import { useState } from "react";
import { useNavigate } from "react-router-dom";

function UploadInvoice() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [processing, setProcessing] = useState(false);

  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) {
      setFile(null);
      setStatus("");
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setFile(null);
      setStatus("Please select a PDF, JPG, or PNG invoice.");
      return;
    }

    setFile(selectedFile);
    setStatus(`"${selectedFile.name}" is ready for processing.`);
  };

  const handleUpload = () => {
    if (!file) {
      setStatus("Please select an invoice file first.");
      return;
    }

    setProcessing(true);
    setStatus("Uploading invoice...");

    setTimeout(() => {
      setStatus("AI is processing your invoice...");

      setTimeout(() => {
        setStatus("Invoice processed successfully!");

        setTimeout(() => {
          navigate("/invoices/123");
        }, 800);
      }, 1500);
    }, 1000);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Upload Invoice</h1>
          <p>Upload an invoice to start processing.</p>
        </div>
      </div>

      <div className="upload-card">
        <h2>Upload your invoice</h2>

        <p className="upload-description">
          Select a PDF, JPG, or PNG invoice from your computer.
        </p>

        <div className="file-section">
          <label htmlFor="invoice-file">
            Choose Invoice File
          </label>

          <input
            id="invoice-file"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
          />

          {file && (
            <div className="selected-file">
              <strong>Selected file:</strong> {file.name}
            </div>
          )}

          <button
            className="primary-button"
            onClick={handleUpload}
            disabled={processing}
          >
            {processing ? "Processing..." : "Upload & Process"}
          </button>

          {status && (
            <div
              className={
                status.includes("successfully")
                  ? "success-message"
                  : "upload-status"
              }
            >
              {status}
            </div>
          )}
        </div>
      </div>

      <div className="process-card">
        <h2>What happens next?</h2>

        <div className="process-step">
          <div className="step-number">1</div>

          <div>
            <h3>Upload</h3>
            <p>Select your invoice file.</p>
          </div>
        </div>

        <div className="process-step">
          <div className="step-number">2</div>

          <div>
            <h3>AI Processing</h3>
            <p>
              Invoice information is extracted automatically.
            </p>
          </div>
        </div>

        <div className="process-step">
          <div className="step-number">3</div>

          <div>
            <h3>Validation</h3>
            <p>
              Invoice data is checked for errors.
            </p>
          </div>
        </div>

        <div className="process-step">
          <div className="step-number">4</div>

          <div>
            <h3>Approval</h3>
            <p>
              Validated invoices can be reviewed and approved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadInvoice;