//go:build ignore
// +build ignore

package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
	"cashmanagement-backend/repository"
	"cashmanagement-backend/config"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}
	
	pool := config.InitDB()
	ctx := context.Background()
	defer pool.Close()

	queries := repository.New(pool)
	
	// Get Admin
	var userIDStr string
	err = pool.QueryRow(ctx, "SELECT id FROM users LIMIT 1").Scan(&userIDStr)
	if err != nil {
		log.Fatal(err)
	}

	userID, _ := uuid.Parse(userIDStr)

	res, count, err := queries.SearchTransactions(ctx, repository.SearchTransactionsParams{
		UserID: userID,
		Limit: 10,
		Offset: 0,
	})
	
	if err != nil {
		log.Fatal("Search Failed: ", err)
	}
	
	fmt.Printf("Success! Count: %d, items: %d\n", count, len(res))
}
