package middleware

import (
	"strings"

	"github.com/gofiber/fiber/v2"

	"cashmanagement-backend/util"
)

func Protected() fiber.Handler {
	return func(c *fiber.Ctx) error {
		authHeader := c.Get("Authorization")

		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			return util.ErrorResponse(c, fiber.StatusUnauthorized, "Missing or invalid token", "UNAUTHORIZED")
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")

		claims, err := util.VerifyToken(tokenString)
		if err != nil {
			return util.ErrorResponse(c, fiber.StatusUnauthorized, "Invalid or expired token", "UNAUTHORIZED")
		}

		c.Locals("user_id", claims.UserID)
		return c.Next()
	}
}
