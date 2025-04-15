package core

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"runtime"

	_ "github.com/go-sql-driver/mysql"
)

type Database interface {
	StartTransaction() (*sql.Tx, error)
	ExecWithoutTransaction(ctx context.Context, query string, args ...interface{}) (*sql.Rows, error)
	Close() error
}

type Credentials struct {
	Hostname string `json:"hostname"`
	Username string `json:"username"`
	Password string `json:"password"`
	Database string `json:"database"`
}

func readCredentialsFromFile(filename string) (*Credentials, error) {
	_, callerFile, _, ok := runtime.Caller(0)
	if !ok {
		return nil, fmt.Errorf("unable to determine caller")
	}

	dir := filepath.Dir(callerFile)
	path := filepath.Join(dir, filename)

	data, err := os.ReadFile(path)
	if err != nil {
		return nil, fmt.Errorf("failed to read credentials file at %s: %w", path, err)
	}

	var creds Credentials
	if err := json.Unmarshal(data, &creds); err != nil {
		return nil, fmt.Errorf("failed to parse credentials file at %s: %w", path, err)
	}

	return &creds, nil
}

func NewDatabase() (Database, error) {
	// Load credentials from file
	creds, err := readCredentialsFromFile("credentials.json")
	if err != nil {
		fmt.Println("error loading credentials: %w", err)

		// use pre-filled credentials
		creds = &Credentials{
			Hostname: hostname,
			Username: username,
			Password: password,
			Database: database,
		}
	}
	// fmt.Println("loaded credentials: %s", creds.Password)

	// Define the data source name (DSN)
	dsn := fmt.Sprintf("%s:%s@tcp(%s)/%s", creds.Username, creds.Password, creds.Hostname, creds.Database)

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
