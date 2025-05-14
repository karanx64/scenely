export default function UserAvatar({ username }) {
  const initials = username ? username.slice(0, 2).toUpperCase() : "SC";

  return (
    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
      {initials}
    </div>
  );
}
