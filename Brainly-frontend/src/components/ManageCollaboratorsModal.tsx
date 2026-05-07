//src/components/ManageCollaboratorsModal.tsx
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2 } from "lucide-react";
import { Workspace } from "../redux/slices/workspaceSlice";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

interface ManageCollaboratorsModalProps {
  open: boolean;
  onClose: () => void;
  workspace: Workspace;
  onRemove:(memeberId:string)=>void;
}

export const ManageCollaboratorsModal = ({
  open,
  onClose,
  workspace,
  onRemove
}: ManageCollaboratorsModalProps) => {

  const handleRemove = (memberId: string, email: string) => {
    //console.log("O M:",memberId);
    if (confirm(`Remove ${email} from ${workspace.name}?`)) {
      onRemove(memberId);
    }
  };

  const userEmail=useSelector((state:RootState)=>state.user.email);
  

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
                <h2 className="text-lg font-semibold">
                  Manage Collaborators ({workspace.name})
                </h2>
                <button onClick={onClose}>
                  <X size={20} className="text-gray-500 hover:text-gray-700" />
                </button>
                
              </div>
              <div>
                <h1 className="text-lg font-semibold text-red-600">Owner:<span className="text-black">{workspace.owner.name}</span></h1>
              </div>

              {workspace.members && workspace.members.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {workspace.members.map((member) => 
                  
                  ( workspace.owner.email!==member.email && member.email!==userEmail && 
                    <li
                      key={member.email}
                      className="flex justify-between items-center py-2"
                    >
                      <div>
                        <p className="font-medium text-gray-800">
                          {member.name || "Unnamed"}
                        </p>
                        <p className="text-xs text-gray-500">{member.email}</p>
                      </div>
                      <button
                        onClick={() => handleRemove(member._id!, member.email)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </li>
                  )
                  )}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 text-center">
                  No collaborators yet.
                </p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
