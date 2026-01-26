import { Button } from "@/components/Button";
import { PlusIcon } from "@/icons/PlusIcon";
import { Menu } from "lucide-react";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import { useState } from "react";

interface Props {
  workspace: any;

  categories: string[];
  selectedCategories: string[];

  onToggleCategory: (cat: string) => void;

  onOpenSidebar: () => void;
  onAddLink: () => void;
  onCreateWorkspace: () => void; // ✅ ADDED BACK
}

export function DashboardHeader({
  workspace,
  categories,
  selectedCategories,
  onToggleCategory,
  onOpenSidebar,
  onAddLink,
  onCreateWorkspace,
}: Props) {
  const [showFilter, setShowFilter] = useState(false);

  return (
    <div className="mb-8 flex flex-col gap-4">

      {/* ---------------- Top Row ---------------- */}
      <div className="flex justify-between items-center">

        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            className="md:hidden p-2 rounded-full border bg-white shadow-sm"
            onClick={onOpenSidebar}
          >
            <Menu size={20} />
          </button>

          <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
            {workspace ? workspace.name : "Select a Workspace"}
          </h1>
        </div>

        {/* Right buttons */}
        <div className="flex gap-3">
          <Button
            onClick={onAddLink}
            variant="Primary"
            text="Add Content"
            startIcon={<PlusIcon />}
          />

          <Button
            onClick={onCreateWorkspace}
            variant="Primary"
            text="Create Workspace"
            startIcon={<PlusIcon />}
          />
        </div>
      </div>

      {/* ---------------- Filter Row ---------------- */}
      {workspace && categories.length > 1 && (
        <div className="flex items-center gap-3 flex-wrap">

          <button
            onClick={() => setShowFilter((p) => !p)}
            className="flex items-center gap-2 px-3 py-1 rounded-md bg-black text-white text-sm"
          >
            Select Category
            {showFilter ? <MdArrowDropUp /> : <MdArrowDropDown />}
          </button>

          {showFilter &&
            categories.map((cat) => {
              const active = selectedCategories.includes(cat);

              return (
                <button
                  key={cat}
                  onClick={() => onToggleCategory(cat)}
                  className={`
                    px-3 py-1 rounded-full text-xs capitalize transition
                    ${active
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"}
                  `}
                >
                  {cat}
                </button>
              );
            })}
        </div>
      )}
    </div>
  );
}
