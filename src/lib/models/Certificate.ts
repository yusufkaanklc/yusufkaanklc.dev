import mongoose, { Schema, type Document } from "mongoose";
import type { Certificate as CertificateBase } from "@/types/models";

export interface ICertificate extends CertificateBase, Document {}

const CertificateSchema = new Schema<ICertificate>(
  {
    name: { type: String, required: true },
    issuer: { type: String, required: true },
  },
  { timestamps: true }
);

export const Certificate =
  mongoose.models.Certificate || mongoose.model<ICertificate>("Certificate", CertificateSchema);
