import axios from "./instance";
import { Configuration } from "./model/configuration";
import { Mapping, MappingsWithMeta } from "./model/mappings";

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
}

export default new MimusServeAdmin();
