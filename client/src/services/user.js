import axios from "axios";
const baseUrl = "http://localhost:8081/api/users"; //http://localhost:8081

const create = async (credentials) => {
  const response = await axios.post(baseUrl, credentials);
  return response.data;
};

export default { create };
