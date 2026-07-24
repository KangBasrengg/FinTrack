package service

import (
	"context"
	"time"

	"github.com/google/uuid"

	"cashmanagement-backend/model"
	"cashmanagement-backend/repository"
)

type BillService interface {
	CreateBill(ctx context.Context, userID uuid.UUID, req model.BillRequest) (model.BillResponse, error)
	GetBillsByUserID(ctx context.Context, userID uuid.UUID) ([]model.BillResponse, error)
	PayBill(ctx context.Context, userID uuid.UUID, billID uuid.UUID) error
}

type billService struct {
	repo repository.BillRepository
}

func NewBillService(repo repository.BillRepository) BillService {
	return &billService{repo: repo}
}

func (s *billService) CreateBill(ctx context.Context, userID uuid.UUID, req model.BillRequest) (model.BillResponse, error) {
	dueDate, err := time.Parse("2006-01-02", req.DueDate)
	if err != nil {
		return model.BillResponse{}, err
	}

	b := repository.Bill{
		UserID:  userID,
		Name:    req.Name,
		Amount:  req.Amount,
		DueDate: dueDate,
		Type:    req.Type,
	}

	created, err := s.repo.CreateBill(ctx, b)
	if err != nil {
		return model.BillResponse{}, err
	}

	return mapBillToResponse(created), nil
}

func (s *billService) GetBillsByUserID(ctx context.Context, userID uuid.UUID) ([]model.BillResponse, error) {
	bills, err := s.repo.GetBillsByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}

	var res []model.BillResponse
	for _, b := range bills {
		res = append(res, mapBillToResponse(b))
	}
	return res, nil
}

func (s *billService) PayBill(ctx context.Context, userID uuid.UUID, billID uuid.UUID) error {
	return s.repo.MarkBillAsPaid(ctx, billID, userID)
}

func mapBillToResponse(b repository.Bill) model.BillResponse {
	return model.BillResponse{
		ID:        b.ID,
		UserID:    b.UserID,
		Name:      b.Name,
		Amount:    b.Amount,
		DueDate:   b.DueDate.Format("2006-01-02"),
		Status:    b.Status,
		Type:      b.Type,
		CreatedAt: b.CreatedAt.Format(time.RFC3339),
	}
}
