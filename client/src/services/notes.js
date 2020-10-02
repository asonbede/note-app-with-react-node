import axios from "axios";
const baseUrl = "/api/notes"; //http://localhost:3001/ http://localhost:8081/
const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = (newObject) => {
  const request = axios.post(baseUrl, newObject);
  return request.then((response) => response.data);
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
};
