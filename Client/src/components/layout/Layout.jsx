import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout({ children }) {
  return (
    <div className="flex bg-slate-100 dark:bg-slate-800 min-h-screen">
      <Sidebar />

      <main className="flex-1">
        <Header />
        {children}
      </main>
    </div>
  );
}

