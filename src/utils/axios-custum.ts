import axios from "axios";

export default axios.create({
//   baseURL: "http://localhost:8000/api/v1/",
  baseURL : 'https://eloquent-bohr.212-227-211-20.plesk.page/public/api/v1/'
});

export const http_client = (token: string) =>
  axios.create({
    // baseURL: "http://localhost:8000/api/v1/",
    baseURL : 'https://eloquent-bohr.212-227-211-20.plesk.page/public/api/v1/',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// export const baseURL = "http://localhost:8000"
export const baseURL = "https://eloquent-bohr.212-227-211-20.plesk.page/public"
