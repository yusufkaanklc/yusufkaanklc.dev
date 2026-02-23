import mongoose, { Schema, type Document } from "mongoose";
import type { Contact as ContactBase } from "@/types/models";

export interface IContact extends ContactBase, Document {}

const ContactSchema = new Schema<IContact>(
  {
    email: { type: String, required: true },
    phone: { type: String, required: true },
    location: { type: String, required: true },
    availability: { type: String, required: true },
  },
  { timestamps: true }
);

export const Contact = mongoose.models.Contact || mongoose.model<IContact>("Contact", ContactSchema);
