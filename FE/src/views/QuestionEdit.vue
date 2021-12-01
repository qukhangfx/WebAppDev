<template>
  <div v-if="test" class="row">
    <div class="col-md-6 mb-4">
      <div class="row mb-2">
        <div class="col-md-12">
          <div class="row mb-2">
            <div class="col-md-2"></div>
            <div class="col-md-8">
              <img src="../assets/question.svg" class="img-fluid mb-3" alt="" />
            </div>
            <div class="col-md-2"></div>
          </div>
          <h2 class="text-center">{{ test.name }}</h2>
          <div class="form-group row">
            <label for="type" class="col-sm-12 col-form-label"
              >Loại câu hỏi</label
            >
            <div class="col-sm-12">
              <select
                class="form-control"
                name="type"
                v-model="newQuestion.type"
              >
                <option value="1">Trắc nghiệm</option>
                <option value="2">Trắc nghiệm nhiều đáp án</option>
              </select>
            </div>
          </div>
          <div class="form-group row">
            <label for="content" class="col-sm-12 col-form-label"
              >Nội dung câu hỏi</label
            >
            <div class="col-sm-12">
              <ckeditor
                :editor="editor"
                v-model="newQuestion.content"
                :config="editorConfig"
              ></ckeditor>
            </div>
          </div>
          <div class="form-group row">
            <label for="a" class="col-sm-1 col-form-label">
              <h2><span class="badge badge-success">A</span></h2>
            </label>
            <div class="col-sm-11">
              <textarea
                style="box-shadow: none"
                rows="2"
                type="text"
                class="form-control"
                name="a"
                v-model="newQuestion.a"
              />
            </div>
          </div>
          <div class="form-group row">
            <label for="b" class="col-sm-1 col-form-label">
              <h2><span class="badge badge-primary">B</span></h2>
            </label>
            <div class="col-sm-11">
              <textarea
                style="box-shadow: none"
                rows="2"
                type="text"
                class="form-control"
                name="b"
                v-model="newQuestion.b"
              />
            </div>
          </div>
          <div class="form-group row">
            <label for="c" class="col-sm-1 col-form-label">
              <h2><span class="badge badge-danger">C</span></h2>
            </label>
            <div class="col-sm-11">
              <textarea
                style="box-shadow: none"
                rows="2"
                type="text"
                class="form-control"
                name="c"
                v-model="newQuestion.c"
              />
            </div>
          </div>
          <div class="form-group row">
            <label for="d" class="col-sm-1 col-form-label">
              <h2><span class="badge badge-info">D</span></h2>
            </label>
            <div class="col-sm-11">
              <textarea
                style="box-shadow: none"
                rows="2"
                type="text"
                class="form-control"
                name="d"
                v-model="newQuestion.d"
              />
            </div>
          </div>
          <div class="form-group row">
            <label for="answer" class="col-sm-12 col-form-label">Đáp án</label>
            <div class="col-sm-12">
              <input
                type="text"
                class="form-control"
                name="answer"
                :placeholder="[
                  [
                    newQuestion.type == 1
                      ? 'Ví dụ: a'
                      : newQuestion.type == 2
                      ? 'Ví dụ: bd hay b'
                      : '',
                  ],
                ]"
                v-model="newQuestion.answer"
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <button v-on:click="insertQuestion" class="btn btn-danger mr-2 mb-2">
          <i class="fas fa-plus-circle"></i>&nbsp;Thêm câu hỏi
        </button>
        <button
          v-if="currentQuestion"
          v-on:click="updateQuestion"
          class="btn btn-primary mr-2 mb-2"
        >
          <i class="fas fa-edit"></i>&nbsp;Cập nhật câu hỏi
        </button>
        <button
          v-if="currentQuestion"
          v-on:click="deleteQuestion"
          class="btn btn-light mr-2 mb-2"
        >
          <i class="fas fa-trash-alt"></i>&nbsp;Xoá câu hỏi
        </button>
      </div>
      <p class="mt-2 mb-2">{{ message }}</p>
    </div>
    <div class="col-md-6 mb-4">
      <h2 class="text-center">Danh sách câu hỏi</h2>
      <ul class="list-group">
        <li
          class="list-group-item"
          :class="{ active: index == currentQuestionId }"
          v-for="(question, index) in questions"
          :key="question.id"
          @click="setActiveQuestion(question, index)"
        >
          <div>
            <div class="row">
              <div class="col-md-12 mb-2" style="color: black">
                <ckeditor
                  :disabled="true"
                  :editor="editor"
                  :config="editorDisabled"
                  :model-value="question.content"
                ></ckeditor>
              </div>
              <div class="col-md-12">
                <span class="badge badge-success">A</span> {{ question.a }}
              </div>
              <div class="col-md-12">
                <span class="badge badge-primary">B</span> {{ question.b }}
              </div>
              <div class="col-md-12">
                <span class="badge badge-danger">C</span> {{ question.c }}
              </div>
              <div class="col-md-12">
                <span class="badge badge-info">D</span> {{ question.d }}
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
  <div v-else>
    <h3>Không tìm thấy bài kiểm tra</h3>
  </div>
</template>

<script>
import ClassicEditor from "@ckeditor/ckeditor5-editor-classic/src/classiceditor";

