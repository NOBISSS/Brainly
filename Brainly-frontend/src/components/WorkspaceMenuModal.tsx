import { UserPlus, Users, Trash2 } from "lucide-react";

interface WorkspaceMenuModalProps {
    open: boolean;
    onClose: () => void;
    workspaceName: string;
    onAddCollaborator: () => void;
    onRemoveCollaborator: () => void;
    onDelete: () => void;
}

export function WorkspaceMenuModal({
    open,
    onClose,
    workspaceName,
    onAddCollaborator,
    onRemoveCollaborator,
    onDelete,
}: WorkspaceMenuModalProps) {
    if (!open) return null;

    return (
        <>
            <div
                className="fixed inset-0 z-[9998]"
                onClick={onClose}
            />

            <div
                className="absolute right-1 top-full z-[9999] mt-1 w-56 max-w-[calc(100vw-32px)] overflow-hidden rounded-xl border border-gray-200 bg-white py-1 text-gray-800 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="border-b border-gray-100 px-3 py-2.5">
                    <p className="truncate text-xs text-gray-500">
                        Workspace
                    </p>
                    <p className="truncate text-sm font-semibold text-gray-800">
                        {workspaceName}
                    </p>
                </div>

                <button
                    type="button"
                    className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition hover:bg-purple-50 hover:text-purple-700"
                    onClick={() => {
                        onAddCollaborator();
                        onClose();
                    }}
                >
                    <UserPlus size={17} />
                    <span>Add collaborator</span>
                </button>

                <button
                    type="button"
                    className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition hover:bg-purple-50 hover:text-purple-700"
                    onClick={() => {
                        onRemoveCollaborator();
                        onClose();
                    }}
                >
                    <Users size={17} />
                    <span>Manage collaborators</span>
                </button>

                <div className="my-1 border-t border-gray-100" />

                <button
                    type="button"
                    className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50"
                    onClick={() => {
                        onDelete();
                        onClose();
                    }}
                >
                    <Trash2 size={17} />
                    <span>Delete workspace</span>
                </button>
            </div>
        </>
    );
}