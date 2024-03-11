<template>
  <div>
    <h2>포트폴리오</h2>
    <p v-if="portfolio">총 가치: {{ toCurrency(portfolio.total_value) }}</p>
    <table v-if="portfolio && portfolio.positions && portfolio.positions.length > 0">
      <thead>
        <tr>
          <th>종목코드</th>
          <th>보유수량</th>
          <th>평단가</th>
          <th>총 가치</th>
          <th>수익률</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="position in portfolio.positions" :key="position.symbol">
          <td>{{ position.symbol }}</td>
          <td>{{ position.quantity }}</td>
          <td>{{ toCurrency(position.average_buy_price) }}</td>
          <td>{{ toCurrency(position.total_amount) }}</td>
          <td>{{ position.rtn ? toPercentage(position.rtn) : '-' }}</td>
        </tr>
      </tbody>
    </table>
    <p v-else>포트폴리오 정보를 불러오는 중...</p>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';

const portfolio = ref({
  total_value: 0,
  cash_balance: 0,
  positions: []
});

// 숫자를 통화 형식으로 변환
function toCurrency(value) {
  return value.toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' });
}

// 수익률을 백분율로 변환
function toPercentage(value) {
  return `${(value * 100).toFixed(2)}%`;
}
function transformPortfolioData(data) {
  // API 응답에서 positions 배열 복사
  const positionsCopy = [...data.positions];

  // 현금 잔액을 positions 배열에 추가
  positionsCopy.push({
    symbol: '현금',
    quantity: '-',
    sellable_quantity: '-',
    average_buy_price: '-',
    total_amount: data.cash_balance,
    rtn: 0
  });

  return {
    ...data,
    positions: positionsCopy
  };
}

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:8000/portfolio');
    console.log("데이터 로딩 성공:", response.data);
    // 데이터 변환 함수를 호출하여 현금 잔액을 포함한 포트폴리오 데이터를 생성
    const transformedData = transformPortfolioData(response.data);
    portfolio.value = transformedData;
  } catch (error) {
    console.error("포트폴리오 데이터를 가져오는데 실패했습니다.", error);
  }
});
</script>

<style>
table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  text-align: left;
  padding: 8px;
}

th {
  background-color: #f2f2f2;
}
</style>
