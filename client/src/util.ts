import { useState } from "react";

export enum TransactionStatus {
  "IDLE" = "IDLE",
  "SENDING" = "SENDING",
  "RECEIVING" = "RECEIVING",
}

export const usePostCSVFile = () => {
  const [error, setError] = useState<boolean>(false);
  const [status, setStatus] = useState<TransactionStatus>(
    TransactionStatus.IDLE
  );

  const observeDownload = async (response: Response) => {
    const reader = response.clone().body?.getReader();
    if (reader) {
      while (true) {
        const { done } = await reader.read();
        if (done) return response.clone().blob();
      }
    }
  };

  const triggerSavefile = (blob: Blob, filename: string) => {
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", `${filename.split(".")[0]}.zip`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setError(false);
    setStatus(TransactionStatus.IDLE);
  };

  const submit = async (file: File) => {
    setStatus(TransactionStatus.SENDING);
    const formData = new FormData();
    formData.append("file", file);
    fetch("http://localhost:4000/upload_csv", {
      method: "POST",
      body: formData,
    })
      .then(async (res) => {
        setStatus(TransactionStatus.RECEIVING);
        return await observeDownload(res);
      })
      .then((blob) => {
        if (blob) {
          setStatus(TransactionStatus.IDLE);
          triggerSavefile(blob, file.name);
        }
      })
      .catch((error) => {
        console.log(error);
        setTimeout(() => {
          setStatus(TransactionStatus.IDLE);
          setError(true);
        }, 500);
      });
  };

  return { submit, status, error, reset: handleReset };
};
