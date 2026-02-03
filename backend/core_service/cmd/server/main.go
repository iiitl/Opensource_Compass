package main

import (
	"log"
	"net/http"

	"core-service/routes"
)

func main() {
	mux := http.NewServeMux()

	routes.RegisterHealthRoutes(mux)

	log.Println("Core service running on :8080")
	err := http.ListenAndServe(":8080", mux)
	if err != nil {
		log.Fatal(err)
	}
}
