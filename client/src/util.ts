import { useState } from "react";

export enum TransactionStatus {
  "IDLE" = "IDLE",
  "SENDING" = "SENDING",
  "RECEIVING" = "RECEIVING",
}

export const usePostCSVFile = () => {
  const [status, setStatus] = useState<TransactionStatus>(
    TransactionStatus.IDLE
  );

  const triggerSavefile = (blob: Blob) => {
    const href = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.setAttribute("download", "data.zip");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const observeDownload = async (response: Response) => {
    const reader = response.clone().body?.getReader();
    if (reader) {
      while (true) {
        const { done } = await reader.read();
        if (done) return response.clone().blob();
      }
    }
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
          triggerSavefile(blob);
        }
      })
      .catch((error) => {
        console.log(error);
        setStatus(TransactionStatus.IDLE);
      });
  };

  return { submit, status };
};
