package api

import (
	"encoding/json"
	"familyllc/model"
	"familyllc/store/tasks"
	"fmt"
	"net/http"
)

type TasksApi struct {
	taskStore tasks.Store
}

func NewTasksApi(taskStore tasks.Store) *TasksApi {
	return &TasksApi{
		taskStore: taskStore,
	}
}

func (h *TasksApi) RegisterEndpoints() {
	http.HandleFunc("/tasks", h.handleGetTasks)
	http.HandleFunc("/tasks/create", h.handleCreateTask)
	http.HandleFunc("/tasks/mark-complete", h.handleMarkComplete)
}

func setCORSHeaders(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
}

func (h *TasksApi) handleGetTasks(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	ctx := r.Context()
	tasks, err := h.taskStore.GetTasks(ctx)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error fetching tasks: %v", err), http.StatusInternalServerError)
		return
	}
	resp, err := json.Marshal(tasks)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error marshalling tasks: %v", err), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")

	fmt.Fprint(w, string(resp))
}

func (h *TasksApi) handleCreateTask(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	if r.Method != http.MethodPut {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	var task model.Task
	if err := json.NewDecoder(r.Body).Decode(&task); err != nil {
		http.Error(w, fmt.Sprintf("Error decoding task: %v", err), http.StatusBadRequest)
		return
	}

	err := h.taskStore.CreateTask(ctx, &task)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error creating task: %v", err), http.StatusInternalServerError)
		return
	}

	fmt.Fprintf(w, "Task created with ID: %d", task.ID)
}

func (h *TasksApi) handleMarkComplete(w http.ResponseWriter, r *http.Request) {
	setCORSHeaders(w)

	if r.Method == http.MethodOptions {
		// Handle the preflight request for CORS
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	ctx := r.Context()

	var payload struct {
		ID        uint64 `json:"id"`
		Completed bool   `json:"completed"`
	}

	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, fmt.Sprintf("Error decoding request body: %v", err), http.StatusBadRequest)
		return
	}

	task, err := h.taskStore.GetTaskByID(ctx, payload.ID)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error fetching task: %v", err), http.StatusInternalServerError)
		return
	}

	if task == nil {
		http.Error(w, "Task not found", http.StatusNotFound)
		return
	}

	task.Complete = payload.Completed
	err = h.taskStore.UpdateTask(ctx, task)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error updating task: %v", err), http.StatusInternalServerError)
		return
	}

	status := "incomplete"
	if task.Complete {
		status = "complete"
	}
	fmt.Fprintf(w, "Task with ID %d marked as %s", task.ID, status)
}
