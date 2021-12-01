<template>
  <div v-if="test" class="row">
    <div class="col-md-12 text-center mt-2 mb-2">
      <h3>Hiệu chỉnh bài kiểm tra</h3>
    </div>
    <div class="col-md-6">
      <TestForm
        :test="test"
        @test-submit="updateTest"
        @test-delete="deleteTest"
      />
      <p>{{ message }}</p>
    </div>
    <div class="col-md-6 mt-3">
      <img class="img-fluid mb-3" src="../assets/working.svg" />
    </div>
  </div>
  <div v-else>
    <br />
    <p>Bài kiểm tra không tìm thấy.</p>
  </div>
</template>
<script>
import TestService from "../services/test.service";
import TestForm from "../components/TestForm";
export default {
  name: "TestEdit",
  components: {
    TestForm,
  },
  data() {
    return {
      test: null,
      message: "",
    };
  },
  methods: {
    async getTest(id) {
      const [error, response] = await this.handle(TestService.get(id));
      if (error) {
        console.log(error);
      } else {
        this.test = response.data;
        console.log(response.data);
      }
    },
    async updateTest(data) {
      const [error, response] = await this.handle(
        TestService.update(this.test.id, data)
      );
      if (error) {
        console.log(error);
      } else {
        console.log(response.data);
        this.message = "Bài kiểm tra được cập nhật thành công.";
      }
    },
    async deleteTest() {
      const [error, response] = await this.handle(
        TestService.delete(this.test.id)
      );
      if (error) {
        console.log(error);
      } else {
        console.log(response.data);
        this.$router.push({ name: "TestBook" });
      }
    },
  },
  mounted() {
    if (!this.$store.getters.loggedInUser || !this.$store.getters.loggedInUser.isAdmin) {
      this.$router.push("/");
    }
    this.message = "";
    this.getTest(this.$route.params.id);
  },
};
</script>
<style></style>
