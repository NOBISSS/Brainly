import { motion } from "framer-motion";
import { MdDelete } from "react-icons/md";
import { DEFAULT_LOGO } from "@/constants/frConstant";
import { getCategoryIcon } from "@/utils/getCategoryIcon";

interface Props {
  link: any;
  onDelete: (id: string, title: string) => void;
}

export function LinkCard({ link, onDelete }: Props) {
  const { _id, title, url, thumbnail, createdBy, category } = link;

  const { icon, bg } = getLinkIcon(category);

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      initial={{ y: -10, scale: 0.9 }}
      animate={{ y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 300 }}
      style={thumbnail ? { backgroundImage: `url(${thumbnail})` } : undefined}
      className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-lg bg-cover bg-center relative"
    >
      <div className="absolute inset-0 bg-black/70 rounded-3xl" />

      <div className="flex justify-between">
        <h2 className="relative text-white font-medium">{title}</h2>

        <MdDelete
          className="relative text-red-400 cursor-pointer"
          onClick={() => onDelete(_id, title)}
        />
      </div>

      <p className="relative text-gray-200 text-sm truncate">{url}</p>

      <div className="flex justify-between mt-4">
        <a href={url} target="_blank" className="text-purple-200">
          Open →
        </a>

        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bg}`}>
            {icon}
          </div>

          {createdBy && (
            <img
              src={createdBy.avatar || DEFAULT_LOGO}
              className="w-10 h-10 rounded-full object-cover"
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}
