import { Sidebar } from "@/components/Sidebar";
import { getContentTree } from "@/lib/content";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tree = getContentTree();

  return (
    <div className="flex min-h-screen">
      <Sidebar tree={tree} />
      <main className="flex-1 overflow-x-hidden flex justify-center">
        {children}
      </main>
    </div>
  );
}
