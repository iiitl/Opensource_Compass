package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/jackc/pgx/v5"
)

func main() {
	connStr := "postgresql://postgres.wcmjcqdiunmbdykygjuy:1b8M47aIpVmjxmRN@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres"

	conn, err := pgx.Connect(context.Background(), connStr)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
		os.Exit(1)
	}
	defer conn.Close(context.Background())

	rows, err := conn.Query(context.Background(), "SELECT id, github_username FROM users")
	if err != nil {
		log.Fatal("Failed to fetch users:", err)
	}
	defer rows.Close()

	fmt.Println("--- Users in DB ---")
	count := 0
	for rows.Next() {
		var id, username string
		if err := rows.Scan(&id, &username); err != nil {
			log.Fatal(err)
		}
		fmt.Printf("ID: '%s' (len=%d), Username: %s\n", id, len(id), username)
		count++
	}
	fmt.Printf("Total users: %d\n", count)
}
