import React, { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InspectionTable from "@/features/inspections/components/inspections-table";
import ServiceTable from "@/features/services/components/services-table";
import IssueTable from "@/features/issues/components/issues-table";

import { Inspection } from "@/features/inspections/types";
import { Issue } from "@/features/issues/types";
import { Service } from "@/features/services/types";
import { CollectionNames } from "@/types";
import InspectionDialog from "@/features/inspections/components/inspection-dialog";
import { Button } from "./ui/button";
import { Plus, TriangleAlert } from "lucide-react";
import ServiceDialog from "@/features/services/components/service-dialog";
import IssueDialog from "@/features/issues/components/issue-dialog";

type VehicleEventTabsProps = {
  vehicleUid?: string;
  inspections?: Inspection[];
  services?: Service[];
  issues?: Issue[];
};

function VehicleEventTabs({ vehicleUid, inspections, services, issues }: VehicleEventTabsProps) {
  const [activeTab, setActiveTab] = useState<CollectionNames>(CollectionNames.Inspections);

  const handleTabChange = (value: string) => {
    setActiveTab(value as CollectionNames);
  };

  const renderDialog = () => {
    switch (activeTab) {
      case CollectionNames.Inspections:
        return (
          <InspectionDialog
            vehicleUid={vehicleUid}
            trigger={
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Schedule an inspection
              </Button>
            }
          />
        );
      case CollectionNames.Services:
        return (
          <ServiceDialog
            vehicleUid={vehicleUid}
            trigger={
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Schedule a service
              </Button>
            }
          />
        );
      case CollectionNames.Issues:
        return (
          <IssueDialog
            vehicleUid={vehicleUid}
            trigger={
              <Button>
                <TriangleAlert className="mr-2 h-4 w-4" />
                Report an issue
              </Button>
            }
          />
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicle event</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={CollectionNames.Inspections} onValueChange={handleTabChange}>
          <div className="flex justify-between items-center">
            <TabsList className="max-w-max">
              {inspections && <TabsTrigger value={CollectionNames.Inspections}>Inspections</TabsTrigger>}
              {services && <TabsTrigger value={CollectionNames.Services}>Services</TabsTrigger>}
              {issues && <TabsTrigger value={CollectionNames.Issues}>Issues</TabsTrigger>}
            </TabsList>
            {vehicleUid && renderDialog()}
          </div>
          {inspections && (
            <TabsContent value={CollectionNames.Inspections}>
              <InspectionTable inspections={inspections} />
            </TabsContent>
          )}
          {services && (
            <TabsContent value={CollectionNames.Services}>
              <ServiceTable services={services} />
            </TabsContent>
          )}
          {issues && (
            <TabsContent value={CollectionNames.Issues}>
              <IssueTable issues={issues} />
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default VehicleEventTabs;
