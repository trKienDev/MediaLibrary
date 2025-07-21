import { MediaType } from "../../interfaces/media-type.interface.js";

export interface CreateTagDTO {
      _id?: string;
      name: string;
      slug: string;
      scopes: MediaType[];
}

export interface TagDTO {
      _id?: string;
      name: string;
      scopes: MediaType[];
}