import { motion } from "framer-motion";
import { MdGroupAdd } from "react-icons/md";
import { MdGroupRemove } from "react-icons/md";

const button_common_css="flex w-full text-left px-3.5 py-3 gap-5  hover:bg-purple-50 text-sm text-gray-700 border-b-purple-700 border-b-2 ";

export function WorkspaceMenuModal({ open, onClose, workspaceName, onAddCollaborator, onRemoveCollaborator, onDelete }: any) {
  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="absolute -right-30 pt-1 top-10 bg-white border shadow-lg rounded-md rounded-b-xl w-48 z-50"
    >
      <button
        onClick={() => {
          onAddCollaborator();
          onClose();
        }}
        className={button_common_css}
      >
        <span className="text-3xl"><MdGroupAdd/></span> Add Collaborator
      </button>

      <button
        onClick={() => {
          onRemoveCollaborator();
          onClose();
        }}
        className={button_common_css}
      >
        <span className="text-3xl"><MdGroupRemove/></span> Remove Collaborator
      </button>

      <button
        onClick={() => {
          onDelete();
          onClose();
        }}
        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 text-sm"
      >
        🗑️ Delete Workspace
      </button>
       <button
        onClick={() => {
          onClose();
        }}
        className="block w-full text-center px-4 py-2 rounded-b-xl text-sm text-white bg-purple-600"
      >
        Close
      </button>
    </motion.div>
  );
}
