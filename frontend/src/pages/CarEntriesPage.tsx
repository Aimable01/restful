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
      if (axios.isAxiosError(error) && error.response && error.response.data) {
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
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        toast.error(error.response.data.message || "Exit processing failed.");
      } else {
        toast.error("Something went wrong while processing the exit.");
      }
    }
  };

  return (
    <div>
      <h2>Register Car Entry</h2>
      <form onSubmit={handleSubmit(submitEntry)}>
        <label>Plate Number</label>
        <input type="text" {...register("plateNumber")} />
        {errors.plateNumber && <p>{errors.plateNumber.message}</p>}

        <label>Parking Code</label>
        <input type="text" {...register("parkingCode")} />
        {errors.parkingCode && <p>{errors.parkingCode.message}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Processing..." : "Register Entry"}
        </button>
      </form>

      <hr />

      <h2>Vehicles Currently Parked</h2>
      {activeEntries.length === 0 ? (
        <p>No active cars found in the parking lots.</p>
      ) : (
        <ul>
          {activeEntries.map((car) => (
            <li key={car._id} style={{ marginBottom: "10px" }}>
              <strong>{car.plateNumber}</strong> - Zone: {car.parkingCode}
              (Entered: {new Date(car.entryDateTime).toLocaleTimeString()})
              {" | "}
              <button onClick={() => handleExit(car._id)}>
                Process Exit & Bill
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
