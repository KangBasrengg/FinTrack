package handler

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"

	"cashmanagement-backend/model"
	"cashmanagement-backend/service"
	"cashmanagement-backend/util"
)

type WalletHandler struct {
	walletService service.WalletService
}

func NewWalletHandler(walletService service.WalletService) *WalletHandler {
	return &WalletHandler{walletService: walletService}
}

func (h *WalletHandler) Create(c *fiber.Ctx) error {
	userID, ok := c.Locals("user_id").(uuid.UUID)
	if !ok {
		return util.ErrorResponse(c, fiber.StatusUnauthorized, "Unauthorized", "UNAUTHORIZED")
	}

	var req model.WalletRequest
	if err := c.BodyParser(&req); err != nil {
		return util.ErrorResponse(c, fiber.StatusBadRequest, "Invalid request body", err.Error())
	}

	if req.Name == "" || req.Type == "" {
		return util.ErrorResponse(c, fiber.StatusBadRequest, "Name and type are required", "VALIDATION_ERROR")
	}

	res, err := h.walletService.Create(c.Context(), userID, req)
	if err != nil {
		return util.ErrorResponse(c, fiber.StatusInternalServerError, err.Error(), "CREATE_FAILED")
	}

	return util.SuccessResponse(c, fiber.StatusCreated, res, "Wallet created successfully")
}

func (h *WalletHandler) GetAll(c *fiber.Ctx) error {
	userID, ok := c.Locals("user_id").(uuid.UUID)
	if !ok {
		return util.ErrorResponse(c, fiber.StatusUnauthorized, "Unauthorized", "UNAUTHORIZED")
	}

	res, err := h.walletService.GetByUserID(c.Context(), userID)
	if err != nil {
		return util.ErrorResponse(c, fiber.StatusInternalServerError, err.Error(), "FETCH_FAILED")
	}

	// Always return empty array instead of null
	if res == nil {
		res = []model.WalletResponse{}
	}

	return util.SuccessResponse(c, fiber.StatusOK, res, "Wallets retrieved successfully")
}

func (h *WalletHandler) Update(c *fiber.Ctx) error {
	userID, ok := c.Locals("user_id").(uuid.UUID)
	if !ok {
		return util.ErrorResponse(c, fiber.StatusUnauthorized, "Unauthorized", "UNAUTHORIZED")
	}

	walletIDParam := c.Params("id")
	walletID, err := uuid.Parse(walletIDParam)
	if err != nil {
		return util.ErrorResponse(c, fiber.StatusBadRequest, "Invalid wallet ID format", "INVALID_ID")
	}

	var req model.WalletRequest
	if err := c.BodyParser(&req); err != nil {
		return util.ErrorResponse(c, fiber.StatusBadRequest, "Invalid request body", err.Error())
	}

	if req.Name == "" || req.Type == "" {
		return util.ErrorResponse(c, fiber.StatusBadRequest, "Name and type are required", "VALIDATION_ERROR")
	}

	res, err := h.walletService.Update(c.Context(), userID, walletID, req)
	if err != nil {
		return util.ErrorResponse(c, fiber.StatusNotFound, err.Error(), "UPDATE_FAILED")
	}

	return util.SuccessResponse(c, fiber.StatusOK, res, "Wallet updated successfully")
}

func (h *WalletHandler) Delete(c *fiber.Ctx) error {
	userID, ok := c.Locals("user_id").(uuid.UUID)
	if !ok {
		return util.ErrorResponse(c, fiber.StatusUnauthorized, "Unauthorized", "UNAUTHORIZED")
	}

	walletIDParam := c.Params("id")
	walletID, err := uuid.Parse(walletIDParam)
	if err != nil {
		return util.ErrorResponse(c, fiber.StatusBadRequest, "Invalid wallet ID format", "INVALID_ID")
	}

	err = h.walletService.Delete(c.Context(), userID, walletID)
	if err != nil {
		return util.ErrorResponse(c, fiber.StatusInternalServerError, err.Error(), "DELETE_FAILED")
	}

	return util.SuccessResponse(c, fiber.StatusOK, nil, "Wallet deleted successfully")
}
