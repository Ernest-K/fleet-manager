import { ReactElement } from "react";
import { AuthLayout } from "@/layouts/auth-layout";
import AuthTabs from "@/features/auth/components/auth-tabs";

const AuthPage = () => {
  return (
    <main className="container min-h-[calc(100vh-6rem)] py-4 flex justify-center items-center">
      <AuthTabs />
    </main>
  );
};

AuthPage.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default AuthPage;
