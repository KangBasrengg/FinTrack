package model

import "github.com/google/uuid"

type ChatMessageRequest struct {
	Message    string `json:"message"`
	ReceiverID string `json:"receiver_id,omitempty"` // admin replies target a user
}

type ChatMessageResponse struct {
	ID         uuid.UUID `json:"id"`
	SenderID   uuid.UUID `json:"sender_id"`
	SenderName string    `json:"sender_name"`
	SenderRole string    `json:"sender_role"`
	ReceiverID uuid.UUID `json:"receiver_id"`
	Message    string    `json:"message"`
	IsRead     bool      `json:"is_read"`
	CreatedAt  string    `json:"created_at"`
}

type ChatConversation struct {
	UserID       uuid.UUID `json:"user_id"`
	UserName     string    `json:"user_name"`
	LastMessage  string    `json:"last_message"`
	LastTime     string    `json:"last_time"`
	UnreadCount  int       `json:"unread_count"`
}
