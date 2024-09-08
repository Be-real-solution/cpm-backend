import * as multer from 'multer'
import { extname } from 'path'

export const MulterConfigs = {
	storage: multer.diskStorage({
		destination: (req, file, cb) => {
			const fileType = 'files'

			// if (file.mimetype.startsWith('image/')) {
			// 	fileType = 'images'
			// } else if (file.mimetype.startsWith('video/')) {
			// 	fileType = 'videos'
			// }

			cb(null, `${process.cwd()}/uploads/${fileType}`)
		},

		filename: (req, file, cb) => {
			const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
			cb(null, `${uniqueSuffix}${extname(file.originalname)}`)
		},
	}),
	fileFilter: (req: any, file: any, cb: any) => {
		cb(null, true)
	},
}
