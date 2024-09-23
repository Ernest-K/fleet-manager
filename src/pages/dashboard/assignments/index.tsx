import DashboardContentHeader from "@/components/dashboard-content-header";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import AssignmentTable from "@/features/assignments/components/assignments-table";
import CreateAssignmentDialog from "@/features/assignments/components/create-assignment-dialog";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { Plus } from "lucide-react";
import { ReactElement } from "react";

const AssignmentsPage = () => {
  return (
    <>
      <DashboardContentHeader title="Assignments">
        <CreateAssignmentDialog
          trigger={
            <Button>
              <Plus className="sm:mr-2 h-5 w-5" />
              <span className="hidden sm:block">Add assignment</span>
            </Button>
          }
        />
      </DashboardContentHeader>
      <Separator />
      <section className="py-6">
        <AssignmentTable />
      </section>
    </>
  );
};

AssignmentsPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default AssignmentsPage;
