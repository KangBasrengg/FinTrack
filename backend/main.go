package main

import (
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/rs/zerolog"
	zlog "github.com/rs/zerolog/log"

	"cashmanagement-backend/config"
	"cashmanagement-backend/handler"
	"cashmanagement-backend/middleware"
	"cashmanagement-backend/repository"
	"cashmanagement-backend/service"
)

func main() {
	// Setup structured logging (zerolog)
	zerolog.TimeFieldFormat = time.RFC3339
	zlog.Logger = zlog.Output(zerolog.ConsoleWriter{Out: os.Stdout, TimeFormat: time.RFC3339})

	// Initialize Database Connection
	dbPool := config.InitDB()
	defer dbPool.Close()

	// Initialize Repositories
	repo := repository.New(dbPool)

	// Initialize Services
	authService := service.NewAuthService(repo)
	walletService := service.NewWalletService(repo)
	categoryService := service.NewCategoryService(repo)
	transactionService := service.NewTransactionService(repo)
	
	billRepo := repository.NewBillRepository(dbPool)
	billService := service.NewBillService(billRepo)

	chatRepo := repository.NewChatRepository(dbPool)
	chatService := service.NewChatService(chatRepo)

	// Initialize Cron Job
	cronService := service.NewCronService(repo, transactionService)
	cronService.Start()
	defer cronService.Stop()

	// Initialize Handlers
	authHandler := handler.NewAuthHandler(authService)
	walletHandler := handler.NewWalletHandler(walletService)
	categoryHandler := handler.NewCategoryHandler(categoryService)
	transactionHandler := handler.NewTransactionHandler(transactionService)
	billHandler := handler.NewBillHandler(billService)
	chatHandler := handler.NewChatHandler(chatService)

	// Initialize Fiber App
	app := fiber.New(fiber.Config{
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			code := fiber.StatusInternalServerError
			if e, ok := err.(*fiber.Error); ok {
				code = e.Code
			}
			return c.Status(code).JSON(fiber.Map{
				"success": false,
				"data":    nil,
				"message": err.Error(),
				"error":   "INTERNAL_SERVER_ERROR",
			})
		},
	})

	// Middlewares
	app.Use(recover.New())
	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
	}))

	// Routes
	api := app.Group("/api")

	api.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"success": true,
			"message": "Service is up and running",
		})
	})

	// Public Routes
	auth := api.Group("/auth")
	auth.Post("/register", authHandler.Register)
	auth.Post("/login", authHandler.Login)

	// Protected Routes
	protected := api.Group("", middleware.Protected())
	protected.Get("/me", func(c *fiber.Ctx) error {
		userID := c.Locals("user_id")
		return c.JSON(fiber.Map{
			"success": true,
			"data": fiber.Map{
				"user_id": userID,
			},
			"message": "Protected route accessed successfully",
			"error":   nil,
		})
	})

	// Wallet Routes
	wallets := protected.Group("/wallets")
	wallets.Post("/", walletHandler.Create)
	wallets.Get("/", walletHandler.GetAll)
	wallets.Put("/:id", walletHandler.Update)
	wallets.Delete("/:id", walletHandler.Delete)

	// Category Routes
	categories := protected.Group("/categories")
	categories.Post("/", categoryHandler.Create)
	categories.Get("/", categoryHandler.GetAll)
	categories.Put("/:id", categoryHandler.Update)
	categories.Delete("/:id", categoryHandler.Delete)

	// Transaction Routes
	transactions := protected.Group("/transactions")
	transactions.Post("/", transactionHandler.Create)
	transactions.Post("/search", transactionHandler.Search)
	transactions.Get("/:id", transactionHandler.GetByID)
	transactions.Put("/:id", transactionHandler.Update)
	transactions.Delete("/:id", transactionHandler.Delete)

	// Bill Routes
	bills := protected.Group("/bills")
	bills.Post("/", billHandler.Create)
	bills.Get("/", billHandler.GetAll)
	bills.Post("/:id/pay", billHandler.Pay)

	// Chat Routes
	chat := protected.Group("/chat")
	chat.Post("/send", chatHandler.SendMessage)
	chat.Get("/messages/:userId", chatHandler.GetMessages)
	chat.Get("/conversations", chatHandler.GetConversations)
	chat.Get("/unread", chatHandler.GetUnreadCount)
	chat.Get("/admin-id", chatHandler.GetAdminID)

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}
	zlog.Info().Msgf("Server started on port %s", port)
	if err := app.Listen(":" + port); err != nil {
		zlog.Fatal().Err(err).Msg("Failed to start server")
	}
}
