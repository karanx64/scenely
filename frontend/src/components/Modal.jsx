import React, { useState } from "react";

export default function Modal({
  onClose,
  title,
  description,
  actions,
  children,
  type = "default", // "default", "confirm", "input"
  onConfirm,
  onInputSubmit,
}) {
  const [inputValue, setInputValue] = useState("");

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose();
  };

  const handleInputSubmit = () => {
    if (onInputSubmit) onInputSubmit(inputValue);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-base-content/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-base-100 text-base-content p-6 rounded-xl shadow-lg max-w-md w-72 relative ring-1 ring-base-300 md:w-96">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-base-content/70 hover:text-error text-xl"
          aria-label="Close"
        >
          ✖
        </button>
        {title && <h2 className="text-lg font-bold mb-2">{title}</h2>}
        {description && <p className="mb-4">{description}</p>}
        {type === "input" && (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="input input-bordered w-full mb-4"
            placeholder="Enter your input..."
          />
        )}
        {children}
        {actions && (
          <div className="flex gap-2 justify-end mt-4">
            {actions.map((action, idx) => (
              <React.Fragment key={idx}>{action}</React.Fragment>
            ))}
          </div>
        )}
        {type === "confirm" && (
          <div className="flex gap-2 justify-end mt-4">
            <button className="btn" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleConfirm}>
              Confirm
            </button>
          </div>
        )}
        {type === "input" && (
          <div className="flex gap-2 justify-end mt-4">
            <button className="btn" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleInputSubmit}>
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
