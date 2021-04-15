import axios from "axios";
const baseUrl = "http://localhost:8081/api/notes"; //http://localhost:3001/ http://localhost:8081/
let token = null;

const setToken = (newToken) => {
  token = `bearer ${newToken}`;
};
const getAll = (baseUrl) => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

// const create = (newObject) => {
//   const request = axios.post(baseUrl, newObject);
//   return request.then((response) => response.data);
// };
const create = async (baseUrl, newObject) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

const update = (id, notObject) => {
  const request = axios.put(`${baseUrl}/${id}`, notObject);
  return request.then((response) => response.data);
};

const deletePerson = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`);
  return request.then((response) => response.data); //note-app-with-react-node
};
export default {
  getAll,
  create,
  update,
  deletePerson,
  setToken,
};
