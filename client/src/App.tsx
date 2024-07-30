import "./App.css";
import BackGroundImage from "./app-background.jpg";
import { ChangeEvent, useState } from "react";
import { TransactionStatus, usePostCSVFile } from "./util";

function App() {
  const [fileToUpload, setFileToUpload] = useState<File | undefined>(undefined);

  const { submit, status, error, reset } = usePostCSVFile();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFileToUpload(e.target.files[0]);
  };

  const handleSubmit = () => {
    if (fileToUpload) submit(fileToUpload);
  };

  const meterValues: Record<TransactionStatus, number> = {
    IDLE: 0,
    SENDING: 2.5,
    RECEIVING: 10,
  };

  return (
    <div
      className="csv-form-page"
      style={{ backgroundImage: `url(${BackGroundImage})` }}
    >
      <div
        className="schedulity-logo"
      >SCHEDULITY</div>

      <div className="csv-form-container">
        <div className="csv-form-title">
          <h1>Split your CSV file</h1>
          <p>Simple ● Fast ● 24h/24</p>
        </div>

        <div className="card csv-form-card">
          <div className="csv-form">
            <div className="csv-form-text">
              <p>Send your customer file to sort by gender</p>
              <p>
                <small>
                  This operation may take longer depending on the size of your
                  file
                </small>
              </p>
            </div>
            <form className="csv-form-input">
              <label htmlFor="file">Choose your CSV file</label>
              <input
                name="file"
                type="file"
                onChange={handleChange}
                accept="text/csv"
              />
            </form>
          </div>

          <button
            className="btn-dark"
            disabled={status !== TransactionStatus.IDLE || error}
            onClick={handleSubmit}
          >
            Upload file
          </button>
        </div>
      </div>

      <dialog open={status !== TransactionStatus.IDLE}>
        <h2>Split your customer by gender...</h2>
        <hr />
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

      <dialog open={error}>
        <h2>An error has occured</h2>
        <hr className="hr-error" />
        <p>
          <small>
            The creation of your files did not go as planned. <br />
            Please try again later...
          </small>
        </p>
        <button className="btn-light" onClick={reset}>
          Close
        </button>
      </dialog>
    </div>
  );
}

export default App;
