import http from "../common/http";
import store from "../store";

class TestService {

  constructor() {
    http.interceptors.request.use(config => {
      const user = store.getters.loggedInUser;
      if (user && user.accessToken) {
        config.headers.authorization = `Bearer ${user.accessToken}`;
      }
      return config;
    });
  }

  getAll() { return http.get("/tests"); }
  get(id) { return http.get(`/tests/${id}`); }
  create(data) { return http.post("/tests", data); }
  update(id, data) { return http.put(`/tests/${id}`, data); }
  delete(id) { return http.delete(`/tests/${id}`); }
  findByName(name) { return http.get(`/tests?name=${name}`); }

}

export default new TestService();