<template>
  <div class="container">
    <div class="row">
      <div class="card-header col-12 text-center">
        <h4 class="pt-3">Our Users</h4>
      </div>
      <div class="card-body">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Email</th>
              <th scope="col">First Name</th>
              <th scope="col">Last Name</th>
              <th scope="col">Role</th>
              <th scope="col">Edit</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user of users" :key="user.id">
              <td>{{ user.id }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.firstName }}</td>
              <td>{{ user.lastName }}</td>
              <td>{{ user.role }}</td>
              <td>
                <router-link :to="{ name: 'EditUser', params: { id: user.id } }"
                  ><h5 class="btn btn-success">Edit</h5></router-link
                >
              </td>
              <td>
                <button @click="removeUser(user)" class="btn btn-danger">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
const axios = require("axios");
const swal = require("sweetalert");

export default {
  name: "AdminUser",
  props: ["baseURL"],
  data() {
    return {
      token: null,
      users: [],
    };
  },

  methods: {
    async getUsers() {
      await axios
        .get(`${this.baseURL}user/all/?token=${this.token}`)
        .then((res) => {
          this.users = res.data;
        })
        .catch((err) => console.log(err));
    },

    removeUser(user) {
      swal({
        text: `Are you sure you want to delete the user ${user.firstName} ${user.lastName}?`,
        icon: "error",
        buttons: true,
        dangerMode: true,
        closeOnClickOutside: false,
      }).then((confirm) => {
        if (confirm) {
          axios
            .post(`${this.baseURL}user/delete/${user.id}/?token=${this.token}`)
            .then(() => {
              //location.reload();
              location.reload();
              swal({
                text: "User Deleted Successfully!",
                icon: "success",
                closeOnClickOutside: false,
              });
            })
            .catch((err) => console.log(err));
        }
      });
    },
  },
  mounted() {
    if (this.$route.name == "AdminUser" && !localStorage.getItem("token")) {
      this.$router.push({ name: "Signin" });
    }
    this.token = localStorage.getItem("token");
    this.getUsers();
  },
};
</script>

<style scoped>
h4 {
  font-family: "Roboto", sans-serif;
  color: #484848;
  font-weight: 700;
}

#add-category {
  float: right;
  font-weight: 500;
}
</style>
