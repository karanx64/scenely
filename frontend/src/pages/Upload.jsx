// src/pages/upload.jsx
import UploadForm from "../components/UploadForm";
import { RotateCcw } from "lucide-react";

const UploadPage = () => {
  return (
    <div className="p-4">
      <div className="flex flex-col">
        <h1 className="text-center text-4xl">Upload Post</h1>
        <button
          className="btn btn-error text-primary-content  m-auto mt-6 tooltip"
          onClick={() => window.location.reload()}
          data-tip="Reload the page"
        >
          <RotateCcw />
          Start Again
        </button>
      </div>

      <div className="bg-base-100 p-4 rounded-lg shadow-md mt-2">
        <UploadForm />
      </div>
    </div>
  );
};

export default UploadPage;
