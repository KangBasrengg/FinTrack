package service

import (
	"context"
	"errors"
	"time"

	"github.com/google/uuid"

	"cashmanagement-backend/model"
	"cashmanagement-backend/repository"
)

type CategoryService interface {
	Create(ctx context.Context, userID uuid.UUID, req model.CategoryRequest) (*model.CategoryResponse, error)
	GetByUserID(ctx context.Context, userID uuid.UUID) ([]model.CategoryResponse, error)
	Update(ctx context.Context, userID uuid.UUID, categoryID uuid.UUID, req model.CategoryRequest) (*model.CategoryResponse, error)
	Delete(ctx context.Context, userID uuid.UUID, categoryID uuid.UUID) error
}

type categoryService struct {
	repo repository.Querier
}

func NewCategoryService(repo repository.Querier) CategoryService {
	return &categoryService{repo: repo}
}

func (s *categoryService) Create(ctx context.Context, userID uuid.UUID, req model.CategoryRequest) (*model.CategoryResponse, error) {
	category, err := s.repo.CreateCategory(ctx, repository.CreateCategoryParams{
		UserID: userID,
		Name:   req.Name,
		Type:   req.Type,
		Icon:   req.Icon,
		Color:  req.Color,
	})
	if err != nil {
		return nil, errors.New("failed to create category")
	}
	return mapCategoryToResponse(category), nil
}

func (s *categoryService) GetByUserID(ctx context.Context, userID uuid.UUID) ([]model.CategoryResponse, error) {
	categories, err := s.repo.GetCategoriesByUserID(ctx, userID)
	if err != nil {
		return nil, errors.New("failed to fetch categories")
	}

	var res []model.CategoryResponse
	for _, c := range categories {
		res = append(res, *mapCategoryToResponse(c))
	}
	return res, nil
}

func (s *categoryService) Update(ctx context.Context, userID uuid.UUID, categoryID uuid.UUID, req model.CategoryRequest) (*model.CategoryResponse, error) {
	category, err := s.repo.UpdateCategory(ctx, repository.UpdateCategoryParams{
		ID:     categoryID,
		UserID: userID,
		Name:   req.Name,
		Type:   req.Type,
		Icon:   req.Icon,
		Color:  req.Color,
	})
	if err != nil {
		return nil, errors.New("failed to update category or not found")
	}
	return mapCategoryToResponse(category), nil
}

func (s *categoryService) Delete(ctx context.Context, userID uuid.UUID, categoryID uuid.UUID) error {
	err := s.repo.DeleteCategory(ctx, repository.DeleteCategoryParams{
		ID:     categoryID,
		UserID: userID,
	})
	if err != nil {
		return errors.New("failed to delete category")
	}
	return nil
}

func mapCategoryToResponse(category repository.Category) *model.CategoryResponse {
	return &model.CategoryResponse{
		ID:        category.ID,
		UserID:    category.UserID,
		Name:      category.Name,
		Type:      category.Type,
		Icon:      category.Icon,
		Color:     category.Color,
		CreatedAt: category.CreatedAt.Format(time.RFC3339),
	}
}
