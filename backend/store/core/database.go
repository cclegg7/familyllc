package core

import (
	"context"
	"database/sql"
	"fmt"

	_ "github.com/go-sql-driver/mysql"
)

type Database interface {
	StartTransaction() (*sql.Tx, error)
	ExecWithoutTransaction(ctx context.Context, query string, args ...interface{}) (*sql.Rows, error)
	Close() error
}

func NewDatabase() (Database, error) {
	// Define the data source name (DSN)
	dsn := fmt.Sprintf("%s:%s@tcp(%s)/%s", username, password, hostname, database)

	// Open a connection to the database
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		return nil, fmt.Errorf("error opening database: %w", err)
	}

	// Test the connection
	if err = db.Ping(); err != nil {
		return nil, fmt.Errorf("error connecting to the database: %w", err)
	}

	return &databaseImpl{db: db}, nil
}

const (
	hostname = "127.0.0.1:3306"
	username = "root"
	password = "3cfwk6sTc&c8pHjF"
	database = "family_inc"
)

type databaseImpl struct {
	db *sql.DB
}

func (d *databaseImpl) Close() error {
	return d.db.Close()
}

func (d *databaseImpl) ExecWithoutTransaction(ctx context.Context, query string, args ...interface{}) (*sql.Rows, error) {
	result, err := d.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("error executing query: %w", err)
	}
	return result, nil
}

func (d *databaseImpl) StartTransaction() (*sql.Tx, error) {
	tx, err := d.db.Begin()
	if err != nil {
		return nil, fmt.Errorf("error starting transaction: %w", err)
	}
	return tx, nil
}
