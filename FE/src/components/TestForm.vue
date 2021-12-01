<template>
  <Form @submit="$emit('test-submit', testLocal)" :validation-schema="schema">
    <div class="form-group">
      <label for="name">Tên bài kiểm tra</label>
      <Field name="name" type="text" class="form-control" v-model="testLocal.name" />
      <ErrorMessage name="name" class="error-feedback" />
    </div>
    <div v-if="testLocal.id" class="form-group">
      <label for="id">Mã bài kiểm tra</label>
      <Field name="id" type="text" class="form-control" v-model="testLocal.id" disabled />
      <ErrorMessage name="id" class="error-feedback" />
    </div>
    <div class="form-group">
      <label for="time">Thời gian làm bài</label>
      <Field name="time" type="text" class="form-control" v-model="testLocal.time" />
      <ErrorMessage name="time" class="error-feedback" />
    </div>
    <div class="form-group">
      <label for="password">Mật khẩu</label>
      <Field
        name="password"
        type="text"
        class="form-control"
        v-model="testLocal.password"
      />
      <ErrorMessage name="password" class="error-feedback" />
    </div>
    <div class="form-group form-check">
      <input
        name="visible"
        type="checkbox"
        class="form-check-input"
        v-model="testLocal.visible"
      />
      <label for="visible" class="form-check-label">
        <strong>Hiển thị công khai</strong>
      </label>
    </div>
    <div class="form-group">
      <button class="btn btn-success"><i class="fas fa-save"></i>&nbsp;Lưu</button>
      <button
        v-if="testLocal.id"
        type="button"
        class="ml-2 btn btn-danger"
        @click="$emit('test-delete', testLocal.id)"
      >
        <i class="fas fa-trash-alt"></i>&nbsp;Xóa
      </button>
    </div>
  </Form>
</template>
<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
export default {
  name: "TestForm",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  emits: ["test-submit", "test-delete"],
  props: ["test"],
  data() {
    const schema = yup.object().shape({
      name: yup
        .string()
        .required("Tên phải có giá trị.")
        .min(2, "Tên phải ít nhất 2 ký tự.")
        .max(50, "Tên có nhiều nhất 50 ký tự."),
    });
    return {
      testLocal: this.test,
      schema,
    };
  },
};
</script>
<style>
@import "../assets/styles/main.css";
</style>
