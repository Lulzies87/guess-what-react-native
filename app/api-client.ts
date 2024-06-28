import axios from "axios";

export default axios.create({
  baseURL: "http://10.100.102.77:3000",
});

// export default axios.create({
//   baseURL: "http://192.168.50.237:3000",
// });