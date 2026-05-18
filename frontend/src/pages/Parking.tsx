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
      if (axios.isAxiosError(error) && error.response && error.response.data) {
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
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        const serverErrorMessage = error.response.data.message;
        toast.error(serverErrorMessage || "Failed to create parking");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div>
      <h2>Create Parking</h2>
      <form onSubmit={handleSubmit(submit)}>
        <label>Code</label>
        <input type="text" {...register("code")} />
        {errors.code && <p>{errors.code.message}</p>}

        <label>Parking Name</label>
        <input type="text" {...register("parkingName")} />
        {errors.parkingName && <p>{errors.parkingName.message}</p>}

        <label>Available Spaces</label>
        <input
          type="number"
          {...register("availableSpaces", { valueAsNumber: true })}
        />
        {errors.availableSpaces && <p>{errors.availableSpaces.message}</p>}

        <label>Location</label>
        <input type="text" {...register("location")} />
        {errors.location && <p>{errors.location.message}</p>}

        <label>Fee Per Hour</label>
        <input
          type="number"
          step="0.01"
          {...register("feePerHour", { valueAsNumber: true })}
        />
        {errors.feePerHour && <p>{errors.feePerHour.message}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Parking"}
        </button>
      </form>

      <hr />

      <h2>Parking Spaces List</h2>
      {parkings.length === 0 ? (
        <p>No parking slots available.</p>
      ) : (
        <ul>
          {parkings.map((item) => (
            <li key={item._id}>
              <strong>{item.parkingName}</strong> ({item.code}) -{" "}
              {item.location} | Spaces: {item.availableSpaces} | Fee: $
              {item.feePerHour}/hr
            </li>
          ))}
        </ul>
      )}

      <div>
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span> Page {page} </span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={parkings.length < 10}
        >
          Next
        </button>
      </div>
    </div>
  );
}
