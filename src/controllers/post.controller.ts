import { Request, Response, Router } from "express";
import { PostService } from "../services/post.service";
import { authGuard } from "../config/auth.guard";

export class PostController {
	private postService: PostService;

	constructor() {
		this.postService = new PostService();
	}

	public async createPost(req: Request, res: Response): Promise<void> {
		try {
			const { content, media } = req.body;
			const userId = req.user?.id;

			const newPost = await this.postService.createPost(userId, content, media);

			if (!newPost) {
				res.status(400).json({ message: "Unable to create post." });
				return;
			}

			res
				.status(201)
				.json({ message: "Post created successfully.", post: newPost });
		} catch (error) {
			console.error("Error creating post:", error);
			res.status(500).json({ message: "Internal server error." });
		}
	}

	public async getPostsByUser(req: Request, res: Response): Promise<void> {
		try {
			const { userId } = req.params;
			const { page = 1, size = 20 } = req.query;

			const posts = await this.postService.getPostsByUser(
				userId,
				parseInt(page as string),
				parseInt(size as string)
			);

			res.status(200).json(posts);
		} catch (error) {
			console.error("Error fetching user posts:", error);
			res.status(500).json({ message: "Internal server error." });
		}
	}

	public async getAllPostsExcludingUser(
		req: Request,
		res: Response
	): Promise<void> {
		try {
			const userId = req.user?.id;
			const { page = 1, size = 20 } = req.query;

			const posts = await this.postService.getAllPostsExcludingUser(
				userId,
				parseInt(page as string),
				parseInt(size as string)
			);

			res.status(200).json(posts);
		} catch (error) {
			console.error("Error fetching posts:", error);
			res.status(500).json({ message: "Internal server error." });
		}
	}

	public async deletePost(req: Request, res: Response): Promise<void> {
		try {
			const { postId } = req.params;

			const isDeleted = await this.postService.deletePost(postId, req.user?.id);

			if (!isDeleted) {
				res.status(404).json({ message: "Post not found." });
				return;
			}

			res.status(200).json({ message: "Post deleted successfully." });
		} catch (error) {
			console.error("Error deleting post:", error);
			res.status(500).json({ message: "Internal server error." });
		}
	}
}

const router = Router();
const postController = new PostController();

router.use(authGuard);

router.post("/", postController.createPost.bind(postController));
router.get("/user/:userId", postController.getPostsByUser.bind(postController));
router.get("/", postController.getAllPostsExcludingUser.bind(postController));
router.delete("/:postId", postController.deletePost.bind(postController));

export default router;
