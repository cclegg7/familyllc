package main

import (
	"familyllc/server"
	"familyllc/store/core"
	"familyllc/store/tasks"
	"fmt"
	"log"
	"os"
	"os/signal"

	_ "github.com/go-sql-driver/mysql"
)

func main() {
	database, err := core.NewDatabase()
	if err != nil {
		log.Fatalf("Error creating database: %v", err)
	}

	taskStore := tasks.NewStore(database)

	s := server.NewServer(taskStore)
	serverErrChan := s.Start()
	defer func() {
		err := s.Stop()
		if err != nil {
			fmt.Printf("Error stopping server: %v", err)
		}
	}()

	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt)

	// Block until either an error occurs or an interrupt signal is received
	select {
	case err := <-serverErrChan:
		fmt.Printf("Server error: %v", err)
	case <-c:
		fmt.Println("Received interrupt signal")
	}
}
