package main

import (
	"log"
	"net/http"

	"core-service/config"
	"core-service/routes"
)

func main() {
	cfg := config.Load()
	mux := http.NewServeMux()

	routes.RegisterHealthRoutes(mux)

	log.Printf("Core service running on :%s\n", cfg.ServerPort)
	err := http.ListenAndServe(":"+cfg.ServerPort, mux)
	if err != nil {
		log.Fatal(err)
	}
}
