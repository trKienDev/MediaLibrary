import mongoose from "mongoose";

export interface CreateCodeDTO {
      name: string;
      slug: string;
      studio_id: string;
}
export interface CodeDTO {
      _id: string;
      name: string;
      slug: string;
      studio_id: string;
}