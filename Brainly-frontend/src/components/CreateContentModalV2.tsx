import { CrossIcon } from "../icons/CrossIcon";
import { Button } from "./Button";
import { Input } from "./Input";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { detectLinkType } from "../utils/detectLinkType";
import { useDispatch } from "react-redux";
import { addLink } from "../redux/slices/linkSlice";
import { fetchWorkspaces as FetchWorkspacesThunk } from "../redux/slices/workspaceSlice";
import axios from "axios";
import { BACKEND_URL } from "../config";
import type { HiOutlineClipboardDocumentList } from "react-icons/hi2";

interface CreateContentModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function CreateContentModalV2({
    open,
    onClose,
    onSuccess,
}: CreateContentModalProps) {
    const types = [
        "youtube",
        "twitter",
        "canva",
        "Google Docs",
        "Google Sheets",
        "PDF/Word File",
    ];

    const lastFetchedUrlRef=useRef<string | null>(null);
    const [isAutoType,setIsAutoType]=useState(false);
    const [isFetchingOG, setIsFetchingOG] = useState(false);
    const [thumbnail, setThumbnail] = useState<string | null>(null);
    const [workspace, setWorkspaces] = useState<any[]>([]);
    const [selectedWorkspace, setSelectedWorkspace] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [title, setTitle] = useState("");
    const [link, setLink] = useState("");
    const typeRef = useRef<HTMLSelectElement>(null);
    const workspaceRef = useRef<HTMLSelectElement>(null);
    const dispatch = useDispatch();

    const fetchOGPreview = async (url: string) => {
        console.log("CALLED");
        if (!url) return;

        //prevent duplicate calling
        if(lastFetchedUrlRef.current===url){
            console.log("OG Already Fetched for this URL");
            return;
        }

        lastFetchedUrlRef.current=url;
        setIsFetchingOG(true);

        try {
            const res = await axios.get(BACKEND_URL + `api/links/preview?url=${url}`,{withCredentials:true});
            console.log(res);
            if (res.data.title && !title) setTitle(res.data.title);
            if (res.data.thumbnail && !thumbnail) setThumbnail(res.data.thumbnail);
        } catch (error) {
            console.log(error);
            console.log("OG FETCH FAILED");
            lastFetchedUrlRef.current=null;
        } finally {
            setIsFetchingOG(false);
        }
    }

    const handleLinkChange = (
        value: string
    ) => {
        if (!value) return;

        const detectedType = detectLinkType(value);
        if (detectedType && detectedType !== "unknown") {
            setSelectedType(detectedType);
            setIsAutoType(true);
        }
    };


    //   const createLink = () => {
    //   const title = titleRef.current?.value;
    //   const link = linkRef.current?.value;
    //   const type = selectedType || detectLinkType(link || "");
    //   const workspaceId = selectedWorkspace;

    //   if (!title || !link || !type || !workspaceId) {
    //     toast.error("Please fill all required details");
    //     return;
    //   }

    //   dispatch(
    //     addLink({
    //       title,
    //       url: link,
    //       category: type,
    //       workspace: workspaceId,
    //     })
    //   );

    //   toast.success("Link created successfully");
    //   onSuccess?.();
    //   onClose();
    // };
    const createLink = () => {

        if (!link || !selectedWorkspace) {
            console.log(link, selectedWorkspace);
            toast.error("Please Fill All Required Details")
            return;
        }

        const type = selectedType || detectLinkType(link);

        dispatch(
            addLink({
                title: title || "Untitled",
                url: link,
                category: type,
                workspace: selectedWorkspace
            })
        )

        toast.success("Link Created Successfully");
        onSuccess?.();
        onClose();
    }


    useEffect(() => {
        if (!open) return;
        const fetchWorkspaces = async () => {
            try {
                const workspacesData = await dispatch(FetchWorkspacesThunk()).unwrap();
                console.log(workspacesData)
                setWorkspaces(workspacesData);
            } catch (error) {
                console.log("Failed to Fetch Workspaces", error);
            }
        };
        fetchWorkspaces();
        //setWorkspaces(workspacesData || []);
    }, [open, dispatch]);

    if (!open) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 z-40 backdrop-blur-sm bg-black/30"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                <div className="w-full max-w-md bg-white p-5 sm:p-6 rounded-2xl shadow-lg relative">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-xl sm:text-2xl font-bold text-purple-700">
                            Add Link
                        </h1>
                        <button onClick={onClose} className="cursor-pointer">
                            <CrossIcon />
                        </button>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-3 flex flex-col">
                        <Input value={title} placeholder="Title (auto later)"
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <Input value={link} placeholder="Paste Link here"
                            onChange={(e) => {
                                const value = e.target.value;
                                setLink(value)
                                handleLinkChange(value)
                                if(value!==lastFetchedUrlRef.current){
                                    setThumbnail(null);
                                }
                                setIsAutoType(false);
                            }}
                            onBlur={() => fetchOGPreview(link)}
                        />

                        {/* Type Selection */}
                        <select
                            ref={typeRef}
                            className="border p-2 rounded w-full text-sm sm:text-base"
                            value={selectedType}
                            onChange={(e) => {setSelectedType(e.target.value)
                                setIsAutoType(false);
                            }}
                        >
                            <option value="">Select Type</option>
                            {types.map((type, index) => (
                                <option key={index} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                        {isAutoType && (
                            <p className="text-xs text-gray-400">
                                Type Detected Automatially - You can change it
                            </p>
                        )}
                        {/* Workspace Selection */}
                        <select
                            ref={workspaceRef}
                            className="border p-2 rounded w-full text-sm sm:text-base"
                            value={selectedWorkspace}
                            onChange={(e) => setSelectedWorkspace(e.target.value)}
                        >
                            <option value="">Select Workspace</option>
                            {workspace.map((ws: any) => (
                                <option key={ws._id} value={ws._id}>
                                    {ws.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/*PREVIEW*/}
                    {isFetchingOG && (
                        <p className="text-sm text-gray-500 mt-2">Fetching Preview</p>
                    )}
                    {
                        thumbnail && (
                            <div className="flex gap-3 border rounded-lg p-2 mt-2">
                                <img
                                    src={thumbnail}
                                    className="w-16 h-16 object-cover rounded"
                                    alt="preview"
                                />
                                <div>
                                    <p className="font-semibold line-clamp-2">{title}</p>
                                    <p className="text-xs text-gray-400 uppercase">{selectedType}</p>
                                </div>
                            </div>
                        )
                    }
                    {/* Submit Button */}
                    <div className="flex justify-center mt-5">
                        <Button
                            onClick={createLink}
                            variant="Primary"
                            text="Submit"
                            fullWidth={true}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
