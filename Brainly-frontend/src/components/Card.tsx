import { ShareIcon } from "../icons/ShareIcon";
import { DeleteIcon } from "../icons/DeleteIcon";
import { DeleteContentModal } from "./DeleteContentModal";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import toast from "react-hot-toast";
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
    return <div key={id} className="bg-white max-w-80 min-h-60 max-h-140 p-4 rounded-md shadow-md border-gray-300 border">
            <div className="flex justify-between">
                <div className="text-md flex gap-4 items-center justify-center">
                    <ShareIcon/>
                    {title}
                </div>
                <div className="flex gap-2 items-center justify-center text-gray-500">
                    <a href={link} target="_blank">
                    <ShareIcon/>
                    </a>
                    <DeleteIcon onClick={handleDelete} />
                </div>
                
            </div>
            <div className="p-4">
            {type==="youtube" && (()=>{
                const embedUrl=getYouTubeEmbedUrl(link);
                return embedUrl ? (
                     <iframe
                    className="w-full rounded-md"
                    src={embedUrl}
                    title={title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
            />
                ) :(
                    <p className="text-red-500 text-sm">Invalid YouTube URL</p>
                );
            })()}
            {type==="twitter" &&
            <blockquote className="twitter-tweet  w-1/8 h-1/8"><a href={link.replace("x.com","twitter.com")}></a></blockquote> 
            }
            {type==="canva" &&(
                <iframe src={link.includes("?embed") ? link : link.endsWith("/view") ? `${link}?embed`:link} className="w-full h-96 rounded-md"
                allowFullScreen referrerPolicy="no-referrer"></iframe>
            )
            }
            {type==="Google Docs" &&(
                <iframe src={link.replace("edit","preview")} className="w-full h-96 rounded-md"
                allowFullScreen referrerPolicy="no-referrer"></iframe>
            )
            }
            {type==="Google Sheets" &&(
                <iframe src={link.replace("edit","preview")} className="w-full h-96 rounded-md"
                allowFullScreen referrerPolicy="no-referrer"></iframe>
            )
            }
            </div>
             {/* ✅ Render modal below the card */}
        <DeleteContentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmDelete}
        contentTitle={title}
      />
    </div>
}