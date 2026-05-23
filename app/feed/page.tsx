import { TopNavbar } from "@/components/top-navbar";
import { ArticleCard } from "@/components/article-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Layers } from "lucide-react";
import { ClassicalFeedArticle } from "@/types/blog";

async function getClassicalFeed(): Promise<ClassicalFeedArticle[]> {
  // Target your specialized global chronological endpoint directly
  const res = await fetch("http://localhost:8000/api/feed/classical", { 
    cache: "no-store", // Explicit cache bypass to surface real-time database state rows
    headers: {
      "Accept": "application/json",
    }
  });

  if (!res.ok) {
    throw new Error(`Failed to communicate with Express runtime layer. Status: ${res.status}`);
  }

  return res.json();
}

export default async function FeedPage() {
  let articles: ClassicalFeedArticle[] = [];
  let connectionFailure = false;

  try {
    articles = await getClassicalFeed();
  } catch (err) {
    console.error("RSC Fetch Error down link path:", err);
    connectionFailure = true;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col antialiased">
      <TopNavbar />
      
      <main className="flex-1 container mx-auto py-10 px-4 max-w-6xl">
        {/* Title Context Header */}
        <div className="flex items-start justify-between gap-4 border-b pb-6 mb-8">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-primary font-medium text-sm tracking-wider uppercase">
              <Layers className="h-4 w-4" />
              Track A Core System
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              Global Chronological Feed
            </h1>
            <p className="text-muted-foreground text-base">
              Displaying the latest publications unfiltered across database state arrays.
            </p>
          </div>
        </div>

        {/* Dynamic State Management UI Grid Section */}
        {connectionFailure ? (
          <Alert variant="destructive" className="border-destructive/30 bg-destructive/5">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="font-semibold">Backend Link Failure</AlertTitle>
            <AlertDescription className="text-sm opacity-90 mt-1">
              Could not reconcile network socket requests against <code className="bg-muted px-1 py-0.5 rounded text-xs">http://localhost:8000/api/feed/classical</code>. 
              Confirm your local Node/Express or FastAPI instance deployment is serving traffic concurrently on the specified port.
            </AlertDescription>
          </Alert>
        ) : articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-16 border rounded-xl border-dashed bg-muted/10">
            <p className="text-muted-foreground font-medium text-base mb-1">
              The classical wire timeline is empty.
            </p>
            <p className="text-sm text-muted-foreground/70">
              No articles match the querying status requirements at this moment.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((item) => (
              <ArticleCard key={item.id} article={item} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
