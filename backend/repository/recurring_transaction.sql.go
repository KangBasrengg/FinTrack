package repository

import (
	"context"
	"time"

	"github.com/google/uuid"
)

const getDueRecurringTransactions = `-- name: GetDueRecurringTransactions :many
SELECT id, user_id, wallet_id, category_id, amount, note, frequency, next_run_date, is_active, created_at 
FROM recurring_transactions
WHERE is_active = true AND next_run_date <= $1
`

func (q *Queries) GetDueRecurringTransactions(ctx context.Context, runDate time.Time) ([]RecurringTransaction, error) {
	rows, err := q.db.Query(ctx, getDueRecurringTransactions, runDate)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []RecurringTransaction
	for rows.Next() {
		var i RecurringTransaction
		if err := rows.Scan(
			&i.ID,
			&i.UserID,
			&i.WalletID,
			&i.CategoryID,
			&i.Amount,
			&i.Note,
			&i.Frequency,
			&i.NextRunDate,
			&i.IsActive,
			&i.CreatedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const updateRecurringTransactionNextRun = `-- name: UpdateRecurringTransactionNextRun :exec
UPDATE recurring_transactions
SET next_run_date = $2
WHERE id = $1
`

func (q *Queries) UpdateRecurringTransactionNextRun(ctx context.Context, id uuid.UUID, nextRunDate time.Time) error {
	_, err := q.db.Exec(ctx, updateRecurringTransactionNextRun, id, nextRunDate)
	return err
}
