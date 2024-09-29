import React from "react";
import { Issue } from "@/features/issues/types";
import DetailRow from "@/components/detail-row";
import { CalendarIcon, Circle, CircleDot, Notebook, UserRound } from "lucide-react";
import { format } from "date-fns";

type IssueCardProps = {
  issue: Issue;
};

function IssueCard({ issue }: IssueCardProps) {
  return (
    <div className="border-border border-[1px] rounded-lg p-6 flex flex-col justify-center gap-3 relative grow">
      <div className="flex flex-col justify-evenly gap-3">
        {issue.reportedByUser && (
          <div className="flex flex-col sm:flex-row gap-3 ">
            <DetailRow Icon={UserRound} label="Role" value={issue.reportedByUser.role} />
            <div className="flex gap-3 ml-10 sm:ml-0">
              <DetailRow label="First name" value={issue.reportedByUser.firstName} />
              <DetailRow label="Last name" value={issue.reportedByUser.lastName} />
            </div>
          </div>
        )}
        <DetailRow Icon={Circle} label="Severity" value={issue.severity} />
        <DetailRow Icon={CircleDot} label="Status" value={issue.status} />
        <DetailRow Icon={CalendarIcon} label="Reported at" value={format(issue.reportedAt.toDate(), "PP - HH:mm")} />
        <DetailRow Icon={Notebook} label="Description" value={issue.description} />
      </div>
    </div>
  );
}

export default IssueCard;
