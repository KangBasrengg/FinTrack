package model

import "github.com/google/uuid"

type WalletRequest struct {
	Name    string  `json:"name"`
	Type    string  `json:"type"` // bank, e-wallet, cash, credit
	Balance float64 `json:"balance"`
}

type WalletResponse struct {
	ID        uuid.UUID `json:"id"`
	UserID    uuid.UUID `json:"user_id"`
	Name      string    `json:"name"`
	Type      string    `json:"type"`
	Balance   float64   `json:"balance"`
	CreatedAt string    `json:"created_at"`
}
