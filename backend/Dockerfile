# Build stage
FROM golang:1.23-alpine AS builder

WORKDIR /app

# Install dependencies for CGO (if needed) and ca-certificates
RUN apk add --no-cache git ca-certificates tzdata

# Copy go.mod and go.sum
COPY go.mod go.sum ./
RUN go mod download

# Copy the rest of the source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/server main.go

# Run stage
FROM alpine:latest

WORKDIR /app

# Copy ca-certificates for HTTPS requests
RUN apk --no-cache add ca-certificates tzdata

# Copy the binary from the builder stage
COPY --from=builder /app/server .
# Copy the .env file if necessary (usually secrets are set via fly secrets, but good to have fallback)
# COPY .env . 

# Expose the port the app runs on
EXPOSE 7860

# Command to run the application
CMD ["./server"]
