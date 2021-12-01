<template>
  <div id="app">
    <nav class="navbar navbar-expand navbar-dark bg-success">
      <a href="/" class="navbar-brand">Anh Ngữ Simple</a>

      <div v-if="currentUser" class="navbar-nav mr-auto">
        <li class="nav-item">
          <router-link to="/" class="nav-link">
            <i class="fas fa-window-restore"></i>&nbsp;Bài kiểm tra
          </router-link>
        </li>
      </div>

      <div v-if="!currentUser" class="navbar-nav ml-auto">
        <li class="nav-item">
          <router-link to="/register" class="nav-link"
            ><i class="fas fa-user-plus"></i>&nbsp;Đăng ký
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/login" class="nav-link"
            ><i class="fas fa-user"></i>&nbsp;Đăng nhập
          </router-link>
        </li>
      </div>

      <div v-if="currentUser" class="navbar-nav ml-auto">
        <li class="nav-item">
          <router-link to="/profile" class="nav-link">
            <i class="fas fa-user-circle"></i>&nbsp;{{ currentUser.username }}
          </router-link>
        </li>
        <li class="nav-item">
          <a class="nav-link" @click.prevent="logout"
            ><i class="fas fa-user-times"></i>&nbsp;Đăng xuất
          </a>
        </li>
      </div>
    </nav>
    <div class="container mt-3">
      <router-view />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "App",
  computed: {
    ...mapGetters({
      currentUser: "loggedInUser",
    }),
  },
  methods: {
    ...mapMutations([
      "initAuthState", // map this.initAuthState() to this.$store.commit("initAuthState")
    ]),
    logout() {
      this.$store.commit("logout");
      this.$router.push("/login");
    },
  },
  mounted() {
    this.initAuthState();
  },
};
</script>

<style>
.list-group-item.active {
  background-color: #4caf50 !important;
  border-color: #4caf50 !important;
}

select:focus,
input:focus,
button:focus {
  outline: none !important;
  box-shadow: none !important;
}
</style>
