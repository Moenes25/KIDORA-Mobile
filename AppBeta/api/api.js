import axios from "axios";
// change ip  ipconfig  copy your ipv4 // 10.246.85.174
export default axios.create({
  baseURL: "http://192.168.0.120:3000/api",
});
