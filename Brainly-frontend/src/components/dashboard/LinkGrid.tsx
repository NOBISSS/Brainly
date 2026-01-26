import { LinkCard } from "./LinkCard";

export function LinkGrid({ links, loading, error, onDelete, user }) {
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="grid grid-cols-3 gap-6">
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
