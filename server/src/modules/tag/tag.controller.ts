import { IncomingMessage, ServerResponse } from "http";
import { TagRepository } from "./tag.repository.js";
import { TagService } from "./tag.service.js";
import { sendError, sendResponse } from "../../middlewares/response.js";

const _tagRepository = new TagRepository();
const _tagService = new TagService(_tagRepository);

const getAllTags = async(req: IncomingMessage, res: ServerResponse) => {
      try {
            const tags = await _tagService.getAllTags();
            sendResponse(res, 200, tags);
      } catch(err) {
            console.error('Error getting all tags: ', err);
            sendError(res, 500, err);
      }
};

const createTag = async(req: IncomingMessage, res: ServerResponse) => {
      try {
            const tag = await _tagService.createTag(req);
            sendResponse(res, 201, tag);
      } catch(err) {
            console.error('Error creating tag: ', err);
            sendError(res, 500, err);
      }
};

const tagController = {
      getAllTags,
      createTag, 
}
export default tagController;