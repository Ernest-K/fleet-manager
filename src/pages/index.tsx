import { Button } from "@/components/ui/button";
import RootLayout from "@/layouts/root-layout";
import Link from "next/link";

export default function LandingPage() {
  return (
    <RootLayout>
      <main className="min-h-screen flex flex-col justify-center items-center">
        <h1 className="text-3xl font-medium mb-8">Fleet Manager</h1>
        <Button asChild>
          <Link href="/auth">Get started</Link>
        </Button>
      </main>
    </RootLayout>
  );
}
