import mongoose, { Schema } from "mongoose";

export interface iCode extends Document {
      _id: mongoose.Types.ObjectId;
      name: string;
      studio_id: string;
      slug: string;
}

const CodeSchema: Schema = new Schema({
      name: { type: String, required: true, unique: true },
      slug: { type: String, required: true },
      studio_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Studio' },
}, {
      collection: 'Codes',
      timestamps: true
});

export const CodeModel = mongoose.model<iCode>('Code', CodeSchema);