package handler

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"

	"cashmanagement-backend/model"
	"cashmanagement-backend/service"
	"cashmanagement-backend/util"
)

type BillHandler struct {
	billService service.BillService
}

func NewBillHandler(billService service.BillService) *BillHandler {
	return &BillHandler{billService: billService}
}

func (h *BillHandler) Create(c *fiber.Ctx) error {
	userID, ok := c.Locals("user_id").(uuid.UUID)
	if !ok {
		return util.ErrorResponse(c, fiber.StatusUnauthorized, "Unauthorized", "UNAUTHORIZED")
	}

	var req model.BillRequest
	if err := c.BodyParser(&req); err != nil {
		return util.ErrorResponse(c, fiber.StatusBadRequest, "Invalid request body", err.Error())
	}

	res, err := h.billService.CreateBill(c.Context(), userID, req)
	if err != nil {
		return util.ErrorResponse(c, fiber.StatusInternalServerError, err.Error(), "CREATE_FAILED")
	}

	return util.SuccessResponse(c, fiber.StatusCreated, res, "Bill created successfully")
}

func (h *BillHandler) GetAll(c *fiber.Ctx) error {
	userID, ok := c.Locals("user_id").(uuid.UUID)
	if !ok {
		return util.ErrorResponse(c, fiber.StatusUnauthorized, "Unauthorized", "UNAUTHORIZED")
	}

	res, err := h.billService.GetBillsByUserID(c.Context(), userID)
	if err != nil {
		return util.ErrorResponse(c, fiber.StatusInternalServerError, err.Error(), "FETCH_FAILED")
	}

	if res == nil {
		res = []model.BillResponse{}
	}

	return util.SuccessResponse(c, fiber.StatusOK, res, "Bills retrieved successfully")
}

func (h *BillHandler) Pay(c *fiber.Ctx) error {
	userID, ok := c.Locals("user_id").(uuid.UUID)
	if !ok {
		return util.ErrorResponse(c, fiber.StatusUnauthorized, "Unauthorized", "UNAUTHORIZED")
	}

	billIDParam := c.Params("id")
	billID, err := uuid.Parse(billIDParam)
	if err != nil {
		return util.ErrorResponse(c, fiber.StatusBadRequest, "Invalid bill ID", "INVALID_ID")
	}

	err = h.billService.PayBill(c.Context(), userID, billID)
	if err != nil {
		return util.ErrorResponse(c, fiber.StatusInternalServerError, err.Error(), "UPDATE_FAILED")
	}

	return util.SuccessResponse(c, fiber.StatusOK, nil, "Bill marked as paid")
}
