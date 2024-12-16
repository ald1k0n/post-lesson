import { model, Model, InferSchemaType, Schema, Document } from "mongoose";

const postSchema = new Schema(
	{
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: "user",
			required: true,
		},
		content: {
			required: true,
			type: String,
		},
		media: [
			{
				type: new Schema(
					{
						type: {
							type: String,
							enum: ["image", "video"],
							required: true,
						},
						url: {
							type: String,
							required: true,
						},
					},
					{ _id: false } // Prevents generating an additional ID for each media object
				),
			},
		],
	},
	{
		timestamps: true,
	}
);

export type IPost = InferSchemaType<typeof postSchema> & Document;
export const Post: Model<IPost> = model<IPost>("post", postSchema);
