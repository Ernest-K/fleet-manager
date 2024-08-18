import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

interface MenuProps {
  links: {
    title: string;
    url: string;
    icon: LucideIcon;
  }[];
}

function Menu({ links }: MenuProps) {
  const router = useRouter();

  return (
    <aside className="sticky top-0 h-full pt-3">
      <nav className="flex flex-col gap-3">
        {links.map((link, index) => {
          const variant = router.pathname == link.url ? "default" : "ghost";
          return (
            <Link
              key={index}
              href={link.url}
              className={cn(
                buttonVariants({ variant: variant, size: "sm" }),
                variant === "default" &&
                  "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                "justify-start"
              )}
            >
              <link.icon className="mr-2 h-6 w-6" />
              <span>{link.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export default Menu;
