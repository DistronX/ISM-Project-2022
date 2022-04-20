import multer from "multer";
import path from "path";
import { dirname} from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname,'../../Test/'));
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + ((Math.random() % 100000) + 1).toString()+'.png');
  },
})

export const upload = multer({ storage:storage });
