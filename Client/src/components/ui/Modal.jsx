export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 px-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-xl shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold dark:text-white">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="text-red-500 text-xl font-bold"
          >
            ✕
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}