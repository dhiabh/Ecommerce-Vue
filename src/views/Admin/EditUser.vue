<template>
  <div class="container">
    <div class="row">
      <div class="col-12 text-center">
        <h4 class="pt-3">Edit User</h4>
      </div>
    </div>

    <div class="row">
      <div class="col-3"></div>
      <div class="col-md-6 px-5 px-md-0">
        <form v-if="user">
          <div class="form-group">
            <label>First Name</label>
            <input
              type="text"
              class="form-control"
              v-model="user.firstName"
              required
            />
          </div>
          <div class="form-group">
            <label>Last Name</label>
            <input
              type="text"
              class="form-control"
              v-model="user.lastName"
              required
            />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input
              type="text"
              class="form-control"
              v-model="user.email"
              required
            />
          </div>
          <div class="form-group">
            <label>Role</label>
            <select class="form-control" v-model="user.role" required>
              <option>ADMIN_USER</option>
              <option>ADMIN_PROD</option>
              <option>USER</option>
            </select>
          </div>

          <button type="button" class="btn btn-primary" @click="editUser">
            Submit
          </button>
        </form>
      </div>
      <div class="col-3"></div>
    </div>
  </div>
</template>

<script>
const axios = require("axios");
const swal = require("sweetalert");
export default {
  props: ["baseURL"],

  data() {
    return {
      id: null,
      user: null,
      token: null,
    };
  },
  methods: {
    async getUser(id) {
      await axios
        .get(`${this.baseURL}user/getUserById/${id}/?token=${this.token}`)
        .then((res) => {
          this.user = res.data;
          console.log(this.user);
        });
    },
    async editUser() {
      const updatedUser = {
        id: this.user.id,
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        email: this.user.email,
        role: this.user.role,
      };
      axios
        .post(
          `${this.baseURL}user/updateUser/?token=${this.token}`,updatedUser
        )
        .then(() => {
          
          this.$router.push({ name: "AdminUser" });
          swal({
            text: "User Updated Successfully!",
            icon: "success",
            closeOnClickOutside: false,
          });
        })
        .catch((err) => console.log("err", err));
    },
  },
  mounted() {
    if (!localStorage.getItem("token")) {
      this.$router.push({ name: "Signin" });
      return;
    }
    this.token = localStorage.getItem("token");
    this.id = this.$route.params.id;
    this.getUser(this.id);
  },
};
</script>

<style scoped>
h4 {
  font-family: "Roboto", sans-serif;
  color: #484848;
  font-weight: 700;
}
</style>
