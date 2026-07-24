//go:build ignore
// +build ignore

package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, relying on environment variables")
	}

	dbUrl := os.Getenv("DB_URL")
	if dbUrl == "" {
		log.Fatal("DB_URL is not set")
	}

	ctx := context.Background()
	pool, err := pgxpool.New(ctx, dbUrl)
	if err != nil {
		log.Fatal("Failed to connect to db:", err)
	}
	defer pool.Close()

	// Get Admin Nuril ID
	var userID string
	err = pool.QueryRow(ctx, "SELECT id FROM users WHERE name = 'Admin Nuril' LIMIT 1").Scan(&userID)
	if err != nil {
		log.Fatal("Could not find Admin Nuril:", err)
	}

	// Insert Wallets
	_, _ = pool.Exec(ctx, `
		INSERT INTO wallets (user_id, name, type, balance) VALUES
		($1, 'BCA Primary', 'Bank Account', 12500000),
		($1, 'GoPay', 'E-Wallet', 1500000)
		ON CONFLICT DO NOTHING
	`, userID)

	// Insert Categories
	_, _ = pool.Exec(ctx, `
		INSERT INTO categories (user_id, name, type, icon, color) VALUES
		($1, 'Food & Beverage', 'Expense', 'Coffee', 'bg-rose-100 text-rose-600'),
		($1, 'Transportation', 'Expense', 'Car', 'bg-blue-100 text-blue-600'),
		($1, 'Salary', 'Income', 'PiggyBank', 'bg-emerald-100 text-emerald-600')
		ON CONFLICT DO NOTHING
	`, userID)

	fmt.Println("Successfully seeded wallets and categories for Admin Nuril!")
}
