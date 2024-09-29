import DashboardContentHeader from "@/components/dashboard-content-header";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import CreateIssueDialog from "@/features/issues/components/create-issue-dialog";
import IssuesTable from "@/features/issues/components/issues-table";
import { useGetIssues } from "@/features/issues/hooks/useGetIssues";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { useAuth } from "@/providers/auth-provider";
import { TriangleAlert } from "lucide-react";
import { ReactElement } from "react";

const IssuesPage = () => {
  const { authUser } = useAuth();
  // const { data, isLoading } = useGetIssues({ managerUid: authUser!.uid });

  // console.log(data);

  return (
    <>
      <DashboardContentHeader title="Issues">
        <CreateIssueDialog
          trigger={
            <Button>
              <TriangleAlert className="sm:mr-2 h-5 w-5" />
              <span className="hidden sm:block">Report an issue</span>
            </Button>
          }
        />
      </DashboardContentHeader>
      <Separator />
      <section className="py-6">
        <IssuesTable />
      </section>
    </>
  );
};

IssuesPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default IssuesPage;
