import { createWebHistory, createRouter } from "vue-router";
import store from "../store";

const routes = [
  {
    path: "/",
    alias: "/",
    name: "TestBook",
    component: () => import("../views/TestBook.vue"),
  },
  {
    path: "/edit-test/:id",
    name: "TestEdit",
    component: () => import("../views/TestEdit.vue"),
  },
  {
    path: "/add-test",
    name: "TestAdd",
    component: () => import("../views/TestAdd.vue"),
  },
  {
    path: "/edit-question/:testId",
    name: "QuestionEdit",
    component: () => import("../views/QuestionEdit.vue"),
  },
  {
    path: "/do-test/:testId",
    name: "TestDo",
    component: () => import("../views/TestDo.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/UserLogin.vue"),
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/UserRegister.vue"),
  },
  {
    path: "/profile",
    name: "Profile",
    component: () => import("../views/UserProfile.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const publicPages = ["/login", "/register"];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = store.getters.userLoggedIn;

  if (authRequired && !loggedIn) {
    next("/login");
  } else {
    next();
  }
});

export default router;