import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon, X, Menu as MenuIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";

interface MenuProps {
  links: {
    title: string;
    url: string;
    icon: LucideIcon;
  }[];
}

function Menu({ links }: MenuProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleCloseMenu = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    // Close the menu if user clicks outside of it
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        handleCloseMenu();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <div className="md:hidden fixed top-3 left-4 z-50">
        <Button variant="outline" size="icon" onClick={toggleMenu}>
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <MenuIcon className="h-6 w-6" />
          )}
          <span className="sr-only">Toggle menu</span>
        </Button>
      </div>

      <nav
        ref={menuRef}
        className={cn(
          "fixed flex flex-col gap-4 p-10 pt-20 w-3/4 inset-0 z-40 bg-background border-r border-border transition-transform transform",
          isOpen ? "translate-x-0" : "-translate-x-full", // Slide in/out effect
          "md:hidden" // Hide on medium and larger screens
        )}
      >
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
              onClick={handleCloseMenu}
            >
              <link.icon className="mr-4 h-6 w-6" />
              <span className="text-lg">{link.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sidebar menu for larger screens */}
      <aside className="hidden md:block sticky top-0 h-full pt-3">
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
    </>
  );
}

export default Menu;
