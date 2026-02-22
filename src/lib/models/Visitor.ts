import mongoose, { Schema, type Document } from "mongoose";

export interface IVisitor extends Document {
  token: string;
  ip?: string;
  country?: string;
  countryCode?: string;
  city?: string;
  regionName?: string;
  isp?: string;
  visitedAt: Date;
}

const VisitorSchema = new Schema<IVisitor>({
  token: { type: String, required: true, unique: true },
  ip: { type: String },
  country: { type: String },
  countryCode: { type: String },
  city: { type: String },
  regionName: { type: String },
  isp: { type: String },
  visitedAt: { type: Date, default: Date.now },
});

export const Visitor =
  mongoose.models.Visitor || mongoose.model<IVisitor>("Visitor", VisitorSchema);
