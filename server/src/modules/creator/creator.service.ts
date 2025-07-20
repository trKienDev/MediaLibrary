import { UploadFiles } from "../../enums.js";
import { ApiRequest } from "../../interfaces/api-request.interface.js";
import { uploadFile } from "../../utils/file.utils.js";
import { extractParamFromRequest } from "../../utils/request.utils.js";
import { CreatorDTO } from "./creator.dto.js";
import { iCreatorRepository } from "./creator.repository.js";

export class CreatorService {
      constructor(private _creatorRepository: iCreatorRepository) {}

      async findCreatorById(id: string): Promise<CreatorDTO> {
            const creator = await this._creatorRepository.findById(id);
            if (!creator) throw new Error("Creator not found.");
            return creator;
      }

      async createCreator(req: ApiRequest) {
            const { file_name } = await uploadFile(req, UploadFiles.CREATORS);
            console.log('file name: ', file_name);
            const creator_name = extractParamFromRequest(req, "name");
            const creator_birth = new Date(extractParamFromRequest(req, "birth"));
            const creator_views = Number(extractParamFromRequest(req, "views"));
            const creator_status = extractParamFromRequest(req, "status");
            const isCreatorActive = creator_status === "active";
            const creator_tags = extractParamFromRequest(req, "tag_ids").split(",")
                                                .map(s => s.trim())
                                                .filter(s => s.length > 0);

            const existing = await this._creatorRepository.findByNameAndBirth(creator_name, creator_birth);
            if (existing) return { success: false, code: 409, message: "Creator has already existed" };

            const identifier_name = createCreatorIdentifierName(creator_name);
            const data: CreatorDTO = {
                  name: creator_name,
                  identifier_name,
                  birth: creator_birth,
                  image: file_name, 
                  active: isCreatorActive,
                  views: creator_views,
                  tag_ids: creator_tags,
            };

            return this._creatorRepository.create(data);
      }

      // async updateCreator(req: ApiRequest, id: string): Promise<CreatorDTO> {
      //       const current = await this._creatorRepository.findById(id);
      //       if (!current) throw new Error("Creator not found!");

      //       const { file_name } = await uploadFile(req, UploadFiles.CREATOR_AVATARS);
      //       const creator_name = extractParamFromRequest(req, "name");
      //       const identifier_name = createCreatorIdentifierName(creator_name);
      //       const creator_birth = new Date(extractParamFromRequest(req, "birth"));

      //       const updateData: Partial<CreatorDTO> = { name: creator_name, identifier_name, birth: creator_birth };
      //       if (file_name) {
      //             deleteFile(UploadFiles.CREATOR_AVATARS, current.image);
      //             updateData.image = file_name;
      //       }

      //       const updated = await this._creatorRepository.update(id, updateData);
      //       if (!updated) throw new Error("Error updating creator.");
      //       return updated;
      // }
}

function createCreatorIdentifierName(name: string): string {
      return `@${name.toLowerCase().replace(/\\s/g, "")}`;
}