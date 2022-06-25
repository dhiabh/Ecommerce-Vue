<template>
  <div class="container">
    <div class="row">
      <div class="col-12 text-center">
        <h4 class="pt-3">{{msg}}</h4>
      </div>
    </div>

    <div class="row justify-content-center">
      <img v-show="len == 0" class="img-fluid" src="../../assets/no-item-found.png" alt="Sorry">
      <div v-for="product of products" :key="product.id" class="col-md-6 col-xl-4 col-12 pt-3  justify-content-around d-flex">
        <ProductBox :product="product">
        </ProductBox>
      </div>
    </div>
  </div>
</template>

<script>
import ProductBox from '../../components/Product/ProductBox';
export default {
  name: 'Search',
  data(){
    return {
      key:'',
      products: null,
      len : 0,
      msg : null
    }
  },
  components : {ProductBox},
  props : [ "baseURL" , "categories" ],
  mounted() {
    this.key = this.$route.params.key;
    this.products = JSON.parse(this.$route.params.products);

    this.len = this.products.length;
    if(this.len == 0) {
      this.msg = `Sorry, no products matched '${this.key}'` ;
    } else if(this.len == 1) {
      this.msg = `Only 1 product matched '${this.key}'`;
    } else {
      this.msg = `${this.len} products matched '${this.key}'`;
    }
  }
}
</script>

<style scoped>
h4 {
  font-family: 'Roboto', sans-serif;
  color: #484848;
  font-weight: 700;
}

h5 {
  font-family: 'Roboto', sans-serif;
  color: #686868;
  font-weight: 300;
}
</style>
