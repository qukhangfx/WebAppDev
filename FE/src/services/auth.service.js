import http from "../common/http";
import store from "../store";

class AuthService {

  constructor() {
    http.interceptors.request.use(config => {
      const user = store.getters.loggedInUser;
      if (user && user.accessToken) {
        config.headers.authorization = `Bearer ${user.accessToken}`;
      }
      return config;
    });
  }
  
  getAll() { return http.get(`/auth/`); }
  update(id, data) { return http.put(`/auth/profile/${id}`, data); }
  get(id) { return http.get(`/auth/profile/${id}`); }

}

export default new AuthService();