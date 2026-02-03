package routes

import (
	"net/http"
)

func RegisterHealthRoutes(mux *http.ServeMux) {
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("core-service is healthy"))
	})
}
