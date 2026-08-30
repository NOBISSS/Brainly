import type { ReactElement } from "react";

interface ButtonProps {
    variant: "Primary" | "Secondary";
    text: string;
    startIcon?: ReactElement;
    onClick?: () => void;
    fullWidth?: boolean;
    loading?: boolean;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
}

const variantClasses = {
    Primary: "bg-gradient-to-t from-fuchsia-500 to-purple-700 text-white hover:from-fuchsia-600 hover:to-purple-800",
    Secondary: "bg-purple-100 text-purple-700 hover:bg-purple-200",
};

export function Button({
    variant,
    text,
    startIcon,
    onClick,
    fullWidth = false,
    loading = false,
    disabled = false,
    type = "button",
}: ButtonProps) {
    const isDisabled = loading || disabled;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isDisabled}
            className={`group relative inline-flex min-w-0 items-center justify-center gap-1.5 overflow-hidden rounded-xl px-3 py-2 text-xs font-medium whitespace-nowrap shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-purple-400/50 disabled:pointer-events-none disabled:opacity-50 sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm ${variantClasses[variant]} ${fullWidth ? "w-full" : ""}`}
        >
            {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            ) : (
                startIcon && <span className="shrink-0">{startIcon}</span>
            )}

            <span className="truncate">
                {loading ? "Loading..." : text}
            </span>

            <span className="absolute bottom-0 left-1/2 h-px w-4/5 -translate-x-1/2 bg-gradient-to-r from-transparent via-black/40 to-transparent" />

            <span className="absolute bottom-0 left-1/2 h-[3px] w-4/5 -translate-x-1/2 bg-gradient-to-r from-transparent via-black/40 to-transparent opacity-0 blur-sm transition-opacity duration-300 group-hover:opacity-100" />
        </button>
    );
}