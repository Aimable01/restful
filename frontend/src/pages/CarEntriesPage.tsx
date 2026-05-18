import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import API from "../api/axios";

const schema = z.object({
  plateNumber: z.string().nonempty("Plate number is required"),
  parkingCode: z.string().nonempty("Parking code is required"),
});

interface EntryInputs {
  plateNumber: string;
  parkingCode: string;
}

interface CarEntryItem extends EntryInputs {
  _id: string;
  entryDateTime: string;
  exitDateTime: string | null;
  chargedAmount: number;
  status: "IN" | "OUT";
  createdAt: string;
  updatedAt: string;
}

export default function CarEntriesPage() {
  const [activeEntries, setActiveEntries] = useState<CarEntryItem[]>([]);

  const {
    handleSubmit,
    register,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<EntryInputs>({
    resolver: zodResolver(schema),
  });

  const fetchEntries = async () => {
    try {
      const response = await API.get("/entries");

      if (response.data) {
        const insideParkings = response.data.filter(
          (car: CarEntryItem) => car.status === "IN",
        );

        setActiveEntries(insideParkings);
      }
    } catch (error) {
      console.log("Could not load tracking array from server:", error);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const submitEntry = async (data: EntryInputs) => {
    try {
      const response = await API.post("/entries/entry", data);

      if (response.data) {
        toast.success(response.data.message || "Car registered successfully!");
        reset();
        fetchEntries();
      }
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.data) {
        toast.error(
          error.response.data.message || "Entry registration failed.",
        );
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  const handleExit = async (id: string) => {
    try {
      const response = await API.post(`/entries/exit/${id}`);

      if (response.data) {
        const totalBill = response.data.bill?.chargedAmount || 0;

        toast.success(
          `${response.data.message || "Car exited!"} Total Fee: $${totalBill}`,
        );

        fetchEntries();
      }
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.data) {
        toast.error(error.response.data.message || "Exit processing failed.");
      } else {
        toast.error("Something went wrong while processing the exit.");
      }
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Car Entry Management
        </h1>
        <p className="text-gray-500 mt-1">
          Register vehicles and manage parking exits.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Register Car Entry
        </h2>

        <form
          onSubmit={handleSubmit(submitEntry)}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700">
              Plate Number
            </label>

            <input
              type="text"
              {...register("plateNumber")}
              className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="e.g RAB123A"
            />

            {errors.plateNumber && (
              <p className="text-red-500 text-sm mt-1">
                {errors.plateNumber.message}
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700">
              Parking Code
            </label>

            <input
              type="text"
              {...register("parkingCode")}
              className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="e.g PK-01"
            />

            {errors.parkingCode && (
              <p className="text-red-500 text-sm mt-1">
                {errors.parkingCode.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition disabled:opacity-70"
            >
              {isSubmitting ? "Processing..." : "Register Entry"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Vehicles Currently Parked
          </h2>

          <span className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full">
            {activeEntries.length} Active
          </span>
        </div>

        {activeEntries.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No active cars found in the parking lots.
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

                  <th className="py-3 px-2 text-sm font-semibold text-gray-600">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {activeEntries.map((car) => (
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
                      {new Date(car.entryDateTime).toLocaleTimeString()}
                    </td>

                    <td className="py-4 px-2">
                      <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
                        {car.status}
                      </span>
                    </td>

                    <td className="py-4 px-2">
                      <button
                        onClick={() => handleExit(car._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition"
                      >
                        Process Exit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
