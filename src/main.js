import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
//import swal from 'sweetalert';
// import "bootstrap"
// import "bootstrap/dist/css/bootstrap.min.css"

//using axios as a global object
window.axios = require('axios')

window.swal = require('sweetalert')

createApp(App).use(router).mount('#app');
