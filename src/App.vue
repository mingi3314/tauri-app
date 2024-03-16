<script setup>
import { ref } from 'vue';
import AccountModal from './components/AccountModal.vue';
import Account from './components/Account.vue';
import PortfolioTable from './components/PortfolioTable.vue';

const isModalOpen = ref(false);

function openModal() {
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
}
</script>

<template>
  <div id="app">

    <div class="button-container">
      <button @click="openModal">계좌 등록하기</button>
    </div>

    <AccountModal v-if="isModalOpen" @on-backdrop-clicked="closeModal" ref="accountModal">
      <Account @btn-close-clicked="closeModal" />
    </AccountModal>

    <PortfolioTable />
  </div>
</template>

<style>
.button-container {
  display: flex;
  justify-content: flex-end;
  /* 우측 정렬 */
  padding: 20px;
  /* 상단 및 우측 여백 */
}
</style>
