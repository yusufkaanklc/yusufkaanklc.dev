import mongoose, { Schema, type Document } from "mongoose";

export interface IBlogLike extends Document {
  blogPostId: mongoose.Types.ObjectId;
  ip: string;
  likedAt: Date;
}

const BlogLikeSchema = new Schema<IBlogLike>({
  blogPostId: { type: Schema.Types.ObjectId, ref: "BlogPost", required: true },
  ip: { type: String, required: true },
  likedAt: { type: Date, default: Date.now },
});

BlogLikeSchema.index({ blogPostId: 1, ip: 1 }, { unique: true });

export const BlogLike =
  mongoose.models.BlogLike || mongoose.model<IBlogLike>("BlogLike", BlogLikeSchema);
