import { createApp } from "vue";
import "./styles.css";
import App from "./App.vue";

import { library } from '@fortawesome/fontawesome-svg-core';
import { faChevronRight, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/aura-light-green/theme.css'


library.add(faChevronRight, faChevronDown);

const app = createApp(App);

app.component('font-awesome-icon', FontAwesomeIcon);
app.use(PrimeVue)

app.mount('#app');