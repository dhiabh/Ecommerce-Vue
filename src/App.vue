<template>
  <Navbar
    :cartCount="cartCount"
    :isAdmin="isAdmin"
    @resetCartCount="resetCartCount"
    v-if="!['Signup', 'Signin'].includes($route.name)"
  />
  <div style="min-height: 60vh">
    <router-view
      v-if="products && categories"
      :baseURL="baseURL"
      :products="products"
      :categories="categories"
      @fetchData="fetchData"
    >
    </router-view>
  </div>
  <Footer v-if="!['Signup', 'Signin'].includes($route.name)" />
</template>

<script>
const axios = require('axios')

import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
export default {
  data() {
    return {
      baseURL: "http://localhost:8080/",
      products: null,
      categories: null,
      key: 0,
      token: null,
      cartCount: 0,
      isAdmin: false
    };
  },

  components: { Footer, Navbar },
  methods: {

    async checkAdmin() {
      await axios
        .get(`${this.baseURL}user/getUserByToken/?token=${this.token}`).then(
          (response) => {
            this.isAdmin = (response.data.role === "ADMIN_PROD") || (response.data.role === "ADMIN_USER")
            
          }
        ).catch((err) => console.log(err));
    },

    async fetchData() {
      // fetch products
      await axios
        .get(this.baseURL + 'product/')
        .then((res) => (this.products = res.data))
        .catch((err) => console.log(err));

      //fetch categories
      await axios
        .get(this.baseURL + 'category/')
        .then((res) => (this.categories = res.data))
        .catch((err) => console.log(err));

      //fetch cart items
      if (this.token) {
        await axios.get(`${this.baseURL}cart/?token=${this.token}`).then(
          (response) => {
            if (response.status == 200) {
              // update cart
              this.cartCount = Object.keys(response.data.products).length;
            }
          },
          (error) => {
            console.log(error);
          }
        );
      }
    },
    resetCartCount() {
      this.cartCount = 0;
    },
  },
  mounted() {
    this.token = localStorage.getItem('token');
    this.checkAdmin();
    this.fetchData();
  },
};
</script>

<style>
html {
  overflow-y: scroll;
}
</style>
