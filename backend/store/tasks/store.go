package tasks

import (
	"context"
	"fmt"

	"familyllc/model"
	"familyllc/store/core"
)

type Store interface {
	GetTaskByID(ctx context.Context, id uint64) (*model.Task, error)
	GetTasks(ctx context.Context) ([]*model.Task, error)
	CreateTask(ctx context.Context, task *model.Task) error
	UpdateTask(ctx context.Context, task *model.Task) error
}

func NewStore(database core.Database) Store {
	return &store{database: database}
}

type store struct {
	database core.Database
}

func (s *store) GetTaskByID(ctx context.Context, id uint64) (*model.Task, error) {
	query := "SELECT id, name, complete FROM tasks WHERE id = ?"
	row, err := s.database.ExecWithoutTransaction(ctx, query, id)
	if err != nil {
		return nil, err
	}
	defer row.Close()

	if !row.Next() {
		return nil, fmt.Errorf("task with id %d not found", id)
	}

	var task taskRecord
	if err := row.Scan(&task.ID, &task.Name, &task.Complete); err != nil {
		return nil, err
	}

	return task.toModel(), nil
}

func (s *store) GetTasks(ctx context.Context) ([]*model.Task, error) {
	tasks, err := s.fetchTasks(ctx)
	if err != nil {
		return nil, err
	}

	return taskRecordList(tasks).toModels(), nil

}

func (s *store) fetchTasks(ctx context.Context) ([]*taskRecord, error) {
	query := "SELECT id, name, complete FROM tasks"
	rows, err := s.database.ExecWithoutTransaction(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tasks []*taskRecord
	for rows.Next() {
		var task taskRecord
		if err := rows.Scan(&task.ID, &task.Name, &task.Complete); err != nil {
			return nil, err
		}
		tasks = append(tasks, &task)
	}

	return tasks, nil
}

func (s *store) CreateTask(ctx context.Context, task *model.Task) error {
	tx, err := s.database.StartTransaction()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	query := "INSERT INTO tasks (name) VALUES (?)"
	result, err := tx.ExecContext(ctx, query, task.Name)
	if err != nil {
		return err
	}

	lastInsertId, err := result.LastInsertId()
	if err != nil {
		return err
	}

	task.ID = uint64(lastInsertId)

	return tx.Commit()
}

func (s *store) UpdateTask(ctx context.Context, task *model.Task) error {
	tx, err := s.database.StartTransaction()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	query := "UPDATE tasks SET name = ?, complete = ? WHERE id = ?"
	_, err = tx.ExecContext(ctx, query, task.Name, task.Complete, task.ID)
	if err != nil {
		fmt.Printf("Error updating task: %v\n", err)
		return err
	}

	return tx.Commit()
}
