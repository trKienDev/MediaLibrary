import { IncomingMessage, ServerResponse } from "http";
import { SlugRepository } from "../slug/slug.repository.js";
import StudioRepository from "./studio.repository.js";
import StudioService from "./studio.service.js";
import { sendError, sendResponse } from "../../middlewares/response.js";

const _studioRepository = new StudioRepository();
const _slugRepository = new SlugRepository();
const _studioService = new StudioService(_studioRepository, _slugRepository);

export const getAllStudios = async(req: IncomingMessage, res: ServerResponse) => {
      try {
            const studios = await _studioRepository.getAll();
            return sendResponse(res, 201, studios);
      } catch(err) {
            console.error('Error getting studios: ', err);
            return sendError(res, 500, err);
      }
}

export const createStudio = async(req: IncomingMessage, res: ServerResponse) => {
      try {
            const createdStudio = await _studioService.createStudio(req);
            return sendResponse(res, 201, createdStudio);
      } catch(err) {
            console.error('Error creating studio: ', err);
            return sendError(res, 500, err);
      }
}