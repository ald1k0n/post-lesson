import { File } from "../entities/file.entity";
import { IUser, User } from "../entities/user.entity";
import { AuthService } from "./auth.service";

export class UserService extends AuthService {
	public async register(
		username: string,
		email: string,
		password: string
	): Promise<IUser | null> {
		try {
			const hashedPassword = await this.hashPassword(password);
			const newUser = await User.create({
				username,
				email,
				password: hashedPassword,
			});
			return newUser;
		} catch (error) {
			console.error("Error registering user:", error);
			return null;
		}
	}

	public async login(
		email: string,
		password: string
	): Promise<{ user: Omit<IUser, "password">; token: string } | null> {
		try {
			const user = await User.findOne({ email }).lean();
			if (!user) {
				throw new Error("User not found.");
			}

			const { password: userPass, ...rest } = user;

			const isPasswordValid = await this.verifyPassword(password, userPass);
			if (!isPasswordValid) {
				throw new Error("Invalid password.");
			}

			const token = this.generateToken(
				{ id: user._id, email: user.email },
				process.env.JWT_SECRET as string,
				"12h"
			);

			return { user: rest as Omit<IUser, "password">, token };
		} catch (error) {
			console.error("Error logging in:", error);
			return null;
		}
	}

	public async getUserById(userId: string): Promise<IUser | null> {
		try {
			return await User.findById(userId);
		} catch (error) {
			console.error("Error fetching user:", error);
			return null;
		}
	}

	public async uploadFile(
		userId: string,
		fileId: string
	): Promise<IUser | null> {
		try {
			const user = await User.findById(userId);
			if (!user) {
				throw new Error("User not found.");
			}

			user.profilePhoto = `/files/${fileId}`;
			await user.save();

			return user;
		} catch (error) {
			console.error("Error uploading file:", error);
			return null;
		}
	}
}
