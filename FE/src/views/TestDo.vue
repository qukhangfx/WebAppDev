<template>
  <div v-if="test" class="row">
    <div class="col-md-9 mb-4">
      <div class="row">
        <div class="col-md-12 mb-3 justify-center text-center">
          <h2>{{ test.name }}</h2>
          <p><i class="fas fa-bell"></i>&nbsp;{{ toConvert(timer) }}</p>
          <button @click="submitTest" class="btn btn-danger">
            <i class="fas fa-book-open"></i>&nbsp;Nộp bài
          </button>
          <div
            class="alert alert-info mt-4 mb-2 text-left"
            role="alert"
            v-show="message"
          >
            {{ message }}
          </div>
        </div>
      </div>
      <ul class="list-group">
        <li
          class="list-group-item"
          v-for="(question, index) in questions"
          :key="question.id"
          @click="setActiveQuestion(question, index)"
        >
          <div>
            <div class="row">
              <div class="col-md-12 mb-2">
                <p>Câu {{ index + 1 }}.</p>
                <ckeditor
                  :disabled="true"
                  :editor="editor"
                  :config="editorDisabled"
                  v-model="question.content"
                ></ckeditor>
              </div>
              <div class="col-md-12">
                <p class="mb-2">
                  {{
                    question.type == 1
                      ? "Chọn một đáp án:"
                      : "Chọn nhiều đáp án:"
                  }}
                </p>
              </div>
              <div
                class="col-md-12 cursor-pointer mb-2"
                :class="[
                  [
                    answers[question.id] &&
                    includeAnswers(answers[question.id], question.type, 'a')
                      ? 'current-answer'
                      : '',
                  ],
                ]"
                @click="setAnswerQuestion(question.id, question.type, 'a')"
              >
                <span class="badge badge-success">A</span> {{ question.a }}
              </div>
              <div
                class="col-md-12 cursor-pointer mb-2"
                :class="[
                  [
                    answers[question.id] &&
                    includeAnswers(answers[question.id], question.type, 'b')
                      ? 'current-answer'
                      : '',
                  ],
                ]"
                @click="setAnswerQuestion(question.id, question.type, 'b')"
              >
                <span class="badge badge-primary">B</span> {{ question.b }}
              </div>
              <div
                class="col-md-12 cursor-pointer mb-2"
                :class="[
                  [
                    answers[question.id] &&
                    includeAnswers(answers[question.id], question.type, 'c')
                      ? 'current-answer'
                      : '',
                  ],
                ]"
                @click="setAnswerQuestion(question.id, question.type, 'c')"
              >
                <span class="badge badge-danger">C</span> {{ question.c }}
              </div>
              <div
                class="col-md-12 cursor-pointer mb-2"
                :class="[
                  [
                    answers[question.id] &&
                    includeAnswers(answers[question.id], question.type, 'd')
                      ? 'current-answer'
                      : '',
                  ],
                ]"
                @click="setAnswerQuestion(question.id, question.type, 'd')"
              >
                <span class="badge badge-info">D</span> {{ question.d }}
              </div>
              <div class="col-md-12 mt-2" v-if="answers[question.id]">
                <p class="mb-0" v-if="question.type == 1">
                  Bạn chọn đáp án:
                  <span class="badge badge-light" style="font-size: 16px">{{
                    answers[question.id].toUpperCase()
                  }}</span>
                </p>
                <p
                  class="mb-0"
                  v-if="
                    question.type == 2 && getChooses(answers[question.id]) != ''
                  "
                >
                  Bạn chọn đáp án:
                  <span
                    v-if="getChooses(answers[question.id]).includes('a')"
                    class="badge badge-light mr-2"
                    style="font-size: 16px"
                    >A</span
                  >
                  <span
                    v-if="getChooses(answers[question.id]).includes('b')"
                    class="badge badge-light mr-2"
                    style="font-size: 16px"
                    >B</span
                  >
                  <span
                    v-if="getChooses(answers[question.id]).includes('c')"
                    class="badge badge-light mr-2"
                    style="font-size: 16px"
                    >C</span
                  >
                  <span
                    v-if="getChooses(answers[question.id]).includes('d')"
                    class="badge badge-light mr-2"
                    style="font-size: 16px"
                    >D</span
                  >
                </p>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <div class="row">
        <div class="col-md-4"></div>
        <div class="col-md-4 mt-4 mb-2">
          <img class="img-fluid" src="../assets/decide.svg" />
        </div>
        <div class="col-md-4"></div>
      </div>
    </div>
    <div class="col-md-3 mb-4">
      <div class="row">
        <div class="col-md-12 mb-4">
          <img class="img-fluid" src="../assets/trophy.svg" />
        </div>
      </div>
      <h4 class="mb-3">Bảng xếp hạng &nbsp;<i class="fas fa-trophy"></i></h4>
      <p v-if="trophies.length == 0">
        Hãy trở thành thí sinh đầu tiên tham gia đề bài này.
      </p>
      <ul class="list-unstyled">
        <li class="media" v-for="(trophy, index) in trophies" :key="index">
          <img
            width="55"
            :src="
              index == 0
                ? imgTrophy
                : '//ssl.gstatic.com/accounts/ui/avatar_2x.png'
            "
            class="mr-3 rounded"
            alt="Got rank 1"
          />
          <div class="media-body">
            <h5 class="mt-0 mb-1">{{ trophy.username }}</h5>
            <p>{{ trophy.score }}</p>
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
import TrophyService from "../services/trophy.service";

