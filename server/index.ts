import express, { urlencoded } from "express";
import { parse, stringify } from "csv";
import multer from "multer";
import fs from "node:fs";

const PORT = 3000;
const UPLOAD_DEST = "_uploads";

const app = express();
const upload = multer({ dest: UPLOAD_DEST });

app.use(express.json());
app.use(urlencoded({ extended: true }));

const readCSV = async (path: string) => {
  const records: Record<string, string>[] = [];
  const parser = fs.createReadStream(path).pipe(parse({ columns: true }));
  for await (const record of parser) records.push(record);
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
  return records;
};

const groupCSVRowsByGender = (CSVRows: Record<string, string>[]) => {
  return CSVRows.reduce((groups, current) => {
    const key = current["gender"];
    groups[key] = groups[key] ?? [];
    groups[key].push(current);
    return groups;
  }, {} as Record<string, Record<string, string>[]>);
};

const writeCSV = async (path: string, CSVRows: Record<string, string>[]) => {
  const columns = Object.keys(CSVRows[0]);
  const writableStream = fs.createWriteStream(path);
  const stringifier = stringify({ header: true, columns: columns });
  CSVRows.forEach((row) => stringifier.write(row));
  stringifier.pipe(writableStream);
};

app.post("/upload_csv", upload.single("file"), async (req, res) => {
  try {
    if (!req.file?.path) throw "No file recieved";
    const CURRENT_DATE = new Date().toLocaleDateString().replaceAll("/", "-");
    const ORIGINAL_FILENAME = req.file?.originalname.split(".")[0];
    const LOCAL_FOLDER_NAME = `${UPLOAD_DEST}/${ORIGINAL_FILENAME}_${CURRENT_DATE}`;
    const CSVRows = await readCSV(req.file?.path!);
    const CSVRowsGroups = groupCSVRowsByGender(CSVRows);
    if (fs.existsSync(LOCAL_FOLDER_NAME)) throw "Folder already exist";
    fs.mkdirSync(LOCAL_FOLDER_NAME);
    Object.entries(CSVRowsGroups).map(([groupName, CSVRows]) => {
      const localFilePath = `${LOCAL_FOLDER_NAME}/group_by_${groupName}.csv`;
      writeCSV(localFilePath, CSVRows);
    });
    res.sendStatus(200);
  } catch (error) {
    res.status(400).json(error);
  }
});

app
  .listen(PORT, () => {
    console.log("Server is running on port: ", PORT);
  })
  .on("error", (error) => {
    console.log(error);
  });
