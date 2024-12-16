import { UserService } from "../services/user.service";
import { Request, Response, Router } from "express";
import { authGuard } from "../config/auth.guard";
export class UserController {
	private userService: UserService;

	constructor() {
		this.userService = new UserService();
	}

	public async register(req: Request, res: Response): Promise<void> {
		const { username, email, password } = req.body;
		try {
			const newUser = await this.userService.register(
				username,
				email,
				password
			);
			if (!newUser) {
				res.status(400).json({ message: "User registration failed." });
				return;
			}
			res
				.status(201)
				.json({ message: "User registered successfully!", user: newUser });
		} catch (error) {
			console.error("Error registering user:", error);
			res.status(500).json({ message: "Internal server error." });
		}
	}

	public async login(req: Request, res: Response): Promise<void> {
		const { email, password } = req.body;
		try {
			const result = await this.userService.login(email, password);
			if (!result) {
				res.status(401).json({ message: "Invalid email or password." });
				return;
			}
			res.status(200).json({
				message: "Login successful!",
				user: result.user,
				token: result.token,
			});
		} catch (error) {
			console.error("Error logging in:", error);
			res.status(500).json({ message: "Internal server error." });
		}
	}

	public async getUserById(req: Request, res: Response): Promise<void> {
		const { id } = req.params;
		try {
			const user = await this.userService.getUserById(id);
			if (!user) {
				res.status(404).json({ message: "User not found." });
				return;
			}
			res.status(200).json(user);
		} catch (error) {
			console.error("Error fetching user:", error);
			res.status(500).json({ message: "Internal server error." });
		}
	}
	public async uploadPhoto(req: Request, res: Response): Promise<void> {
		const { id } = req.params;
		const { fileId } = req.body;
		try {
			const user = await this.userService.getUserById(id);

			if (!user) {
				res.status(404).json({ message: "User not found." });
				return;
			}

			const updated = await this.userService.uploadFile(id, fileId);

			res.status(200).json(updated);
		} catch (error) {
			console.error("Error fetching user:", error);
			res.status(500).json({ message: "Internal server error." });
		}
	}
}

const router = Router();
const userController = new UserController();

router.post("/", userController.register.bind(userController));
router.post("/login", userController.login.bind(userController));
router.put(
	"/photo/:id",
	authGuard,
	userController.uploadPhoto.bind(userController)
);
router.get("/:id", authGuard, userController.getUserById.bind(userController));

export default router;
