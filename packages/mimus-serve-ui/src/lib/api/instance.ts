import axios from "axios";

const instance = axios.create({
  baseURL: "/__admin",
});

export default instance;
