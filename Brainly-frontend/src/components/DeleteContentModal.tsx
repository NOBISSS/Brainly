interface DeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm:()=>void;
  contentTitle:string;
}


export function DeleteContentModal({ open, onClose, onConfirm,contentTitle }:DeleteModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/30 backdrop-blur-sm z-50">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold">
          Are you sure you want to delete <span className="text-red-500">{contentTitle}</span>?
        </h2>
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
