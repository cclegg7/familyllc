# Backend Service Architecture

The backend is a Go application structured in layers following clean architecture principles:

## Directory Structure

```
backend/
├── domain/          # Business logic and domain interfaces
│   └── tasks/       # Task-related domain logic
├── model/           # Data models and entities
├── server/          # HTTP server and API handlers
│   └── tasks/       # Task-related API endpoints
└── store/           # Data persistence layer
    ├── core/        # Core storage interfaces
    ├── tasks/       # Task storage implementation
    └── users/       # User storage implementation
```

## Architectural Layers

### Models (`model/`)
Contains the core data structures and entities used throughout the application. For example, `task.go` defines the Task entity model.

### Domain Layer (`domain/`)
Houses the business logic and defines interfaces for the application's core functionality. This layer is independent of external frameworks and storage implementations.

### Server Layer (`server/`)
Handles HTTP routing and API endpoints. The `server.go` file configures and initializes the HTTP server, while subdirectories like `tasks/` contain specific API endpoint handlers.

### Store Layer (`store/`)
Implements data persistence and storage operations:
- `core/`: Defines base interfaces for storage operations
- `tasks/`: Task-specific storage implementation
- `users/`: User-specific storage implementation

## Dependencies
Dependencies are managed via Go modules (`go.mod`) and vendored in the `vendor/` directory.

## Getting Started

To run the server:

```bash
cd backend
go run main.go
```

The server will start listening on the configured port and expose the REST API endpoints.