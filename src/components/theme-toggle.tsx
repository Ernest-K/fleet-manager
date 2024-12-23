import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme}>
      {theme === "light" ? (
        <>
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all" />
        </>
      ) : (
        <>
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
        </>
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
