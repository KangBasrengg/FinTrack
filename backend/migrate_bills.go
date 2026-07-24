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
	CREATE TABLE IF NOT EXISTS bills (
		id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
		user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
		name VARCHAR(255) NOT NULL,
		amount DECIMAL(15,2) NOT NULL,
		due_date DATE NOT NULL,
		status VARCHAR(50) DEFAULT 'Pending',
		type VARCHAR(50) NOT NULL,
		created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
	);
	`
	_, err := pool.Exec(context.Background(), query)
	if err != nil {
		log.Fatalf("Failed to create bills table: %v", err)
	}
	log.Println("Bills table created successfully!")
}
