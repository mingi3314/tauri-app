<script setup>
import { ref } from 'vue';
import Account from './components/Account.vue';
import Rebalance from './components/Rebalance.vue';
import PortfolioTable from './components/PortfolioTable.vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';

const isAccountModalOpen = ref(false);
const isRebalanceModalOpen = ref(false);
</script>

<template>
  <div id="app">

    <div class="button-container">
      <Button label="계좌 등록하기" @click="isAccountModalOpen = true" />
      <Button label="리밸런싱 실행" @click="isRebalanceModalOpen = true" />
    </div>

    <Dialog v-model:visible="isAccountModalOpen" modal header="계좌 등록">
      <Account />
    </Dialog>

    <Dialog v-model:visible="isRebalanceModalOpen" modal header="주문 확인">
      <Rebalance />
    </Dialog>

    <PortfolioTable />
  </div>
</template>

<style scoped>
.button-container {
  display: flex;
  justify-content: flex-end;
  /* 우측 정렬 */
  padding: 20px;
  /* 상단 및 우측 여백 */
}

.p-button {
  margin-left: 20px;
  /* 버튼 사이 여백 */
}
</style>
