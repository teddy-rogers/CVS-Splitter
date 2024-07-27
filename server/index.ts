import express, { Response } from "express";

const app = express();

app.get("/", (_, response: Response) => {
  response.status(200).send("Yo World!");
});

const PORT = 3000;

app
  .listen(PORT, () => {
    console.log("Server is running on port: ", PORT);
  })
  .on("error", (error) => {
    throw new Error(error.message);
  });
