import { useState } from "react";
import { Button } from "@/components/Button";
import { PlusIcon } from "@/icons/PlusIcon";
import { Menu } from "lucide-react";
import {
  MdArrowDropDown,
  MdArrowDropUp,
} from "react-icons/md";

interface Props {
  workspace: any;
  categories: string[];
  selectedCategories: string[];
  onToggleCategory: (cat: string) => void;
  onOpenSidebar: () => void;
  onAddLink: () => void;
  onCreateWorkspace: () => void;
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
  const [showFilter, setShowFilter] =
    useState(false);

  const clearFilters = () => {
    selectedCategories.forEach(
      (category) =>
        onToggleCategory(category)
    );
  };

  return (
    <header className="mb-5 w-full sm:mb-7">
      <div className="
                flex
                w-full
                flex-col
                gap-4
                rounded-2xl
                bg-white/70
                p-3
                shadow-sm
                ring-1
                ring-black/5
                backdrop-blur-sm
                sm:p-4
                lg:bg-transparent
                lg:p-0
                lg:shadow-none
                lg:ring-0
                lg:backdrop-blur-none
            ">
        <div className="
                    flex
                    w-full
                    items-start
                    justify-between
                    gap-3
                ">
          <div className="
                        flex
                        min-w-0
                        flex-1
                        items-start
                        gap-2
                        sm:gap-3
                    ">
            <button
              type="button"
              aria-label="Open sidebar"
              onClick={onOpenSidebar}
              className="
                                mt-0.5
                                flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                border
                                border-gray-200
                                bg-white
                                text-gray-700
                                shadow-sm
                                transition
                                hover:bg-gray-50
                                md:hidden
                            "
            >
              <Menu size={20} />
            </button>

            <div className="min-w-0 flex-1">
              <h1 className="
                                truncate
                                text-xl
                                font-semibold
                                tracking-tight
                                text-gray-900
                                sm:text-2xl
                                lg:text-3xl
                            ">
                {workspace
                  ? workspace.name
                  : "Select a Workspace"}
              </h1>

              {workspace?.description && (
                <p className="
                                    mt-1
                                    line-clamp-2
                                    max-w-2xl
                                    text-xs
                                    leading-5
                                    text-gray-500
                                    sm:text-sm
                                    sm:leading-6
                                ">
                  {workspace.description}
                </p>
              )}
            </div>
          </div>

          <div className="
                        flex
                        shrink-0
                        items-center
                        gap-2
                    ">
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

        {workspace &&
          categories.length > 1 && (
            <div className="
                            flex
                            w-full
                            min-w-0
                            flex-col
                            gap-3
                        ">
              <div className="
                                flex
                                items-center
                                gap-2
                            ">
                <button
                  type="button"
                  onClick={() =>
                    setShowFilter(
                      (previous) =>
                        !previous
                    )
                  }
                  className="
                                        flex
                                        h-9
                                        shrink-0
                                        items-center
                                        gap-1.5
                                        rounded-lg
                                        bg-gray-900
                                        px-3
                                        text-xs
                                        font-medium
                                        text-white
                                        transition
                                        hover:bg-gray-800
                                        sm:text-sm
                                    "
                >
                  Filter

                  {showFilter ? (
                    <MdArrowDropUp
                      size={20}
                    />
                  ) : (
                    <MdArrowDropDown
                      size={20}
                    />
                  )}
                </button>

                {selectedCategories.length >
                  0 && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="
                                            shrink-0
                                            text-xs
                                            font-medium
                                            text-purple-600
                                            transition
                                            hover:text-purple-700
                                        "
                    >
                      Clear filters
                    </button>
                  )}
              </div>

              {showFilter && (
                <div className="
                                    flex
                                    w-full
                                    max-w-full
                                    gap-2
                                    overflow-x-auto
                                    pb-1
                                    [scrollbar-width:none]
                                    [&::-webkit-scrollbar]:hidden
                                ">
                  {categories.map(
                    (category) => {
                      const active =
                        selectedCategories.includes(
                          category
                        );

                      return (
                        <button
                          key={
                            category
                          }
                          type="button"
                          onClick={() =>
                            onToggleCategory(
                              category
                            )
                          }
                          className={`
                                                        shrink-0
                                                        rounded-full
                                                        px-3
                                                        py-1.5
                                                        text-xs
                                                        font-medium
                                                        capitalize
                                                        transition
                                                        sm:px-4
                                                        sm:text-sm
                                                        ${active
                              ? "bg-purple-600 text-white shadow-sm"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }
                                                    `}
                        >
                          {
                            category
                          }
                        </button>
                      );
                    }
                  )}
                </div>
              )}
            </div>
          )}
      </div>
    </header>
  );
}