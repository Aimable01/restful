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
      if (axios.isAxiosError(error) && error.response?.data) {
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
      if (axios.isAxiosError(error) && error.response?.data) {
        toast.error(
          error.response.data.message || "Failed to fetch outgoing report",
        );
      } else {
        toast.error("Something went wrong fetching outgoing report.");
      }
    }
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Reports Dashboard</h1>

        <p className="text-gray-500 mt-1">
          Generate incoming and outgoing parking reports.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Incoming Cars Report
        </h2>

        <form
          onSubmit={incomingForm.handleSubmit(handleIncomingSubmit)}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end"
        >
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700">
              Start Date & Time
            </label>

            <input
              type="datetime-local"
              {...incomingForm.register("start")}
              className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
            />

            {incomingForm.formState.errors.start && (
              <p className="text-red-500 text-sm mt-1">
                {incomingForm.formState.errors.start.message}
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700">
              End Date & Time
            </label>

            <input
              type="datetime-local"
              {...incomingForm.register("end")}
              className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
            />

            {incomingForm.formState.errors.end && (
              <p className="text-red-500 text-sm mt-1">
                {incomingForm.formState.errors.end.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={incomingForm.formState.isSubmitting}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition disabled:opacity-70 h-fit"
          >
            {incomingForm.formState.isSubmitting
              ? "Generating..."
              : "Generate Report"}
          </button>
        </form>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Incoming Results
            </h3>

            <span className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full">
              {incomingData.length} Records
            </span>
          </div>

          {incomingData.length === 0 ? (
            <div className="text-gray-500 text-center py-8 border rounded-lg">
              No records found for this period.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-left">
                    <th className="py-3 px-2 text-sm font-semibold text-gray-600">
                      Plate Number
                    </th>

                    <th className="py-3 px-2 text-sm font-semibold text-gray-600">
                      Parking Zone
                    </th>

                    <th className="py-3 px-2 text-sm font-semibold text-gray-600">
                      Entry Time
                    </th>

                    <th className="py-3 px-2 text-sm font-semibold text-gray-600">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {incomingData.map((car) => (
                    <tr
                      key={car._id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition"
                    >
                      <td className="py-4 px-2 font-medium text-gray-800">
                        {car.plateNumber}
                      </td>

                      <td className="py-4 px-2 text-gray-600">
                        {car.parkingCode}
                      </td>

                      <td className="py-4 px-2 text-gray-600">
                        {new Date(car.entryDateTime).toLocaleString()}
                      </td>

                      <td className="py-4 px-2">
                        <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
                          {car.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Outgoing Reports */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Outgoing Cars Report
        </h2>

        <form
          onSubmit={outgoingForm.handleSubmit(handleOutgoingSubmit)}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end"
        >
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700">
              Start Date & Time
            </label>

            <input
              type="datetime-local"
              {...outgoingForm.register("start")}
              className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
            />

            {outgoingForm.formState.errors.start && (
              <p className="text-red-500 text-sm mt-1">
                {outgoingForm.formState.errors.start.message}
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700">
              End Date & Time
            </label>

            <input
              type="datetime-local"
              {...outgoingForm.register("end")}
              className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
            />

            {outgoingForm.formState.errors.end && (
              <p className="text-red-500 text-sm mt-1">
                {outgoingForm.formState.errors.end.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={outgoingForm.formState.isSubmitting}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition disabled:opacity-70 h-fit"
          >
            {outgoingForm.formState.isSubmitting
              ? "Generating..."
              : "Generate Report"}
          </button>
        </form>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Outgoing Results
            </h3>

            <span className="bg-red-100 text-red-700 text-sm px-3 py-1 rounded-full">
              {outgoingData.length} Records
            </span>
          </div>

          {outgoingData.length === 0 ? (
            <div className="text-gray-500 text-center py-8 border rounded-lg">
              No records found for this period.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-left">
                    <th className="py-3 px-2 text-sm font-semibold text-gray-600">
                      Plate Number
                    </th>

                    <th className="py-3 px-2 text-sm font-semibold text-gray-600">
                      Parking Zone
                    </th>

                    <th className="py-3 px-2 text-sm font-semibold text-gray-600">
                      Exit Time
                    </th>

                    <th className="py-3 px-2 text-sm font-semibold text-gray-600">
                      Fee Charged
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {outgoingData.map((car) => (
                    <tr
                      key={car._id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition"
                    >
                      <td className="py-4 px-2 font-medium text-gray-800">
                        {car.plateNumber}
                      </td>

                      <td className="py-4 px-2 text-gray-600">
                        {car.parkingCode}
                      </td>

                      <td className="py-4 px-2 text-gray-600">
                        {car.exitDateTime
                          ? new Date(car.exitDateTime).toLocaleString()
                          : "N/A"}
                      </td>

                      <td className="py-4 px-2">
                        <span className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full">
                          ${car.chargedAmount}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
