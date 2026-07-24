package handler

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"

	"cashmanagement-backend/model"
	"cashmanagement-backend/service"
	"cashmanagement-backend/util"
)

type CategoryHandler struct {
	categoryService service.CategoryService
}

func NewCategoryHandler(categoryService service.CategoryService) *CategoryHandler {
	return &CategoryHandler{categoryService: categoryService}
}

func (h *CategoryHandler) Create(c *fiber.Ctx) error {
	userID, ok := c.Locals("user_id").(uuid.UUID)
	if !ok {
		return util.ErrorResponse(c, fiber.StatusUnauthorized, "Unauthorized", "UNAUTHORIZED")
	}

	var req model.CategoryRequest
	if err := c.BodyParser(&req); err != nil {
		return util.ErrorResponse(c, fiber.StatusBadRequest, "Invalid request body", err.Error())
	}

	if req.Name == "" || req.Type == "" || req.Icon == "" || req.Color == "" {
		return util.ErrorResponse(c, fiber.StatusBadRequest, "Name, type, icon, and color are required", "VALIDATION_ERROR")
	}

	res, err := h.categoryService.Create(c.Context(), userID, req)
	if err != nil {
		return util.ErrorResponse(c, fiber.StatusInternalServerError, err.Error(), "CREATE_FAILED")
	}

	return util.SuccessResponse(c, fiber.StatusCreated, res, "Category created successfully")
}

func (h *CategoryHandler) GetAll(c *fiber.Ctx) error {
	userID, ok := c.Locals("user_id").(uuid.UUID)
	if !ok {
		return util.ErrorResponse(c, fiber.StatusUnauthorized, "Unauthorized", "UNAUTHORIZED")
	}

	res, err := h.categoryService.GetByUserID(c.Context(), userID)
	if err != nil {
		return util.ErrorResponse(c, fiber.StatusInternalServerError, err.Error(), "FETCH_FAILED")
	}

	// Always return empty array instead of null
	if res == nil {
		res = []model.CategoryResponse{}
	}

	return util.SuccessResponse(c, fiber.StatusOK, res, "Categories retrieved successfully")
}

func (h *CategoryHandler) Update(c *fiber.Ctx) error {
	userID, ok := c.Locals("user_id").(uuid.UUID)
	if !ok {
		return util.ErrorResponse(c, fiber.StatusUnauthorized, "Unauthorized", "UNAUTHORIZED")
	}

	categoryIDParam := c.Params("id")
	categoryID, err := uuid.Parse(categoryIDParam)
	if err != nil {
		return util.ErrorResponse(c, fiber.StatusBadRequest, "Invalid category ID format", "INVALID_ID")
	}

	var req model.CategoryRequest
	if err := c.BodyParser(&req); err != nil {
		return util.ErrorResponse(c, fiber.StatusBadRequest, "Invalid request body", err.Error())
	}

	if req.Name == "" || req.Type == "" || req.Icon == "" || req.Color == "" {
		return util.ErrorResponse(c, fiber.StatusBadRequest, "Name, type, icon, and color are required", "VALIDATION_ERROR")
	}

	res, err := h.categoryService.Update(c.Context(), userID, categoryID, req)
	if err != nil {
		return util.ErrorResponse(c, fiber.StatusNotFound, err.Error(), "UPDATE_FAILED")
	}

	return util.SuccessResponse(c, fiber.StatusOK, res, "Category updated successfully")
}

func (h *CategoryHandler) Delete(c *fiber.Ctx) error {
	userID, ok := c.Locals("user_id").(uuid.UUID)
	if !ok {
		return util.ErrorResponse(c, fiber.StatusUnauthorized, "Unauthorized", "UNAUTHORIZED")
	}

	categoryIDParam := c.Params("id")
	categoryID, err := uuid.Parse(categoryIDParam)
	if err != nil {
		return util.ErrorResponse(c, fiber.StatusBadRequest, "Invalid category ID format", "INVALID_ID")
	}

	err = h.categoryService.Delete(c.Context(), userID, categoryID)
	if err != nil {
		return util.ErrorResponse(c, fiber.StatusInternalServerError, err.Error(), "DELETE_FAILED")
	}

	return util.SuccessResponse(c, fiber.StatusOK, nil, "Category deleted successfully")
}
