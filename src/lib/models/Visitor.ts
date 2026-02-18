import mongoose, { Schema, type Document } from "mongoose";

export interface IVisitor extends Document {
  ip: string;
  visitedAt: Date;
}

const VisitorSchema = new Schema<IVisitor>({
  ip: { type: String, required: true, unique: true },
  visitedAt: { type: Date, default: Date.now },
});

export const Visitor =
  mongoose.models.Visitor || mongoose.model<IVisitor>("Visitor", VisitorSchema);
