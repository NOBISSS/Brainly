import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { CrossIcon } from "../icons/CrossIcon";
import { Button } from "./Button";
import { Input } from "./Input";
import type { AppDispatch } from "../redux/store";
import {
  addCollaborator,
  createWorkspace as createWorkspaceThunk,
} from "../redux/slices/workspaceSlice";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateWorkspaceModal({
  open,
  onClose,
  onSuccess,
}: Props) {
  const dispatch = useDispatch<AppDispatch>();

  const nameRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const [collaborators, setCollaborators] = useState<string[]>([]);
  const [creating, setCreating] = useState(false);

  const reset = () => {
    if (nameRef.current) nameRef.current.value = "";
    if (descRef.current) descRef.current.value = "";
    if (emailRef.current) emailRef.current.value = "";
    setCollaborators([]);
  };

  const handleClose = () => {
    if (creating) return;
    reset();
    onClose();
  };

  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      nameRef.current?.focus();
    }, 150);

    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !creating) {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, creating]);

  const addEmail = () => {
    const email = emailRef.current?.value.trim().toLowerCase();

    if (!email) {
      toast.error("Enter a collaborator email");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Enter a valid email");
      return;
    }

    if (collaborators.includes(email)) {
      toast.error("Collaborator already added");
      return;
    }

    setCollaborators((prev) => [...prev, email]);

    if (emailRef.current) {
      emailRef.current.value = "";
      emailRef.current.focus();
    }
  };

  const handleEmailKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addEmail();
    }
  };

  const removeEmail = (email: string) => {
    setCollaborators((prev) =>
      prev.filter((item) => item !== email)
    );
  };

  const createWorkspace = async () => {
    const name = nameRef.current?.value.trim() || "";
    const description = descRef.current?.value.trim() || "";

    if (!name) {
      toast.error("Workspace name is required");
      nameRef.current?.focus();
      return;
    }

    if (name.length < 2) {
      toast.error("Workspace name must be at least 2 characters");
      return;
    }

    if (creating) return;

    try {
      setCreating(true);

      const created = await dispatch(
        createWorkspaceThunk({
          name,
          description,
        })
      ).unwrap();

      const workspaceId = created?._id;

      if (!workspaceId) {
        throw new Error("Workspace ID missing after creation");
      }

      let failed = 0;

      for (const email of collaborators) {
        try {
          await dispatch(
            addCollaborator({
              workspaceId,
              email,
            })
          ).unwrap();
        } catch {
          failed++;
        }
      }

      if (failed > 0) {
        toast.success(
          "Workspace created, but some collaborators could not be added"
        );
      } else {
        toast.success("Workspace created successfully");
      }

      onSuccess?.();
      reset();
      onClose();
    } catch (error: any) {
      toast.error(
        error?.message ||
        error?.response?.data?.message ||
        "Failed to create workspace"
      );
    } finally {
      setCreating(false);
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-3 backdrop-blur-sm sm:p-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.97 }}
          onClick={(e) => e.stopPropagation()}
          className="flex max-h-[94vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        >
          <div className="flex shrink-0 items-start justify-between border-b border-gray-100 p-4 sm:p-5">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
                Create Workspace
              </h2>
              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                Organize your content in one place
              </p>
            </div>

            <button
              type="button"
              onClick={handleClose}
              disabled={creating}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
            >
              <CrossIcon />
            </button>
          </div>

          <div className="overflow-y-auto p-4 sm:p-5">
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Workspace name
                </label>

                <Input
                  reference={nameRef}
                  placeholder="e.g. My Projects"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Description{" "}
                  <span className="font-normal text-gray-400">
                    (optional)
                  </span>
                </label>

                <Input
                  reference={descRef}
                  placeholder="What will you use this workspace for?"
                />
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="mb-3">
                  <h3 className="text-sm font-semibold text-gray-800">
                    Collaborators
                  </h3>
                  <p className="mt-1 text-xs text-gray-400">
                    Invite people to work with you
                  </p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="min-w-0 flex-1">
                    <Input
                      reference={emailRef}
                      type="email"
                      placeholder="name@example.com"
                      onKeyDown={handleEmailKeyDown}
                    />
                  </div>

                  <Button
                    onClick={addEmail}
                    variant="Primary"
                    text="Add"
                  />
                </div>

                {collaborators.length > 0 && (
                  <div className="mt-4 max-h-36 space-y-2 overflow-y-auto pr-1">
                    {collaborators.map((email) => (
                      <div
                        key={email}
                        className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2.5"
                      >
                        <span className="min-w-0 truncate text-sm text-gray-700">
                          {email}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            removeEmail(email)
                          }
                          disabled={creating}
                          className="shrink-0 rounded-md px-2 py-1 text-xs font-medium text-red-500 transition hover:bg-red-50"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {collaborators.length > 0 && (
                  <p className="mt-3 text-xs text-purple-600">
                    {collaborators.length} collaborator
                    {collaborators.length > 1 ? "s" : ""}{" "}
                    will be invited.
                  </p>
                )}
              </div>

              <Button
                onClick={createWorkspace}
                variant="Primary"
                text={
                  creating
                    ? "Creating workspace..."
                    : "Create Workspace"
                }
                fullWidth
                disabled={creating}
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}