package repository

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type ChatMessage struct {
	ID         uuid.UUID
	SenderID   uuid.UUID
	SenderName string
	SenderRole string
	ReceiverID uuid.UUID
	Message    string
	IsRead     bool
	CreatedAt  time.Time
}

type ChatConversationRow struct {
	UserID      uuid.UUID
	UserName    string
	LastMessage string
	LastTime    time.Time
	UnreadCount int
}

type ChatRepository interface {
	SendMessage(ctx context.Context, senderID, receiverID uuid.UUID, message string) (ChatMessage, error)
	GetMessages(ctx context.Context, userID1, userID2 uuid.UUID) ([]ChatMessage, error)
	GetConversations(ctx context.Context, adminID uuid.UUID) ([]ChatConversationRow, error)
	GetUnreadCount(ctx context.Context, userID uuid.UUID) (int, error)
	MarkAsRead(ctx context.Context, senderID, receiverID uuid.UUID) error
	GetAdminID(ctx context.Context) (uuid.UUID, error)
}

type chatRepository struct {
	db *pgxpool.Pool
}

func NewChatRepository(db *pgxpool.Pool) ChatRepository {
	return &chatRepository{db: db}
}

func (r *chatRepository) SendMessage(ctx context.Context, senderID, receiverID uuid.UUID, message string) (ChatMessage, error) {
	query := `
		INSERT INTO chat_messages (sender_id, receiver_id, message)
		VALUES ($1, $2, $3)
		RETURNING id, sender_id, receiver_id, message, is_read, created_at
	`
	var m ChatMessage
	err := r.db.QueryRow(ctx, query, senderID, receiverID, message).Scan(
		&m.ID, &m.SenderID, &m.ReceiverID, &m.Message, &m.IsRead, &m.CreatedAt,
	)
	if err != nil {
		return m, err
	}

	// Fetch sender info
	r.db.QueryRow(ctx, `SELECT name, role FROM users WHERE id = $1`, senderID).Scan(&m.SenderName, &m.SenderRole)
	return m, nil
}

func (r *chatRepository) GetMessages(ctx context.Context, userID1, userID2 uuid.UUID) ([]ChatMessage, error) {
	query := `
		SELECT cm.id, cm.sender_id, u.name, u.role, cm.receiver_id, cm.message, cm.is_read, cm.created_at
		FROM chat_messages cm
		JOIN users u ON u.id = cm.sender_id
		WHERE (cm.sender_id = $1 AND cm.receiver_id = $2) 
		   OR (cm.sender_id = $2 AND cm.receiver_id = $1)
		ORDER BY cm.created_at ASC
	`
	rows, err := r.db.Query(ctx, query, userID1, userID2)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var messages []ChatMessage
	for rows.Next() {
		var m ChatMessage
		if err := rows.Scan(&m.ID, &m.SenderID, &m.SenderName, &m.SenderRole, &m.ReceiverID, &m.Message, &m.IsRead, &m.CreatedAt); err != nil {
			return nil, err
		}
		messages = append(messages, m)
	}
	return messages, nil
}

func (r *chatRepository) GetConversations(ctx context.Context, adminID uuid.UUID) ([]ChatConversationRow, error) {
	query := `
		SELECT DISTINCT ON (user_id) user_id, user_name, last_message, last_time, unread_count
		FROM (
			SELECT 
				CASE WHEN cm.sender_id = $1 THEN cm.receiver_id ELSE cm.sender_id END AS user_id,
				u.name AS user_name,
				cm.message AS last_message,
				cm.created_at AS last_time,
				(SELECT COUNT(*) FROM chat_messages cm2 
				 WHERE cm2.sender_id = CASE WHEN cm.sender_id = $1 THEN cm.receiver_id ELSE cm.sender_id END
				 AND cm2.receiver_id = $1 AND cm2.is_read = false) AS unread_count
			FROM chat_messages cm
			JOIN users u ON u.id = CASE WHEN cm.sender_id = $1 THEN cm.receiver_id ELSE cm.sender_id END
			WHERE cm.sender_id = $1 OR cm.receiver_id = $1
			ORDER BY cm.created_at DESC
		) sub
		ORDER BY user_id, last_time DESC
	`
	rows, err := r.db.Query(ctx, query, adminID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var convos []ChatConversationRow
	for rows.Next() {
		var c ChatConversationRow
		if err := rows.Scan(&c.UserID, &c.UserName, &c.LastMessage, &c.LastTime, &c.UnreadCount); err != nil {
			return nil, err
		}
		convos = append(convos, c)
	}
	return convos, nil
}

func (r *chatRepository) GetUnreadCount(ctx context.Context, userID uuid.UUID) (int, error) {
	var count int
	err := r.db.QueryRow(ctx, `SELECT COUNT(*) FROM chat_messages WHERE receiver_id = $1 AND is_read = false`, userID).Scan(&count)
	return count, err
}

func (r *chatRepository) MarkAsRead(ctx context.Context, senderID, receiverID uuid.UUID) error {
	_, err := r.db.Exec(ctx, `UPDATE chat_messages SET is_read = true WHERE sender_id = $1 AND receiver_id = $2 AND is_read = false`, senderID, receiverID)
	return err
}

func (r *chatRepository) GetAdminID(ctx context.Context) (uuid.UUID, error) {
	var adminID uuid.UUID
	err := r.db.QueryRow(ctx, `SELECT id FROM users WHERE role = 'super_admin' LIMIT 1`).Scan(&adminID)
	return adminID, err
}
