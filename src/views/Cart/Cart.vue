<template>
  <div class="container">
    <div class="row">
      <div class="col-12 text-center">
        <h3 class="pt-3">Shopping cart</h3>
      </div>
    </div>
    <!--    loop over all the cart items and display one by one-->
    <div
      v-for="(cartItem, index) in cartItems"
      :key="cartItem.id"
      class="row mt-2 pt-3 justify-content-around"
    >
      <div class="col-2"></div>
      <!-- display image -->
      <div class="col-md-3 embed-responsive embed-responsive-16by9">
        <router-link :to="{ name: 'ShowDetails', params: { id: cartItem.id } }">
          <img
            v-bind:src="cartItem.imageURL"
            class="w-100 card-img-top embed-responsive-item"
          />
        </router-link>
      </div>
      <!-- display product name, quantity and price -->
      <div class="col-md-5 px-3">
        <div class="card-block px-3">
          <h6 class="card-title">
            <router-link
              :to="{ name: 'ShowDetails', params: { id: cartItem.id } }"
              >{{ cartItem.name }}
            </router-link>
          </h6>
          <p id="item-price" class="mb-0 font-weight-bold">
            $ {{ cartItem.price }} per unit
          </p>
          <div id="item-quantity" class="d-flex align-items-center mb-0">
            Quantity :
            <form @submit.prevent="updateQuantity" method="post">
              <div class="input-counter ml-3">
                <div>
                  <button
                    type="submit"
                    :value="index"
                    name="minus"
                    class="minus-btn"
                  >
                    <h3><i class="bi bi-dash-circle-fill mr-2"></i></h3>
                  </button>
                  <span class="counter-btn font-weight-bold">{{
                    cartItem.quantity
                  }}</span>
                  <button
                    type="submit"
                    :value="index"
                    name="plus"
                    class="plus-btn"
                  >
                    <h3><i class="bi bi-plus-circle-fill ml-2"></i></h3>
                  </button>
                </div>
              </div>
            </form>
          </div>
          <p id="item-total-price" class="mb-0">
            Total Price:
            <span class="font-weight-bold">
              $ {{ cartItem.price * cartItem.quantity }}</span
            >
          </p>
          <br />
          <br /><a
            href="#"
            class="text-right"
            @click="removeFromCart(cartItem.product_id)"
            >Remove From Cart</a
          >
        </div>
      </div>
      <div class="col-2"></div>
      <div class="col-12"><hr /></div>
    </div>

    <!-- display total price -->
    <div v-if="cartItems.length != 0" class="total-cost pt-2 text-right">
      <h5>Total : $ {{ totalcost.toFixed(2) }}</h5>
    </div>
    <div v-else>
      <div class="row justify-content-center">
        <img
          class="img-fluid"
          src="../../assets/no-item-found.png"
          alt="Sorry"
        />
      </div>
      <div class="row justify-content-center mt-3">
        <button class="btn btn-dark">
          <router-link class="text-white" :to="{ name: 'Home' }"
            >Start Shopping
          </router-link>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
const axios = require("axios");
export default {
  data() {
    return {
      cartItems: [],
      token: null,
      totalcost: 0,
      index: 0,
    };
  },
  name: "Cart",
  props: ["baseURL"],
  methods: {
    isDisabled() {
      return this.cartItems.length === 0;
    },
    // fetch all the items in cart
    listCartItems() {
      axios.get(`${this.baseURL}cart/?token=${this.token}`).then(
        (response) => {
          if (response.status == 200) {
            const result = response.data;
            // store cartitems and total price in two variables
            this.cartItems = result.products;
            this.totalcost = result.cart.total;

            for (let i = 0; i < this.cartItems.length; i++) {
              this.cartItems[i] = {
                ...this.cartItems[i],
                ...result.cartItemDtos[i],
              };
            }
          }
        },
        (error) => {
          console.log(error);
        }
      );
    },

    removeFromCart(itemId) {
      axios
        .delete(`${this.baseURL}cart/delete/${itemId}/?token=${this.token} `)
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
    showDetails(productId) {
      this.$router.push({
        name: "ShowDetails",
        params: { id: productId },
      });
    },

    updateQuantity(event) {
      this.index = event.submitter.value;
      if (event.submitter.name == "plus") {
        this.increaseQuantity(
          this.cartItems[this.index].quantity,
          this.cartItems[this.index].total,
          this.cartItems[this.index].price
        );
      } else {
        this.decreaseQuantity(
          this.cartItems[this.index].quantity,
          this.cartItems[this.index].total,
          this.cartItems[this.index].price
        );
      }
      //console.log(this.cartItems[this.index].price)
    },
    increaseQuantity(quantity, total, price) {
      quantity++;
      total += price;
      axios
        .put(
          `${this.baseURL}cart/update/${this.cartItems[this.index].id}/?token=${
            this.token
          }`,
          {
            quantity: quantity,
            total: total,
          }
        )
        .then(() => {
          this.$router.push({ name: "Cart" }).catch(() => {});
          this.cartItems[this.index].quantity = quantity;
          this.cartItems[this.index].total = total;
          this.totalcost += this.cartItems[this.index].price;
        })
        .catch((err) => console.log(err));
    },
    decreaseQuantity(quantity, total, price) {
      if (quantity > 1) {
        quantity--;
        total -= price;

        axios
          .put(
            `${this.baseURL}cart/update/${
              this.cartItems[this.index].id
            }/?token=${this.token}`,
            {
              quantity: quantity,
              total: total,
            }
          )
          .then(() => {
            this.$router.push({ name: "Cart" }).catch(() => {});
            this.cartItems[this.index].quantity = quantity;
            this.cartItems[this.index].total = total;
            this.totalcost -= this.cartItems[this.index].price;
          });
      }
    },
  },
  mounted() {
    this.token = localStorage.getItem("token");
    this.listCartItems();
  },
};
</script>

<style scoped>
h4,
h5 {
  font-family: "Roboto", sans-serif;
  color: #484848;
  font-weight: 700;
}

.embed-responsive .card-img-top {
  object-fit: cover;
}

#item-price {
  color: #232f3e;
}

#item-quantity {
  float: left;
}

#item-total-price {
  float: right;
}

.confirm {
  font-weight: bold;
  font-size: larger;
}

.minus-btn,
.plus-btn {
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
}
.counter-btn {
  font-size: 20px;
}
</style>
