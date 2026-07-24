package model

import (
	"time"

	"github.com/google/uuid"
)

type TransactionRequest struct {
	WalletID        uuid.UUID `json:"wallet_id"`
	CategoryID      uuid.UUID `json:"category_id"`
	Type            string    `json:"type"` // income, outcome
	Amount          float64   `json:"amount"`
	Note            string    `json:"note"`
	TransactionDate time.Time `json:"transaction_date"`
}

type TransactionSearchRequest struct {
	WalletID  *uuid.UUID `json:"wallet_id"`
	CategoryID *uuid.UUID `json:"category_id"`
	Type      *string    `json:"type"`
	StartDate *time.Time `json:"start_date"`
	EndDate   *time.Time `json:"end_date"`
	MinAmount *float64   `json:"min_amount"`
	MaxAmount *float64   `json:"max_amount"`
	Page      int        `json:"page"`
	Limit     int        `json:"limit"`
	SortBy    string     `json:"sort_by"` // default: transaction_date
	SortOrder string     `json:"sort_order"` // asc, desc (default)
}

type TransactionResponse struct {
	ID              uuid.UUID `json:"id"`
	UserID          uuid.UUID `json:"user_id"`
	WalletID        uuid.UUID `json:"wallet_id"`
	CategoryID      uuid.UUID `json:"category_id"`
	Type            string    `json:"type"`
	Amount          float64   `json:"amount"`
	Note            string    `json:"note"`
	TransactionDate time.Time `json:"transaction_date"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

type PaginatedResponse struct {
	Items      interface{} `json:"items"`
	TotalCount int         `json:"total_count"`
	Page       int         `json:"page"`
	Limit      int         `json:"limit"`
	TotalPages int         `json:"total_pages"`
}
