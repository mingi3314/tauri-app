<template>
    <div class="modal-backdrop" v-if="isVisible" @click.self="close">
      <div class="modal-content">
        <slot></slot> <!-- Account 컴포넌트를 여기에 삽입합니다 -->
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  
  export default {
    setup() {
      const isVisible = ref(false);
  
      function open() {
        isVisible.value = true;
      }
  
      function close() {
        isVisible.value = false;
      }
  
      return { isVisible, open, close };
    }
  };
  </script>
  
  <style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
  }
  </style>
  