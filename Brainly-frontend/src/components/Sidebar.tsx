// src/components/Sidebar.tsx
import { useEffect, useState } from "react";
import { SidebarItem } from "./SidebarItem";
import Brain from "../assets/brain.svg";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { HiArrowTurnRightDown } from "react-icons/hi2";
import {
  fetchWorkspaces,
  setSelectedWorkspaces,
  deleteWorkspace,
  addCollaborator,
  removeCollaborator,
  fetchWorkspaceById,
  Workspace,
} from "../redux/slices/workspaceSlice";
import { MoreVertical } from "lucide-react";
import { WorkspaceMenuModal } from "./WorkspaceMenuModal";
import { AddCollaboratorModal } from "./AddCollaboratorModal";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { ManageCollaboratorsModal } from "./ManageCollaboratorsModal";
import { fetchCurrentUser } from "../redux/slices/userThunks";

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const dispatch = useDispatch<AppDispatch>();
  const {name}=useSelector((store)=>store.user);
  
  const { list, loading } = useSelector(
    (state: RootState) => state.workspaces
  );

  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });


  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [addCollaboratorOpen, setAddCollaboratorOpen] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(
    null
  );
  const [removeCollaborators, setRemoveCollaborators] = useState(false);

  useEffect(() => {
    dispatch(fetchWorkspaces());
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  const handleWorkspaceClick = (workspace: Workspace) => {
    const workspaceId = workspace._id;
    const exist = list.some((w) => w._id === workspaceId);
    if (!exist) {
      dispatch(fetchWorkspaceById(workspaceId));
    }
    dispatch(setSelectedWorkspaces(workspaceId));
    onClose(); // close drawer on mobile
  };

  const handleAddCollaborator = (workspace: Workspace) => {
    setSelectedWorkspace(workspace);
    setAddCollaboratorOpen(true);
  };

  const handleCollaboratorSubmit = async (email: string) => {
    try {
      if (!selectedWorkspace?._id) return;
      await dispatch(
        addCollaborator({ workspaceId: selectedWorkspace._id, email })
      ).unwrap();
      toast.success(`Invite sent to ${email} for ${selectedWorkspace.name}`);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong"
      );
    } finally {
      setAddCollaboratorOpen(false);
    }
  };

  const handleRemoveCollaborator = async (memberId: string) => {
    if (!selectedWorkspace?._id) return;
    try {
      await dispatch(
        removeCollaborator({
          workspaceId: selectedWorkspace._id,
          memberId: memberId,
        })
      ).unwrap();
      toast.success("Collaborator removed successfully");
    } catch (error: any) {
      console.log(error);
      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong"
      );
    }
  };

  const handleDeleteWorkspace = async (
    workspaceId: string,
    workspaceName: string
  ) => {
    const confirmDelete = confirm(
      `Are you sure you want to delete "${workspaceName}"?`
    );
    if (!confirmDelete) return;

    try {
      await dispatch(deleteWorkspace(workspaceId)).unwrap();
      toast.success(`"${workspaceName}" deleted successfully`);
    } catch (err) {
      toast.error(`Failed to delete "${workspaceName}"`);
    }
  };

  const sidebarBody = (
    <div className="h-full flex flex-col justify-between  w-full">
      <div className="part-1 ">
        {/* Logo Header */}
        <div className="flex items-center gap-2 mt-3 pl-2">
          <img className="w-10 h-10" src={Brain} alt="Brainly Logo" />
          <h1 className="text-purple-600 text-3xl font-extrabold tracking-tight">
            Brainly
          </h1>
        </div>

        {/* Navigation Links */}
        <div className="pt-6 ml-2 space-y-1">
          <SidebarItem text="Workspaces" icon={<HiArrowTurnRightDown />} />
        </div>

        {/* Workspace List */}
        <div className="mt-4 space-y-2 relative flex-1 overflow-y-auto pr-1">
          {loading && (
            <p className="text-gray-400 text-sm">Loading workspaces...</p>
          )}

          <AnimatePresence>
            {list.map((ws) => (
              <motion.div
                key={ws._id}
                layout
                onClick={() => handleWorkspaceClick(ws)}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                exit={{ opacity: 0 }}
                className="relative flex items-center justify-between group hover:bg-purple-50 rounded-lg p-2 active:bg-[#e3f2fd] font-bold border-l-8 border-purple-600 bg-gradient-to-l from-purple-100 to-white"
              >
                <button
                  className="text-purple-700 font-medium truncate text-sm flex-1 text-left cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(setSelectedWorkspaces(ws._id));
                    onClose();
                  }}
                >
                  {ws.name}
                </button>

                {/* 3-dot menu trigger */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();

                    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();

                    setMenuPosition({
                      top: rect.bottom + 6,
                      left: rect.right - 200,
                    });

                    setMenuOpenId(menuOpenId === ws._id ? null : ws._id);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition"
                >
                  <MoreVertical size={18} className="text-gray-500 hover:text-purple-600" />
                </button>



                {/* Dropdown menu */}
                {menuOpenId === ws._id && (
                  <WorkspaceMenuModal
                    open
                    position={menuPosition}
                    onClose={() => setMenuOpenId(null)}
                    workspaceName={ws.name}
                    onAddCollaborator={() => handleAddCollaborator(ws)}
                    onRemoveCollaborator={() => {
                      setSelectedWorkspace(ws);
                      setRemoveCollaborators(true);
                    }}
                    onDelete={() => handleDeleteWorkspace(ws._id, ws.name)}
                  />

                )}

              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Profile part */}
      <div className="part-2 profile-part p-4 border-t-2 border-purple-800">
        <div className="user-details flex items-center gap-3">
          <div className="group relative circle w-[34px] h-[34px] bg-black rounded-full bg-gradient-to-t from-cyan-400 via-cyan-700 to-purple-700">
            <span className="absolute opacity-0 inset-x-0 group-hover:opacity-100 transition-opacity duration-300 bottom-px bg-gradient-to-r from-transparent via-black to-transparent h-[3px] w-4/5 mx-auto blur-sm"></span>
          </div>
          <h1 className="text-xl ">Hello, {name}</h1>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile sidebar drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
            <motion.div
              className="fixed top-0 left-0 bottom-0 w-64 bg-gradient-to-r from-gray-100 to-white z-50 md:hidden"
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: "tween", duration: 0.2 }}
            >
              {sidebarBody}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <div className="hidden md:flex h-screen bg-white py-4 px-2 w-72 fixed left-0 top-0 z-40 bg-gradient-to-r from-gray-100 to-white">
        {sidebarBody}
      </div>

      {/* Modals */}
      <AddCollaboratorModal
        open={addCollaboratorOpen}
        onClose={() => setAddCollaboratorOpen(false)}
        workspaceName={selectedWorkspace?.name || ""}
        onSubmit={handleCollaboratorSubmit}
      />
      <ManageCollaboratorsModal
        open={removeCollaborators}
        onClose={() => setRemoveCollaborators(false)}
        workspace={selectedWorkspace}
        onRemove={handleRemoveCollaborator}
      />
    </>
  );
}
