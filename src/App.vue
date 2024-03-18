<script setup>
import { ref } from 'vue';
import Modal from './components/Modal.vue';
import Account from './components/Account.vue';
import Rebalance from './components/Rebalance.vue';
import PortfolioTable from './components/PortfolioTable.vue';


const isAccountModalOpen = ref(false);
const isRebalanceModalOpen = ref(false);

function openAccountModal() {
  isAccountModalOpen.value = true;
}

function closeAccountModal() {
  isAccountModalOpen.value = false;
}

function openRebalanceModal() {
  isRebalanceModalOpen.value = true;
}

function closeRebalanceModal() {
  isRebalanceModalOpen.value = false;
}
</script>

<template>
  <div id="app">

    <div class="button-container">
      <button @click="openAccountModal">계좌 등록하기</button>
      <button @click="openRebalanceModal">리밸런싱 실행</button>
    </div>

    <Modal v-if="isAccountModalOpen" @on-backdrop-clicked="closeAccountModal" ref="accountModal">
      <Account @btn-close-clicked="closeAccountModal" />
    </Modal>

    <Modal v-if="isRebalanceModalOpen" @on-backdrop-clicked="closeRebalanceModal" ref="rebalanceModal">
      <Rebalance @btn-close-clicked="closeRebalanceModal" />
    </Modal>

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

.button-container button {
  margin-left: 20px;
  /* 버튼 사이 여백 */
}
</style>
