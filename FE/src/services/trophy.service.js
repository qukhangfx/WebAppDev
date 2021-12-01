import http from "../common/http";
import store from "../store";

class TrophyService {

  constructor() {
    http.interceptors.request.use(config => {
      const user = store.getters.loggedInUser;
      if (user && user.accessToken) {
        config.headers.authorization = `Bearer ${user.accessToken}`;
      }
      return config;
    });
  }
  
  getAll(id) { return http.get(`/trophy/${id}`); }
  create(data) { return http.post("/trophy", data); }

}

export default new TrophyService();