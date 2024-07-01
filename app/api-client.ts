import axios from "axios";

export default axios.create({
  baseURL: "http://ec2-13-60-163-0.eu-north-1.compute.amazonaws.com:3000",
});