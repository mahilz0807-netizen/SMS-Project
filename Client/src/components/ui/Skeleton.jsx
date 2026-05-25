export default function Skeleton({
  className = "",
  height = "h-24"
}) {
  return (
    <div
      className={`animate-pulse bg-slate-300 dark:bg-slate-700 rounded-2xl w-full ${height} ${className}`}
    />
  );
}