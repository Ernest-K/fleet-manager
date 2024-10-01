import React from "react";
import { Issue } from "@/features/issues/types";
import DetailRow from "@/components/detail-row";
import { CalendarIcon, Circle, CircleDot, FileWarning, Notebook, Pencil, UserRound } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import IssueDialog from "@/features/issues/components/issue-dialog";

type IssueCardProps = {
  issue: Issue;
};

function IssueCard({ issue }: IssueCardProps) {
  return (
    <div className="border-border border-[1px] rounded-lg p-6 flex flex-col justify-center gap-3 relative grow">
      <IssueDialog
        issue={issue}
        trigger={
          <Button variant="ghost" size="icon" className="absolute top-6 right-6">
            <Pencil className="h-4 w-4" />
          </Button>
        }
      />
      <div className="flex flex-col justify-evenly gap-3">
        {issue.createdByUser && (
          <div className="flex flex-col sm:flex-row gap-3 ">
            <DetailRow Icon={UserRound} label="Role" value={issue.createdByUser.role} />
            <div className="flex gap-3 ml-10 sm:ml-0">
              <DetailRow label="First name" value={issue.createdByUser.firstName} />
              <DetailRow label="Last name" value={issue.createdByUser.lastName} />
            </div>
          </div>
        )}
        <DetailRow Icon={FileWarning} label="Issue type" value={issue.type} />
        <DetailRow Icon={Circle} label="Severity" value={issue.severity} />
        <DetailRow Icon={CircleDot} label="Status" value={issue.status} />
        <DetailRow Icon={CalendarIcon} label="Reported at" value={format(issue.createdAt.toDate(), "PP - HH:mm")} />
        <DetailRow Icon={Notebook} label="Description" value={issue.description} />
      </div>
    </div>
  );
}

export default IssueCard;
