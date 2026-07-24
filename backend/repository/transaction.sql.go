package repository

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"
)

const createTransaction = `-- name: CreateTransaction :one
INSERT INTO transactions (
  user_id, wallet_id, category_id, type, amount, note, transaction_date
) VALUES (
  $1, $2, $3, $4, $5, $6, $7
)
RETURNING id, user_id, wallet_id, category_id, type, amount, note, transaction_date, created_at, updated_at
`

type CreateTransactionParams struct {
	UserID          uuid.UUID
	WalletID        uuid.UUID
	CategoryID      uuid.UUID
	Type            string
	Amount          float64
	Note            *string
	TransactionDate time.Time
}

func (q *Queries) CreateTransaction(ctx context.Context, arg CreateTransactionParams) (Transaction, error) {
	row := q.db.QueryRow(ctx, createTransaction,
		arg.UserID,
		arg.WalletID,
		arg.CategoryID,
		arg.Type,
		arg.Amount,
		arg.Note,
		arg.TransactionDate,
	)
	var i Transaction
	err := row.Scan(
		&i.ID,
		&i.UserID,
		&i.WalletID,
		&i.CategoryID,
		&i.Type,
		&i.Amount,
		&i.Note,
		&i.TransactionDate,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const getTransactionByID = `-- name: GetTransactionByID :one
SELECT id, user_id, wallet_id, category_id, type, amount, note, transaction_date, created_at, updated_at 
FROM transactions
WHERE id = $1 AND user_id = $2 LIMIT 1
`

func (q *Queries) GetTransactionByID(ctx context.Context, id uuid.UUID, userID uuid.UUID) (Transaction, error) {
	row := q.db.QueryRow(ctx, getTransactionByID, id, userID)
	var i Transaction
	err := row.Scan(
		&i.ID,
		&i.UserID,
		&i.WalletID,
		&i.CategoryID,
		&i.Type,
		&i.Amount,
		&i.Note,
		&i.TransactionDate,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const updateTransaction = `-- name: UpdateTransaction :one
UPDATE transactions
SET wallet_id = $3, category_id = $4, type = $5, amount = $6, note = $7, transaction_date = $8, updated_at = NOW()
WHERE id = $1 AND user_id = $2
RETURNING id, user_id, wallet_id, category_id, type, amount, note, transaction_date, created_at, updated_at
`

type UpdateTransactionParams struct {
	ID              uuid.UUID
	UserID          uuid.UUID
	WalletID        uuid.UUID
	CategoryID      uuid.UUID
	Type            string
	Amount          float64
	Note            *string
	TransactionDate time.Time
}

func (q *Queries) UpdateTransaction(ctx context.Context, arg UpdateTransactionParams) (Transaction, error) {
	row := q.db.QueryRow(ctx, updateTransaction,
		arg.ID,
		arg.UserID,
		arg.WalletID,
		arg.CategoryID,
		arg.Type,
		arg.Amount,
		arg.Note,
		arg.TransactionDate,
	)
	var i Transaction
	err := row.Scan(
		&i.ID,
		&i.UserID,
		&i.WalletID,
		&i.CategoryID,
		&i.Type,
		&i.Amount,
		&i.Note,
		&i.TransactionDate,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const deleteTransaction = `-- name: DeleteTransaction :exec
DELETE FROM transactions
WHERE id = $1 AND user_id = $2
`

func (q *Queries) DeleteTransaction(ctx context.Context, id uuid.UUID, userID uuid.UUID) error {
	_, err := q.db.Exec(ctx, deleteTransaction, id, userID)
	return err
}

// SearchTransactions dynamically builds the query based on provided filters
type SearchTransactionsParams struct {
	UserID     uuid.UUID
	WalletID   *uuid.UUID
	CategoryID *uuid.UUID
	Type       *string
	StartDate  *time.Time
	EndDate    *time.Time
	MinAmount  *float64
	MaxAmount  *float64
	Limit      int
	Offset     int
	SortBy     string
	SortOrder  string
}

func (q *Queries) SearchTransactions(ctx context.Context, arg SearchTransactionsParams) ([]Transaction, int, error) {
	queryBuilder := []string{"FROM transactions WHERE user_id = $1"}
	args := []interface{}{arg.UserID}
	argIdx := 2

	if arg.WalletID != nil {
		queryBuilder = append(queryBuilder, fmt.Sprintf("AND wallet_id = $%d", argIdx))
		args = append(args, *arg.WalletID)
		argIdx++
	}
	if arg.CategoryID != nil {
		queryBuilder = append(queryBuilder, fmt.Sprintf("AND category_id = $%d", argIdx))
		args = append(args, *arg.CategoryID)
		argIdx++
	}
	if arg.Type != nil {
		queryBuilder = append(queryBuilder, fmt.Sprintf("AND type = $%d", argIdx))
		args = append(args, *arg.Type)
		argIdx++
	}
	if arg.StartDate != nil {
		queryBuilder = append(queryBuilder, fmt.Sprintf("AND transaction_date >= $%d", argIdx))
		args = append(args, *arg.StartDate)
		argIdx++
	}
	if arg.EndDate != nil {
		queryBuilder = append(queryBuilder, fmt.Sprintf("AND transaction_date <= $%d", argIdx))
		args = append(args, *arg.EndDate)
		argIdx++
	}
	if arg.MinAmount != nil {
		queryBuilder = append(queryBuilder, fmt.Sprintf("AND amount >= $%d", argIdx))
		args = append(args, *arg.MinAmount)
		argIdx++
	}
	if arg.MaxAmount != nil {
		queryBuilder = append(queryBuilder, fmt.Sprintf("AND amount <= $%d", argIdx))
		args = append(args, *arg.MaxAmount)
		argIdx++
	}

	whereClause := strings.Join(queryBuilder, " ")

	// 1. Get Total Count
	countQuery := "SELECT count(*) " + whereClause
	var total int
	err := q.db.QueryRow(ctx, countQuery, args...).Scan(&total)
	if err != nil {
		return nil, 0, err
	}

	// 2. Get Data
	sortBy := "transaction_date"
	if arg.SortBy == "amount" || arg.SortBy == "created_at" {
		sortBy = arg.SortBy
	}
	sortOrder := "DESC"
	if strings.ToUpper(arg.SortOrder) == "ASC" {
		sortOrder = "ASC"
	}

	dataQuery := fmt.Sprintf("SELECT id, user_id, wallet_id, category_id, type, amount, note, transaction_date, created_at, updated_at %s ORDER BY %s %s LIMIT $%d OFFSET $%d", whereClause, sortBy, sortOrder, argIdx, argIdx+1)
	args = append(args, arg.Limit, arg.Offset)

	rows, err := q.db.Query(ctx, dataQuery, args...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var items []Transaction
	for rows.Next() {
		var i Transaction
		if err := rows.Scan(
			&i.ID,
			&i.UserID,
			&i.WalletID,
			&i.CategoryID,
			&i.Type,
			&i.Amount,
			&i.Note,
			&i.TransactionDate,
			&i.CreatedAt,
			&i.UpdatedAt,
		); err != nil {
			return nil, 0, err
		}
		items = append(items, i)
	}

	if err := rows.Err(); err != nil {
		return nil, 0, err
	}

	return items, total, nil
}
