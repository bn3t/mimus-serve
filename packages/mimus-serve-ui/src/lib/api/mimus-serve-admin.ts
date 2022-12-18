import axios from "./instance";
import { Scenario } from "./model";
import { Configuration } from "./model/configuration";
import { Mapping, MappingsWithMeta } from "./model";

class MimusServeAdmin {
  public getConfiguraton = async () => {
    const response = await axios.get<Configuration>("settings");
    return response.data;
  };

  public getMappings = async () => {
    const response = await axios.get<MappingsWithMeta>("mappings");
    return response.data;
  };

  public getMappingById = async (mappingId: string) => {
    const response = await axios.get<Mapping>(`mappings/${mappingId}`);
    return response.data;
  };

  public getScenarios = async () => {
    const response = await axios.get<Scenario[]>("scenarios");
    return response.data;
  };

  public resetScenarios = async () => {
    await axios.post("scenarios/reset");
  };

  // call reset scenario state
  public resetScenarioState = async (scenarioName: string) => {
    await axios.put(`scenarios/${scenarioName}/state`, {});
  };

  // call set scenario state
  public setScenarioState = async (scenarioName: string, state: string) => {
    await axios.put(`scenarios/${scenarioName}/state`, { state });
  };
}

export default new MimusServeAdmin();
