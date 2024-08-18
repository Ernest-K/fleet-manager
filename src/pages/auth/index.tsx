import { ReactElement } from "react";
import { AuthLayout } from "@/layouts/auth-layout";
import AuthTabs from "@/features/auth/components/auth-tabs";
import { ThemeToggle } from "@/components/theme-toggle";

const AuthPage = () => {
  return (
    <>
      <nav className="container flex justify-end py-8">
        <ThemeToggle />
      </nav>
      <main className="container h-[calc(100vh-10rem)] flex justify-center items-center">
        <AuthTabs />
      </main>
    </>
  );
};

AuthPage.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default AuthPage;
