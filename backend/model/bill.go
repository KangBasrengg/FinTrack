package model

import "github.com/google/uuid"

type BillRequest struct {
	Name    string  `json:"name"`
	Amount  float64 `json:"amount"`
	DueDate string  `json:"due_date"`
	Type    string  `json:"type"`
}

type BillResponse struct {
	ID        uuid.UUID `json:"id"`
	UserID    uuid.UUID `json:"user_id"`
	Name      string    `json:"name"`
	Amount    float64   `json:"amount"`
	DueDate   string    `json:"due_date"`
	Status    string    `json:"status"`
	Type      string    `json:"type"`
	CreatedAt string    `json:"created_at"`
}
