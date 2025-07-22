import { IncomingMessage, ServerResponse } from "http";
import { TagRepository } from "./tag.repository.js";
import { TagService } from "./tag.service.js";
import { sendError, sendResponse } from "../../middlewares/response.js";
import { SlugRepository } from "../slug/slug.repository.js";
import { ApiRequest } from "../../interfaces/api-request.interface.js";

const _tagRepository = new TagRepository();
const _slugRepository = new SlugRepository();
const _tagService = new TagService(_tagRepository, _slugRepository);

export const getAllTags = async(req: IncomingMessage, res: ServerResponse) => {
      try {
            const tags = await _tagService.getAllTags();
            sendResponse(res, 200, tags);
      } catch(err) {
            console.error('Error getting all tags: ', err);
            sendError(res, 500, err);
      }
};

export const getTagsByScope = async(req: ApiRequest, res: ServerResponse) => {
      try {
            const scopesParam= req.query?.scopes as string[];
            let scopes: string[] = [];

            if (Array.isArray(scopesParam)) {
                  scopes = scopesParam as string[];
            } else if (typeof scopesParam === 'string') {
                  scopes = [scopesParam];
            } else {
                  scopes = [];
            }
            
            const tags = await _tagService.getTagsByScope(scopes);
            sendResponse(res, 200, tags);
      } catch(err) {
            console.error('Error getting tag by scopes: ', err);
            sendError(res, 500, err);
      }
}

export const createTag = async(req: IncomingMessage, res: ServerResponse) => {
      try {
            const tag = await _tagService.createTag(req);
            sendResponse(res, 201, tag);
      } catch(err) {
            console.error('Error creating tag: ', err);
            sendError(res, 500, err);
      }
};
