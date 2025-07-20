import { IncomingMessage } from "http";
import { ParsedUrlQuery } from "querystring";

export interface ApiRequest extends IncomingMessage {
      file?: {
            filename: string;
            path: string;
            mimetype: string;
      };
      files?: {
            fieldname: string;
            originalname: string;
            encoding: string;
            mimetype: string;
            size: number;
            destination: string;
            filename: string;
            path: string;
      }[];
      body: Record<string, any> | ParsedUrlQuery;
      params?: Record<string, string>; // Thêm thuộc tính params
      fileValidationError?: string; // Thêm thuộc tính để chứa thông báo lỗi file
      query?: Record<string, string> | ParsedUrlQuery; 
}
