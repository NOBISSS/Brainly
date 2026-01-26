import { motion } from "framer-motion";
import { MdDelete } from "react-icons/md";
import { DEFAULT_LOGO } from "@/constants/frConstant";
import { getCategoryIcon } from "@/utils/getCategoryIcon";

interface Props {
  link: any;
  user: any;
  onDelete: (id: string, title: string) => void;
}

export function LinkCard({ link, user, onDelete }: Props) {
  const { url, title, thumbnail, _id, createdBy, category } = link;

  const { icon, bg } = getCategoryIcon(category);

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      initial={{ y: -10, scale: 0.9 }}
      animate={{ y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={thumbnail ? { backgroundImage: `url(${thumbnail})` } : undefined}
      className="bg-white p-5 flex flex-col justify-evenly rounded-2xl shadow-sm hover:shadow-lg bg-cover bg-center relative"
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70 rounded-3xl" />

      {/* Title + delete */}
      <div className="flex justify-between relative">
        <h2 className="font-medium text-lg text-white mb-2">
          {title}
        </h2>

        <MdDelete
          className="text-red-400 text-xl cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(_id, title);
          }}
        />
      </div>

      {/* URL */}
      <p className="relative text-sm text-gray-200 truncate">{url}</p>

      {/* Footer */}
      <div className="mt-4 flex justify-between relative">

        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="text-purple-200 font-medium hover:text-white"
        >
          Open Link →
        </a>

        {createdBy && (
          <div className="relative group">

            <img
              src={createdBy.avatar || DEFAULT_LOGO}
              className="w-10 h-10 rounded-full object-cover border"
            />

            {/* Category icon overlay */}
            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center ${bg}`}>
              {icon}
            </div>

            {/* Tooltip */}
            <div className="absolute bottom-full mb-1 hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded">
              {createdBy.name === user.name ? "ME" : createdBy.name}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
