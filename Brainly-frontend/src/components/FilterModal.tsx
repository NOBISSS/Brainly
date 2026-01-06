import { createPortal } from "react-dom";

interface FilterModalProps {
  open: boolean;
  onClose: () => void;
  categories: string[];
  selectedCategories: string[];
  onSelectedCategories: (cat: string) => void;
}

export default function FilterModal({
  open,
  onClose,
  categories,
  selectedCategories,
  onSelectedCategories,
}: FilterModalProps) {
  if (!open) return null;

  return createPortal(
    <>
      {/* backdrop */}
      <div
        className="fixed inset-0 z-[9998]"
        onClick={onClose}
      />

      {/* filter panel */}
      <div className="fixed z-[9999] top-24 right-6 bg-white rounded-xl shadow-xl w-64 p-4">
        <h2 className="font-semibold mb-3 text-gray-800">Filter by Category</h2>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {categories.map((cat) => (
            <label
              key={cat}
              className="flex items-center gap-2 text-sm cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={() => onSelectedCategories(cat)}
              />
              {cat}
            </label>
          ))}
        </div>
      </div>
    </>,
    document.body
  );
}
