<template>
  <div v-if="currentUser">
    <header class="jumbotron">
      <div class="row">
        <div class="col-md-6">
          <h3>
            Thông tin người dùng <strong>{{ currentUser.username }}</strong>
          </h3>
          <form v-if="user">
            <div class="form-group">
              <label for="fullname">Họ và tên đầy đủ</label>
              <input
                type="text"
                class="form-control"
                id="fullname"
                v-model="user.fullname"
              />
            </div>
            <button @click="updateFullname" class="btn btn-primary">
              <i class="fas fa-user-edit"></i>&nbsp;Cập nhật
            </button>
          </form>
        </div>
        <div class="col-md-6">
          <img class="img-fluid" src="../assets/edit.svg" />
        </div>
      </div>
    </header>
    <div class="row mb-4">
      <div class="col-md-8">
        <div class="card" v-if="currentUser.isAdmin">
          <div class="table-responsive">
            <table class="table table-striped">
              <thead>
                <tr class="text-center">
                  <th scope="col">#</th>
                  <th scope="col">Họ tên đầy đủ</th>
                  <th scope="col">username</th>
                  <th scope="col">Hành động</th>
                </tr>
              </thead>
              <tbody v-if="users">
                <tr v-for="(user, index) in users" :key="index">
                  <th scope="row">{{ index + 1 }}</th>
                  <td>{{ user.fullname }}</td>
                  <td>{{ user.username }}</td>
                  <td class="text-center">
                    <button
                      v-show="!user.isActive && !user.isAdmin"
                      class="btn btn-success mr-4 mb-2"
                      @click="allowUser(user._id, user.username, true)"
                    >
                      <i class="fas fa-book"></i>&nbsp; Kích hoạt
                    </button>
                    <button
                      v-show="user.isActive && !user.isAdmin"
                      class="btn btn-danger mr-4 mb-2"
                      @click="allowUser(user._id, user.username, false)"
                    >
                      <i class="fas fa-book-dead"></i>&nbsp; Bỏ kích hoạt
                    </button>
                    <button
                      v-show="!user.isAdmin"
                      class="btn btn-info mr-2 mb-2"
                      @click="allowAdmin(user._id, user.username, true)"
                    >
                      <i class="fas fa-user-shield"></i>&nbsp; Cấp quyền
                    </button>
                    <button
                      v-show="user.isAdmin && user.username != 'admin'"
                      class="btn btn-light mr-2 mb-2"
                      @click="allowAdmin(user._id, user.username, false)"
                    >
                      <i class="fas fa-user-times"></i>&nbsp; Bỏ cấp quyền
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="col-md-4"></div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import AuthService from "../services/auth.service";

export default {
  name: "Profile",
  computed: {
    ...mapGetters({
      currentUser: "loggedInUser",
    }),
  },
  data() {
    return {
      user: null,
      users: [],
      currentFullName: "",
    };
  },
  methods: {
    async retrieveUsers() {
      const [error, respone] = await this.handle(AuthService.getAll());
      if (error) {
        console.log(error);
      } else {
        this.users = respone.data;
        console.log(this.users);
      }
    },

    async retrieveUser(currentUserId) {
      console.log(currentUserId);
      const [error, respone] = await this.handle(
        AuthService.get(currentUserId)
      );
      if (error) {
        console.log(error);
      } else {
        this.user = respone.data;
        console.log(this.user);
      }
    },

    async allowUser(currentId, currentUsername, currentStatus) {
      const [error, respone] = await this.handle(
        AuthService.update(currentId, {
          username: currentUsername,
          isActive: currentStatus,
        })
      );
      if (error) {
        console.log(error);
      } else {
        console.log(respone.data);
        this.retrieveUsers();
      }
    },

    async allowAdmin(currentId, currentUsername, currentStatus) {
      const [error, respone] = await this.handle(
        AuthService.update(currentId, {
          username: currentUsername,
          isAdmin: currentStatus,
        })
      );
      if (error) {
        console.log(error);
      } else {
        console.log(respone.data);
        this.retrieveUsers();
      }
    },

    async updateFullname() {
      const [error, respone] = await this.handle(
        AuthService.update(this.user._id, this.user)
      );
      if (error) {
        console.log(error);
      } else {
        console.log(respone.data);
        this.retrieveUsers();
      }
    },
  },
  mounted() {
    if (!this.currentUser) {
      this.$router.push("/login");
    }
    console.log(this.currentUser);
    this.retrieveUser(this.currentUser.id);
    this.retrieveUsers();
  },
};
</script>