export default {
  name: "QuestionDo",

  data() {
    return {
      test: null,
      currentTestId: "",
      questions: [],
      answers: {},
      currentQuestionId: -1,
      currentQuestion: null,
      message: "",
      timer: 0,
      outOfTime: false,
      isSubmit: false,
      score: 0,
      gotSubmit: false,
      currentUser: null,
      trophies: [],

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

      imgTrophy:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAACxQAAAsUBidZ/7wAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAA4HSURBVHic7Z19cBzlfcc/v2fv9GLzYrBDTBoFI9tgyxg7NDY4mFhnK6EQnA5lIGScoQmdNpkEdHJIWsVmjMgkTD0hETZDO00nbd4TEqBMO2Q6E2HZECAFQ0OMBbHAsSEl2PhFwpZl6XT76x8SRjrr9nb3dvcO737+kX3P2+9+z/eeZ5/XFd6F6K6F3UBzEHnZ/7cjiGwgPaXPWn7srGAyiw5TaQMSKksigJiTCCDmJAKIOYkAYk4igJiTqlTBI1v5lCgf8JU4N/wB0jUBW1QmqrW6mX/wmfpVaeWngdrjkooJAOXv8DmWVzuHUGUCsKlH+UdfaYWtUBkBJF1AzEkEEHMSAcScRAAxJxFAzEkEEHMqNwx0QGFrKkOmaPiuqYEtBweGJX2SpehysG6mG60ym0lagNiTCCDmVKsApNIGBI5W53eqmAAMDBYLEzg7SlsiQZhRNEwZiNCSCVRMAApvOQS/LzJDokI51yHMyRehUsku4A8OYdN1G+dHZknIaCezcGrVhN2RGVNA5VoAoccp3M6zOipbQsfwl47hwosRWXISFROApTzuGEH4rHZU7UOqa8a+w2cdI+V4LBprTqZiDpYMe4CXHKIszq/ghojMCY+zuBFY5BCjR27jtajMKaTSv7AfOwUK3K1dvDcqY4JG72Mm8E3nSM4+CJuKCsDk+DdgyCHKn+UtHtBfUjvhU8EO1TAfiKDj/6+bqSXHAziPaI6j/Hu4ljlTUQHIx3gd+J5jHFier6dLu8eNo5WjIZvmAzn+9r/0bmagdCFcXiLRd2UtfwrZMEcq3QVg8twB9DvFEVhuw9MjW8aepkX7orDNE2IGAHQT15LmGWB5iRSHEe4M3zBnKi4AaWEfyt+7iHq+CA+PdPMYg0dPD90wrwwzpJt4HHgImOUixW3SypvhGlWaqpmfzm/lftTdU7/UnY5MnxVIuUGdDpZD9cgfi85uF/ITybImkILLpOItwNuYGj6j8ISbuDo0AKqlI0aGIPuH3Ub+H+r42zCt8ULVCEA+zKCVYrXCb0pGVhsdrtj6yUmIqYPhvIuIPEWaq+RzHAvfKneEKoB8t7eTMnIFh61hWkR4qGTkgUO+7Qqcfhc9qfALhviofIHDXrIu47SRK0J7BtCtLLOVJw1cIRl+7SmtIvY2bkG5Czht8liCmXkhWOmy7Cz7GcCkMDvykC/aJR0BvipZ7vOatXayDMOTwBWS9eZDt4TWAqhyB4DCeq9pRVCrmXuNoQnhB8DIJCWgb+0r285ykYHaYpU/AnwfoclP5QNgjfoQHz50SygtgG7hUlve6cuNzeWyiid95/cos23hbzCsoeBAqXnPHKip921rWS2AVYN5Pgf2BAG8CvwY4bvSyit+s9Z7uBSZ8Dx0uWT9+7AYoewKVsOG8ROjalgHXOM3P1nFK8A6YJ1uY76d5woMF4rSoG/tO09mnLcEJOIhrWD2p3rQ4Z3Aaygvofxa1ga0tCtsKPikLB8WLyZg9FEusQ3bC/M2wlJp5pmgywPQ3y+8cxKHucJvCyD1Zz5mLutf4StxCbSTS5jEhyhLpS1YHwb+DKCGDiYRlsLtQZd1giM1X4cS+wuCJF33lqSmXhVa/kV8iAneh4G2ANrNYhueK5avgSWSYXuQZZ4o+8V507HSTwONXtJ5bgFS6RGTnr5ILnvDcUeTX7STxZjiPsSwRG4NzoeBtgAKG3AQlQpfDbK88cj8lw6i9l9BmDtsDabujJvDqvyxIhx9SD5YHwYmAN3CAlXnvW+qXKtbHHfHlIVcuPN50JuAcOaJp5x5ryw5+MNQ8gb02yyAkvsHr9XNwfkwOAEIHUjJ/EQlvDEtgFzwwkOgdwWeb/0ZT1iXHm4NOt8JWHRQuk6EAOcFAnkG0C6abMMOFwIAUGNYJCsI6JLeSQpQhN6F9wPXl4rr5hlA0lPfkNxAg2Qmm5AKBt1ME8oO3P0oFcMiubV8HwbSAtgWG1xWPoDYNuuCKLdoAYKSs29GAhCZVTMkpu5DYVb+GBtwXx9CQD4suwUYm5h5wYMAQLGNsEgyvFBu+Y7F9F40G5XtwLRicRxbAGOpqT+7WZa+Geq2be1kPoYX8PaDtIFFki3Ph54EoD+nhrOZlTfMFWEuMAchg9Lko+QelG6UXWrotZReYE/QvzTddfF1oA8UC3cUwGnTN1pLDrYHak8HKc5gFmnmosxFuQDIgA8fQg/QjfAy0IuhlwPskQ5cb044ecJmO2n6aBixaDRKI0KjQKMKC8aMDfNSiRGEV0XZrcJuRv/2WCPs5BB75QZcLLqfjO66+J9BPz9ZWDEBSN3pO8yyIxf7KQ9A/4mzyLEAaEJpxNCI0shoRftfvHDHn4CdwG6E3dhjf/P0yJcmHsoV7eIC26JVYI4Kc8cWW6rx5pAhhFdE6VV40QzzdbnS3ZhfX1tWz+DR54B5hWGTCsCqGTKnT5kpH+xztflUv8lUargdmA/MBWZDwVb26mAEeBWhF+VlLDYbaWEXwkGFK8cUWo2VD1CL0qRwtSrb3VY+gDQ8NYjKLa5Lqj+t3W3lA8hXGEB4EvgLRn/h1Vj5MFq3jShXAgN8kd4TXcDY7h1/V51GhTCscGOqmf/wk1x3LfwV0DL+s8IWQNJTDpjlx97jK//NfBzlAaDOT/rIUDZKG+0w7qnTyrARuIWwZtHKZ0htrvdb+QAonSWj1NRv8pu9tPIIcC0Ol19UGEX58tuVDwXDDivDfSp8Dq2yo1fCMVtYnVrJf5aVz4jdxegWrckxRo2p/XY5RUiW/0a4Cqru9JICWWnjW+M/PGncmWrmX1VYA+SisqwEA7bNJ9LN/KrcjGTBzmGQ4rt0rPSgfOj1snfsSivbEK7GSWzRkke4WbLcWxgw6cRDKsPPVLgOOD5ZeIQM2HBNeiWPBpel07Eyy/X4uRTSyuMYrsL5KpwoGEb5pLROfgaz6MxTqpn/skdVXKmmrN9ASzrD1gqVXzZyK08AK4FK7WEfQrle2niwWATHqcd0M91GuBqJXMV9xuZjknFxSKTKkSzPIrQAByIuegDhGmlzfm4qOfcszTxubFYCBwMzzZk3jdIsq3g6ovJCR1r5X4QVwBsRFdmHzUella5SEV0tPshKnjXKCgj9LPs+Y1glK3k+5HIiR1rpwZABXg+1IGU/NhlZy1Ou7PKUdzfzbOFZlCn+rHNk0MAlknG8N6gk2s3iPNxTLFzS9Ysw5sTqoOkZN6EoKLbDXQX1fF4+zf1l2Xcv87B5jnDWAwax+XMvW9O9TvvuQUOb5qyhlr3lZjIC0wwU366dK5ijmTihLDgtHdc7XPbolhx7sUJ741UNyh4vCbxtCLFpAixPadxjMcj8kPKuHqyQfSjefOhJAHnhIm/2eCPs/KuEcL+jRx96EoAYFnizxhth518VaMjfUbzl700AIas37PyrhLC/Y3gtgIZsfNj5VwWmugTgehSgv+QMW2nwbo8HlAbtZppk8H0NXAr68rDNdYIp7g9ZmDLnQfRfOJPjvL+cPFzQoJ1Mk7XufOh+GFjLRXjdRazYnnYLj253bgL/5+Alw2+pthdKvc1xFuB9J7aNt5ZaSLEAlxduuc7YNiz0YMIh4E5j8z6gDWG/26R565R+EPTSPB8C7kTHfKjufYi6L8fLXn43FTMAbDTKbCtDh7Swz8qwySizgXY3i0oS9lNyJXHrQ2UjNrMlS4e0sU+ybCLNbIR23Cwve/ChawGI0/hSGEb4joE5Vob2wj5cMhy1MqPCADbisM/gFB8JOH23YeA7pJgjbbQX9uHyRY5KKxvJMRt19mGJcibguj/Kd7MfmLhZUrFFeFDytEuL+9ee6DYabOV2lJs5+Tlkn5Vhptu83k3oPexDOKfgYxvhQfK0y1oPPvwWDaS4HSb14QHJ4mpjqysBaBfvta0JS5kq8IjkWS8t/M6dyZPk2808W1kHrBn/sGgszpGPVP4e3SDRu5lBesJ3UuARlPXSVoYP7+FCRk9cr2F8i67MlDZKXqPmqgsYGTd2FegysNRkWF1O5QNIhpesldxkLBYL/OJEefYp2A3UMv6UUReGpZJldTmVDyBt/F6y3AQsQt7xodspYVctQL6brMKNarM+vYot/kwtjT7Kh/OGu8TwG7W5LKxyxmO9HN6FFRPI8zBDzMOwXm4N0YedLMPiLpSHJUvJLe7uuoDHOFc+Et2LDUa2cJ0IRQ90Bokp6/fnHvtM7rA+w9eiKQ20k3PdvIzC3Y6gCCsfQCWy7WfRkYp2X6XbN5FUzW3hCZUhEUDMSQQQcxIBxJxEADEnEUDMSQQQcxIBxJxEADEnEUDMSQQQcxIBxJxU/21fK/vunaAZfmbnaXVL/B3C3dt3Dj96fpXr+Dv2vnNO89y6ATbNi2QRsmpIiWpL6WjRojn/p88HcnW8eMD98YX+ofGbdKb6LvfdStIFxJxEADEnEUDMSQQQcxIBxJxqvRreN1PTx5k/47Wi4Xv7z+FYLvrb3PcOLjn/yx0PV92I65QTwHnT9rN+xU+Lhn9j26c8DROD4ndHrmlVW8J97ZwPki4g5iQCiDmJAGJOIoCYkwgg5iQCiDmn3DCw1HLw3v7C+xne4UjO4obf/nXR8NZZT7B82stl2VdtnHIC8LocPB7bVvqHijeKh0fCuCS9siRdQMxJBBBzEgHEnEQAMScRQMw55UYBpZaDC9kx4P7tLWelyn6paNVxygmg1HJwIVFdElWtJF1AzEkEEHMSAcScRAAxJxFAzEkEEHMSAcScRAAxJxFAzEkEEHMSAcScRAAxJxFAzKlSAdgjlbYgeKrzO/0/NgLuoMEsWTMAAAAASUVORK5CYII=",
    };
  },

  methods: {
    async retrieveTest(currentId) {
      const [error, response] = await this.handle(TestService.get(currentId));
      if (error) {
        console.log(error);
      } else {
        this.test = response.data;
        this.timer = this.test.time * 60;
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
      }
    },

    refreshList() {
      this.retrieveQuestions(this.currentTestId);
      this.currentQuestion = null;
      this.currentQuestionId = -1;
    },

    setActiveQuestion(question, index) {
      this.currentQuestionId = index;
      this.currentQuestion = question;
    },

    setAnswerQuestion(questionId, questionType, answer) {
      if (this.outOfTime || this.isSubmit) {
        return;
      }
      if (questionType === 1) {
        this.answers[questionId] = answer;
      } else {
        if (!this.answers[questionId]) {
          this.answers[questionId] = {
            a: false,
            b: false,
            c: false,
            d: false,
          };
        }
        this.answers[questionId][answer] = !this.answers[questionId][answer];
      }
    },

    getChooses(obj) {
      let result = "";
      if (obj && obj["a"]) result += "a";
      if (obj && obj["b"]) result += "b";
      if (obj && obj["c"]) result += "c";
      if (obj && obj["d"]) result += "d";
      return `${result}`;
    },

    includeAnswers(obj, currentType, currentAnswer) {
      if (currentType === 1) {
        return obj && currentAnswer.toLowerCase() === obj.toLowerCase();
      } else {
        return (
          obj &&
          this.getChooses(obj)
            .toLowerCase()
            .includes(currentAnswer.toLowerCase())
        );
      }
    },

    toConvert(sec) {
      let h = parseInt(sec / 3600);
      sec %= 3600;
      let m = parseInt(sec / 60);
      sec %= 60;
      return `${h} giờ ${m} phút ${sec} giây`;
    },

    submitTest() {
      if (
        !this.outOfTime &&
        Object.keys(this.answers).length !== this.questions.length
      ) {
        this.message = "Bạn chưa hoàn thành tất cả câu hỏi.";
        return;
      }
      this.isSubmit = true;
      if (!this.gotSubmit) {
        this.calculateScore();
        this.gotSubmit = true;
      }
    },

    calculateScore() {
      this.questions.forEach((question) => {
        if (question.type === 1) {
          if (
            this.answers[question.id] != null &&
            this.answers[question.id].toLowerCase() ==
              question.answer.toLowerCase()
          ) {
            this.score += 1;
          }
        } else {
          let currentResult = this.getChooses(this.answers[question.id]);
          if (currentResult === question.answer) {
            this.score += 1;
          }
        }
      });
      this.message = `Điểm của bạn là ${this.score}.`;
      this.insertTrophy();
      this.score = 0;
    },

    async retrieveTrophies(currentId) {
      const [error, response] = await this.handle(
        TrophyService.getAll(currentId)
      );
      if (error) {
        console.log(error);
      } else {
        this.trophies = response.data;
      }
    },

    refreshTrophy() {
      this.retrieveTrophies(this.currentTestId);
    },

    async insertTrophy() {
      const [error, response] = await this.handle(
        TrophyService.create({
          username: this.currentUser.username,
          score: this.score,
          testId: this.currentTestId,
        })
      );
      if (error) {
        console.log(error);
      } else {
        console.log("Successfully!", response.data);
        this.refreshTrophy();
      }
    },
  },

  mounted() {
    this.currentTestId = this.$route.params.testId;
    this.refreshList();
    this.retrieveTest(this.currentTestId);
    this.currentUser = this.$store.getters.loggedInUser;
    this.refreshTrophy();
    const timerInterval = setInterval(() => {
      if (this.timer == 0 || this.isSubmit || this.questions.length == 0) {
        clearInterval(timerInterval);
        this.outOfTime = true;
        if (this.questions.length) {
          this.submitTest();
        }
      } else {
        this.timer--;
      }
    }, 1000);
  },
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.current-answer {
  font-weight: bold;
}

.ck-editor .ck-editor__main .ck-content {
    border: none;
}
</style>
