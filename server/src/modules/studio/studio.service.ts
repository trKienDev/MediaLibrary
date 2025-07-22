import { iSlugRepository } from "../slug/slug.repository.js";
import { iStudioRepository } from "./studio.repository.js";
import { IncomingMessage } from "http";
import { CreateStudioDTO, StudioDTO } from "./studio.dto.js";
import { parseJSON } from "../../middlewares/json-parser.js";
import { slugify } from "../../utils/string.utils.js";

export default class StudioService {
      constructor(
            private readonly _studioRepository: iStudioRepository,
            private readonly _slugRepository: iSlugRepository,
      ) {}

      async createStudio(req: IncomingMessage): Promise<StudioDTO> {
            const body = await parseJSON(req, ['studio_name']);
            const { studio_name } = body;

            if(typeof studio_name !== 'string' || !studio_name.trim()) {
                  throw new Error('Invalid tag name');
            }
            const studio_slug = slugify(studio_name);

            const studioDto: CreateStudioDTO = { name: studio_name, slug: studio_slug };
            const studio = await this._studioRepository.create(studioDto);

            await this._slugRepository.create(studio_slug, "studio", studio._id);
            return studio;
      }
}