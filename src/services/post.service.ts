import { IPost, Post } from "../entities/post.entity";

export class PostService {
	public async createPost(
		userId: string,
		content: string,
		media: { type: string; url: string }[]
	): Promise<IPost | null> {
		try {
			const newPost = new Post({
				createdBy: userId,
				content,
				media,
			});

			const savedPost = await newPost.save();
			return savedPost;
		} catch (error) {
			console.error("Error creating post:", error);
			return null;
		}
	}

	public async getPostsByUser(
		userId: string,
		page: number = 1,
		size: number = 20
	): Promise<{ content: IPost[]; totalPages: number; totalElements: number }> {
		try {
			const totalElements = await Post.countDocuments({ createdBy: userId });
			const totalPages = Math.ceil(totalElements / size);

			const posts = await Post.find({ createdBy: userId })
				.skip((page - 1) * size)
				.limit(size)
				.sort({ createdAt: -1 });

			return {
				content: posts,
				totalPages,
				totalElements,
			};
		} catch (error) {
			console.error("Error getting posts by user:", error);
			return { content: [], totalPages: 0, totalElements: 0 };
		}
	}

	public async getAllPostsExcludingUser(
		userId: string,
		page: number = 1,
		size: number = 20
	): Promise<{ content: IPost[]; totalPages: number; totalElements: number }> {
		try {
			const totalElements = await Post.countDocuments({
				createdBy: { $ne: userId },
			});
			const totalPages = Math.ceil(totalElements / size);

			const posts = await Post.find({ createdBy: { $ne: userId } })
				.skip((page - 1) * size)
				.limit(size)
				.sort({ createdAt: -1 });

			return {
				content: posts,
				totalPages,
				totalElements,
			};
		} catch (error) {
			console.error("Error getting all posts excluding user:", error);
			return { content: [], totalPages: 0, totalElements: 0 };
		}
	}

	public async getPostById(postId: string): Promise<IPost | null> {
		try {
			const post = await Post.findById(postId);
			return post || null;
		} catch (error) {
			console.error("Error getting post by ID:", error);
			return null;
		}
	}

	public async updatePost(
		postId: string,
		content: string,
		userId: string
	): Promise<IPost | null> {
		try {
			const post = await Post.findById(postId);
			if (!post || String(post.createdBy) !== userId) {
				return null;
			}

			post.content = content;

			const updatedPost = await post.save();
			return updatedPost;
		} catch (error) {
			console.error("Error updating post:", error);
			return null;
		}
	}

	public async deletePost(postId: string, userId: string): Promise<boolean> {
		try {
			const post = await Post.deleteOne({ _id: postId, createdBy: userId });
			if (!post) {
				return false;
			}

			return true;
		} catch (error) {
			console.error("Error deleting post:", error);
			return false;
		}
	}
}
