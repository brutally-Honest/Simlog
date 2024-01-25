import axios from "axios";
export default axios.create({
  baseURL: "http://localhost:4100",
  //set the port to your backend server port 
});
