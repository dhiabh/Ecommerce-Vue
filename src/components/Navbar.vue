<template>
  <nav class="navbar navbar-expand-lg">
    <!--    Logo-->
    <router-link class="navbar-brand" :to="{ name: 'Home' }">
      <img id="logo" src="../assets/logo2.png" />
    </router-link>

    <!--    Burger Button-->
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="custom-toggler navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <!--      Search Bar-->
      <form class="form-inline ml-auto mr-auto">
        <div class="input-group">
          <input
            v-model="searchKey"
            size="100"
            type="text"
            class="form-control"
            placeholder="Search Items"
            aria-label="Username"
            aria-describedby="basic-addon1"
          />
          <div class="input-group-prepend" @click="search()">
            <span class="input-group-text" id="search-button-navbar">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="white"
                class="bi bi-search"
                viewBox="0 0 16 16"
              >
                <path
                  d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
                />
              </svg>
            </span>
          </div>
        </div>
      </form>

      <!--      DropDowns-->
      <ul class="navbar-nav ml-auto">
        <li class="nav-item dropdown">
          <a
            class="nav-link text-light dropdown-toggle"
            href="#"
            id="navbarDropdown"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            Browse
          </a>
          <div class="dropdown-menu" aria-labelledby="navbarDropdown">
            <router-link class="dropdown-item" :to="{ name: 'Home' }"
              >Home</router-link
            >
            <router-link class="dropdown-item" :to="{ name: 'Product' }"
              >Product</router-link
            >
            <router-link class="dropdown-item" :to="{ name: 'Category' }"
              >Category</router-link
            >
          </div>
        </li>

        <li class="nav-item dropdown">
          <a
            class="nav-link text-light dropdown-toggle"
            href="#"
            id="navbarDropdown"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            Accounts
          </a>
          <div class="dropdown-menu" aria-labelledby="navbarDropdown">
            <router-link
              class="dropdown-item"
              v-if="isAdmin"
              :to="{ name: 'Admin' }"
              >Admin</router-link
            >
            <router-link
              class="dropdown-item"
              v-if="!token"
              :to="{ name: 'Signin' }"
              >Log In</router-link
            >
            <router-link
              class="dropdown-item"
              v-if="!token"
              :to="{ name: 'Signup' }"
              >Sign Up</router-link
            >
            <a class="dropdown-item" v-if="token" href="#" @click="signout"
              >Sign Out</a
            >
          </div>
        </li>
        <li v-if="!token" class="nav-item">
          <div id="cart">
            <span id="nav-cart-count">{{ cartCount }}</span>
            <router-link
              @click="isConnected()"
              class="text-light"
              :to="{ name: 'Signin' }"
              ><i class="fa fa-shopping-cart" style="font-size: 36px"></i
            ></router-link>
          </div>
        </li>

        <li v-else class="nav-item" @click="isConnected()">
          <div id="cart">
            <span id="nav-cart-count">{{ cartCount }}</span>
            <router-link class="text-light" :to="{ name: 'Cart' }"
              ><i class="fa fa-shopping-cart" style="font-size: 36px"></i
            ></router-link>
          </div>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import axios from "axios";
const swal = require("sweetalert");
export default {
  name: "Navbar",
  props: ["cartCount", "isAdmin", "products"],
  data() {
    return {
      token: null,
      searchKey: "",
    };
  },
  methods: {
    isConnected() {
      if (!this.token) {
        swal({
          text: "Please log in first!",
          icon: "error",
        });
      }
    },

    async search() {
      await axios
        .get(
          `http://localhost:8080/product/searchWithKey/?key=${this.searchKey}`
        )
        .then((res) => {
          this.$router.push({
            name: "Search",
            params: { key: this.searchKey, products: JSON.stringify(res.data) },
          });
        });
    },

    signout() {
      localStorage.removeItem("token");
      this.token = null;
      this.$emit("resetCartCount");
      this.$router.push({ name: "Home" });
      swal({
        text: "Logged you out. Visit Again",
        icon: "success",
        closeOnClickOutside: false,
      });
    },
  },
  mounted() {
    this.token = localStorage.getItem("token");
  },
};
</script>

<style scoped>
nav {
  background-color: #1c1b2c;
}
.form-control {
  background-color: #cec8c2;
}
#logo {
  width: 100px;
  margin-left: 20px;
  margin-right: 20px;
}

.nav-link {
  color: rgba(255, 255, 255);
}

#search-button-navbar {
  background-color: black;
  border-color: black;
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
}

.input-group-prepend {
  cursor: pointer;
}
#nav-cart-count {
  background-color: black;
  color: white;
  border-radius: 50%;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 15px;
  height: 15px;
  font-size: 15px;
  margin-left: 10px;
}
#cart {
  position: relative;
}

.custom-toggler, .navbar-toggler-icon {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='rgba(255,255,255, 0.5)' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 8h24M4 16h24M4 24h24'/%3E%3C/svg%3E");
}

.custom-toggler, .navbar-toggler {
  border-color: rgb(255,255,255);
} 
</style>
