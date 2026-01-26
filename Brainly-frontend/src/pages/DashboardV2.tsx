// src/pages/Dashboard.tsx

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import type { RootState, AppDispatch } from "@/redux/store";
import { deleteLink, type Link } from "@/redux/slices/linkSlice";

import { Sidebar } from "@/components/Sidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { LinkGrid } from "@/components/dashboard/LinkGrid";
import { CreateContentModalV2 } from "@/components/CreateContentModalV2";
import { DeleteContentModal } from "@/components/DeleteContentModal";

import { useContent } from "@/hooks/useContent";
import { CreateWorkspaceModal } from "@/components/CreateWorkspaceModal";

export default function DashboardV2() {
  const dispatch = useDispatch<AppDispatch>();

  /* ---------------------------------------------------------------- */
  /* Redux State                                                      */
  /* ---------------------------------------------------------------- */

  const selectedWorkspace = useSelector(
    (state: RootState) => state.workspaces.selected || null
  );

  const user = useSelector((state: RootState) => state.user);

  /* ---------------------------------------------------------------- */
  /* Local UI State (ONLY UI stuff lives here)                        */
  /* ---------------------------------------------------------------- */

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
 const [createWorkspaceModalOpen,setCreateWorkspaceModalOpen]=useState(false);
  const [linkToDelete, setLinkToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  /* ---------------------------------------------------------------- */
  /* Data Fetching                                                    */
  /* ---------------------------------------------------------------- */

  const { contents, loading, error, refetch } = useContent(
    selectedWorkspace?._id ?? null
  );

  /* ---------------------------------------------------------------- */
  /* Actions                                                          */
  /* ---------------------------------------------------------------- */

  const openDeleteModal = (id: string, title: string) => {
    setLinkToDelete({ id, title });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!linkToDelete) return;

    try {
      await dispatch(deleteLink(linkToDelete.id)).unwrap();

      toast.success("Link Deleted ✅");

      setDeleteModalOpen(false);
      setLinkToDelete(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.message || "Delete failed");
    }
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat)
        ? prev.filter((c) => c !== cat)
        : [...prev, cat]
    );
  };

  /* ---------------------------------------------------------------- */
  /* Derived Data                                                     */
  /* ---------------------------------------------------------------- */

  const filteredContents = useMemo(() => {
    if (!selectedCategories.length) return contents;

    return contents.filter((item: Link) =>
      selectedCategories.includes(item.category)
    );
  }, [contents, selectedCategories]);

  const categories = useMemo(() => {
    return [...new Set(contents.map((c: Link) => c.category))];
  }, [contents]);

  /* ---------------------------------------------------------------- */
  /* Reset filters when workspace changes                             */
  /* ---------------------------------------------------------------- */

  useEffect(() => {
    setSelectedCategories([]);
  }, [selectedWorkspace]);

  /* ---------------------------------------------------------------- */
  /* Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <div className="flex min-h-screen bg-linear-to-t from-gray-200 to-white">

      {/* Sidebar */}
      <Sidebar
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main */}
      <div className="flex-1 px-4 py-6 md:ml-72">

        {/* Header */}
        <DashboardHeader
  workspace={selectedWorkspace}
  categories={categories}
  selectedCategories={selectedCategories}
  onToggleCategory={toggleCategory}
  onOpenSidebar={() => setSidebarOpen(true)}
  onAddLink={() => setModalOpen(true)}
  onCreateWorkspace={() => setCreateWorkspaceModalOpen(true)}
/>


        {/* Grid */}
        <LinkGrid
          links={filteredContents}
          loading={loading}
          error={error}
          user={user}
          onDelete={openDeleteModal}
        />

        {/* Modals */}
        <CreateContentModalV2
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={refetch}
        />

        <CreateWorkspaceModal
          open={createWorkspaceModalOpen}
          onClose={() => setCreateWorkspaceModalOpen(false)}
          onSuccess={refetch}
        />

        <DeleteContentModal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          contentTitle={linkToDelete?.title || ""}
        />
      </div>
    </div>
  );
}
