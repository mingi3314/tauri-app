<template>
    <div>
        <h2>주문 확인</h2>
        <div v-if="orders.length">
            <table>
                <!-- 테이블 헤더 -->
                <thead>
                    <tr>
                        <th>상품</th>
                        <th>가격</th>
                        <th>수량</th>
                        <th>매매 유형</th>
                    </tr>
                </thead>
                <!-- 테이블 바디 -->
                <tbody>
                    <tr v-for="order in orders" :key="order.symbol">
                        <td>{{ order.symbol }}</td>
                        <td>{{ order.price }}</td>
                        <td>{{ order.quantity }}</td>
                        <td>{{ order.side }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else>주문 불러오는중...</div>
        <div class="button-group">
            <button @click="placeOrders">주문 실행</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from 'axios';

const orders = ref([]);

onMounted(async () => {
    orders.value = await fetchOrders();
})

async function fetchOrders() {
    try {
        const response = await axios.get('http://localhost:8000/strategies/all-weather-kr/orders');
        console.log(response.data); // 성공 응답 처리
        return response.data.orders;
    } catch (error) {
        console.error('계좌 등록에 실패했습니다:', error);
    }
}

async function placeOrders() {
    try {
        const response = await axios.post('http://localhost:8000/strategies/all-weather-kr/orders', { 'orders': orders.value });
        console.log(response.data); // 성공 응답 처리
    } catch (error) {
        console.error('계좌 등록에 실패했습니다:', error);
    }
}
</script>


