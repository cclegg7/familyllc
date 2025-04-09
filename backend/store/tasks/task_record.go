package tasks

import "familyllc/model"

type taskRecord struct {
	ID       uint64
	Name     string
	Complete bool
}

func (tr *taskRecord) toModel() *model.Task {
	return &model.Task{
		ID:       tr.ID,
		Name:     tr.Name,
		Complete: tr.Complete,
	}
}

type taskRecordList []*taskRecord

func (trl taskRecordList) toModels() []*model.Task {
	modelTasks := make([]*model.Task, len(trl))
	for i, tr := range trl {
		modelTasks[i] = tr.toModel()
	}
	return modelTasks
}
