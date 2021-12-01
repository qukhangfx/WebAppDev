<template>
  <div class="row">
    <div class="col-md-12">
      <div class="mb-3 input-group">
        <input
          type="text"
          class="form-control"
          placeholder="Tìm theo tên bài kiểm tra"
          v-model="nameToSearch"
        />
        <div class="input-group-append">
          <button
            class="btn btn-success border-0"
            type="button"
            @click="searchName"
          >
            <i class="fa fa-search" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </div>
    <div class="col-md-12">
      <div class="row">
        <div class="col-md-6 mb-4">
          <h4><i class="fas fa-window-restore"></i>&nbsp;Danh sách bài</h4>
          <div class="row">
            <div class="col-md-12">
              <button
                v-if="isAdmin"
                class="mt-3 btn btn-sm btn-danger"
                @click="goToAddTest"
              >
                <i class="fas fa-plus-circle"></i>&nbsp;Thêm bài kiểm tra
              </button>
              <button
                v-if="showDeleteAll"
                class="mt-3 ml-2 btn btn-sm btn-danger"
                @click="removeAllTest"
              >
                Xóa tất cả
              </button>
            </div>
            <div class="col-md-12 mt-4">
              <ul class="list-group">
                <li
                  class="list-group-item"
                  :class="{ active: index == currentIndex }"
                  v-for="(test, index) in tests"
                  v-show="
                    test.visible ||
                    (currentUser !== null && currentUser.isAdmin)
                  "
                  :key="test.id"
                  @click="setActiveTest(test, index)"
                >
                  <div class="media">
                    <div class="media-body">
                      <h5 class="mt-0 mb-0">
                        <i class="fas fa-trophy"></i>&nbsp;&nbsp;{{ test.name }}&nbsp;&nbsp;
                        <span
                          v-if="
                            !test.visible &&
                            (currentUser !== null && currentUser.isAdmin)
                          "
                          class="badge bg-danger rounded" style="color: #fff;"
                          ><i class="fas fa-user-shield"></i
                        ></span>
                      </h5>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="col-md-6 mb-4">
          <div class="row">
            <div class="col-md-12 mt-4" v-if="!currentTest">
              <img class="img-fluid" src="../assets/team.svg" />
            </div>
            <div class="col-md-12 mt-4" v-if="currentTest">
              <img
                src="../assets/graduation.svg"
                class="img-fluid mb-3"
                alt=""
              />
              <TestDetails :test="currentTest" />
              <div class="mb-2 col-12">
                <div class="row">
                  <strong class="col-sm-12">Mật khẩu:</strong>
                  <div class="col-sm-12 mt-2 mb-2">
                    <input
                      name="userPassword"
                      type="text"
                      class="form-control"
                      v-model="currentTest.userPassword"
                      placeholder="Nhập mật khẩu bài kiểm tra"
                    />
                  </div>
                </div>
              </div>
              <div class="col-md-12">
                <router-link
                  v-if="isAdmin"
                  :to="'/edit-test/' + currentTest.id"
                >
                  <button class="btn btn-warning mr-2 mb-2">
                    <i class="fas fa-marker"></i>&nbsp;Hiệu chỉnh
                  </button>
                </router-link>
                <router-link
                  v-if="isAdmin"
                  :to="'/edit-question/' + currentTest.id"
                >
                  <button class="btn btn-danger mr-2 mb-2">
                    <i class="fas fa-list-ol"></i>&nbsp;Quản lý câu hỏi
                  </button>
                </router-link>
                <router-link
                  :to="
                    currentTest.userPassword == currentTest.password || isAdmin
                      ? '/do-test/' + currentTest.id
                      : ''
                  "
                >
                  <button class="btn btn-primary mr-2 mb-2">
                    <i class="far fa-play-circle"></i>&nbsp;Làm bài
                  </button>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TestDetails from "../components/TestDetails";
import TestService from "../services/test.service";

export default {
  name: "TestBook",
  components: {
    TestDetails,
  },
  data() {
    return {
      tests: [],
      currentTest: null,
      currentIndex: -1,
      nameToSearch: "",
      showDeleteAll: false,
      currentUser: null,
      isAdmin: false,
    };
  },
  methods: {
    setActiveTest(test, index) {
      this.currentTest = test;
      this.currentIndex = test ? index : -1;
      this.currentTest.userPassword = "";
    },

    async retrieveTests() {
      const [error, response] = await this.handle(TestService.getAll());
      if (error) {
        console.log(error);
      } else {
        this.tests = response.data;
        console.log(response.data);
      }
    },

    refreshList() {
      this.retrieveTests();
      this.currentTest = null;
      this.currentIndex = -1;
    },

    async removeAllTest() {},

    goToAddTest() {
      this.$router.push("/add-test");
    },

    async searchName() {
      const [error, response] = await this.handle(
        TestService.findByName(this.nameToSearch)
      );
      if (error) {
        console.log(error);
      } else {
        this.tests = response.data;
        this.setActiveTest(null);
        console.log(response.data);
      }
    },
  },
  mounted() {
    this.currentUser = this.$store.getters.loggedInUser;
    this.isAdmin = this.currentUser !== null && this.currentUser.isAdmin;
    this.retrieveTests();
  },
};
</script>

<style>
</style>
