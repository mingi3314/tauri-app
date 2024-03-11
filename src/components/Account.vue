<script setup>
import { ref, reactive } from "vue";
import axios from 'axios';

const accountData = reactive({
  brokerage: '',
  app_key: '',
  secret_key: ''
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

<template>
  <div>
    <form @submit.prevent="submitAccount">
      <div>
        <label for="brokerage">증권사: </label>
        <select id="brokerage" v-model="accountData.brokerage" required>
          <option disabled value="">증권사를 선택해주세요.</option>
          <option value="ebest">이베스트</option>
          <option value="korea_investment">한국투자증권</option>
        </select>
      </div>
      <div>
        <label for="appKey">APP_KEY:</label>
        <input id="appKey" v-model="accountData.app_key" type="password" required>
      </div>
      <div>
        <label for="secretKey">SECRET_KEY:</label>
        <input id="secretKey" v-model="accountData.secret_key" type="password" required>
      </div>
      <button type="submit">계좌 등록</button>
      <p v-if="accountSubmissionResultMessage">{{ accountSubmissionResultMessage }}</p>
    </form>
  </div>
</template>

<style>
input {
  margin-right: 10px; /* 상하좌우 마진 설정 */
  width: calc(100% - 20px); /* 양쪽 마진을 고려한 너비 설정 */
}
</style>