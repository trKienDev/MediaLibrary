import { ApiRequest } from "./api-request.interface.js";

export interface ValidateIdRequest<TBody = any> extends ApiRequest<TBody> {
      params: {
            id: string;
            [key: string]: string;
      };
}