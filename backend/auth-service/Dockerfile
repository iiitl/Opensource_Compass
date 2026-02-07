FROM golang:1.25-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o main cmd/server/main.go

FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/main .
# auth-service might rely on .env, but usually we inject via docker-compose
# checking if .env exists in source, copying if so, but it might not be there in prod
# safest is to rely on env vars, but for local run copying .env if present is helpful
# adhering to "deployment ready" usually means env vars. 
# copying .env for now to match local setup behaviors if file exists.

EXPOSE 8080

CMD ["./main"]
