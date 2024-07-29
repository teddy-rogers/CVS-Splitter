import "./App.css";
import { ChangeEvent, FormEvent, useState } from "react";
import { TransactionStatus, usePostCSVFile } from "./util";

function App() {
  const [fileToUpload, setFileToUpload] = useState<File | undefined>(undefined);

  const { submit, status } = usePostCSVFile();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFileToUpload(e.target.files[0]);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (fileToUpload) submit(fileToUpload);
  };

  const meterValues: Record<TransactionStatus, number> = {
    IDLE: 0,
    SENDING: 2.5,
    RECEIVING: 10,
  };

  return (
    <div>
      <h1>Book your beauty</h1>

      <div>
        <h2>Split your CSV file</h2>
        <p>
          Send your customer file to sort by gender quickly and free of charge
        </p>
        <p>
          <small>
            This operation can take several minutes depending on the size of
            your file
          </small>
        </p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="file">Envoyer votre fichier CSV</label>
          <input
            name="file"
            type="file"
            onChange={handleChange}
            accept="text/csv"
          />
          <button type="submit">ENVOYER</button>
        </form>
      </div>

      <dialog open={status !== TransactionStatus.IDLE}>
        <h2>Split by user gender...</h2>
        <p>The creation of the files is in progress please wait</p>
        <p>
          <small>
            This operation can take several minutes depending on the size of
            your file
          </small>
        </p>
        <meter value={meterValues[status]} min={0} max={10}>
          {status.toLowerCase()}...
        </meter>
      </dialog>
    </div>
  );
}

export default App;
