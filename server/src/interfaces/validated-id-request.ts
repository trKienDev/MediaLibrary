import { ApiRequest } from "./api-request.interface.js";

export interface ValidateIdRequest extends ApiRequest {
      params: {
            id: string;
            [key: string]: string;
      };
}