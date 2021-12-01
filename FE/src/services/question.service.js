import http from "../common/http";
import store from "../store";

class QuestionService {

  constructor() {
    http.interceptors.request.use(config => {
      const user = store.getters.loggedInUser;
      if (user && user.accessToken) {
        config.headers.authorization = `Bearer ${user.accessToken}`;
      }
      return config;
    });
  }
  
  getAll(id) { return http.get(`/questions/${id}`); }
  create(data) { return http.post("/questions", data); }
  update(id, data) { return http.put(`/questions/${id}`, data); }
  delete(id) { return http.delete(`/questions/${id}`); }

}

export default new QuestionService();