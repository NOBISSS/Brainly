import { memo } from "react";
import LinkCard from "./LinkCard";

interface LinkGridProps {
    links: any[];
    loading: boolean;
    error: string | null;
    user: any;
    onDelete: (id: string, title: string) => void;
}

function LinkGrid({
    links,
    loading,
    error,
    user,
    onDelete,
}: LinkGridProps) {
    if (loading) {
        return (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 2xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, index) => (
                    <div
                        key={index}
                        className="h-[190px] animate-pulse rounded-2xl bg-gray-200"
                    />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-red-100 bg-red-50 p-6">
                <div className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-xl">
                        ⚠️
                    </div>
                    <p className="mt-3 font-medium text-red-700">
                        {error}
                    </p>
                </div>
            </div>
        );
    }

    if (!links.length) {
        return (
            <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white/60 p-6 sm:min-h-[360px] sm:p-8">
                <div className="max-w-sm text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-2xl">
                        🔗
                    </div>

                    <h3 className="mt-4 text-lg font-semibold text-gray-900">
                        No links yet
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-gray-500">
                        Save your first piece of content to start building your second brain.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 2xl:grid-cols-4">
            {links.map((item) => (
                <LinkCard
                    key={item._id}
                    link={item}
                    user={user}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}

export default memo(LinkGrid);