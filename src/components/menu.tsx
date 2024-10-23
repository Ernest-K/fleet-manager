import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { LucideIcon, X, Menu as MenuIcon } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
          {isOpen ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          <span className="sr-only">Toggle menu</span>
        </Button>
      </div>

      <nav
        ref={menuRef}
        className={cn(
          "fixed flex flex-col gap-3 p-8 pt-20 w-2/3 inset-0 z-40 bg-background border-r border-border transition-transform transform",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:hidden"
        )}
      >
        {links.map((link, index) => {
          const variant = router.pathname == link.url ? "secondary" : "ghost";
          return (
            <Link
              key={index}
              href={link.url}
              className={cn(
                buttonVariants({ variant: variant, size: "sm" }),
                variant === "secondary" && "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                "justify-start py-5"
              )}
              onClick={handleCloseMenu}
            >
              <link.icon className="mr-4 h-6 w-6 flex-shrink-0" />
              <span className="text-lg font-normal">{link.title}</span>
            </Link>
          );
        })}
      </nav>

      <aside className="hidden md:block sticky top-0 h-full pt-3">
        <nav className="flex flex-col gap-3">
          {links.map((link, index) => {
            const variant = router.pathname == link.url ? "secondary" : "ghost";
            return (
              <Link
                key={index}
                href={link.url}
                className={cn(
                  buttonVariants({ variant: variant, size: "default" }),
                  variant === "secondary" && "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                  "justify-start min-w-48"
                )}
              >
                <link.icon className="mr-4 h-6 w-6" />
                <span className="text-base font-normal">{link.title}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

export default Menu;
