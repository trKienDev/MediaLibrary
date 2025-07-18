import { IncomingMessage } from "http";
import { iTagRepository } from "./itag.repository.js";
import { TagDTO, TagKind } from "./tag.dto.js";
import { parseJSON } from "../../middlewares/json-parser.js";

export class TagService {
      constructor(private readonly _tagRepository: iTagRepository) {}

      async getAllTags(): Promise<TagDTO[]> {
            return this._tagRepository.getAll();
      }

      async createTag(req: IncomingMessage): Promise<TagDTO> {
            const body = await parseJSON(req, ['name', 'kind']);
            const { name, kind } = body;

            if(!['video', 'film', 'manga', 'anime', 'creator', 'image', 'short', 'clip'].includes(kind)) {
                  throw new Error('Invalid kind value');
            }

            const dto: TagDTO = { name, kind: kind as TagKind};
            return this._tagRepository.create(dto);
      }
 }