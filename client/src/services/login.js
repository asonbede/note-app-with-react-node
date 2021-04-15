import axios from "axios";
const baseUrl = "http://localhost:8081/api/login"; //http://localhost:8081//kkkkkkkkk

const login = async (credentials) => {
  const response = await axios.post(baseUrl, credentials);
  return response.data;
};

export default { login };
