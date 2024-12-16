import { IUser } from "../entities/user.entity";
declare global {
	namespace Express {
		interface Request {
			user?: IUser & { id?: string };
		}
	}
}
