import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000/api",
});
api.defaults.headers.post['Content-Type'] = 'application/json';
api.defaults.headers.put['Content-Type'] = 'application/json';
api.defaults.headers.patch['Content-Type'] = 'application/json';