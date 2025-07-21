import { IncomingMessage, ServerResponse } from "http";
import { SlugRepository } from "../slug/slug.repository";
import StudioRepository from "./studio.repository.js";
import StudioService from "./studio.service";
import { sendError, sendResponse } from "../../middlewares/response";

const _studioRepository = new StudioRepository();
const _slugRepository = new SlugRepository();
const _studioService = new StudioService(_studioRepository, _slugRepository);

export const createStudio = async(req: IncomingMessage, res: ServerResponse) => {
      try {
            const createdStudio = await _studioService.createStudio(req);
            return sendResponse(res, 201, createStudio);
      } catch(err) {
            console.error('Error creating studio: ', err);
            return sendError(res, 500, err);
      }
}