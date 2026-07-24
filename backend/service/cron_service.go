package service

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/robfig/cron/v3"

	"cashmanagement-backend/model"
	"cashmanagement-backend/repository"
)

type CronService interface {
	Start()
	Stop()
}

type cronService struct {
	cron               *cron.Cron
	repo               repository.Querier
	transactionService TransactionService
}

func NewCronService(repo repository.Querier, transactionService TransactionService) CronService {
	// Jakarta Timezone (WIB)
	loc, err := time.LoadLocation("Asia/Jakarta")
	if err != nil {
		loc = time.Local
	}

	c := cron.New(cron.WithLocation(loc))
	return &cronService{
		cron:               c,
		repo:               repo,
		transactionService: transactionService,
	}
}

func (s *cronService) Start() {
	// Run every day at 00:01
	s.cron.AddFunc("1 0 * * *", s.ProcessRecurringTransactions)
	s.cron.Start()
	log.Println("Cron Service started. Recurring transactions will be checked daily.")
	
	// For testing purposes during development, you can uncomment the line below to run it every minute
	// s.cron.AddFunc("* * * * *", s.ProcessRecurringTransactions)
}

func (s *cronService) Stop() {
	s.cron.Stop()
	log.Println("Cron Service stopped.")
}

func (s *cronService) ProcessRecurringTransactions() {
	ctx := context.Background()
	now := time.Now()
	
	log.Printf("Executing ProcessRecurringTransactions at %v\n", now)

	// Fetch transactions that are due today or earlier
	dues, err := s.repo.GetDueRecurringTransactions(ctx, now)
	if err != nil {
		log.Printf("Error fetching due recurring transactions: %v\n", err)
		return
	}

	for _, req := range dues {
		log.Printf("Processing recurring transaction ID: %s for User: %s\n", req.ID, req.UserID)
		
		// 1. We need to determine the transaction Type (income or outcome)
		// Since recurring_transactions doesn't have 'type' explicitly in our schema, 
		// we infer it from the category. Let's fetch the category first.
		category, err := s.repo.GetCategoryByID(ctx, repository.GetCategoryByIDParams{
			ID:     req.CategoryID,
			UserID: req.UserID,
		})
		if err != nil {
			log.Printf("Failed to fetch category %s: %v\n", req.CategoryID, err)
			continue
		}

		note := ""
		if req.Note != nil {
			note = *req.Note
		}

		// 2. Create the actual transaction using TransactionService
		_, err = s.transactionService.Create(ctx, req.UserID, model.TransactionRequest{
			WalletID:        req.WalletID,
			CategoryID:      req.CategoryID,
			Type:            category.Type,
			Amount:          req.Amount,
			Note:            fmt.Sprintf("[Auto] %s", note),
			TransactionDate: now,
		})

		if err != nil {
			log.Printf("Failed to auto-create transaction for %s: %v\n", req.ID, err)
			continue
		}

		// 3. Update the next_run_date based on frequency
		nextRun := calculateNextRunDate(now, req.Frequency)
		err = s.repo.UpdateRecurringTransactionNextRun(ctx, req.ID, nextRun)
		if err != nil {
			log.Printf("Failed to update next_run_date for %s: %v\n", req.ID, err)
		}
	}
}

func calculateNextRunDate(current time.Time, frequency string) time.Time {
	switch frequency {
	case "daily":
		return current.AddDate(0, 0, 1)
	case "weekly":
		return current.AddDate(0, 0, 7)
	case "monthly":
		return current.AddDate(0, 1, 0)
	case "yearly":
		return current.AddDate(1, 0, 0)
	default:
		return current.AddDate(0, 1, 0) // Default to monthly
	}
}
