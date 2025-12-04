import axios from "axios";
// change ip  ipconfig  copy your ipv4 // 10.246.85.174
export default axios.create({
  baseURL: "http://172.26.0.1:5000/api",
});
