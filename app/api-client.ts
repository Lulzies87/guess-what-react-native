import axios from "axios";

export default axios.create({
  baseURL: "http://132.67.173.114:3000",
});

// export default axios.create({
//   baseURL: "http://192.168.50.237:3000",
// });