import React, { useState } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/providers/auth-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import { Eye, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Icons } from "@/components/ui/icons";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Issue, SeverityColors } from "../types";
import { Role } from "@/features/auth/types";
import { useDeleteIssue } from "@/features/issues/hooks/useDeleteIssue";
import IssueSheet from "@/features/issues/components/issue-sheet";
import NoData from "@/components/no-data";

type IssueTableProps = {
  issues: Issue[] | undefined;
};

function IssueTable({ issues }: IssueTableProps) {
  const { authUser } = useAuth();

  const { mutate: deleteIssue, isPending } = useDeleteIssue({ userUid: authUser!.uid });
  const [deletingIssueUid, setDeletingIssueUid] = useState<string | null>(null);

  const handleDeleteIssue = (issueUid: string) => {
    setDeletingIssueUid(issueUid);
    deleteIssue(issueUid, {
      onSuccess: () => {
        toast({
          description: "Issue deleted successfully",
        });
        setDeletingIssueUid(null);
      },
      onError: () => {
        setDeletingIssueUid(null);
      },
    });
  };

  if (!issues || !issues.length) return <NoData title="No issues reported" />;

  return (
    <Table>
      <TableCaption>List of issues</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Reported by</TableHead>
          <TableHead>Reported At</TableHead>
          <TableHead>Vehicle</TableHead>
          <TableHead>Issue type</TableHead>
          <TableHead>Severity</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="max-w-16 text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {issues &&
          issues.map((issue) => (
            <TableRow key={issue.uid}>
              <TableCell className="flex items-center">
                {issue.createdByUser?.role === Role.Driver ? (
                  <Link className={`${buttonVariants({ variant: "link" })} pl-0 space-x-3`} href={`/dashboard/drivers/${issue.createdByUser?.uid}`}>
                    <Avatar>
                      <AvatarImage src={issue.createdByUser?.photoURL ? issue?.createdByUser.photoURL : "/default-profile-photo.jpg"} />
                      <AvatarFallback>FM</AvatarFallback>
                    </Avatar>
                    <div>
                      <span>{`${issue.createdByUser?.firstName} ${issue.createdByUser?.lastName}`}</span>
                      <p className="text-muted-foreground text-xs">{issue.createdByUser?.email}</p>
                    </div>
                  </Link>
                ) : (
                  <div className={`${buttonVariants({ variant: "link" })} pl-0 hover:no-underline space-x-3`}>
                    <Avatar>
                      <AvatarImage src={issue.createdByUser?.photoURL ? issue?.createdByUser.photoURL : "/default-profile-photo.jpg"} />
                      <AvatarFallback>FM</AvatarFallback>
                    </Avatar>
                    <div>
                      <span>{`${issue.createdByUser?.firstName} ${issue.createdByUser?.lastName}`}</span>
                      <p className="text-muted-foreground text-xs">{issue.createdByUser?.email}</p>
                    </div>
                  </div>
                )}
              </TableCell>
              <TableCell>{format(issue.createdAt.toDate(), "PP - HH:mm")}</TableCell>
              <TableCell>{issue.vehicle && <Link className={`${buttonVariants({ variant: "link" })} pl-0`} href={`/dashboard/vehicles/${issue.vehicle?.uid}`}>{`${issue.vehicle?.make} ${issue.vehicle?.model}`}</Link>}</TableCell>
              <TableCell>
                <span className="capitalize">{issue.type}</span>
              </TableCell>
              <TableCell>
                <div className="flex gap-3 items-center">
                  <div className={`w-4 h-4 rounded-full ${SeverityColors[issue.severity]}`} aria-label={issue.severity}></div>
                  <span className="capitalize">{issue.severity}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge>{issue.status}</Badge>
              </TableCell>
              <TableCell className="text-center ">
                <div className="sm:gap-3 flex flex-col sm:flex-row justify-center items-center">
                  <IssueSheet
                    trigger={
                      <Button size="icon" variant="ghost">
                        <Eye className="h-5 w-5" />
                      </Button>
                    }
                    issue={issue}
                  />
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteIssue(issue.uid)} disabled={deletingIssueUid === issue.uid}>
                    {deletingIssueUid === issue.uid ? <Icons.spinner className="h-5 w-5 animate-spin" /> : <X className="w-5 h-5" />}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}

export default IssueTable;
