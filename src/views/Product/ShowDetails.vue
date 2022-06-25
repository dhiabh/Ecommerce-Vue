<template>
  <div class="container">
    <div class="row pt-5">
      <div class="col-md-1"></div>
      <div class="col-md-4 col-12">
        <img :src="product.imageURL" :alt="product.name" class="img-fluid" />
      </div>
      <div class="col-md-6 col-12 pt-3 pt-md-0">
        <h4>{{ product.name }}</h4>
        <h6 class="font-italic">{{ category.categoryName }}</h6>
        <h6 class="font-weight-bold">$ {{ product.price }}</h6>
        <p>
          {{ product.description }}
        </p>

        <div class="d-flex flex-row justify-content-between">
          <div class="input-group col-md-3 col-4 p-0">
            <button
              v-if="!isInCart"
              type="button"
              id="add-to-cart-button"
              class="btn"
              @click="addToCart()"
            >
              Add to Cart
              <ion-icon name="cart-outline" v-pre></ion-icon>
            </button>
            <button
              v-else
              type="button"
              id="add-to-cart-button"
              class="btn"
              @click="removeFromCart()"
            >
              Remove From Cart
              <ion-icon name="cart-outline" v-pre></ion-icon>
            </button>
          </div>
        </div>

        <div class="features pt-3">
          <h5><strong>Features</strong></h5>
          <ul>
            <li>Lorem ipsum dolor sit amet consectetur adipisicing elit.</li>
            <li>Officia quas, officiis eius magni error magnam voluptatem</li>
            <li>nesciunt quod! Earum voluptatibus quaerat dolorem doloribus</li>
            <li>molestias ipsum ab, ipsa consectetur laboriosam soluta et</li>
            <li>ut doloremque dolore corrupti, architecto iusto beatae.</li>
          </ul>
        </div>
        <div class="text-center">
          <button
            id="show-cart-button"
            type="button"
            class="btn p-1 py-0"
            @click="listCartItems()"
          >
            Show Cart

            <ion-icon name="cart-outline" v-pre></ion-icon>
          </button>
        </div>
      </div>
      <div class="col-md-1"></div>
    </div>
  </div>
</template>

<script>
const axios = require("axios");
const swal = require("sweetalert");
export default {
  data() {
    return {
      product: {},
      category: {},
      id: null,
      token: null,
      quantity: 1,
      isInCart: null,
    };
  },
  props: ["baseURL", "products", "categories"],
  methods: {
    isProductInCart() {
      if (this.token) {
        axios
          .post(
            `${this.baseURL}cart_product/?token=${this.token}`,
            JSON.parse(JSON.stringify(this.product))
          )
          .then((res) => {
            this.isInCart = res.data;
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },

    addToCart() {
      if (!this.token) {
        swal({
          text: "Please log in first!",
          icon: "error",
        });
        return;
      }
      axios
        .post(`${this.baseURL}cart/add?token=${this.token}`, this.product)
        .then(
          (response) => {
            if (response.status == 201) {
              this.$router.go(0);
              // refresh nav bar
              this.$emit("fetchData");
            }
          },
          (error) => {
            console.log(error);
          }
        );
    },

    removeFromCart() {
      axios
        .delete(`${this.baseURL}cart/delete/${this.id}/?token=${this.token} `)
        .then(
          (response) => {
            if (response.status == 200) {
              this.$router.go(0);
            }
            this.$emit("fetchData");
          },
          (error) => {
            console.log(error);
          }
        );
    },

    listCartItems() {
      if (!this.token) {
        swal({
          text: "Please log in first!",
          icon: "error",
        });
        return;
      }

      axios.get(`${this.baseURL}cart/?token=${this.token}`).then(
        (response) => {
          if (response.status === 200) {
            this.$router.push("/cart");
          }
        },
        (error) => {
          console.log(error);
        }
      );
    },
  },
  mounted() {
    this.id = this.$route.params.id;
    this.product = this.products.find((product) => product.id == this.id);
    this.category = this.categories.find(
      (category) => category.id == this.product.categoryId
    );
    this.token = localStorage.getItem("token");
    this.isProductInCart();
  },
};
</script>

<style>

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}

#add-to-cart-button {
  background-color: #febd69;
}

#show-cart-button {
  background-color: #131921;
  color: white;
  border-radius: 0;
}
</style>
