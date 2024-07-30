import express, { urlencoded } from "express";
import multer from "multer";
import fs from "node:fs";
import cors from "cors";
import {
  parseCSVFile,
  groupCSVRowsByGender,
  writeCSVFilesInOutputDir,
  compressOutputDir,
  clearMulterUploadDir,
} from "./utils";

const PORT = 4000;
const MULTER_UPLOAD_DEST = "_uploads";

const app = express();
const upload = multer({ dest: MULTER_UPLOAD_DEST });

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:3000" }));

app.post("/upload_csv", upload.single("file"), async (req, res) => {
  try {
    if (!req.file?.path) throw "No file recieved";
    const CURRENT_DATE = new Date().toLocaleDateString().replaceAll("/", "-");
    const ORIGINAL_FILENAME = req.file?.originalname.split(".")[0];
    const OUTPUT_DIR = `${MULTER_UPLOAD_DEST}/${ORIGINAL_FILENAME} ${CURRENT_DATE}`;
    if (fs.existsSync(OUTPUT_DIR)) throw "Folder already exist";
    const CSVParsedRows = await parseCSVFile(req.file?.path!);
    if (Object.prototype.hasOwnProperty.call(CSVParsedRows[0], "gender")) {
      const CSVRowsGroupsByGender = groupCSVRowsByGender(CSVParsedRows);
      writeCSVFilesInOutputDir(OUTPUT_DIR, CSVRowsGroupsByGender)
        .then(() => compressOutputDir(OUTPUT_DIR))
        .then(() => res.sendFile(`${OUTPUT_DIR}.zip`, { root: "." }))
        .then(() => clearMulterUploadDir(OUTPUT_DIR))
        .catch((e) => {
          throw e;
        });
    } else {
      throw "No gender column in document";
    }
  } catch (error) {
    res.status(400).json(error);
  }
});

app.listen(PORT, () => {
  console.log("Server is running on port: ", PORT);
});
