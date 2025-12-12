import type { ReactElement } from "react";

interface ButtonProps{
    variant:"Primary"|"Secondary";
    text:string;
    startIcon?:ReactElement;
    onClick?:()=>void;
    fullWidth?:boolean;
    loading?:boolean;
}

const variantClasses={
    "Primary":"bg-purple-600 text-white ",
    "Secondary":"bg-purple-200 text-purple-600"
}

const defaultStyles="px-4 py-2 rounded-md flex items-center justify-center gap-2 font-md";

export function Button({variant,text,startIcon,onClick,fullWidth,loading}:ButtonProps){
    return <button onClick={onClick} className={variantClasses[variant] + " bg-gradient-to-t from-fuchsia-500 to-purple-900 relative group "+ " "+defaultStyles + `${fullWidth ? " w-full" : ""} ${loading ? " opacity-45" : " cursor-pointer"}`} disabled={loading}>
        {startIcon}
        {text}
        <span className="absolute inset-x-0 bottom-px bg-gradient-to-r from-transparent via-black to-transparent h-px w-4/5 mx-auto"></span>
        <span className="absolute opacity-0 inset-x-0 group-hover:opacity-100 transition-opacity duration-300 bottom-px bg-gradient-to-r from-transparent via-black to-transparent h-[3px] w-4/5 mx-auto blur-sm"></span>
    </button>
}