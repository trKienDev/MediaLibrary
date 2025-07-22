import { ServerResponse } from "http";
import { ApiRequest } from "../../interfaces/api-request.interface.js";
import { SlugRepository } from "../slug/slug.repository.js";
import { CodeRepository } from "./code.repository.js";
import { CodeService } from "./code.service.js";
import { sendError, sendResponse } from "../../middlewares/response.js";
import mongoose from "mongoose";
import { ValidateIdRequest } from "../../middlewares/validate-id.js";

const _codeRepository = new CodeRepository();
const _slugRepository = new SlugRepository();
const _codeService = new CodeService(_codeRepository, _slugRepository);

export const getAllCodes = async(req: ApiRequest, res: ServerResponse) => {
      try {
            const codes = await _codeRepository.getAll();
            return sendResponse(res, 201, codes);
      } catch(err) {
            console.error('Error getting all codes: ', err);
            sendError(res, 500, err);
      }
}

export const getCodesByStudio = async(req: ValidateIdRequest, res: ServerResponse) => {
      try {
            const studio_id = req.params?.id;
            if(!mongoose.Types.ObjectId.isValid(studio_id)) {
                  throw new Error('Invalid studio id');
            }
            const codes = await _codeRepository.getByStudio(new mongoose.Types.ObjectId(studio_id));
            return sendResponse(res, 201, codes);
      } catch(err) {
            console.error('Error getting codes by studio: ', err);
            sendError(res, 500, err);
      }
}

export const createCode = async(req: ApiRequest, res: ServerResponse) => {
      try {
            const code = await _codeService.createCode(req);
            sendResponse(res, 201, code);
      } catch(err) {
            console.error('Error creating code: ', err);
            sendError(res, 500, err);
      }
}


