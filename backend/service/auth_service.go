package service

import (
	"context"
	"errors"
	"time"

	"cashmanagement-backend/model"
	"cashmanagement-backend/repository"
	"cashmanagement-backend/util"
)

type AuthService interface {
	Register(ctx context.Context, req model.RegisterRequest) (*model.AuthResponse, error)
	Login(ctx context.Context, req model.LoginRequest) (*model.AuthResponse, error)
}

type authService struct {
	repo repository.Querier
}

func NewAuthService(repo repository.Querier) AuthService {
	return &authService{repo: repo}
}

func (s *authService) Register(ctx context.Context, req model.RegisterRequest) (*model.AuthResponse, error) {
	// Hash password
	hashedPassword, err := util.HashPassword(req.Password)
	if err != nil {
		return nil, errors.New("failed to hash password")
	}

	var phonePtr *string
	if req.Phone != "" {
		phonePtr = &req.Phone
	}

	// Create user
	user, err := s.repo.CreateUser(ctx, repository.CreateUserParams{
		Name:         req.Name,
		Email:        req.Email,
		PasswordHash: hashedPassword,
		Phone:        phonePtr,
	})
	if err != nil {
		return nil, errors.New("email already registered or invalid data")
	}

	// Generate Token
	token, err := util.GenerateToken(user.ID, 24*time.Hour)
	if err != nil {
		return nil, errors.New("failed to generate token")
	}

	return &model.AuthResponse{
		User: model.UserResponse{
			ID:    user.ID,
			Name:  user.Name,
			Email: user.Email,
			Role:  user.Role,
		},
		Token: token,
	}, nil
}

func (s *authService) Login(ctx context.Context, req model.LoginRequest) (*model.AuthResponse, error) {
	// Find user
	user, err := s.repo.GetUserByEmail(ctx, req.Email)
	if err != nil {
		return nil, errors.New("invalid email or password")
	}

	// Check password
	err = util.CheckPassword(req.Password, user.PasswordHash)
	if err != nil {
		return nil, errors.New("invalid email or password")
	}

	// Generate Token
	token, err := util.GenerateToken(user.ID, 24*time.Hour)
	if err != nil {
		return nil, errors.New("failed to generate token")
	}

	return &model.AuthResponse{
		User: model.UserResponse{
			ID:    user.ID,
			Name:  user.Name,
			Email: user.Email,
			Role:  user.Role,
		},
		Token: token,
	}, nil
}
