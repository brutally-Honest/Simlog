import axios from "axios";
export default axios.create({
  baseURL: "http://localhost:3000",
  // you should use your backend  server port number
});
