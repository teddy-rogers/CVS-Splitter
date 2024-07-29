import { parse, stringify } from "csv";
import compressing from "compressing";
import fs from "node:fs";

export const parseCSVFile = async (CSVpath: string) => {
  const parsedCSVRows: Record<string, string>[] = [];
  const parser = fs.createReadStream(CSVpath).pipe(parse({ columns: true }));
  for await (const record of parser) parsedCSVRows.push(record);
  fs.unlink(CSVpath, (err) => {
    if (err) throw err;
  });
  return parsedCSVRows;
};

export const groupCSVRowsByGender = (CSVRows: Record<string, string>[]) => {
  return CSVRows.reduce((groups, currentCSVRow) => {
    const key = currentCSVRow["gender"];
    groups[key] = groups[key] ?? [];
    groups[key].push(currentCSVRow);
    return groups;
  }, {} as Record<string, Record<string, string>[]>);
};

export const writeCSVFilesInOutputDir = (
  outputDir: string,
  CSVRowsGroups: Record<string, Record<string, string>[]>
) => {
  return new Promise((resolve, reject) => {
    const CVSGroupToWriteCount = Object.keys(CSVRowsGroups).length;
    let CVSFilesWrittenCount = 0;
    fs.mkdirSync(outputDir);
    Object.entries(CSVRowsGroups).forEach(([groupName, CSVRows]) => {
      stringify(CSVRows, { header: true })
        .pipe(fs.createWriteStream(`${outputDir}/group_by_${groupName}.csv`))
        .on("error", (error) => reject(error))
        .once("finish", () => {
          ++CVSFilesWrittenCount;
          if (CVSFilesWrittenCount === CVSGroupToWriteCount) {
            resolve(outputDir);
          }
        });
    });
  });
};

export const compressOutputDir = (inputDir: string) => {
  return new Promise((resolve, reject) => {
    compressing.zip
      .compressDir(inputDir, `${inputDir}.zip`)
      .then(() => {
        resolve(inputDir);
      })
      .catch(() => {
        reject("Unable to compress the output folder");
      });
  });
};

export const clearMulterUploadDir = (path: string) => {
  const throwError = (error: NodeJS.ErrnoException | null) => {
    if (error) throw error;
  };
  fs.rm(path, { recursive: true }, throwError);
  fs.rm(`${path}.zip`, throwError);
};
