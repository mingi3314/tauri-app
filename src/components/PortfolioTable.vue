<template>
  <div>
    <h2>포트폴리오</h2>
    <p v-if="portfolio">총 가치: {{ toCurrency(portfolio.total_value) }}</p>
    <div class="segmented-bar-container">
      <!-- 자산군별 비중을 나타내는 각 세그먼트 -->
      <div v-for="group in groupedAssets" :key="group.name" class="segmented-bar"
        :style="{ width: group.percentage * 100 + '%', backgroundColor: getColorForAssetClass(group.name), 'border-radius': '5px' }"
        :title="`${translateAssetClassName(group.name)}: ${toPercentage(group.percentage)}`"
        :data-label="`${translateAssetClassName(group.name)}: ${toPercentage(group.percentage)}`">
      </div>
    </div>

    <div class="asset-labels">
      <span v-for="group in groupedAssets" :key="group.name" class="asset-label">
        <span class="color-indicator" :style="{ backgroundColor: getColorForAssetClass(group.name) }"></span>
        {{ translateAssetClassName(group.name) }}: {{ toPercentage(group.percentage) }}
      </span>
    </div>

    <TreeTable :value="treeTableData">
      <Column field="name" header="이름" expander></Column>
      <Column field="percentage" header="비중"></Column>
      <Column field="total_value" header="가치"></Column>
      <Column field="rtn" header="수익률"></Column>
    </TreeTable>

  </div>
</template>


<script setup>
import { computed, onMounted, ref } from 'vue';
import axios from 'axios';
import TreeTable from 'primevue/treetable';
import Column from 'primevue/column';

const portfolio = ref(null);

onMounted(async () => {
  portfolio.value = await fetchPortfolioData();
});

const groupedAssets = computed(() => {
  if (!portfolio.value) return [];
  // portfolio 데이터를 변환하고 자산군별로 그룹화합니다.
  const data = transformPortfolioData(portfolio.value);
  let assetGroups = groupAssetsByClass(data.positions, data.total_value);
  // 그룹화된 자산군을 비중에 따라 정렬합니다.
  return sortAssetGroups(assetGroups);
});

const treeTableData = computed(() => {
  return groupedAssets.value.map((group, index) => ({
    key: `group-${index}`,
    data: {
      name: translateAssetClassName(group.name),
      percentage: toPercentage(group.percentage),
      total_value: toCurrency(group.total_value),
      rtn: toPercentage(group.average_rtn)
    },
    children: group.positions.map((position, childIndex) => ({
      key: `position-${index}-${childIndex}`,
      data: {
        name: position.asset.label,
        percentage: toPercentage(calcWeight(position.total_amount, portfolio.value.total_value)),
        total_value: toCurrency(position.total_amount),
        rtn: toPercentage(position.rtn)
      }
    }))
  }));
});



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

function sortAssetGroups(assetGroups) {
  // 자산군을 비중에 따라 정렬합니다.
  assetGroups.sort((a, b) => b.percentage - a.percentage);

  // 각 자산군 내의 자산들을 비중에 따라 정렬합니다.
  assetGroups.forEach(group => {
    group.positions.sort((a, b) => b.percentage - a.percentage);
  });

  return assetGroups;
}

async function fetchPortfolioData() {
  try {
    const response = await axios.get('http://localhost:8000/portfolio');
    return response.data;
  } catch (error) {
    console.error("포트폴리오 데이터를 가져오는데 실패했습니다.", error);
    return null; // 오류 발생 시 null 반환
  }
}

function translateAssetClassName(className) {
  const nameMap = {
    "STOCK": "주식",
    "BOND": "채권",
    "CASH": "현금성 자산",
    "COMMODITY": "원자재",
    "OTHER": "기타"
  };

  return nameMap[className] || className;
}

function getColorForAssetClass(assetClass) {
  const colors = {
    STOCK: '#3498db',
    BOND: '#9b59b6',
    CASH: '#2ecc71',
    COMMODITY: '#f1c40f',
    OTHER: '#e74c3c'
  };
  return colors[assetClass] || '#bdc3c7'; // 기본 색상 설정
}

</script>

<style>
.segmented-bar-container {
  display: flex;
  width: 100%;
  height: 10px;
  gap: 4px;
  background-color: #ecf0f1;
  /* 기본 배경 색상, 필요에 따라 조정 */
  border-radius: 5px;
  overflow: hidden;
}

.color-indicator {
  height: 10px;
  width: 10px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 8px;
  /* 라벨과의 간격 */
}

.asset-labels {
  display: flex;
  gap: 20px;
  padding-top: 4px;
  margin-bottom: 8px;
}

.asset-label {
  font-size: 0.8em;
  color: #666;
  display: flex;
  align-items: center;
  /* 중앙 정렬 */
}
</style>
