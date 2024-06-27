import axios from "axios";

const BASE_URL = "http://localhost:3001";

export const getActivities = (): Promise<any> => {
  return axios.get(`${BASE_URL}/activities`).then(resp => resp.data);
};

export const getActualActivities = (): Promise<any> => {
  return axios.get(`${BASE_URL}/activities/actual`).then(resp => resp.data);
};
