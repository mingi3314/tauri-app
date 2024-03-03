<script setup>
import { ref } from "vue";
import { invoke } from "@tauri-apps/api/tauri";
import axios from 'axios';

const greetMsg = ref("");
const name = ref("");

const responseMsg = ref("");

async function getAccount() {
  try {
    const response = await axios.get("http://localhost:8000/accounts/default");
    const { brokerage } = response.data.account;
    responseMsg.value = `${brokerage} 계좌에 연결되었습니다.`;
  } catch (error) {
    console.error("There was an error:", error);
    responseMsg.value = "계좌 연결 상태를 가져오는 데 실패했습니다.";
  }
}

async function greet() {
  // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
  greetMsg.value = await invoke("greet", { name: name.value });
}
</script>

<template>
  <form class="row" @submit.prevent="greet">
    <input id="greet-input" v-model="name" placeholder="Enter a name..." />
    <button type="submit">Greet</button>
  </form>

  <p>{{ greetMsg }}</p>

  <button @click="getAccount">계좌 연결 상태</button>
  <p>{{ responseMsg }}</p>
</template>
