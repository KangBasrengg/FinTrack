//go:build ignore
// +build ignore

package main

import (
	"context"
	"log"

	"cashmanagement-backend/config"
)

func main() {
	pool := config.InitDB()
	defer pool.Close()

	query := `
	CREATE TABLE IF NOT EXISTS chat_messages (
		id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
		sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
		receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
		message TEXT NOT NULL,
		is_read BOOLEAN DEFAULT false,
		created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
	);

	CREATE INDEX IF NOT EXISTS idx_chat_sender ON chat_messages(sender_id);
	CREATE INDEX IF NOT EXISTS idx_chat_receiver ON chat_messages(receiver_id);
	CREATE INDEX IF NOT EXISTS idx_chat_unread ON chat_messages(receiver_id, is_read) WHERE is_read = false;
	`
	_, err := pool.Exec(context.Background(), query)
	if err != nil {
		log.Fatalf("Failed to create chat_messages table: %v", err)
	}
	log.Println("chat_messages table created successfully!")
}
