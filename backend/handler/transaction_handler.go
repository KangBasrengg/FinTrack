package handler

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"

	"cashmanagement-backend/model"
	"cashmanagement-backend/service"
	"cashmanagement-backend/util"
)

type TransactionHandler struct {
	transactionService service.TransactionService
}

func NewTransactionHandler(transactionService service.TransactionService) *TransactionHandler {
	return &TransactionHandler{transactionService: transactionService}
}

func (h *TransactionHandler) Create(c *fiber.Ctx) error {
	userID, ok := c.Locals("user_id").(uuid.UUID)
	if !ok {
		return util.ErrorResponse(c, fiber.StatusUnauthorized, "Unauthorized", "UNAUTHORIZED")
	}

	var req model.TransactionRequest
	if err := c.BodyParser(&req); err != nil {
		return util.ErrorResponse(c, fiber.StatusBadRequest, "Invalid request body", err.Error())
	}

	res, err := h.transactionService.Create(c.Context(), userID, req)
	if err != nil {
		return util.ErrorResponse(c, fiber.StatusInternalServerError, err.Error(), "CREATE_FAILED")
	}

	return util.SuccessResponse(c, fiber.StatusCreated, res, "Transaction created successfully")
}

func (h *TransactionHandler) GetByID(c *fiber.Ctx) error {
	userID, ok := c.Locals("user_id").(uuid.UUID)
	if !ok {
		return util.ErrorResponse(c, fiber.StatusUnauthorized, "Unauthorized", "UNAUTHORIZED")
	}

	idParam := c.Params("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		return util.ErrorResponse(c, fiber.StatusBadRequest, "Invalid transaction ID format", "INVALID_ID")
	}

	res, err := h.transactionService.GetByID(c.Context(), userID, id)
	if err != nil {
		return util.ErrorResponse(c, fiber.StatusNotFound, err.Error(), "NOT_FOUND")
	}

	return util.SuccessResponse(c, fiber.StatusOK, res, "Transaction retrieved successfully")
}

func (h *TransactionHandler) Update(c *fiber.Ctx) error {
	userID, ok := c.Locals("user_id").(uuid.UUID)
	if !ok {
		return util.ErrorResponse(c, fiber.StatusUnauthorized, "Unauthorized", "UNAUTHORIZED")
	}

	idParam := c.Params("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		return util.ErrorResponse(c, fiber.StatusBadRequest, "Invalid transaction ID format", "INVALID_ID")
	}

	var req model.TransactionRequest
	if err := c.BodyParser(&req); err != nil {
		return util.ErrorResponse(c, fiber.StatusBadRequest, "Invalid request body", err.Error())
	}

	res, err := h.transactionService.Update(c.Context(), userID, id, req)
	if err != nil {
		return util.ErrorResponse(c, fiber.StatusNotFound, err.Error(), "UPDATE_FAILED")
	}

	return util.SuccessResponse(c, fiber.StatusOK, res, "Transaction updated successfully")
}

func (h *TransactionHandler) Delete(c *fiber.Ctx) error {
	userID, ok := c.Locals("user_id").(uuid.UUID)
	if !ok {
		return util.ErrorResponse(c, fiber.StatusUnauthorized, "Unauthorized", "UNAUTHORIZED")
	}

	idParam := c.Params("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		return util.ErrorResponse(c, fiber.StatusBadRequest, "Invalid transaction ID format", "INVALID_ID")
	}

	err = h.transactionService.Delete(c.Context(), userID, id)
	if err != nil {
		return util.ErrorResponse(c, fiber.StatusInternalServerError, err.Error(), "DELETE_FAILED")
	}

	return util.SuccessResponse(c, fiber.StatusOK, nil, "Transaction deleted successfully")
}

func (h *TransactionHandler) Search(c *fiber.Ctx) error {
	userID, ok := c.Locals("user_id").(uuid.UUID)
	if !ok {
		return util.ErrorResponse(c, fiber.StatusUnauthorized, "Unauthorized", "UNAUTHORIZED")
	}

	var req model.TransactionSearchRequest
	if err := c.BodyParser(&req); err != nil {
		return util.ErrorResponse(c, fiber.StatusBadRequest, "Invalid request body", err.Error())
	}

	res, err := h.transactionService.Search(c.Context(), userID, req)
	if err != nil {
		return util.ErrorResponse(c, fiber.StatusInternalServerError, err.Error(), "SEARCH_FAILED")
	}

	return util.SuccessResponse(c, fiber.StatusOK, res, "Transactions retrieved successfully")
}
