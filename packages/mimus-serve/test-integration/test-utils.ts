import axios from "axios";

const BASE_URL = "http://localhost:4000/";

export const myaxios = axios.create({
  baseURL: BASE_URL,
  validateStatus: () => true,
});

// reset scenarios
export const resetScenarios = async () => {
  await myaxios.post("/__admin/scenarios/reset", {});
};

// reset datasets
export const resetDatasets = async () => {
  await myaxios.post("/__admin/datasets/reset", {});
};
