import { ReactElement } from "react";
import { AuthLayout } from "@/layouts/auth-layout";

const AuthPage = () => {
  return <h1>Hello</h1>;
};

AuthPage.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default AuthPage;
