// src/pages/Dashboard.tsx
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store";
import { Sidebar } from "../components/Sidebar";
import { Button } from "../components/Button";
import { PlusIcon } from "../icons/PlusIcon";
import { useEffect, useMemo, useState } from "react";
import { CreateContentModal } from "../components/CreateContentModal";
import { CreateWorkspaceModal } from "../components/CreateWorkspaceModal";
import { useContent } from "../hooks/useContent";
import FilterModal from "../components/FilterModal";
import { MdArrowDropUp, MdDelete, MdArrowDropDown } from "react-icons/md";
import { DeleteContentModal } from "../components/DeleteContentModal";
import { deleteLink, type Link } from "../redux/slices/linkSlice";
import toast from "react-hot-toast";
import { Menu } from "lucide-react";
import { ThemeToggle } from "../components/ThemeToggle";
import { CreateContentModalV2 } from "../components/CreateContentModalV2";
import { DEFAULT_LOGO } from "@/constants/frConstant";
import { Card } from "../components/Card";
import { getCategoryIcon } from "@/utils/getCategoryIcon";

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();

  const selectedWorkspace = useSelector(
    (state: RootState) => state.workspaces.selected || null
  );
  const user = useSelector((state: RootState) => state.user.user);

  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile sidebar
  const [modalOpen, setModalOpen] = useState(false);
  const [createWorkspaceModalOpen, setCreateWorkspaceModalOpen] =
    useState(false);
  const [deleteModalOpen, setDeleteModal] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState<{
    id: string,
    title: string,
  } | null>(null);

  const [showFilter, setShowFilter] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const { contents, loading, error, refetch } = useContent(
    selectedWorkspace?._id ?? null
  );

  const openDeleteModal = (id: string, title: string) => {
    setLinkToDelete({ id, title });
    setDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!linkToDelete) return;

    try {
      await dispatch(deleteLink(linkToDelete.id)).unwrap();
      toast.success("Link Deleted");
      setDeleteModal(false);
      setLinkToDelete(null);
      refetch();
    } catch (err: any) {
      console.log("Error when Deleting Link:", err);
      toast.error(err?.message || "Failed to Delete The Link");
    }
  };

  const handleToggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const filteredContents = useMemo(() => {
    if (!selectedCategories.length) return contents;
    return contents.filter((item: Link) =>
      selectedCategories.includes(item.category)
    );
  }, [contents, selectedCategories]);

  const categories = useMemo(() => {
    const unique = new Set<string>();
    contents.forEach((c: Link) => unique.add(c.category));
    return Array.from(unique);
  }, [contents]);

  useEffect(() => {
    setSelectedCategories([]);
    setShowFilter(false);
  }, [selectedWorkspace]);
  //bg-linear-to-t from-gray-200 to-white
  return (
    <div className="bg-bg flex min-h-screen text-text bg-linear-to-t from-gray-200 to-white">
      {/* Sidebar (desktop + mobile drawer) */}
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Dashboard */}
      <div className="flex-1 px-4 py-6 md:p-5 md:ml-72 transition-all duration-300">
        {/* Modals */}
        <CreateContentModalV2
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={refetch}
        />
        <CreateWorkspaceModal
          open={createWorkspaceModalOpen}
          onClose={() => setCreateWorkspaceModalOpen(false)}
        />

        {/* Header Section */}
        <div className="flex justify-between mb-8 flex-col gap-4">
          <div className="header-part-1 flex justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              {/* Mobile menu icon like ChatGPT */}
              <button
                className="md:hidden p-2 rounded-full border border-purple-200 bg-white shadow-sm"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="text-purple-700" size={22} />
              </button>

              <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
                {selectedWorkspace
                  ? selectedWorkspace.name
                  : "Select a Workspace"}
              </h1>
            </div>


            <div className="flex gap-2 md:gap-4 flex-wrap justify-end">
              <Button
                onClick={() => setModalOpen(true)}
                variant="Primary"
                text="Add Content"
                startIcon={<PlusIcon />}
              />
              <Button
                onClick={() => setCreateWorkspaceModalOpen(true)}
                variant="Primary"
                text="Create Workspace"
                startIcon={<PlusIcon />}
              />
            </div>
          </div>

          {selectedWorkspace && categories.length > 1 && (
            <div className="header-part-2 flex items-end justify-end">
              <h1
                onClick={() => setShowFilter((prev) => !prev)}
                className="cursor-pointer border rounded-md flex gap-3 select-none items-center p-1 px-2 bg-black text-white text-sm md:text-base"
              >
                Select Category{" "}
                {showFilter ? <MdArrowDropUp /> : <MdArrowDropDown />}
              </h1>

              <FilterModal
                open={showFilter}
                onClose={() => setShowFilter(false)}
                categories={categories}
                selectedCategories={selectedCategories}
                onSelectedCategories={handleToggleCategory}
              />
            </div>
          )}
        </div>

        {/* Workspace Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p className="text-center text-gray-500 py-12 col-span-full">Loading links...</p>
          ) : error ? (
            <p className="text-center text-red-500 py-12 col-span-full">{error}</p>
          ) : filteredContents && filteredContents.length > 0 ? (
            filteredContents.map((item) => {
              const { url, title, thumbnail, _id, createdBy, category } = item;
              const { icon, bg } = getCategoryIcon(category);
              return (
                <motion.div
                  key={_id}
                  whileHover={{ scale: 1.05 }}
                  layoutId={_id}
                  initial={{ y: -10, scale: 0.9 }}
                  animate={{ y: 0, scale: 1 }}
                  style={thumbnail ? { backgroundImage: `url(${thumbnail})` } : undefined}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className={`bg-white p-5 flex flex-col justify-evenly rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 ease-in-out cursor-default  bg-cover bg-center relative`}
                >
                  <div className="absolute inset-0 bg-black/70 rounded-3xl "></div>
                  <div className="flex justify-between">
                    <h2 className="relative font-medium text-lg text-white mb-2">
                      {title}
                    </h2>
                    <div className="relative text-2xl text-red-500 cursor-pointer">
                      <MdDelete
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteModal(_id!, title);
                        }}
                      />
                    </div>
                  </div>
                  <p className="relative text-sm text-gray-200 truncate mt-1">{url}</p>
                  <div className="mt-4 flex justify-between">
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-purple-200 relative font-medium hover:text-white cursor-pointer"
                    >
                      Open Link →
                    </a>
                    {createdBy && <div className="relative flex items-center gap-4">
                      <div className="group">
                        <img
                          src={createdBy?.avatar || DEFAULT_LOGO}
                          alt={createdBy?.name == user?.name ? "me" : createdBy?.name}
                          className="w-10 h-10 rounded-full border bg-center bg-clip-content object-center object-cover"
                        />
                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center ${bg}`}>
                          {icon}
                        </div>
                        <div className="absolute bottom-full mb-1 hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded">
                          {createdBy?.name == user?.name ? "ME" : createdBy?.name}
                        </div>
                      </div>
                    </div>
                    }
                  </div>
                </motion.div>
              )
            })
          ) : (
            <p className="text-gray-500 text-center col-span-full py-12">
              {selectedCategories.length
                ? "No Links Match the selected Categories"
                : "No links yet. Start by adding content."}
            </p>
          )}
        </div>

        {/* Floating Add Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setModalOpen(true)}
          className="fixed bottom-6 right-6 bg-purple-600 text-white px-5 py-3 rounded-full shadow-lg hover:bg-purple-700 transition"
        >
          + Add Link
        </motion.button>
      </div>

      <DeleteContentModal
        open={deleteModalOpen}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        contentTitle={linkToDelete?.title || ""}
      />
    </div>
  );
}
