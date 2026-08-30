import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CrossIcon } from "../icons/CrossIcon";
import { Button } from "./Button";
import { Input } from "./Input";
import { detectLinkType } from "../utils/detectLinkType";
import { addLink } from "../redux/slices/linkSlice";
import { fetchWorkspaces } from "../redux/slices/workspaceSlice";
import type { AppDispatch, RootState } from "../redux/store";
import { LINK_TYPES as types } from "@/constants/frConstant";
import axios from "axios";
import { BACKEND_URL } from "../config";

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function CreateContentModalV2({
    open,
    onClose,
    onSuccess,
}: Props) {
    const dispatch = useDispatch<AppDispatch>();
    const nameRef = useRef<HTMLInputElement>(null);
    const workspaceRef = useRef<HTMLButtonElement>(null);
    const lastFetchedUrl = useRef<string | null>(null);
    const userEditedTitle = useRef(false);

    const selectedWorkspace = useSelector(
        (state: RootState) => state.workspaces.selected
    );

    const [workspaces, setWorkspaces] = useState<any[]>([]);
    const [workspace, setWorkspace] = useState("");
    const [type, setType] = useState("");
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const [thumbnail, setThumbnail] = useState("");
    const [thumbnailError, setThumbnailError] = useState(false);
    const [fetchingPreview, setFetchingPreview] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [autoType, setAutoType] = useState(false);

    const isValidUrl = (value: string) => {
        try {
            const parsed = new URL(value);
            return parsed.protocol === "http:" || parsed.protocol === "https:";
        } catch {
            return false;
        }
    };

    useEffect(() => {
        if (open && selectedWorkspace?._id) {
            setWorkspace(selectedWorkspace._id);
        }
    }, [open, selectedWorkspace]);

    useEffect(() => {
        if (!open) return;

        dispatch(fetchWorkspaces())
            .unwrap()
            .then((data) => setWorkspaces(data || []))
            .catch(() => toast.error("Failed to load workspaces"));
    }, [open, dispatch]);

    useEffect(() => {
        if (!open) return;

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape" && !submitting) {
                handleClose();
            }
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [open, submitting]);

    useEffect(() => {
        if (!open) return;

        const timer = setTimeout(() => {
            nameRef.current?.focus();
        }, 150);

        return () => clearTimeout(timer);
    }, [open]);

    useEffect(() => {
        if (!url || !isValidUrl(url)) return;

        const timer = setTimeout(async () => {
            if (lastFetchedUrl.current === url) return;

            lastFetchedUrl.current = url;
            setFetchingPreview(true);
            setThumbnailError(false);

            try {
                const response = await axios.get(
                    `${BACKEND_URL}api/links/preview?url=${encodeURIComponent(url)}`,
                    { withCredentials: true }
                );

                if (response.data?.title && !userEditedTitle.current) {
                    setTitle(response.data.title);
                }

                if (response.data?.thumbnail) {
                    setThumbnail(response.data.thumbnail);
                }
            } catch {
                lastFetchedUrl.current = null;
            } finally {
                setFetchingPreview(false);
            }
        }, 600);

        return () => clearTimeout(timer);
    }, [url]);

    const handleUrlChange = (value: string) => {
        setUrl(value);
        setTitle("");
        setThumbnail("");
        setThumbnailError(false);
        setAutoType(false);
        lastFetchedUrl.current = null;
        userEditedTitle.current = false;

        const detected = detectLinkType(value);

        if (detected && detected !== "unknown") {
            setType(detected);
            setAutoType(true);
        } else {
            setType("");
        }
    };

    const handleCreate = async () => {
        if (!workspace) {
            toast.error("Please select a workspace");
            workspaceRef.current?.focus();
            return;
        }

        if (!url.trim()) {
            toast.error("Please enter a link");
            return;
        }

        if (!isValidUrl(url)) {
            toast.error("Please enter a valid URL");
            return;
        }

        if (submitting) return;

        try {
            setSubmitting(true);

            const detected = detectLinkType(url);
            const contentType = type || detected || "unknown";

            await dispatch(
                addLink({
                    title: title.trim() || "Untitled",
                    url: url.trim(),
                    category: contentType.toUpperCase(),
                    workspace,
                })
            ).unwrap();

            toast.success("Link created successfully");
            onSuccess();
            handleClose();
        } catch (error: any) {
            toast.error(
                error?.message || "Failed to create link"
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        if (submitting) return;

        setUrl("");
        setTitle("");
        setThumbnail("");
        setThumbnailError(false);
        setWorkspace(selectedWorkspace?._id || "");
        setType("");
        setAutoType(false);
        setFetchingPreview(false);
        setSubmitting(false);
        lastFetchedUrl.current = null;
        userEditedTitle.current = false;

        onClose();
    };

    if (!open) return null;

    const canSubmit =
        Boolean(workspace && url.trim() && isValidUrl(url)) &&
        !submitting;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-3 backdrop-blur-sm sm:p-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleClose}
            >
                <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.97 }}
                    onClick={(e) => e.stopPropagation()}
                    className="flex max-h-[94vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
                >
                    <div className="flex shrink-0 items-start justify-between border-b border-gray-100 p-4 sm:p-5">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
                                Add Link
                            </h2>
                            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                                Save content to your workspace
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={submitting}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
                        >
                            <CrossIcon />
                        </button>
                    </div>

                    <div className="overflow-y-auto p-4 sm:p-5">
                        <div className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-700">
                                    Link
                                </label>

                                <Input
                                    value={url}
                                    placeholder="https://example.com"
                                    onChange={(e) =>
                                        handleUrlChange(e.target.value)
                                    }
                                />

                                {url && !isValidUrl(url) && (
                                    <p className="text-xs text-red-500">
                                        Enter a valid HTTP or HTTPS URL.
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-700">
                                    Content type
                                </label>

                                <Select
                                    value={type}
                                    onValueChange={(value) => {
                                        setType(value);
                                        setAutoType(false);
                                    }}
                                >
                                    <SelectTrigger className="w-full bg-gray-50">
                                        <SelectValue placeholder="Select content type" />
                                    </SelectTrigger>

                                    <SelectContent
                                        position="popper"
                                        side="bottom"
                                        align="start"
                                        sideOffset={5}
                                        className="z-[200] max-h-60 w-[var(--radix-select-trigger-width)] overflow-y-auto bg-white"
                                    >
                                        <SelectGroup>
                                            <SelectLabel className="px-3 py-2 text-xs uppercase tracking-wide text-gray-400">
                                                Types
                                            </SelectLabel>

                                            {types.map((item, index) => (
                                                <SelectItem
                                                    key={`${item}-${index}`}
                                                    value={item}
                                                    className="cursor-pointer capitalize"
                                                >
                                                    {item}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>

                                {autoType && (
                                    <p className="text-xs text-purple-600">
                                        ✨ Type detected automatically
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-700">
                                    Workspace
                                </label>

                                <Select
                                    value={workspace}
                                    onValueChange={setWorkspace}
                                >
                                    <SelectTrigger
                                        ref={workspaceRef}
                                        className={`w-full ${
                                            workspace
                                                ? "bg-gray-50"
                                                : "border-red-300 bg-red-50"
                                        }`}
                                    >
                                        <SelectValue placeholder="Select a workspace" />
                                    </SelectTrigger>

                                    <SelectContent
                                        position="popper"
                                        side="bottom"
                                        align="start"
                                        sideOffset={5}
                                        className="z-[200] max-h-60 w-[var(--radix-select-trigger-width)] overflow-y-auto bg-white"
                                    >
                                        <SelectGroup>
                                            <SelectLabel className="px-3 py-2 text-xs uppercase tracking-wide text-gray-400">
                                                Workspaces
                                            </SelectLabel>

                                            {workspaces.length === 0 ? (
                                                <div className="px-3 py-4 text-center text-sm text-gray-400">
                                                    No workspaces found
                                                </div>
                                            ) : (
                                                workspaces.map((item) => (
                                                    <SelectItem
                                                        key={item._id}
                                                        value={item._id}
                                                        className="cursor-pointer"
                                                    >
                                                        {item.name}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-700">
                                    Title
                                </label>

                                <Input
                                    value={title}
                                    placeholder="Title will be generated automatically"
                                    onChange={(e) => {
                                        userEditedTitle.current = true;
                                        setTitle(e.target.value);
                                    }}
                                />
                            </div>

                            {fetchingPreview && (
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
                                    Fetching preview...
                                </div>
                            )}

                            {thumbnail && !thumbnailError && (
                                <div className="relative h-44 overflow-hidden rounded-2xl bg-gray-900 sm:h-52">
                                    <img
                                        src={thumbnail}
                                        alt=""
                                        onError={() =>
                                            setThumbnailError(true)
                                        }
                                        className="absolute inset-0 h-full w-full object-cover"
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                                    <div className="relative flex h-full flex-col justify-end p-4">
                                        <h3 className="line-clamp-2 text-lg font-semibold text-white">
                                            {title || "Untitled"}
                                        </h3>

                                        <p className="mt-1 truncate text-xs text-white/70">
                                            {url}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <Button
                                onClick={handleCreate}
                                variant="Primary"
                                text={
                                    submitting
                                        ? "Saving..."
                                        : "Save Link"
                                }
                                fullWidth
                                disabled={!canSubmit}
                            />
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}