import axios from "axios";
export default axios.create({
  baseURL: "http://localhost:4100",
  // instead of 4100 you should use your backend  server port number
});
