import { model, Model, InferSchemaType, Schema, Document } from "mongoose";

const userEntity = new Schema(
	{
		email: {
			type: String,
			unique: true,
			required: true,
			validate: {
				validator: (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
				message: "Invalid email format.",
			},
			set: (email: string) => email.toLowerCase(),
		},
		username: {
			type: String,
			unique: true,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		profilePhoto: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

export type IUser = InferSchemaType<typeof userEntity> & Document;
export const User: Model<IUser> = model<IUser>("user", userEntity);
