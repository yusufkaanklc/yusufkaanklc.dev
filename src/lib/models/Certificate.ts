import mongoose, { Schema, type Document } from "mongoose";

export interface ICertificate extends Document {
  name: string;
  issuer: string;
}

const CertificateSchema = new Schema<ICertificate>(
  {
    name: { type: String, required: true },
    issuer: { type: String, required: true },
  },
  { timestamps: true }
);

export const Certificate =
  mongoose.models.Certificate || mongoose.model<ICertificate>("Certificate", CertificateSchema);
