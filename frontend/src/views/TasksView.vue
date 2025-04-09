<script setup>
import { ref, onMounted } from 'vue';
import TasksClient from '../client/tasksClient.js';

const tasks = ref([]);

onMounted(async () => {
const client = new TasksClient();
  tasks.value = await client.getTasks();
  console.log(tasks.value);
});

const markComplete = async (taskId) => {
  const client = new TasksClient();
  await client.markTaskComplete(taskId);
  console.log(`Task ${taskId} marked as complete`);
};
</script>

<template>
    <div class="about">
        <h1>Tasks</h1>
        <ul>
        <li v-for="task in tasks" :key="task.id">
            <input type="checkbox" :checked="task.complete" @change="markComplete(task.id)" />
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
  