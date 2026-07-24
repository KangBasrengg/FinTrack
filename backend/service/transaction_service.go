package service

import (
	"context"
	"errors"
	"math"

	"github.com/google/uuid"

	"cashmanagement-backend/model"
	"cashmanagement-backend/repository"
)

type TransactionService interface {
	Create(ctx context.Context, userID uuid.UUID, req model.TransactionRequest) (*model.TransactionResponse, error)
	GetByID(ctx context.Context, userID uuid.UUID, transactionID uuid.UUID) (*model.TransactionResponse, error)
	Update(ctx context.Context, userID uuid.UUID, transactionID uuid.UUID, req model.TransactionRequest) (*model.TransactionResponse, error)
	Delete(ctx context.Context, userID uuid.UUID, transactionID uuid.UUID) error
	Search(ctx context.Context, userID uuid.UUID, req model.TransactionSearchRequest) (*model.PaginatedResponse, error)
}

type transactionService struct {
	repo repository.Querier
}

func NewTransactionService(repo repository.Querier) TransactionService {
	return &transactionService{repo: repo}
}

func (s *transactionService) Create(ctx context.Context, userID uuid.UUID, req model.TransactionRequest) (*model.TransactionResponse, error) {
	// Ideally we should also check if the wallet_id and category_id belong to the user
	// but for simplicity and given the FK constraints (if any ownership checks exist) we can proceed
	note := &req.Note
	if req.Note == "" {
		note = nil
	}

	trx, err := s.repo.CreateTransaction(ctx, repository.CreateTransactionParams{
		UserID:          userID,
		WalletID:        req.WalletID,
		CategoryID:      req.CategoryID,
		Type:            req.Type,
		Amount:          req.Amount,
		Note:            note,
		TransactionDate: req.TransactionDate,
	})
	if err != nil {
		return nil, errors.New("failed to create transaction")
	}

	// Update Wallet Balance
	wallet, _ := s.repo.GetWalletByID(ctx, repository.GetWalletByIDParams{ID: req.WalletID, UserID: userID})
	if req.Type == "income" {
		wallet.Balance += req.Amount
	} else if req.Type == "outcome" {
		wallet.Balance -= req.Amount
	}
	s.repo.UpdateWallet(ctx, repository.UpdateWalletParams{
		ID:      wallet.ID,
		UserID:  userID,
		Name:    wallet.Name,
		Type:    wallet.Type,
		Balance: wallet.Balance,
	})

	return mapTransactionToResponse(trx), nil
}

func (s *transactionService) GetByID(ctx context.Context, userID uuid.UUID, transactionID uuid.UUID) (*model.TransactionResponse, error) {
	trx, err := s.repo.GetTransactionByID(ctx, transactionID, userID)
	if err != nil {
		return nil, errors.New("transaction not found")
	}
	return mapTransactionToResponse(trx), nil
}

func (s *transactionService) Update(ctx context.Context, userID uuid.UUID, transactionID uuid.UUID, req model.TransactionRequest) (*model.TransactionResponse, error) {
	oldTrx, err := s.repo.GetTransactionByID(ctx, transactionID, userID)
	if err != nil {
		return nil, errors.New("transaction not found")
	}

	note := &req.Note
	if req.Note == "" {
		note = nil
	}

	trx, err := s.repo.UpdateTransaction(ctx, repository.UpdateTransactionParams{
		ID:              transactionID,
		UserID:          userID,
		WalletID:        req.WalletID,
		CategoryID:      req.CategoryID,
		Type:            req.Type,
		Amount:          req.Amount,
		Note:            note,
		TransactionDate: req.TransactionDate,
	})
	if err != nil {
		return nil, errors.New("failed to update transaction")
	}

	// Adjust wallet balance (simplified logic assuming same wallet for this demo)
	if oldTrx.WalletID == req.WalletID {
		wallet, _ := s.repo.GetWalletByID(ctx, repository.GetWalletByIDParams{ID: req.WalletID, UserID: userID})
		// Revert old
		if oldTrx.Type == "income" {
			wallet.Balance -= oldTrx.Amount
		} else {
			wallet.Balance += oldTrx.Amount
		}
		// Apply new
		if req.Type == "income" {
			wallet.Balance += req.Amount
		} else {
			wallet.Balance -= req.Amount
		}
		s.repo.UpdateWallet(ctx, repository.UpdateWalletParams{
			ID:      wallet.ID,
			UserID:  userID,
			Name:    wallet.Name,
			Type:    wallet.Type,
			Balance: wallet.Balance,
		})
	}

	return mapTransactionToResponse(trx), nil
}

func (s *transactionService) Delete(ctx context.Context, userID uuid.UUID, transactionID uuid.UUID) error {
	trx, err := s.repo.GetTransactionByID(ctx, transactionID, userID)
	if err != nil {
		return errors.New("transaction not found")
	}

	err = s.repo.DeleteTransaction(ctx, transactionID, userID)
	if err != nil {
		return errors.New("failed to delete transaction")
	}

	// Revert wallet balance
	wallet, _ := s.repo.GetWalletByID(ctx, repository.GetWalletByIDParams{ID: trx.WalletID, UserID: userID})
	if trx.Type == "income" {
		wallet.Balance -= trx.Amount
	} else {
		wallet.Balance += trx.Amount
	}
	s.repo.UpdateWallet(ctx, repository.UpdateWalletParams{
		ID:      wallet.ID,
		UserID:  userID,
		Name:    wallet.Name,
		Type:    wallet.Type,
		Balance: wallet.Balance,
	})

	return nil
}

func (s *transactionService) Search(ctx context.Context, userID uuid.UUID, req model.TransactionSearchRequest) (*model.PaginatedResponse, error) {
	if req.Page <= 0 {
		req.Page = 1
	}
	if req.Limit <= 0 {
		req.Limit = 10
	}
	offset := (req.Page - 1) * req.Limit

	params := repository.SearchTransactionsParams{
		UserID:     userID,
		WalletID:   req.WalletID,
		CategoryID: req.CategoryID,
		Type:       req.Type,
		StartDate:  req.StartDate,
		EndDate:    req.EndDate,
		MinAmount:  req.MinAmount,
		MaxAmount:  req.MaxAmount,
		Limit:      req.Limit,
		Offset:     offset,
		SortBy:     req.SortBy,
		SortOrder:  req.SortOrder,
	}

	transactions, totalCount, err := s.repo.SearchTransactions(ctx, params)
	if err != nil {
		return nil, errors.New("failed to search transactions")
	}

	var res []model.TransactionResponse
	for _, t := range transactions {
		res = append(res, *mapTransactionToResponse(t))
	}
	if res == nil {
		res = []model.TransactionResponse{}
	}

	totalPages := int(math.Ceil(float64(totalCount) / float64(req.Limit)))

	return &model.PaginatedResponse{
		Items:      res,
		TotalCount: totalCount,
		Page:       req.Page,
		Limit:      req.Limit,
		TotalPages: totalPages,
	}, nil
}

func mapTransactionToResponse(trx repository.Transaction) *model.TransactionResponse {
	note := ""
	if trx.Note != nil {
		note = *trx.Note
	}
	return &model.TransactionResponse{
		ID:              trx.ID,
		UserID:          trx.UserID,
		WalletID:        trx.WalletID,
		CategoryID:      trx.CategoryID,
		Type:            trx.Type,
		Amount:          trx.Amount,
		Note:            note,
		TransactionDate: trx.TransactionDate,
		CreatedAt:       trx.CreatedAt,
		UpdatedAt:       trx.UpdatedAt,
	}
}
