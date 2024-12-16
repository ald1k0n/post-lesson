import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IUser } from "../entities/user.entity";

export const authGuard = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	const token = req.headers.authorization?.split(" ")[1];

	if (!token) {
		res.status(401).json({ message: "Authorization token required." });
		return;
	}

	jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
		if (err) {
			res.status(401).json({ message: "Invalid or expired token." });
			return;
		}

		req.user = decoded as IUser;

		next();
	});
};
