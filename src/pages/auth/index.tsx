import { ReactElement } from "react";
import { AuthLayout } from "@/layouts/auth-layout";
import AuthTabs from "@/features/auth/components/auth-tabs";
import { ThemeToggle } from "@/components/theme-toggle";
import { Navbar } from "@/components/navbar";

const AuthPage = () => {
  return (
    <>
      <Navbar>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </Navbar>
      <main className="container h-[calc(100vh-6rem)] flex justify-center items-center">
        <AuthTabs />
      </main>
    </>
  );
};

AuthPage.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default AuthPage;
