import DashboardContentHeader from "@/components/dashboard-content-header";
import SkeletonTable from "@/components/skeleton-table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import IssueDialog from "@/features/issues/components/issue-dialog";
import IssuesTable from "@/features/issues/components/issues-table";
import { useGetIssuesByManagerUid } from "@/features/issues/hooks/useGetIssues";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { useAuth } from "@/providers/auth-provider";
import { TriangleAlert } from "lucide-react";
import { ReactElement } from "react";

const IssuesPage = () => {
  const { authUser } = useAuth();
  const { data: issues, isLoading } = useGetIssuesByManagerUid(authUser!.uid);

  return (
    <>
      <DashboardContentHeader title="Issues">
        <IssueDialog
          trigger={
            <Button>
              <TriangleAlert className="sm:mr-2 h-5 w-5" />
              <span className="hidden sm:block">Report an issue</span>
            </Button>
          }
        />
      </DashboardContentHeader>
      <Separator />
      <section className="py-6">{isLoading ? <SkeletonTable /> : <IssuesTable issues={issues} />}</section>
    </>
  );
};

IssuesPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default IssuesPage;
