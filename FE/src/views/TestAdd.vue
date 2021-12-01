<template>
  <div class="row">
    <div class="col-md-12 text-center mb-2 mt-2">
      <h4>Thêm bài kiểm tra</h4>
    </div>
    <div class="col-md-6">
      <TestForm :test="test" @test-submit="addTest" @test-delete="resetTest" />
      <p>{{ message }}</p>
    </div>
    <div class="col-md-6 mt-4" v-if="!currentTest">
      <img class="img-fluid" src="../assets/edit2.svg" />
    </div>
  </div>
</template>
<script>
import TestService from "../services/test.service";
import TestForm from "../components/TestForm";
export default {
  name: "TestAdd",
  components: {
    TestForm,
  },
  data() {
    return {
      test: {
        name: "Bài kiểm tra số ",
        time: "15",
        password: "1234",
        visible: false,
      },
      message: "",
    };
  },
  methods: {
    async addTest(data) {
      const [error, response] = await this.handle(TestService.create(data));
      if (error) {
        console.log(error);
      } else {
        console.log(response.data);
        this.message = "Bài kiểm tra được thêm thành công.";
      }
    },
    resetTest() {},
  },
  mounted() {
    if (!this.$store.getters.loggedInUser || !this.$store.getters.loggedInUser.isAdmin) {
      this.$router.push("/");
    }
    this.message = "";
  },
};
</script>
<style></style>
