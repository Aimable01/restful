import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import API from "../api/axios";

const schema = z.object({
  code: z.string().nonempty("Parking code is required"),
  parkingName: z.string().nonempty("Parking name is required"),
  availableSpaces: z
    .number("Must be a number")
    .min(0, "Spaces cannot be negative"),
  location: z.string().nonempty("Location is required"),
  feePerHour: z.number("Must be a number").min(0, "Fee cannot be negative"),
});

interface ParkingInputs {
  code: string;
  parkingName: string;
  availableSpaces: number;
  location: string;
  feePerHour: number;
}

interface ParkingItem extends ParkingInputs {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export default function ParkingsPage() {
  const [parkings, setParkings] = useState<ParkingItem[]>([]);
  const [page, setPage] = useState<number>(1);

  const {
    handleSubmit,
    register,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<ParkingInputs>({
    resolver: zodResolver(schema),
  });

  const fetchParkings = async (currentPage: number) => {
    try {
      const response = await API.get(`/parking?page=${currentPage}`);

      if (response.data) {
        setParkings(response.data);
      }
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.data) {
        toast.error(error.response.data.message || "Failed to fetch parkings");
      } else {
        toast.error("Something went wrong while fetching parkings.");
      }
    }
  };

  useEffect(() => {
    fetchParkings(page);
  }, [page]);

  const submit = async (data: ParkingInputs) => {
    try {
      const response = await API.post("/parking", data);

      if (response.data) {
        toast.success("Parking space created successfully!");

        reset();

        fetchParkings(page);
      }
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.data) {
        const serverErrorMessage = error.response.data.message;

        toast.error(serverErrorMessage || "Failed to create parking");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Parking Management</h1>

        <p className="text-gray-500 mt-1">
          Create and manage parking spaces easily.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Create Parking
        </h2>

        <form
          onSubmit={handleSubmit(submit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700">
              Parking Code
            </label>

            <input
              type="text"
              {...register("code")}
              placeholder="e.g PK-01"
              className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
            />

            {errors.code && (
              <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700">
              Parking Name
            </label>

            <input
              type="text"
              {...register("parkingName")}
              placeholder="e.g Downtown Parking"
              className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
            />

            {errors.parkingName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.parkingName.message}
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700">
              Available Spaces
            </label>

            <input
              type="number"
              {...register("availableSpaces", {
                valueAsNumber: true,
              })}
              placeholder="e.g 50"
              className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
            />

            {errors.availableSpaces && (
              <p className="text-red-500 text-sm mt-1">
                {errors.availableSpaces.message}
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700">
              Location
            </label>

            <input
              type="text"
              {...register("location")}
              placeholder="e.g Kigali City"
              className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
            />

            {errors.location && (
              <p className="text-red-500 text-sm mt-1">
                {errors.location.message}
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700">
              Fee Per Hour ($)
            </label>

            <input
              type="number"
              step="0.01"
              {...register("feePerHour", {
                valueAsNumber: true,
              })}
              placeholder="e.g 2.50"
              className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
            />

            {errors.feePerHour && (
              <p className="text-red-500 text-sm mt-1">
                {errors.feePerHour.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition disabled:opacity-70"
            >
              {isSubmitting ? "Creating..." : "Create Parking"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Parking Spaces List
          </h2>

          <span className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full">
            {parkings.length} Results
          </span>
        </div>

        {parkings.length === 0 ? (
          <div className="text-center py-10 text-gray-500 border rounded-lg">
            No parking slots available.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="py-3 px-2 text-sm font-semibold text-gray-600">
                    Parking Name
                  </th>

                  <th className="py-3 px-2 text-sm font-semibold text-gray-600">
                    Code
                  </th>

                  <th className="py-3 px-2 text-sm font-semibold text-gray-600">
                    Location
                  </th>

                  <th className="py-3 px-2 text-sm font-semibold text-gray-600">
                    Spaces
                  </th>

                  <th className="py-3 px-2 text-sm font-semibold text-gray-600">
                    Fee / Hr
                  </th>
                </tr>
              </thead>

              <tbody>
                {parkings.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="py-4 px-2 font-medium text-gray-800">
                      {item.parkingName}
                    </td>

                    <td className="py-4 px-2 text-gray-600">{item.code}</td>

                    <td className="py-4 px-2 text-gray-600">{item.location}</td>

                    <td className="py-4 px-2 text-gray-600">
                      {item.availableSpaces}
                    </td>

                    <td className="py-4 px-2">
                      <span className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full">
                        ${item.feePerHour}/hr
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-gray-700 font-medium">Page {page}</span>

          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={parkings.length < 10}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
