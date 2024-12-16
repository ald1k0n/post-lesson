import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class AuthService {
	protected async hashPassword(password: string): Promise<string> {
		const saltRounds = 10;
		return bcrypt.hash(password, saltRounds);
	}

	protected async verifyPassword(
		password: string,
		hashedPassword: string
	): Promise<boolean> {
		return bcrypt.compare(password, hashedPassword);
	}

	protected generateToken(
		payload: Record<string, unknown>,
		secret: string,
		expiresIn: string
	): string {
		return jwt.sign(payload, secret, { expiresIn });
	}

	protected verifyToken(
		token: string,
		secret: string
	): Record<string, unknown> | null {
		try {
			return jwt.verify(token, secret) as Record<string, unknown>;
		} catch (err) {
			console.error("Invalid token:", err);
			return null;
		}
	}
}
