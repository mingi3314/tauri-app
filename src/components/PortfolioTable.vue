<template>
  <div>
    <h2>포트폴리오</h2>
    <p v-if="portfolio">총 가치: {{ toCurrency(portfolio.total_value) }}</p>
    <table v-if="portfolio && portfolio.positions && portfolio.positions.length > 0">
      <thead>
        <tr>
          <th>이름</th>
          <th>비중</th>
          <th>가치</th>
          <th>수익률</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="group in groupedAssets" :key="group.name">
          <tr @click="toggleGroup(group.name)">
            <td><strong>{{ group.name }}</strong></td>
            <td>{{ toPercentage(group.percentage) }}</td>
            <td>{{ toCurrency(group.total_value) }}</td>
            <td>{{ toPercentage(group.average_rtn) }}</td>
          </tr>
          <tr v-if="isVisible(group.name)" v-for="asset in group.positions" :key="asset.asset.symbol">
            <td>— {{ asset.asset.label }}</td>
            <td>{{ toPercentage(calcWeight(asset.total_amount, portfolio.total_value)) }}</td>
            <td>{{ toCurrency(asset.total_amount) }}</td>
            <td>{{ toPercentage(asset.rtn) }}</td>
          </tr>
        </template>
      </tbody>
    </table>
    <p v-else>포트폴리오 정보를 불러오는 중...</p>
  </div>
</template>


<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';

const portfolio = ref({ total_value: 0, positions: [] });
const groupedAssets = ref([]);

const showDetails = ref({});

function toggleGroup(groupName) {
  showDetails.value[groupName] = !showDetails.value[groupName];
}

function isVisible(groupName) {
  return !!showDetails.value[groupName];
}


// 숫자를 통화 형식으로 변환
function toCurrency(value) {
  return value.toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' });
}

// 수익률을 백분율로 변환
function toPercentage(value) {
  return `${(value * 100).toFixed(2)}%`;
}

function calcWeight(value, total) {
  return value / total;
}

function transformPortfolioData(data) {
  // API 응답에서 positions 배열 복사
  const positionsCopy = [...data.positions];

  // 현금 잔액을 positions 배열에 추가
  positionsCopy.push({
    asset: {
      label: '현금',
      symbol: 'CASH',
      asset_class: 'CASH'
    },
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

function groupAssetsByClass(positions, totalValue) {
  // 자산군별로 그룹화된 객체를 생성합니다.
  const assetGroups = {};

  positions.forEach(position => {
    const assetClass = position.asset.asset_class;
    if (!assetGroups[assetClass]) {
      // 자산군별로 초기 객체를 생성합니다.
      assetGroups[assetClass] = {
        name: assetClass,
        total_value: 0,
        positions: [],
        average_rtn: 0,
        total_rtn: 0
      };
    }

    // 자산군에 포지션을 추가하고, 가치와 수익률을 누적합니다.
    assetGroups[assetClass].positions.push(position);
    assetGroups[assetClass].total_value += position.total_amount;
    assetGroups[assetClass].total_rtn += position.total_amount * position.rtn;
  });

  // 각 자산군의 비중과 평균 수익률을 계산합니다.
  Object.values(assetGroups).forEach(group => {
    group.percentage = group.total_value / totalValue;
    group.average_rtn = group.total_value > 0 ? (group.total_rtn / group.total_value) : 0;
  });

  return Object.values(assetGroups); // 배열로 변환하여 반환합니다.
}

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:8000/portfolio');
    // 데이터 변환 함수를 호출하여 현금 잔액을 포함한 포트폴리오 데이터를 생성
    const transformedData = transformPortfolioData(response.data);
    portfolio.value = transformedData;
    groupedAssets.value = groupAssetsByClass(portfolio.value.positions, portfolio.value.total_value);
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

th,
td {
  border: 1px solid #ddd;
  text-align: left;
  padding: 8px;
}

th {
  background-color: #f2f2f2;
}
</style>