import EssentialsPlugin from "@ckeditor/ckeditor5-essentials/src/essentials";
import BoldPlugin from "@ckeditor/ckeditor5-basic-styles/src/bold";
import ItalicPlugin from "@ckeditor/ckeditor5-basic-styles/src/italic";
import Underline from "@ckeditor/ckeditor5-basic-styles/src/underline";
import LinkPlugin from "@ckeditor/ckeditor5-link/src/link";
import ParagraphPlugin from "@ckeditor/ckeditor5-paragraph/src/paragraph";

import Image from "@ckeditor/ckeditor5-image/src/image";
import ImageCaption from "@ckeditor/ckeditor5-image/src/imagecaption";
// import ImageStyle from "@ckeditor/ckeditor5-image/src/imagestyle";
import ImageToolbar from "@ckeditor/ckeditor5-image/src/imagetoolbar";
import ImageUpload from "@ckeditor/ckeditor5-image/src/imageupload";

import MediaEmbed from "@ckeditor/ckeditor5-media-embed/src/mediaembed";

import Base64UploadAdapter from "@ckeditor/ckeditor5-upload/src/adapters/base64uploadadapter";

import QuestionService from "../services/question.service";
import TestService from "../services/test.service";

export default {
  name: "QuestionEdit",

  data() {
    return {
      test: null,
      currentTestId: "",
      questions: [],
      currentQuestionId: -1,
      currentQuestion: null,
      newQuestion: {
        content: "",
        a: "",
        b: "",
        c: "",
        d: "",
        answer: "",
        testId: "",
        type: -1,
      },
      message: "",

      editor: ClassicEditor,
      editorDisabled: {
        plugins: [
          EssentialsPlugin,
          BoldPlugin,
          ItalicPlugin,
          LinkPlugin,
          Underline,
          ParagraphPlugin,
          Image,
          ImageCaption,
          // ImageStyle,
          ImageToolbar,
          ImageUpload,
          MediaEmbed,
          Base64UploadAdapter,
        ],
        toolbar: {},
      },
      editorConfig: {
        plugins: [
          EssentialsPlugin,
          BoldPlugin,
          ItalicPlugin,
          LinkPlugin,
          Underline,
          ParagraphPlugin,
          Image,
          ImageCaption,
          // ImageStyle,
          ImageToolbar,
          ImageUpload,
          MediaEmbed,
          Base64UploadAdapter,
        ],
        toolbar: {
          items: [
            "bold",
            "italic",
            "underline",
            "link",
            "undo",
            "redo",
            "uploadImage",
            "mediaEmbed",
          ],
        },
        image: {
          toolbar: [
            "imageStyle:full",
            "imageStyle:side",
            "|",
            "imageTextAlternative",
          ],
        },
      },
    };
  },

  methods: {
    async retrieveTest(currentId) {
      const [error, response] = await this.handle(TestService.get(currentId));
      if (error) {
        console.log(error);
      } else {
        this.test = response.data;
        console.log(response.data);
      }
    },
    async retrieveQuestions(currentId) {
      const [error, response] = await this.handle(
        QuestionService.getAll(currentId)
      );
      if (error) {
        console.log(error);
      } else {
        this.questions = response.data;
        console.log(response.data);
      }
    },

    refreshList() {
      this.retrieveQuestions(this.currentTestId);
      this.currentQuestion = null;
      this.currentQuestionId = -1;
    },

    refreshForm() {
      this.newQuestion.content = "";
      this.newQuestion.a = "";
      this.newQuestion.b = "";
      this.newQuestion.c = "";
      this.newQuestion.d = "";
      this.newQuestion.answer = "";
      this.newQuestion.testId = this.currentTestId;
    },

    async insertQuestion() {
      const [error, response] = await this.handle(
        QuestionService.create(this.newQuestion)
      );
      if (error) {
        console.log(error);
      } else {
        console.log(response.data);
        this.refreshList();
        this.refreshForm();
        this.message = "Thêm câu hỏi thành công.";
      }
    },

    async deleteQuestion() {
      const [error, response] = await this.handle(
        QuestionService.delete(this.currentQuestion.id)
      );
      if (error) {
        console.log(error);
      } else {
        console.log(response.data);
        this.refreshList();
        this.refreshForm();
        this.message = "Xoá câu hỏi thành công.";
      }
    },

    async updateQuestion() {
      const [error, response] = await this.handle(
        QuestionService.update(this.currentQuestion.id, this.newQuestion)
      );
      if (error) {
        console.log(error);
      } else {
        console.log(response.data);
        this.refreshList();
        this.refreshForm();
        this.message = "Cập nhật câu hỏi thành công.";
      }
    },

    setActiveQuestion(question, index) {
      this.currentQuestionId = index;
      this.currentQuestion = question;
      this.newQuestion = this.currentQuestion;
    },
  },

  mounted() {
    if (
      !this.$store.getters.loggedInUser ||
      !this.$store.getters.loggedInUser.isAdmin
    ) {
      this.$router.push("/");
    }
    this.currentTestId = this.$route.params.testId;
    this.refreshList();
    this.refreshForm();
    this.retrieveTest(this.currentTestId);
  },
};
</script>

<style scoped>
</style>>
