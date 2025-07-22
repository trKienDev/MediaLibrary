import mongoose from "mongoose";
import { ApiRequest } from "../../interfaces/api-request.interface.js";
import { parseJSON } from "../../middlewares/json-parser.js";
import { slugify } from "../../utils/string.utils.js";
import { iSlugRepository } from "../slug/slug.repository.js";
import { CodeDTO, CreateCodeDTO } from "./code.dto.js";
import { iCodeRepository } from "./code.repository.js";

export class CodeService {
      constructor(
            private readonly _codeRepository: iCodeRepository,
            private readonly _slugRepository: iSlugRepository,
      ) {}

      async createCode(req: ApiRequest): Promise<CodeDTO> {
            const body = await parseJSON(req, ['code_name', 'studio_id']);
            const { code_name, studio_id } = body;

            if(typeof code_name !== 'string' || !code_name.trim()) {
                  throw new Error('Invalid code name');
            }
            const code_slug = slugify(code_name);

            if(!mongoose.Types.ObjectId.isValid(studio_id)) {
                  throw new Error('Invalid studio_id');
            }

            const dto: CreateCodeDTO = { name: code_name, slug: code_slug, studio_id: studio_id};
            const code = await this._codeRepository.create(dto);

            await this._slugRepository.create(code_slug, "code", code._id);
            return code;
      }
}