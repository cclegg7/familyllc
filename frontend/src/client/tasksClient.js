export default class TasksClient {
    constructor(baseUrl = 'http://localhost:8080') {
        this.baseUrl = baseUrl;
    }

    async getTasks() {
        const response = await fetch(`${this.baseUrl}/tasks`);
        if (!response.ok) {
            throw new Error(`Failed to fetch tasks: ${response.statusText}`);
        }
        return response.json();
    }

    async createTask(task) {
        const response = await fetch(`${this.baseUrl}/tasks/create`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task),
        });

        if (!response.ok) {
            throw new Error(`Failed to create task: ${response.statusText}`);
        }

        const text = await response.text();
        const match = text.match(/Task created with ID: (\d+)/);
        if (!match) {
            throw new Error('Failed to parse task ID from response');
        }

        return parseInt(match[1], 10);
    }

    async markTaskComplete(taskId) {
        const response = await fetch(`${this.baseUrl}/tasks/mark-complete?id=${taskId}`, {
            method: 'POST',
        });

        if (!response.ok) {
            throw new Error(`Failed to mark task as complete: ${response.statusText}`);
        }
    }
}