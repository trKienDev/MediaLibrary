import mongoose, { Document, Schema } from "mongoose";

export interface iCreator extends Document {
      _id: mongoose.Types.ObjectId;
      name: string;
      identifier_name: string;
      birth: Date;
      image: string;
      studio_ids: mongoose.Types.ObjectId[];
      film_ids: mongoose.Types.ObjectId[];
      video_ids: mongoose.Types.ObjectId[];
      tag_ids?: mongoose.Types.ObjectId[];
      active: boolean;
      views: number;
}

const CreatorSchema: Schema = new Schema({
      name: { type: String, required: true },
      identifier_name: { type: String },
      birth: {
            type: Date, 
            required: true, 
            validate: {
                  validator: (value: Date) => value >= new Date("1900-01-01") && value <= new Date(),
                  message: "Birth date must be between January 1, 1900, and today.",
            },
      },
      image: { type: String, match: /\.(jpeg|jpg|gif|png)$/i },
      studio_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Studio" }],
      film_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Film" }],
      video_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
      tag_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
      active: { type: Boolean, required: true },
      views: { type: Number, required: true },
}, {
      collection: "Creators",
      timestamps: true,
});

CreatorSchema.set("toObject", { virtuals: true });
CreatorSchema.set("toJSON", { virtuals: true });

export const CreatorModel = mongoose.model<iCreator>("Creator", CreatorSchema);



