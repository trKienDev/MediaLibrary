import { IncomingMessage } from "http";
import { CreateTagDTO, TagDTO } from "./tag.dto.js";
import { parseJSON } from "../../middlewares/json-parser.js";
import { slugify } from "../../utils/string.utils.js";
import { iTagRepository } from "./tag.repository.js";
import { MediaType } from "../../interfaces/media-type.interface.js";
import { iSlugRepository } from "../slug/slug.repository.js";
import { ApiRequest } from "../../interfaces/api-request.interface.js";

export class TagService {
      constructor(
            private readonly _tagRepository: iTagRepository,
            private readonly _slugRepository: iSlugRepository,
      ) {}

      async getAllTags(): Promise<TagDTO[]> {
            return this._tagRepository.getAll();
      }

      async getTagsByScope(scopes: string[]): Promise<TagDTO[]> {
            const validScopes = ['video', 'film', 'manga', 'anime', 'creator', 'image', 'short', 'clip', 'idol'];
            for(const scope of scopes) {
                  if(!validScopes.includes(scope)) {
                        throw new Error(`Invalid scope value: ${scope}`);
                  }
            }

            return await this._tagRepository.getByScopes(scopes);
      }

      async createTag(req: IncomingMessage): Promise<TagDTO> {
            const body = await parseJSON(req, ['tag_name', 'tag_scopes']);
            const { tag_name, tag_scopes } = body;

            if(typeof tag_name !== 'string' || !tag_name.trim()) {
                  throw new Error('Invalid tag name');
            }
            const tag_slug = slugify(tag_name);

            let scopes: string[] = [];
            if(Array.isArray(tag_scopes)) {
                  scopes = tag_scopes;
            } else if(typeof tag_scopes === 'string') {
                  scopes = [tag_scopes];
            } else {
                  throw new Error('Invalid tag_scope type');
            }
            
            const validScopes = ['video', 'film', 'manga', 'anime', 'creator', 'image', 'short', 'clip', 'idol'];
            for(const scope of scopes) {
                  if(!validScopes.includes(scope)) {
                        throw new Error(`Invalid scope value: ${scope}`);
                  }
            }

            const dto: CreateTagDTO = { name: tag_name, slug: tag_slug, scopes: tag_scopes as MediaType[]};
            const tag = await this._tagRepository.create(dto);

            await this._slugRepository.create(tag_slug, "tag", tag._id!);
            return tag;
      }
 }