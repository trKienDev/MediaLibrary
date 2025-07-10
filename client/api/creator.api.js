import apiEndpoint from "./endpoint.api.js";
import apiMethod from "./method.api.js";

async function getById(creatorId) {
      const result = await apiMethod.get(`${apiEndpoint.creators.getById}/${creatorId}`);
      if(result.success === false) throw new Error(result.error);
      return result.data;
}
async function getName(creatorId) {
      const creator = await getById(creatorId);
      return creator.name;
}

const apiCreator = {
      getById,
      getName,
}
export default apiCreator;