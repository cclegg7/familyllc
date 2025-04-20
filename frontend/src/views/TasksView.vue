<script setup>
import { ref, onMounted } from 'vue';
import TasksClient from '../client/tasksClient.js';

const tasks = ref([]);

onMounted(async () => {
const client = new TasksClient();
  tasks.value = await client.getTasks();
  console.log(tasks.value);
});

const markComplete = async (taskId, completed) => {
  console.log('Sending update for task:', { id: taskId, completed });
  const client = new TasksClient();
  await client.markTaskComplete(taskId, completed);
};
</script>

<template>
  <div class="about">
    <h1>Tasks</h1>
    <ul>
      <li v-for="task in tasks" :key="task.id">
        <input 
          type="checkbox" 
          :checked="task.complete"
          @change="markComplete(task.id, $event.target.checked)"
        />
        {{ task.name }} - {{ task.description }}
      </li>
    </ul>
  </div>
</template>

  
<style>
  @media (min-width: 1024px) {
    .about {
      min-height: 100vh;
      display: flex;
      align-items: center;
    }
  }
  </style>
  