import axios from "axios";
import { CrossIcon } from "../icons/CrossIcon";
import { Button } from "./Button";
import { Input } from "./Input";
import { useEffect, useRef, useState } from "react";
import { BACKEND_URL } from "../config";
import toast from "react-hot-toast";
import { detectLinkType } from "../utils/detectLinkType";
import { useDispatch } from "react-redux";
import { addLink } from "../redux/slices/linkSlice";
import { fetchWorkspaces as FetchWorkspacesThunk } from "../redux/slices/workspaceSlice";

interface CreateContentModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateContentModal({
  open,
  onClose,
  onSuccess,
}: CreateContentModalProps) {
  const types = [
    "youtube",
    "twitter",
    "canva",
    "Google Docs",
    "Google Sheets",
    "PDF/Word File",
  ];
  const [workspace, setWorkspaces] = useState<any[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const titleRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);
  const typeRef = useRef<HTMLSelectElement>(null);
  const workspaceRef = useRef<HTMLSelectElement>(null);
  const dispatch = useDispatch();

  const handleLinkChange = () => {
    const link = linkRef.current?.value || "";
    if (link) {
      const detectedType = detectLinkType(link);
      if (detectedType && detectedType !== "unknown") {
        setSelectedType(detectedType);
      }
    }
  };

  const createLink = async () => {
    const title = titleRef.current?.value;
    const link = linkRef.current?.value;
    const type = typeRef.current?.value || detectLinkType(link || "");
    const workspaceId = workspaceRef.current?.value || "";

    if (!title || !link || type === "unknown" || workspaceId.length === 0) {
      toast.error("Please fill all required details");
      return;
    }

    dispatch(
      addLink({
        title,
        url: link,
        category: type,
        workspace: workspaceId,
      })
    );

    toast.success("Link created successfully");
    onSuccess?.();
    onClose();
  };

  useEffect(() => {
    if (!open) return;
     const fetchWorkspaces = async () => {
      try {
        const workspacesData=await dispatch(FetchWorkspacesThunk()).unwrap();
        console.log(workspacesData)
        setWorkspaces(workspacesData);
       } catch (error) {
         console.log("Failed to Fetch Workspaces", error);
       }
     };
     fetchWorkspaces();
    //setWorkspaces(workspacesData || []);
  }, [open,dispatch]);

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 backdrop-blur-sm bg-black/30"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white p-5 sm:p-6 rounded-2xl shadow-lg relative">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl sm:text-2xl font-bold text-purple-700">
              Add Link
            </h1>
            <button onClick={onClose} className="cursor-pointer">
              <CrossIcon />
            </button>
          </div>

          {/* Inputs */}
          <div className="space-y-3 flex flex-col">
            <Input reference={titleRef} placeholder="Title" />
            <Input
              reference={linkRef}
              placeholder="Link"
              // if your Input supports onChange, this will auto-detect type as user types
              onChange={handleLinkChange as any}
            />

            {/* Type Selection */}
            <select
              ref={typeRef}
              className="border p-2 rounded w-full text-sm sm:text-base"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">Select Type</option>
              {types.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>

            {/* Workspace Selection */}
            <select
              ref={workspaceRef}
              className="border p-2 rounded w-full text-sm sm:text-base"
              value={selectedWorkspace}
              onChange={(e) => setSelectedWorkspace(e.target.value)}
            >
              <option value="">Select Workspace</option>
              {workspace.map((ws: any) => (
                <option key={ws._id} value={ws._id}>
                  {ws.name}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-5">
            <Button
              onClick={createLink}
              variant="Primary"
              text="Submit"
              fullWidth={true}
            />
          </div>
        </div>
      </div>
    </>
  );
}
