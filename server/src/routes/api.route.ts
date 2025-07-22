import { Route } from "../interfaces/route.js";
import { validateId } from "../middlewares/validate-id.js";
import { createCode, getAllCodes, getCodesByStudio } from "../modules/code/code.controller.js";
import { createCreator, getAllCreators } from "../modules/creator/creator.controller.js";
import { createStudio, getAllStudios } from "../modules/studio/studio.controller.js";
import { createTag, getAllTags, getTagsByScope } from "../modules/tag/tag.controller.js";
import { createRouter } from "./create.route.js";

const apiRoutes: Route[] = [
      // code
      { method: 'GET', path: '/api/codes', handler: getAllCodes },
      { method: 'POST', path: '/api/code', handler: createCode },
      { method: 'GET', path: '/api/codes/studio/:id', handler: validateId(getCodesByStudio) },

      // creator
      { method: 'GET', path: '/api/creators', handler: getAllCreators },
      { method: 'POST', path: '/api/creator', handler: createCreator },

      // tag
      { method: 'GET', path: '/api/tags', handler: getAllTags },
      { method: 'GET', path: '/api/tags/scopes', handler: getTagsByScope },
      { method: 'POST', path: '/api/tag', handler: createTag },

      // studio
      { method: 'GET', path: '/api/studios', handler: getAllStudios },
      { method: 'POST', path: '/api/studio', handler: createStudio },

]

export const processApiRoutes = createRouter(apiRoutes);