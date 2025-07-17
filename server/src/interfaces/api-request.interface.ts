import { IncomingMessage } from "http";
import { ParsedUrlQuery } from "querystring";

export interface UploadFile {
      fieldname: string;
      originalname: string;
      encoding: string;
      mimetype: string;
      size: number;
      destination: string;
      filename: string;
      path: string;
}

export interface SingleFile {
      filename: string;
      path: string;
      mimetype: string;
}

/**
 * ApiRequest<TBody = any>:
 * - Dùng cho HTTP API server minimalist.
 * - Generic type-safe cho body.
*/
export interface ApiRequest<TBody = any> extends IncomingMessage {
      file?: SingleFile;
      files?: UploadFile[];
      body: TBody;
      params?: Record<string, string>;
      query?: Record<string, string> | ParsedUrlQuery;
      fileValidationError?: string;
}