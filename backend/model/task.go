package model

type Task struct {
	ID       uint64 `json:"id"`
	Name     string `json:"name"`
	Complete bool   `json:"complete"`
}
