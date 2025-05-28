// components/Modal.jsx
export default function Modal({ onClose, children }) {
  return (
    <div className="fixed inset-0 bg-base-content/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-base-100 text-base-content p-6 rounded-xl shadow-lg max-w-md w-full relative ring-1 ring-base-300">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-base-content/70 hover:text-error text-xl"
        >
          ✖
        </button>
        {children}
      </div>
    </div>
  );
}
