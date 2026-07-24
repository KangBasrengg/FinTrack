package service

import (
	"context"
	"errors"
	"time"

	"github.com/google/uuid"

	"cashmanagement-backend/model"
	"cashmanagement-backend/repository"
)

type WalletService interface {
	Create(ctx context.Context, userID uuid.UUID, req model.WalletRequest) (*model.WalletResponse, error)
	GetByUserID(ctx context.Context, userID uuid.UUID) ([]model.WalletResponse, error)
	Update(ctx context.Context, userID uuid.UUID, walletID uuid.UUID, req model.WalletRequest) (*model.WalletResponse, error)
	Delete(ctx context.Context, userID uuid.UUID, walletID uuid.UUID) error
}

type walletService struct {
	repo repository.Querier
}

func NewWalletService(repo repository.Querier) WalletService {
	return &walletService{repo: repo}
}

func (s *walletService) Create(ctx context.Context, userID uuid.UUID, req model.WalletRequest) (*model.WalletResponse, error) {
	wallet, err := s.repo.CreateWallet(ctx, repository.CreateWalletParams{
		UserID:  userID,
		Name:    req.Name,
		Type:    req.Type,
		Balance: req.Balance,
	})
	if err != nil {
		return nil, errors.New("failed to create wallet")
	}
	return mapWalletToResponse(wallet), nil
}

func (s *walletService) GetByUserID(ctx context.Context, userID uuid.UUID) ([]model.WalletResponse, error) {
	wallets, err := s.repo.GetWalletsByUserID(ctx, userID)
	if err != nil {
		return nil, errors.New("failed to fetch wallets")
	}

	var res []model.WalletResponse
	for _, w := range wallets {
		res = append(res, *mapWalletToResponse(w))
	}
	return res, nil
}

func (s *walletService) Update(ctx context.Context, userID uuid.UUID, walletID uuid.UUID, req model.WalletRequest) (*model.WalletResponse, error) {
	wallet, err := s.repo.UpdateWallet(ctx, repository.UpdateWalletParams{
		ID:      walletID,
		UserID:  userID,
		Name:    req.Name,
		Type:    req.Type,
		Balance: req.Balance,
	})
	if err != nil {
		return nil, errors.New("failed to update wallet or not found")
	}
	return mapWalletToResponse(wallet), nil
}

func (s *walletService) Delete(ctx context.Context, userID uuid.UUID, walletID uuid.UUID) error {
	err := s.repo.DeleteWallet(ctx, repository.DeleteWalletParams{
		ID:     walletID,
		UserID: userID,
	})
	if err != nil {
		return errors.New("failed to delete wallet")
	}
	return nil
}

func mapWalletToResponse(wallet repository.Wallet) *model.WalletResponse {
	return &model.WalletResponse{
		ID:        wallet.ID,
		UserID:    wallet.UserID,
		Name:      wallet.Name,
		Type:      wallet.Type,
		Balance:   wallet.Balance,
		CreatedAt: wallet.CreatedAt.Format(time.RFC3339),
	}
}
