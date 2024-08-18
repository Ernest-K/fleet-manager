import { ReactElement } from "react";
import { AuthLayout } from "@/layouts/auth-layout";
import AuthTabs from "@/features/auth/components/auth-tabs";

const AuthPage = () => {
  return (
    <>
      <AuthTabs />
    </>
  );
};

AuthPage.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default AuthPage;
