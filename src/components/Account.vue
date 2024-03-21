<template>
  <div class="account-form">
    <form @submit.prevent="submitAccount" class="p-fluid">
      <div class="p-field">
        <label for="brokerage">증권사</label>
        <Dropdown id="brokerage" v-model="accountData.brokerage" :options="brokerages" optionLabel="name"
          optionValue="value" placeholder="증권사를 선택해주세요." />
      </div>
      <div class="p-field">
        <label for="appKey">APP_KEY</label>
        <InputText id="appKey" v-model="accountData.app_key" type="password" />
      </div>
      <div class="p-field">
        <label for="secretKey">SECRET_KEY</label>
        <InputText id="secretKey" v-model="accountData.secret_key" type="password" />
      </div>
      <div class="p-formgrid p-grid">
        <div class="p-field p-col">
          <Button label="계좌 등록하기" type="submit" />
        </div>
      </div>
      <p v-if="accountSubmissionResultMessage">{{ accountSubmissionResultMessage }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import axios from 'axios';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';


const emit = defineEmits(['btn-close-clicked']);

const brokerages = [
  { name: '이베스트', value: 'ebest' },
  { name: '한국투자증권', value: 'korea_investment' },
];

const accountData = reactive({
  brokerage: null,
  app_key: '',
  secret_key: '',
});

const accountSubmissionResultMessage = ref('');

async function submitAccount() {
  try {
    const response = await axios.post('http://localhost:8000/accounts', accountData);
    console.log(response.data); // 성공 응답 처리
    accountSubmissionResultMessage.value = '계좌가 성공적으로 등록되었습니다.';
  } catch (error) {
    console.error('계좌 등록에 실패했습니다:', error);
    accountSubmissionResultMessage.value = '계좌 등록에 실패했습니다.';
  }
}

</script>

<style scoped>
.p-field {
  margin-bottom: 20px;
}
</style>