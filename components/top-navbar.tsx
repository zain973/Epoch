"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PenSquare, BookOpen } from "lucide-react";

export function TopNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/feed" className="flex items-center space-x-2 font-bold text-xl tracking-tight">
          <BookOpen className="h-5 w-5 text-primary" />
          <span>DevFeed</span>
        </Link>
        
        <nav className="flex items-center space-x-4">
          <Link href="/write" passHref>
            <Button size="sm" variant="default" className="gap-2">
              <PenSquare className="h-4 w-4" />
              Write a Post
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
