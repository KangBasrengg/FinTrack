package handler

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"

	"cashmanagement-backend/model"
	"cashmanagement-backend/service"
	"cashmanagement-backend/util"
)

type ChatHandler struct {
	chatService service.ChatService
}

func NewChatHandler(chatService service.ChatService) *ChatHandler {
	return &ChatHandler{chatService: chatService}
}

// SendMessage - POST /api/chat/send
func (h *ChatHandler) SendMessage(c *fiber.Ctx) error {
	userID, ok := c.Locals("user_id").(uuid.UUID)
	if !ok {
		return util.ErrorResponse(c, fiber.StatusUnauthorized, "Unauthorized", "UNAUTHORIZED")
	}

	var req model.ChatMessageRequest
	if err := c.BodyParser(&req); err != nil {
		return util.ErrorResponse(c, fiber.StatusBadRequest, "Invalid request body", err.Error())
	}

	res, err := h.chatService.SendMessage(c.Context(), userID, req)
	if err != nil {
		return util.ErrorResponse(c, fiber.StatusInternalServerError, err.Error(), "SEND_FAILED")
	}

	return util.SuccessResponse(c, fiber.StatusCreated, res, "Message sent")
}

// GetMessages - GET /api/chat/messages/:userId
func (h *ChatHandler) GetMessages(c *fiber.Ctx) error {
	userID, ok := c.Locals("user_id").(uuid.UUID)
	if !ok {
		return util.ErrorResponse(c, fiber.StatusUnauthorized, "Unauthorized", "UNAUTHORIZED")
	}

	otherID, err := uuid.Parse(c.Params("userId"))
	if err != nil {
		return util.ErrorResponse(c, fiber.StatusBadRequest, "Invalid user ID", "INVALID_ID")
	}

	// Mark messages from the other user as read
	_ = h.chatService.MarkAsRead(c.Context(), otherID, userID)

	msgs, err := h.chatService.GetMessages(c.Context(), userID, otherID)
	if err != nil {
		return util.ErrorResponse(c, fiber.StatusInternalServerError, err.Error(), "FETCH_FAILED")
	}
	if msgs == nil {
		msgs = []model.ChatMessageResponse{}
	}

	return util.SuccessResponse(c, fiber.StatusOK, msgs, "Messages retrieved")
}

// GetConversations - GET /api/chat/conversations (admin only)
func (h *ChatHandler) GetConversations(c *fiber.Ctx) error {
	userID, ok := c.Locals("user_id").(uuid.UUID)
	if !ok {
		return util.ErrorResponse(c, fiber.StatusUnauthorized, "Unauthorized", "UNAUTHORIZED")
	}

	convos, err := h.chatService.GetConversations(c.Context(), userID)
	if err != nil {
		return util.ErrorResponse(c, fiber.StatusInternalServerError, err.Error(), "FETCH_FAILED")
	}
	if convos == nil {
		convos = []model.ChatConversation{}
	}

	return util.SuccessResponse(c, fiber.StatusOK, convos, "Conversations retrieved")
}

// GetUnreadCount - GET /api/chat/unread
func (h *ChatHandler) GetUnreadCount(c *fiber.Ctx) error {
	userID, ok := c.Locals("user_id").(uuid.UUID)
	if !ok {
		return util.ErrorResponse(c, fiber.StatusUnauthorized, "Unauthorized", "UNAUTHORIZED")
	}

	count, err := h.chatService.GetUnreadCount(c.Context(), userID)
	if err != nil {
		return util.ErrorResponse(c, fiber.StatusInternalServerError, err.Error(), "FETCH_FAILED")
	}

	return util.SuccessResponse(c, fiber.StatusOK, fiber.Map{"count": count}, "Unread count retrieved")
}

// GetAdminID - GET /api/chat/admin-id
func (h *ChatHandler) GetAdminID(c *fiber.Ctx) error {
	adminID, err := h.chatService.GetAdminID(c.Context())
	if err != nil {
		return util.ErrorResponse(c, fiber.StatusInternalServerError, "No admin found", "NOT_FOUND")
	}

	return util.SuccessResponse(c, fiber.StatusOK, fiber.Map{"admin_id": adminID}, "Admin ID retrieved")
}
