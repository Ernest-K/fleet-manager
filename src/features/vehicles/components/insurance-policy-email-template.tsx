import { Body, Container, Head, Heading, Hr, Html, Preview, Section, Text } from "@react-email/components";
import * as React from "react";
import { Vehicle } from "../types";
import { format } from "date-fns";

interface InsurancePolicyEmailTemplateProps {
  vehicle: Vehicle;
}

const InsurancePolicyEmailTemplate: React.FC<InsurancePolicyEmailTemplateProps> = ({ vehicle }) => {
  const formattedDate = format(vehicle.insurancePolicyDate.toDate(), "PP");

  return (
    <Html>
      <Head />
      <Preview>Vehicle Insurance Policy Expiration Reminder</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Vehicle Insurance Policy Expiration Reminder</Heading>

          <Text style={text}>
            This is a friendly reminder that your vehicle&apos;s insurance policy is due to expire soon. Please find the details of your vehicle below:
          </Text>

          <Section style={vehicleDetails}>
            <Text style={detailText}>
              <strong>Vehicle Type:</strong> {vehicle.vehicleType}
            </Text>
            <Text style={detailText}>
              <strong>Make:</strong> {vehicle.make}
            </Text>
            <Text style={detailText}>
              <strong>Model:</strong> {vehicle.model}
            </Text>
            <Text style={detailText}>
              <strong>Year:</strong> {vehicle.year}
            </Text>
            <Text style={detailText}>
              <strong>VIN:</strong> {vehicle.vin}
            </Text>
            <Text style={detailText}>
              <strong>Fuel Type:</strong> {vehicle.fuelType}
            </Text>
            <Text style={detailText}>
              <strong>Color:</strong> {vehicle.color}
            </Text>
            <Text style={detailText}>
              <strong>License Plate:</strong> {vehicle.licensePlateNumber}
            </Text>
            <Text style={detailText}>
              <strong>Registration:</strong> {vehicle.registration}
            </Text>
            <Text style={detailText}>
              <strong>Odometer Reading:</strong> {vehicle.odometerReading} km
            </Text>
          </Section>

          <Text style={text}>
            Your vehicle&apos;s insurance policy is set to expire on: <strong style={highlight}>{formattedDate}</strong>
          </Text>

          <Text style={text}>Please ensure that you renew it in time to maintain continuous coverage.</Text>

          <Hr style={hr} />

          <Text style={text}>Best regards</Text>
        </Container>
      </Body>
    </Html>
  );
};

export default InsurancePolicyEmailTemplate;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "580px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  paddingBottom: "10px",
  textAlign: "center" as const,
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "24px",
};

const vehicleDetails = {
  backgroundColor: "#f4f4f4",
  borderRadius: "4px",
  padding: "24px",
  marginBottom: "24px",
};

const detailText = {
  margin: "0 0 10px 0",
};

const highlight = {
  color: "#007bff",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};
