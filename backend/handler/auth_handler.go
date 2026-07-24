package handler

import (
	"github.com/gofiber/fiber/v2"

	"cashmanagement-backend/model"
	"cashmanagement-backend/service"
	"cashmanagement-backend/util"
)

type AuthHandler struct {
	authService service.AuthService
}

func NewAuthHandler(authService service.AuthService) *AuthHandler {
	return &AuthHandler{authService: authService}
}

func (h *AuthHandler) Register(c *fiber.Ctx) error {
	var req model.RegisterRequest
	if err := c.BodyParser(&req); err != nil {
		return util.ErrorResponse(c, fiber.StatusBadRequest, "Invalid request body", err.Error())
	}

	if req.Name == "" || req.Email == "" || req.Password == "" {
		return util.ErrorResponse(c, fiber.StatusBadRequest, "Name, email, and password are required", "VALIDATION_ERROR")
	}

	res, err := h.authService.Register(c.Context(), req)
	if err != nil {
		return util.ErrorResponse(c, fiber.StatusBadRequest, err.Error(), "REGISTER_FAILED")
	}

	return util.SuccessResponse(c, fiber.StatusCreated, res, "Registration successful")
}

func (h *AuthHandler) Login(c *fiber.Ctx) error {
	var req model.LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return util.ErrorResponse(c, fiber.StatusBadRequest, "Invalid request body", err.Error())
	}

	if req.Email == "" || req.Password == "" {
		return util.ErrorResponse(c, fiber.StatusBadRequest, "Email and password are required", "VALIDATION_ERROR")
	}

	res, err := h.authService.Login(c.Context(), req)
	if err != nil {
		return util.ErrorResponse(c, fiber.StatusUnauthorized, err.Error(), "UNAUTHORIZED")
	}

	return util.SuccessResponse(c, fiber.StatusOK, res, "Login successful")
}
