package util

import "github.com/gofiber/fiber/v2"

type APIResponse struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data"`
	Message string      `json:"message"`
	Error   interface{} `json:"error"`
}

func SuccessResponse(c *fiber.Ctx, statusCode int, data interface{}, message string) error {
	return c.Status(statusCode).JSON(APIResponse{
		Success: true,
		Data:    data,
		Message: message,
		Error:   nil,
	})
}

func ErrorResponse(c *fiber.Ctx, statusCode int, message string, err string) error {
	return c.Status(statusCode).JSON(APIResponse{
		Success: false,
		Data:    nil,
		Message: message,
		Error:   err,
	})
}
