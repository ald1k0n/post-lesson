import { model, Model, InferSchemaType, Schema, Document } from "mongoose";

const fileSchema = new Schema(
	{
		mimetype: String,
		size: Number,
		buffer: Buffer,
		userId: {
			type: Schema.Types.ObjectId,
			ref: "user",
		},
	},
	{
		timestamps: true,
	}
);

export type IFile = InferSchemaType<typeof fileSchema> & Document;
export const File: Model<IFile> = model<IFile>("file", fileSchema);
