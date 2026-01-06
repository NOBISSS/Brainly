// src/components/WorkspaceMenuModal.tsx
import { createPortal } from "react-dom";

interface WorkspaceMenuModalProps {
  open: boolean;
  position: { top: number; left: number };
  onClose: () => void;
  workspaceName: string;
  onAddCollaborator: () => void;
  onRemoveCollaborator: () => void;
  onDelete: () => void;
}

export function WorkspaceMenuModal({
  open,
  position,
  onClose,
  workspaceName,
  onAddCollaborator,
  onRemoveCollaborator,
  onDelete,
}: WorkspaceMenuModalProps) {
  if (!open) return null;

  return createPortal(
    <>
      {/* backdrop */}
      <div
        className="fixed inset-0 z-[9998]"
        onClick={onClose}
      />

      {/* menu */}
      <div
        className="fixed z-[9999] bg-white text-gray-800 rounded-md shadow-xl w-56 border"
        style={{ top: position.top, left: position.left }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 py-2 text-sm font-semibold border-b">
          {workspaceName}
        </div>

        <button
          className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
          onClick={() => {
            onAddCollaborator();
            onClose();
          }}
        >
          Add collaborator
        </button>

        <button
          className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
          onClick={() => {
            onRemoveCollaborator();
            onClose();
          }}
        >
          Manage collaborators
        </button>

        <button
          className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
          onClick={() => {
            onDelete();
            onClose();
          }}
        >
          Delete workspace
        </button>
      </div>
    </>,
    document.body
  );
}
