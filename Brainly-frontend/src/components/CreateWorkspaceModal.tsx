import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { CrossIcon } from "../icons/CrossIcon";
import { Button } from "./Button";
import { Input } from "./Input";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch  } from "../redux/store";
import { addCollaborator, createWorkspace as createWorkspaceThunk } from "../redux/slices/workspaceSlice";
import type { RootState } from "../redux/store"; // ✅ from your store

interface CreateWorkspaceModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateWorkspaceModal({
  open,
  onClose,
  onSuccess,
}: CreateWorkspaceModalProps) {
  const nameRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const [collaborators, setCollaborators] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const workspaces = useSelector(
    (state: RootState) => state.workspaces.workspaces
  );
  const firstWorkspace = workspaces?.[0] || null;
  const dispatch = useDispatch<AppDispatch>();

  const handleAddCollaborator = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const email = emailRef.current?.value?.trim();
    if (!emailRegex.test(email)){
      toast.error("Enter a valid email");
      return
    }
    if (collaborators.includes(email)) {
      toast.error("Collaborator already added");
      return;
    }

    setCollaborators((prev) => [...prev, email]);
    if (emailRef.current) emailRef.current.value = "";
  };

  const removeCollaborator = (email: string) => {
    setCollaborators((prev) => prev.filter((e) => e !== email));
  };

  const createWorkspace = async () => {
    const name = nameRef.current?.value.trim();
    const description = descRef.current?.value.trim();

    if (!name) return toast.error("Workspace name is required");

    try {
      setIsCreating(true);
      const created = await dispatch(createWorkspaceThunk({ name, description })).unwrap();
      toast.success("Workspace created successfully");

      

      // Step 2: Add collaborators (if any)

      const workspaceId = created?._id

        if (!workspaceId) {
          throw new Error("Workspace ID missing After Creation");
        } 
        
          for (const email of collaborators) {
            await dispatch(addCollaborator({ workspaceId, email })).unwrap();
          }
          

      if (collaborators.length > 0) {
        toast.success("Collaborators added Successfully");
      }

      onSuccess?.();
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error(
        err?.response?.data?.message || "Failed to create workspace"
      );
    } finally {
      setIsCreating(false);
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 backdrop-blur-sm bg-black/30 z-40" onClick={onClose}/>

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md sm:max-w-lg bg-white p-5 sm:p-6 rounded-2xl shadow-lg relative">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl sm:text-2xl font-bold text-purple-700">
              Create Workspace
            </h1>
            <button onClick={onClose} className="cursor-pointer">
              <CrossIcon />
            </button>
          </div>

          {/* Workspace Info */}
          <div className="space-y-3 flex flex-col">
            <Input reference={nameRef} placeholder="Workspace Name" />
            <Input reference={descRef} placeholder="Description (optional)" />
          </div>

          {/* Collaborators Section */}
          <div className="mt-5">
            <h2 className="text-sm sm:text-md font-semibold text-gray-700 mb-2">
              Add Collaborators
            </h2>

            <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
              <div className="flex-1">
                <Input
                  reference={emailRef}
                  type="email"
                  placeholder="Enter collaborator email"
                />
              </div>
              <Button
                onClick={handleAddCollaborator}
                variant="Primary"
                text="Add"
              />
            </div>

            {/* Display added collaborators */}
            <div className="mt-3 space-y-2 max-h-32 overflow-y-auto">
              {collaborators.map((email, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center bg-gray-100 p-2 rounded"
                >
                  <span className="text-xs sm:text-sm truncate max-w-[70%]">
                    {email}
                  </span>
                  <button
                    onClick={() => removeCollaborator(email)}
                    className="text-red-500 text-xs font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-5">
            <Button
              onClick={createWorkspace}
              variant="Primary"
              text={isCreating ? "Creating..." : "Create Workspace"}
              fullWidth={true}
              disabled={isCreating}
            />
          </div>
        </div>
      </div>
    </>
  );
}
