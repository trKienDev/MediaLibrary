import { ServerResponse } from "http";
import { ValidateIdRequest } from "../../interfaces/validated-id-request.js";
import { CreatorRepository } from "./creator.repository.js";
import { CreatorService } from "./creator.service.js";
import { sendError, sendResponse } from "../../middlewares/response.js";
import { ApiRequest } from "../../interfaces/api-request.interface.js"; 

const _creatorRepository = new CreatorRepository();
const _creatorService = new CreatorService(_creatorRepository);

const findCreatorById = async(req: ValidateIdRequest, res: ServerResponse) => {
      try {
            const id = req.params.id;
            const creator = await _creatorService.findCreatorById(id);
            return sendResponse(res, 200, creator);
      } catch(error) {
            console.error('Error finding creator by id');
            return sendError(res, 500, error);
      }
};

export const getAllCreators = async(req: ApiRequest, res: ServerResponse) => {
      try { 
            const creators = await _creatorRepository.getAll();
            return sendResponse(res, 200, creators);
      } catch(err) {
            console.error('Error get all creators: ', err);
            return sendError(res, 500, err);
      }
};

export const createCreator = async(req: ApiRequest, res: ServerResponse) => {
      try {
            const created = await _creatorService.createCreator(req);
            return sendResponse(res, 201, created);
      } catch(err) {
            console.error('Error creating creator: ', err);
            return sendError(res, 500, err);
      }
};

// const updateCreator = async(req: ValidateIdRequest, res: ServerResponse) => {
//       try {
//             const id = req.params.id;
//             const updated = await _creatorService.updateCreator(req, id);
//             return sendResponse(res, 200, updated);
//       } catch(err) {
//             console.error('Error updating creator: ', err);
//             return sendError(res, 500, err);
//       }
// }