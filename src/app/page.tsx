import { Terminal } from "@/components/terminal/Terminal";
import { SeoContent } from "@/components/seo/SeoContent";
import { DataProvider } from "@/contexts/DataContext";

export default function Home() {
  return (
    <main>
      <SeoContent />
      <DataProvider>
        <Terminal />
      </DataProvider>
    </main>
  );
}
