import {
  Youtube,
  Twitter,
  Palette,
  FileText,
  Sheet,
  File,
} from "lucide-react";

export const getCategoryIcon = (category?: string) => {
  const iconClass = "w-5 h-5 text-white";

  const map: Record<string, { icon: JSX.Element; bg: string }> = {
    YOUTUBE: {
      icon: <Youtube className={iconClass} />,
      bg: "bg-red-600",
    },
    TWITTER: {
      icon: <Twitter className={iconClass} />,
      bg: "bg-sky-500",
    },
    CANVA: {
      icon: <Palette className={iconClass} />,
      bg: "bg-purple-600",
    },
    "Google Docs": {
      icon: <FileText className={iconClass} />,
      bg: "bg-blue-600",
    },
    "Google Sheets": {
      icon: <Sheet className={iconClass} />,
      bg: "bg-green-600",
    },
    "PDF/Word File": {
      icon: <File className={iconClass} />,
      bg: "bg-orange-600",
    },
  };

  return map[category || "youtube"] || {
    icon: <File className={iconClass} />,
    bg: "bg-gray-600",
  };
};
