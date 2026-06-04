import multer from 'multer';
import path from 'path';
import fs from 'fs';

const folderPath = 'uploads/faktur';
const compressedFolderPath = 'uploads/compressed';

for (const pathToEnsure of [folderPath, compressedFolderPath]) {
  if (!fs.existsSync(pathToEnsure)) {
    fs.mkdirSync(pathToEnsure, { recursive: true });
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, folderPath),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const fileFilter = (req, file, cb) => {
  console.log('udah sampe middleware')
  // console.log('🟢 fileFilter dijalankan, mimetype:', file);
  // console.log('🟢 fileFilter dijalankan, mimetype:', file.mimetype);
  const allowed = ['image/jpeg', 'image/png', 'image/jpg'];
  const allowedExtensions = ['.jpg', '.jpeg', '.png'];
  const extname = path.extname(file.originalname).toLowerCase();

  if (allowed.includes(file.mimetype)) {
    // if()
    cb(null, true);

  } else {
    cb(new Error('File harus berupa jpg, png dan jpeg'), false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
