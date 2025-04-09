package server

import (
	"context"
	"fmt"
	"net/http"
	"time"

	api "familyllc/server/tasks"
	"familyllc/store/tasks"
)

type Server struct {
	httpServer *http.Server
	taskStore  tasks.Store
}

func NewServer(taskStore tasks.Store) Server {
	taskApi := api.NewTasksApi(taskStore)
	taskApi.RegisterEndpoints()

	mux := http.NewServeMux()
	mux.HandleFunc("/tasks", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}
		http.DefaultServeMux.ServeHTTP(w, r)
	})

	return Server{
		httpServer: &http.Server{
			Addr:    ":8080",
			Handler: mux,
		},
		taskStore: taskStore,
	}
}

func (s Server) Start() chan error {
	errChan := make(chan error)

	fmt.Println("Starting server on :8080")
	go func() {
		if err := http.ListenAndServe(":8080", nil); err != nil && err != http.ErrServerClosed {
			errChan <- fmt.Errorf("error starting server: %w", err)
		}
	}()

	return errChan
}

func (s Server) Stop() error {
	// Create a context with a timeout for graceful shutdown
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := s.httpServer.Shutdown(ctx); err != nil {
		return fmt.Errorf("error stopping server: %w", err)
	}

	fmt.Println("Server stopped")

	return nil
}
