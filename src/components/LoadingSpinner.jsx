export default function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-slate-300">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-accent" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
