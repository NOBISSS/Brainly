import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import { socket } from "../socket/socket";
import type { RootState, AppDispatch } from "@/redux/store";

import {
  deleteLink,
  linkAdded,
  linkRemoved,
  type Link,
} from "@/redux/slices/linkSlice";

import {
  socketWorkspaceCreated,
  socketMemberAdded,
  socketMemberRemoved,
} from "../redux/slices/workspaceSlice";

import { Sidebar } from "@/components/Sidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import LinkGrid from "@/components/dashboard/LinkGrid";
import { CreateContentModalV2 } from "@/components/CreateContentModalV2";
import { CreateWorkspaceModal } from "@/components/CreateWorkspaceModal";
import { DeleteContentModal } from "@/components/DeleteContentModal";
import { useContent } from "@/hooks/useContent";

export default function DashboardV2() {
  const dispatch = useDispatch<AppDispatch>();

  const selectedWorkspace = useSelector(
    (state: RootState) => state.workspaces.selected || null
  );

  const user = useSelector(
    (state: RootState) => state.user.user
  );

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [contentModalOpen, setContentModalOpen] = useState(false);
  const [workspaceModalOpen, setWorkspaceModalOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const workspaceId = selectedWorkspace?._id ?? null;

  const {
    contents,
    loading,
    error,
    refetch,
  } = useContent(workspaceId);

  useEffect(() => {
    if (!user?._id) return;

    const handleWorkspaceCreated = (workspace: any) => {
      dispatch(socketWorkspaceCreated(workspace));
    };

    socket.emit("joinUser", user._id);
    socket.on("workspace:new", handleWorkspaceCreated);

    return () => {
      socket.off("workspace:new", handleWorkspaceCreated);
    };
  }, [user?._id, dispatch]);

  useEffect(() => {
    if (!workspaceId) return;

    const handleNewLink = (newLink: Link) => {
      dispatch(linkAdded(newLink));
    };

    const handleLinkDeleted = ({
      linkId,
    }: {
      linkId: string;
    }) => {
      dispatch(linkRemoved(linkId));
    };

    const handleMemberAdded = (member: any) => {
      dispatch(socketMemberAdded(member));
    };

    const handleMemberRemoved = (userId: string) => {
      dispatch(socketMemberRemoved(userId));
    };

    socket.emit("joinWorkspace", workspaceId);

    socket.on("link:new", handleNewLink);
    socket.on("link:deleted", handleLinkDeleted);
    socket.on("memberAdded", handleMemberAdded);
    socket.on("memberRemoved", handleMemberRemoved);

    return () => {
      socket.off("link:new", handleNewLink);
      socket.off("link:deleted", handleLinkDeleted);
      socket.off("memberAdded", handleMemberAdded);
      socket.off("memberRemoved", handleMemberRemoved);

      socket.emit("leaveWorkspace", workspaceId);
    };
  }, [workspaceId, dispatch]);

  useEffect(() => {
    setSelectedCategories([]);
    setSidebarOpen(false);
  }, [workspaceId]);

  const openDeleteModal = useCallback(
    (id: string, title: string) => {
      setLinkToDelete({ id, title });
    },
    []
  );

  const closeDeleteModal = useCallback(() => {
    setLinkToDelete(null);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!linkToDelete) return;

    try {
      await dispatch(deleteLink(linkToDelete.id)).unwrap();

      toast.success("Link deleted successfully");
      setLinkToDelete(null);
    } catch (err: any) {
      console.error("DELETE LINK ERROR:", err);

      toast.error(
        err?.message || "Failed to delete link"
      );
    }
  }, [linkToDelete, dispatch]);

  const toggleCategory = useCallback((category: string) => {
    setSelectedCategories((previous) =>
      previous.includes(category)
        ? previous.filter((item) => item !== category)
        : [...previous, category]
    );
  }, []);

  const categories = useMemo(() => {
    return [
      ...new Set(
        contents
          .map((content: Link) => content.category)
          .filter(Boolean)
      ),
    ];
  }, [contents]);

  const filteredContents = useMemo(() => {
    if (!selectedCategories.length) {
      return contents;
    }

    return contents.filter((item: Link) =>
      selectedCategories.includes(item.category)
    );
  }, [contents, selectedCategories]);

  const handleContentSuccess = useCallback(() => {
    setContentModalOpen(false);
    refetch();
  }, [refetch]);

  const handleWorkspaceSuccess = useCallback(() => {
    setWorkspaceModalOpen(false);
  }, []);

  return (
    <div className="
            min-h-screen
            bg-gradient-to-br
            from-gray-50
            via-white
            to-purple-50/40
            text-gray-900
        ">
      <Sidebar
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="min-h-screen md:ml-72">
        <div className="
                    mx-auto
                    w-full
                    max-w-[1800px]
                    px-4
                    py-5
                    sm:px-6
                    sm:py-6
                    lg:px-8
                ">
          <DashboardHeader
            workspace={selectedWorkspace}
            categories={categories}
            selectedCategories={selectedCategories}
            onToggleCategory={toggleCategory}
            onOpenSidebar={() => setSidebarOpen(true)}
            onAddLink={() => setContentModalOpen(true)}
            onCreateWorkspace={() =>
              setWorkspaceModalOpen(true)
            }
          />

          <section className="mt-6 min-h-[400px]">
            {loading && (
              <div className="
                                flex
                                min-h-[400px]
                                items-center
                                justify-center
                            ">
                <div className="
                                    flex
                                    flex-col
                                    items-center
                                    gap-3
                                ">
                  <div className="
                                        h-8
                                        w-8
                                        animate-spin
                                        rounded-full
                                        border-2
                                        border-purple-200
                                        border-t-purple-600
                                    " />

                  <p className="
                                        text-sm
                                        text-gray-500
                                    ">
                    Loading your content...
                  </p>
                </div>
              </div>
            )}

            {!loading && error && (
              <div className="
                                flex
                                min-h-[400px]
                                items-center
                                justify-center
                            ">
                <div className="
                                    w-full
                                    max-w-sm
                                    rounded-2xl
                                    border
                                    border-red-100
                                    bg-red-50
                                    p-6
                                    text-center
                                ">
                  <div className="
                                        mx-auto
                                        flex
                                        h-12
                                        w-12
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-red-100
                                        text-xl
                                    ">
                    ⚠️
                  </div>

                  <h3 className="
                                        mt-4
                                        font-semibold
                                        text-gray-900
                                    ">
                    Couldn't load your links
                  </h3>

                  <p className="
                                        mt-1
                                        text-sm
                                        text-gray-500
                                    ">
                    Something went wrong while
                    loading your content.
                  </p>

                  <button
                    type="button"
                    onClick={refetch}
                    className="
                                            mt-4
                                            rounded-lg
                                            bg-purple-600
                                            px-4
                                            py-2
                                            text-sm
                                            font-medium
                                            text-white
                                            transition
                                            hover:bg-purple-700
                                        "
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {!loading && !error && (
              <LinkGrid
                links={filteredContents}
                loading={loading}
                error={error}
                user={user}
                onDelete={openDeleteModal}
              />
            )}
          </section>
        </div>
      </main>

      <CreateContentModalV2
        open={contentModalOpen}
        onClose={() => setContentModalOpen(false)}
        onSuccess={handleContentSuccess}
      />

      <CreateWorkspaceModal
        open={workspaceModalOpen}
        onClose={() => setWorkspaceModalOpen(false)}
        onSuccess={handleWorkspaceSuccess}
      />

      <DeleteContentModal
        open={Boolean(linkToDelete)}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        contentTitle={linkToDelete?.title || ""}
      />
    </div>
  );
}