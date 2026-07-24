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

	// 1. Add phone column if not exists
	_, err = pool.Exec(ctx, `ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(50)`)
	if err != nil {
		log.Println("Error adding phone column:", err)
	} else {
		fmt.Println("Successfully ensured 'phone' column exists.")
	}

	// 2. Add role column if not exists
	_, err = pool.Exec(ctx, `ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user'`)
	if err != nil {
		log.Println("Error adding role column:", err)
	} else {
		fmt.Println("Successfully ensured 'role' column exists.")
	}

	// 3. Update 'Admin Nuril' to super_admin
	tag, err := pool.Exec(ctx, `UPDATE users SET role = 'super_admin' WHERE name = 'Admin Nuril'`)
	if err != nil {
		log.Println("Error updating Admin Nuril role:", err)
	} else {
		fmt.Printf("Successfully updated %d row(s) for 'Admin Nuril' to super_admin.\n", tag.RowsAffected())
	}
}
