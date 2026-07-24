package api

import (
	"net/http"

	"github.com/gofiber/adaptor/v2"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/recover"

	"cashmanagement-backend/config"
	"cashmanagement-backend/handler"
	"cashmanagement-backend/middleware"
	"cashmanagement-backend/repository"
	"cashmanagement-backend/service"
)

var fiberApp *fiber.App

func init() {
	// Initialize Database Connection
	dbPool := config.InitDB()

	// Initialize Repositories
	repo := repository.New(dbPool)
	billRepo := repository.NewBillRepository(dbPool)
	chatRepo := repository.NewChatRepository(dbPool)

	// Initialize Services
	authService := service.NewAuthService(repo)
	walletService := service.NewWalletService(repo)
	categoryService := service.NewCategoryService(repo)
	transactionService := service.NewTransactionService(repo)
	billService := service.NewBillService(billRepo)
	chatService := service.NewChatService(chatRepo)
	
	// Init CronService but DON'T start the background ticker
	cronService := service.NewCronService(repo, transactionService)

	// Initialize Handlers
	authHandler := handler.NewAuthHandler(authService)
	walletHandler := handler.NewWalletHandler(walletService)
	categoryHandler := handler.NewCategoryHandler(categoryService)
	transactionHandler := handler.NewTransactionHandler(transactionService)
	billHandler := handler.NewBillHandler(billService)
	chatHandler := handler.NewChatHandler(chatService)

	fiberApp = fiber.New(fiber.Config{
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			code := fiber.StatusInternalServerError
			if e, ok := err.(*fiber.Error); ok {
				code = e.Code
			}
			return c.Status(code).JSON(fiber.Map{
				"success": false,
				"message": err.Error(),
			})
		},
	})

	fiberApp.Use(recover.New())
	fiberApp.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
	}))

	apiGroup := fiberApp.Group("/api")

	apiGroup.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"success": true, "message": "Vercel Serverless Function is OK!"})
	})

	// Webhook endpoint to trigger cron jobs manually or via Vercel Cron
	apiGroup.Get("/trigger-cron", func(c *fiber.Ctx) error {
		cronService.ProcessRecurringTransactions()
		return c.JSON(fiber.Map{"success": true, "message": "Cron job processed successfully"})
	})

	// Auth
	auth := apiGroup.Group("/auth")
	auth.Post("/register", authHandler.Register)
	auth.Post("/login", authHandler.Login)

	// Protected Routes
	protected := apiGroup.Group("", middleware.Protected())
	
	protected.Get("/me", func(c *fiber.Ctx) error {
		userID := c.Locals("user_id")
		return c.JSON(fiber.Map{"success": true, "data": fiber.Map{"user_id": userID}})
	})

	wallets := protected.Group("/wallets")
	wallets.Post("/", walletHandler.Create)
	wallets.Get("/", walletHandler.GetAll)
	wallets.Put("/:id", walletHandler.Update)
	wallets.Delete("/:id", walletHandler.Delete)

	categories := protected.Group("/categories")
	categories.Post("/", categoryHandler.Create)
	categories.Get("/", categoryHandler.GetAll)
	categories.Put("/:id", categoryHandler.Update)
	categories.Delete("/:id", categoryHandler.Delete)

	transactions := protected.Group("/transactions")
	transactions.Post("/", transactionHandler.Create)
	transactions.Post("/search", transactionHandler.Search)
	transactions.Get("/:id", transactionHandler.GetByID)
	transactions.Put("/:id", transactionHandler.Update)
	transactions.Delete("/:id", transactionHandler.Delete)

	bills := protected.Group("/bills")
	bills.Post("/", billHandler.Create)
	bills.Get("/", billHandler.GetAll)
	bills.Post("/:id/pay", billHandler.Pay)

	chat := protected.Group("/chat")
	chat.Post("/send", chatHandler.SendMessage)
	chat.Get("/messages/:userId", chatHandler.GetMessages)
	chat.Get("/conversations", chatHandler.GetConversations)
	chat.Get("/unread", chatHandler.GetUnreadCount)
	chat.Get("/admin-id", chatHandler.GetAdminID)
}

// Handler is the entrypoint for Vercel Serverless Function
func Handler(w http.ResponseWriter, r *http.Request) {
	adaptor.FiberApp(fiberApp)(w, r)
}
