<template>
  <div class="adminPanel container">
    <div class="adminProd">
      <router-link v-if="isAdminProd" :to="{ name: 'AdminProduct' }">
        <button
          type="button"
          class="prod rounded-circle w-100 btn btn-dark btn-lg"
        >
          Products Dashboard
        </button>
      </router-link>
      <br />
      <div>
        <router-link v-if="isAdminProd" :to="{ name: 'AdminCategory' }">
          <button
            type="button"
            class="category rounded-circle w-100 btn btn-dark btn-lg"
          >
            Categories Dashboard
          </button>
        </router-link>
      </div>
    </div>

    <router-link v-if="isAdminUser" :to="{ name: 'AdminUser' }">
      <button
        type="button"
        class="adminUser rounded-circle btn btn-dark btn-lg"
      >
        Users Dashboard
      </button>
    </router-link>
  </div>
</template>

<script>
const axios = require("axios");

export default {
  props: ["baseURL"],
  data() {
    return {
      token: null,
      isAdminProd: false,
      isAdminUser: false,
    };
  },

  methods: {
    async checkAdmin() {
      await axios
        .get(`${this.baseURL}user/getUserByToken/?token=${this.token}`)
        .then((response) => {
          this.isAdminProd = response.data.role === "ADMIN_PROD";
          this.isAdminUser = response.data.role === "ADMIN_USER";
        })
        .catch((err) => console.log(err));
    },
  },

  mounted() {
    if (!localStorage.getItem("token")) {
      this.$router.push({ name: "Signin" });
    }
    this.token = localStorage.getItem("token");
    this.checkAdmin();
  },
};
</script>

<style>
.adminPanel {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.adminPanel button {
  font-size: 30px;
  width: fit-content;
  margin: 55px 0;
}

.adminUser {
  height: 150px;
  position: absolute;
  top: 50%;
  left: 50%;
  /* bring your own prefixes */
  transform: translate(-50%, -50%);
}

.adminProd {
  position: absolute;
  top: 50%;
  left: 50%;
  /* bring your own prefixes */
  transform: translate(-50%, -50%);
}

.prod,
.category {
  height: 150px;
}
</style>
