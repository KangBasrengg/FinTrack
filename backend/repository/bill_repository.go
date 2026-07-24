package repository

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Bill struct {
	ID        uuid.UUID
	UserID    uuid.UUID
	Name      string
	Amount    float64
	DueDate   time.Time
	Status    string
	Type      string
	CreatedAt time.Time
	UpdatedAt time.Time
}

type BillRepository interface {
	CreateBill(ctx context.Context, b Bill) (Bill, error)
	GetBillsByUserID(ctx context.Context, userID uuid.UUID) ([]Bill, error)
	MarkBillAsPaid(ctx context.Context, billID uuid.UUID, userID uuid.UUID) error
}

type billRepository struct {
	db *pgxpool.Pool
}

func NewBillRepository(db *pgxpool.Pool) BillRepository {
	return &billRepository{db: db}
}

func (r *billRepository) CreateBill(ctx context.Context, b Bill) (Bill, error) {
	query := `
		INSERT INTO bills (user_id, name, amount, due_date, type, status)
		VALUES ($1, $2, $3, $4, $5, 'Pending')
		RETURNING id, user_id, name, amount, due_date, status, type, created_at, updated_at
	`
	var i Bill
	err := r.db.QueryRow(ctx, query, b.UserID, b.Name, b.Amount, b.DueDate, b.Type).Scan(
		&i.ID, &i.UserID, &i.Name, &i.Amount, &i.DueDate, &i.Status, &i.Type, &i.CreatedAt, &i.UpdatedAt,
	)
	return i, err
}

func (r *billRepository) GetBillsByUserID(ctx context.Context, userID uuid.UUID) ([]Bill, error) {
	query := `
		SELECT id, user_id, name, amount, due_date, status, type, created_at, updated_at
		FROM bills
		WHERE user_id = $1
		ORDER BY due_date ASC
	`
	rows, err := r.db.Query(ctx, query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []Bill
	for rows.Next() {
		var i Bill
		if err := rows.Scan(&i.ID, &i.UserID, &i.Name, &i.Amount, &i.DueDate, &i.Status, &i.Type, &i.CreatedAt, &i.UpdatedAt); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	return items, nil
}

func (r *billRepository) MarkBillAsPaid(ctx context.Context, billID uuid.UUID, userID uuid.UUID) error {
	query := `
		UPDATE bills SET status = 'Paid', updated_at = CURRENT_TIMESTAMP
		WHERE id = $1 AND user_id = $2
	`
	_, err := r.db.Exec(ctx, query, billID, userID)
	return err
}
