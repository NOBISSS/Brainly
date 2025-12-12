// src/components/AddCollaboratorModal.tsx
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";

interface AddCollaboratorModalProps {
  open: boolean;
  onClose: () => void;
  workspaceName: string;
  onSubmit: (email: string) => void;
}

export function AddCollaboratorModal({
  open,
  onClose,
  workspaceName,
  onSubmit,
}: AddCollaboratorModalProps) {
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    if (!email) return alert("Please enter an email");
    onSubmit(email);
    setEmail("");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 flex justify-center items-center z-50"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="bg-white rounded-2xl shadow-lg w-96 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Add Collaborator
                </h2>
                <button onClick={onClose}>
                  <X size={20} className="text-gray-500 hover:text-gray-700" />
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                Invite a user to <span className="font-medium">{workspaceName}</span>
              </p>

              <input
                type="email"
                placeholder="Enter user email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border w-full rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />

              <div className="flex justify-end mt-4 gap-3">
                <button
                  onClick={onClose}
                  className="text-sm px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="text-sm px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
                >
                  Invite
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
