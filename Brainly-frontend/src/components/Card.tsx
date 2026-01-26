
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { deleteLink } from "../redux/slices/linkSlice";
interface CardProps{
    title:string;
    link:string;
    type:"twitter" | "youtube";
    id:string;
    onDeleted:()=>void;
}
export function Card({title,link,type,id,onDeleted}:CardProps){
    const dispatch=useDispatch();
    const [modalOpen,setModalOpen]=useState(false);

    useEffect(()=>{
        if(type==="twitter" && window.twttr && window.twttr.widgets){
            window.twttr.widgets.load();
        }
    },[link,type])

    function getYouTubeEmbedUrl(url: string) {
        try {
            const youtubeRegex =
            /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
            const match = url.match(youtubeRegex);
                if (match && match[1]) {
                    return `https://www.youtube.com/embed/${match[1]}`;
                }
        } catch (err) {
            console.error("Invalid YouTube URL:", url);
        }
        
        return null;
    }
    const handleDelete=()=>{
        setModalOpen(true);//show Modal
    }
    const handleConfirmDelete=async()=>{
        dispatch(deleteLink(id));
    }
    return <motion.div
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
                  {createdBy && <div className="relative group flex items-center">
                    <img
                      src={createdBy.avatar || DEFAULT_LOGO}
                      alt={createdBy.name}
                      className="w-10 h-10 rounded-full border bg-center bg-clip-content object-center object-cover"
                    />
                    <div className="absolute bottom-full mb-1 hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded">
                      {createdBy.name}
                    </div>
                  </div>
                  }
                </div>
              </motion.div>
}