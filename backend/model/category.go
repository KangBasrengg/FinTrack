package model

import "github.com/google/uuid"

type CategoryRequest struct {
	Name  string `json:"name"`
	Type  string `json:"type"` // income, outcome
	Icon  string `json:"icon"`
	Color string `json:"color"`
}

type CategoryResponse struct {
	ID        uuid.UUID `json:"id"`
	UserID    uuid.UUID `json:"user_id"`
	Name      string    `json:"name"`
	Type      string    `json:"type"`
	Icon      string    `json:"icon"`
	Color     string    `json:"color"`
	CreatedAt string    `json:"created_at"`
}
