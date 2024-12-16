import { Request, Response, Router } from "express";
import { File } from "../entities/file.entity";
import multer from "multer";
import { authGuard } from "../config/auth.guard";
import { IUser } from "../entities/user.entity";

export class FileController {
	public async getFileById(req: Request, res: Response): Promise<void> {
		try {
			const { fileId } = req.params;

			const file = await File.findById(fileId);

			if (!file) {
				res.status(404).json({ message: "File not found." });
				return;
			}

			res.set("Content-Type", file.mimetype as string);
			res.set("Content-Length", (file.size as number).toString());

			res.send(file.buffer);
		} catch (error) {
			console.error("Error retrieving file:", error);
			res.status(500).json({ message: "Internal server error." });
		}
	}

	public async uploadFile(req: Request, res: Response): Promise<void> {
		try {
			const { id } = req.user as { id: string };
			if (!req.file) {
				res.status(400).json({ message: "No file uploaded." });
				return;
			}

			const { buffer, mimetype, size } = req.file;
			console.log(req.user);
			const file = new File({
				mimetype,
				size,
				buffer,
				userId: id,
			});

			await file.save();

			res.status(201).json({
				message: "File uploaded successfully.",
				file: {
					id: file._id,
					mimetype: file.mimetype,
					size: file.size,
				},
			});
		} catch (error) {
			console.error("Error uploading file:", error);
			res.status(500).json({ message: "Internal server error." });
		}
	}
}

const router = Router();
const fileController = new FileController();

const upload = multer({ storage: multer.memoryStorage() });

router.post(
	"/upload",
	upload.single("file"),
	authGuard,
	fileController.uploadFile.bind(fileController)
);

router.get("/:fileId", fileController.getFileById.bind(fileController));

export default router;
