import mongoose, { Schema, type Document } from "mongoose";

export interface IContact extends Document {
  email: string;
  phone: string;
  location: string;
  availability: string;
}

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
