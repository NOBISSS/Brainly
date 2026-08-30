import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { MoreVertical, X } from "lucide-react";
import { HiArrowTurnRightDown } from "react-icons/hi2";
import toast from "react-hot-toast";

import Brain from "../assets/brain.svg";
import { SidebarItem } from "./SidebarItem";
import { WorkspaceMenuModal } from "./WorkspaceMenuModal";
import { AddCollaboratorModal } from "./AddCollaboratorModal";
import { ManageCollaboratorsModal } from "./ManageCollaboratorsModal";

import type { AppDispatch, RootState } from "../redux/store";
import {
    addCollaborator,
    deleteWorkspace,
    fetchWorkspaceById,
    fetchWorkspaces,
    removeCollaborator,
    setSelectedWorkspaces,
    socketMemberAdded,
    socketMemberRemoved,
    socketWorkspaceCreated,
    socketWorkspaceDeleted,
    type Workspace,
} from "../redux/slices/workspaceSlice";

import { fetchCurrentUser } from "../redux/slices/userThunks";
import { socket } from "../socket/socket";

interface SidebarProps {
    mobileOpen: boolean;
    onClose: () => void;
}

export function Sidebar({
    mobileOpen,
    onClose,
}: SidebarProps) {
    const dispatch = useDispatch<AppDispatch>();

    const user = useSelector(
        (state: RootState) => state.user.user
    );

    const {
        list,
        loading,
        selected,
    } = useSelector(
        (state: RootState) => state.workspaces
    );

    const [menuOpenId, setMenuOpenId] =
        useState<string | null>(null);

    const [activeWorkspace, setActiveWorkspace] =
        useState<Workspace | null>(null);

    const [addCollaboratorOpen, setAddCollaboratorOpen] =
        useState(false);

    const [manageCollaboratorsOpen, setManageCollaboratorsOpen] =
        useState(false);

    useEffect(() => {
        dispatch(fetchWorkspaces());
        dispatch(fetchCurrentUser());
    }, [dispatch]);

    useEffect(() => {
        const handleWorkspaceCreated = (
            workspace: Workspace
        ) => {
            dispatch(
                socketWorkspaceCreated(workspace)
            );
        };

        const handleWorkspaceDeleted = (
            workspaceId: string
        ) => {
            dispatch(
                socketWorkspaceDeleted(workspaceId)
            );
        };

        const handleMemberAdded = (
            member: any
        ) => {
            dispatch(
                socketMemberAdded(member)
            );
        };

        const handleMemberRemoved = (
            userId: string
        ) => {
            dispatch(
                socketMemberRemoved(userId)
            );
        };

        socket.on(
            "workspaceCreated",
            handleWorkspaceCreated
        );

        socket.on(
            "workspaceDeleted",
            handleWorkspaceDeleted
        );

        socket.on(
            "memberAdded",
            handleMemberAdded
        );

        socket.on(
            "memberRemoved",
            handleMemberRemoved
        );

        return () => {
            socket.off(
                "workspaceCreated",
                handleWorkspaceCreated
            );

            socket.off(
                "workspaceDeleted",
                handleWorkspaceDeleted
            );

            socket.off(
                "memberAdded",
                handleMemberAdded
            );

            socket.off(
                "memberRemoved",
                handleMemberRemoved
            );
        };
    }, [dispatch]);

    const handleWorkspaceClick = (
        workspace: Workspace
    ) => {
        dispatch(
            setSelectedWorkspaces(
                workspace._id
            )
        );

        setMenuOpenId(null);
        onClose();
    };

    const handleAddCollaborator = (
        workspace: Workspace
    ) => {
        setActiveWorkspace(workspace);
        setAddCollaboratorOpen(true);
        setMenuOpenId(null);
    };

    const handleManageCollaborators = (
        workspace: Workspace
    ) => {
        setActiveWorkspace(workspace);
        setManageCollaboratorsOpen(true);
        setMenuOpenId(null);
    };

    const handleCollaboratorSubmit = async (
        email: string
    ) => {
        if (!activeWorkspace?._id) return;

        try {
            await dispatch(
                addCollaborator({
                    workspaceId:
                        activeWorkspace._id,
                    email,
                })
            ).unwrap();

            toast.success(
                `Invite sent to ${email}`
            );

            setAddCollaboratorOpen(false);
        } catch (error: any) {
            toast.error(
                error?.message ||
                    "Failed to add collaborator"
            );
        }
    };

    const handleRemoveCollaborator = async (
        memberId: string
    ) => {
        if (!activeWorkspace?._id) return;

        try {
            await dispatch(
                removeCollaborator({
                    workspaceId:
                        activeWorkspace._id,
                    memberId,
                })
            ).unwrap();

            toast.success(
                "Collaborator removed successfully"
            );
        } catch (error: any) {
            toast.error(
                error?.message ||
                    "Failed to remove collaborator"
            );
        }
    };

    const handleDeleteWorkspace = async (
        workspaceId: string,
        workspaceName: string
    ) => {
        const confirmed = window.confirm(
            `Delete "${workspaceName}"?`
        );

        if (!confirmed) return;

        try {
            await dispatch(
                deleteWorkspace(workspaceId)
            ).unwrap();

            toast.success(
                "Workspace deleted successfully"
            );

            setMenuOpenId(null);
        } catch (error: any) {
            toast.error(
                error?.message ||
                    "Failed to delete workspace"
            );
        }
    };

    const renderWorkspaces = () => {
        if (loading && !list?.length) {
            return (
                <div className="space-y-2">
                    {Array.from({
                        length: 5,
                    }).map((_, index) => (
                        <div
                            key={index}
                            className="h-10 animate-pulse rounded-xl bg-gray-200"
                        />
                    ))}
                </div>
            );
        }

        if (!list?.length) {
            return (
                <div className="rounded-xl bg-gray-50 p-4 text-center text-sm text-gray-500">
                    No workspaces yet.
                </div>
            );
        }

        return (
            <AnimatePresence initial={false}>
                {list.map((workspace) => {
                    const isSelected =
                        selected?._id ===
                        workspace._id;

                    return (
                        <motion.div
                            key={workspace._id}
                            layout
                            initial={{
                                opacity: 0,
                                y: -4,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            exit={{
                                opacity: 0,
                                height: 0,
                            }}
                            className={`group relative mb-1 flex min-w-0 items-center rounded-xl border-l-4 transition ${
                                isSelected
                                    ? "border-purple-600 bg-purple-100"
                                    : "border-transparent hover:bg-purple-50"
                            }`}
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    handleWorkspaceClick(
                                        workspace
                                    )
                                }
                                className={`min-w-0 flex-1 truncate px-3 py-2.5 text-left text-sm font-medium transition ${
                                    isSelected
                                        ? "text-purple-700"
                                        : "text-gray-700 hover:text-purple-700"
                                }`}
                            >
                                {workspace.name}
                            </button>

                            <button
                                type="button"
                                aria-label={`Open options for ${workspace.name}`}
                                onClick={(event) => {
                                    event.stopPropagation();

                                    setActiveWorkspace(
                                        workspace
                                    );

                                    setMenuOpenId(
                                        (current) =>
                                            current ===
                                            workspace._id
                                                ? null
                                                : workspace._id
                                    );
                                }}
                                className="mr-1 shrink-0 rounded-lg p-1.5 text-gray-400 transition hover:bg-white hover:text-purple-600 md:opacity-0 md:group-hover:opacity-100"
                            >
                                <MoreVertical size={18} />
                            </button>

                            {menuOpenId ===
                                workspace._id && (
                                <WorkspaceMenuModal
                                    open
                                    onClose={() =>
                                        setMenuOpenId(
                                            null
                                        )
                                    }
                                    workspaceName={
                                        workspace.name
                                    }
                                    onAddCollaborator={() =>
                                        handleAddCollaborator(
                                            workspace
                                        )
                                    }
                                    onRemoveCollaborator={() =>
                                        handleManageCollaborators(
                                            workspace
                                        )
                                    }
                                    onDelete={() =>
                                        handleDeleteWorkspace(
                                            workspace._id,
                                            workspace.name
                                        )
                                    }
                                />
                            )}
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        );
    };

    const sidebarContent = (
        <div className="flex h-full min-h-0 flex-col">
            <div className="flex items-center justify-between px-2 sm:px-3">
                <div className="flex items-center gap-2">
                    <img
                        src={Brain}
                        alt="Brainly"
                        className="h-9 w-9 sm:h-10 sm:w-10"
                    />

                    <h1 className="text-2xl font-extrabold tracking-tight text-purple-600 sm:text-3xl">
                        Brainly
                    </h1>
                </div>

                <button
                    type="button"
                    aria-label="Close sidebar"
                    onClick={onClose}
                    className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 md:hidden"
                >
                    <X size={20} />
                </button>
            </div>

            <div className="mt-6 px-2 sm:px-3">
                <SidebarItem
                    text="Workspaces"
                    icon={
                        <HiArrowTurnRightDown />
                    }
                />
            </div>

            <div className="mt-3 min-h-0 flex-1 overflow-y-auto px-2 pb-4 [scrollbar-width:thin] sm:px-3">
                {renderWorkspaces()}
            </div>

            <div className="shrink-0 border-t border-purple-100 px-3 py-3 sm:px-4 sm:py-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 via-cyan-600 to-purple-700 text-sm font-bold text-white">
                        {getInitial(user?.name)}
                    </div>

                    <div className="min-w-0">
                        <p className="text-xs text-gray-500">
                            Hello
                        </p>

                        <p className="truncate text-sm font-semibold text-gray-800">
                            {user?.name || "User"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] md:hidden"
                            initial={{
                                opacity: 0,
                            }}
                            animate={{
                                opacity: 1,
                            }}
                            exit={{
                                opacity: 0,
                            }}
                            onClick={onClose}
                        />

                        <motion.aside
                            className="fixed inset-y-0 left-0 z-50 w-[min(85vw,320px)] bg-gradient-to-br from-gray-50 to-white p-3 shadow-2xl md:hidden"
                            initial={{
                                x: "-100%",
                            }}
                            animate={{
                                x: 0,
                            }}
                            exit={{
                                x: "-100%",
                            }}
                            transition={{
                                duration: 0.22,
                                ease: "easeOut",
                            }}
                        >
                            {sidebarContent}
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 bg-gradient-to-br from-gray-50 to-white p-3 shadow-sm md:flex">
                {sidebarContent}
            </aside>

            <AddCollaboratorModal
                open={addCollaboratorOpen}
                onClose={() =>
                    setAddCollaboratorOpen(false)
                }
                workspaceName={
                    activeWorkspace?.name || ""
                }
                onSubmit={
                    handleCollaboratorSubmit
                }
            />

            <ManageCollaboratorsModal
                open={
                    manageCollaboratorsOpen
                }
                onClose={() =>
                    setManageCollaboratorsOpen(
                        false
                    )
                }
                workspace={
                    activeWorkspace
                }
                onRemove={
                    handleRemoveCollaborator
                }
            />
        </>
    );
}

function getInitial(name?: string) {
    return (
        name?.trim().charAt(0).toUpperCase() ||
        "U"
    );
}