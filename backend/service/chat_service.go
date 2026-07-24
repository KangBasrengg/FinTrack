package service

import (
	"context"

	"github.com/google/uuid"

	"cashmanagement-backend/model"
	"cashmanagement-backend/repository"
)

type ChatService interface {
	SendMessage(ctx context.Context, senderID uuid.UUID, req model.ChatMessageRequest) (model.ChatMessageResponse, error)
	GetMessages(ctx context.Context, userID uuid.UUID, otherUserID uuid.UUID) ([]model.ChatMessageResponse, error)
	GetConversations(ctx context.Context, adminID uuid.UUID) ([]model.ChatConversation, error)
	GetUnreadCount(ctx context.Context, userID uuid.UUID) (int, error)
	MarkAsRead(ctx context.Context, senderID, receiverID uuid.UUID) error
	GetAdminID(ctx context.Context) (uuid.UUID, error)
}

type chatService struct {
	chatRepo repository.ChatRepository
}

func NewChatService(chatRepo repository.ChatRepository) ChatService {
	return &chatService{chatRepo: chatRepo}
}

func (s *chatService) SendMessage(ctx context.Context, senderID uuid.UUID, req model.ChatMessageRequest) (model.ChatMessageResponse, error) {
	var receiverID uuid.UUID
	var err error

	if req.ReceiverID != "" {
		receiverID, err = uuid.Parse(req.ReceiverID)
		if err != nil {
			return model.ChatMessageResponse{}, err
		}
	} else {
		// User sending to admin - find admin
		receiverID, err = s.chatRepo.GetAdminID(ctx)
		if err != nil {
			return model.ChatMessageResponse{}, err
		}
	}

	msg, err := s.chatRepo.SendMessage(ctx, senderID, receiverID, req.Message)
	if err != nil {
		return model.ChatMessageResponse{}, err
	}

	return model.ChatMessageResponse{
		ID:         msg.ID,
		SenderID:   msg.SenderID,
		SenderName: msg.SenderName,
		SenderRole: msg.SenderRole,
		ReceiverID: msg.ReceiverID,
		Message:    msg.Message,
		IsRead:     msg.IsRead,
		CreatedAt:  msg.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
	}, nil
}

func (s *chatService) GetMessages(ctx context.Context, userID uuid.UUID, otherUserID uuid.UUID) ([]model.ChatMessageResponse, error) {
	msgs, err := s.chatRepo.GetMessages(ctx, userID, otherUserID)
	if err != nil {
		return nil, err
	}

	var res []model.ChatMessageResponse
	for _, m := range msgs {
		res = append(res, model.ChatMessageResponse{
			ID:         m.ID,
			SenderID:   m.SenderID,
			SenderName: m.SenderName,
			SenderRole: m.SenderRole,
			ReceiverID: m.ReceiverID,
			Message:    m.Message,
			IsRead:     m.IsRead,
			CreatedAt:  m.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
		})
	}
	return res, nil
}

func (s *chatService) GetConversations(ctx context.Context, adminID uuid.UUID) ([]model.ChatConversation, error) {
	convos, err := s.chatRepo.GetConversations(ctx, adminID)
	if err != nil {
		return nil, err
	}

	var res []model.ChatConversation
	for _, c := range convos {
		res = append(res, model.ChatConversation{
			UserID:      c.UserID,
			UserName:    c.UserName,
			LastMessage: c.LastMessage,
			LastTime:    c.LastTime.Format("2006-01-02T15:04:05Z07:00"),
			UnreadCount: c.UnreadCount,
		})
	}
	return res, nil
}

func (s *chatService) GetUnreadCount(ctx context.Context, userID uuid.UUID) (int, error) {
	return s.chatRepo.GetUnreadCount(ctx, userID)
}

func (s *chatService) MarkAsRead(ctx context.Context, senderID, receiverID uuid.UUID) error {
	return s.chatRepo.MarkAsRead(ctx, senderID, receiverID)
}

func (s *chatService) GetAdminID(ctx context.Context) (uuid.UUID, error) {
	return s.chatRepo.GetAdminID(ctx)
}
