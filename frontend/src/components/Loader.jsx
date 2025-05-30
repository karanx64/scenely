export default function Loader({ type = "spinner", size = "md" }) {
  const sizeClass =
    size === "sm" ? "w-6 h-6" : size === "lg" ? "w-12 h-12" : "w-8 h-8";

  if (type === "spinner") {
    return (
      <div
        className={`animate-spin rounded-full border-4 border-primary border-t-transparent ${sizeClass}`}
      ></div>
    );
  }

  if (type === "skeleton") {
    return (
      <div className={`bg-base-300 animate-pulse rounded ${sizeClass}`}></div>
    );
  }

  return null;
}
