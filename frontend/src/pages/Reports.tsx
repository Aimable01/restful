import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";
import API from "../api/axios";

const schema = z.object({
  start: z.string().nonempty("Start date and time is required"),
  end: z.string().nonempty("End date and time is required"),
});

interface ReportInputs {
  start: string;
  end: string;
}

interface ReportItem {
  _id: string;
  plateNumber: string;
  parkingCode: string;
  entryDateTime: string;
  exitDateTime: string | null;
  chargedAmount: number;
  status: "IN" | "OUT";
}

export default function ReportsPage() {
  const [incomingData, setIncomingData] = useState<ReportItem[]>([]);
  const [outgoingData, setOutgoingData] = useState<ReportItem[]>([]);

  const incomingForm = useForm<ReportInputs>({
    resolver: zodResolver(schema),
  });

  const outgoingForm = useForm<ReportInputs>({
    resolver: zodResolver(schema),
  });

  const handleIncomingSubmit = async (data: ReportInputs) => {
    try {
      const response = await API.get(
        `/reports/incoming?start=${data.start}&end=${data.end}`,
      );
      if (response.data) {
        setIncomingData(response.data);
        toast.success(`Found ${response.data.length} incoming entries.`);
      }
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        toast.error(
          error.response.data.message || "Failed to fetch incoming report",
        );
      } else {
        toast.error("Something went wrong fetching incoming report.");
      }
    }
  };

  const handleOutgoingSubmit = async (data: ReportInputs) => {
    try {
      const response = await API.get(
        `/reports/outgoing?start=${data.start}&end=${data.end}`,
      );
      if (response.data) {
        setOutgoingData(response.data);
        toast.success(`Found ${response.data.length} outgoing entries.`);
      }
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        toast.error(
          error.response.data.message || "Failed to fetch outgoing report",
        );
      } else {
        toast.error("Something went wrong fetching outgoing report.");
      }
    }
  };

  return (
    <div>
      <h1>Reports Dashboard</h1>
      <hr />

      <h2>Incoming Cars Report</h2>
      <form onSubmit={incomingForm.handleSubmit(handleIncomingSubmit)}>
        <label>Start Date & Time</label>
        <input type="datetime-local" {...incomingForm.register("start")} />
        {incomingForm.formState.errors.start && (
          <p>{incomingForm.formState.errors.start.message}</p>
        )}

        <label>End Date & Time</label>
        <input type="datetime-local" {...incomingForm.register("end")} />
        {incomingForm.formState.errors.end && (
          <p>{incomingForm.formState.errors.end.message}</p>
        )}

        <button type="submit" disabled={incomingForm.formState.isSubmitting}>
          {incomingForm.formState.isSubmitting
            ? "Generating..."
            : "Get Incoming Report"}
        </button>
      </form>

      <h3>Incoming Results:</h3>
      {incomingData.length === 0 ? (
        <p>No records found for this period.</p>
      ) : (
        <ul>
          {incomingData.map((car) => (
            <li key={car._id}>
              Plate: {car.plateNumber} | Zone: {car.parkingCode} | Entered:{" "}
              {new Date(car.entryDateTime).toLocaleString()}
            </li>
          ))}
        </ul>
      )}

      <hr />

      <h2>Outgoing Cars Report</h2>
      <form onSubmit={outgoingForm.handleSubmit(handleOutgoingSubmit)}>
        <label>Start Date & Time</label>
        <input type="datetime-local" {...outgoingForm.register("start")} />
        {outgoingForm.formState.errors.start && (
          <p>{outgoingForm.formState.errors.start.message}</p>
        )}

        <label>End Date & Time</label>
        <input type="datetime-local" {...outgoingForm.register("end")} />
        {outgoingForm.formState.errors.end && (
          <p>{outgoingForm.formState.errors.end.message}</p>
        )}

        <button type="submit" disabled={outgoingForm.formState.isSubmitting}>
          {outgoingForm.formState.isSubmitting
            ? "Generating..."
            : "Get Outgoing Report"}
        </button>
      </form>

      <h3>Outgoing Results:</h3>
      {outgoingData.length === 0 ? (
        <p>No records found for this period.</p>
      ) : (
        <ul>
          {outgoingData.map((car) => (
            <li key={car._id}>
              Plate: {car.plateNumber} | Zone: {car.parkingCode} | Exited:{" "}
              {car.exitDateTime
                ? new Date(car.exitDateTime).toLocaleString()
                : "N/A"}{" "}
              | Fee Charged: ${car.chargedAmount}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
