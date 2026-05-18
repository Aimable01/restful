import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import API from "../api/axios";
import { toast } from "sonner";
import axios from "axios";

const schema = z.object({
  firstName: z.string().nonempty("First name is required"),
  lastName: z.string().nonempty("Last name is required"),
  email: z.email("Enter a valid email").nonempty("Email is required"),
  role: z.string(),
  password: z.string().nonempty("Password is required"),
});

interface SignupInputs {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  password: string;
}

export default function SignupPage() {
  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
  } = useForm<SignupInputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      role: "attendant",
    },
  });

  const submit = async (data: SignupInputs) => {
    try {
      const response = await API.post("/auth/register", data);

      if (response.data) {
        const responseMessage = response.data.message;

        toast.success(responseMessage);

        window.location.href = "/auth/login";
      }
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.data) {
        const serverErrorMessage = error.response.data.message;

        toast.error(serverErrorMessage);
      } else {
        toast.error("Something went wrong. Please try later.");
      }
    }
  };

  return (
    <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>

        <p className="text-gray-500 mt-2">
          Register a new parking system account
        </p>
      </div>

      <form onSubmit={handleSubmit(submit)} className="space-y-5">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            First Name
          </label>

          <input
            type="text"
            {...register("firstName")}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter first name"
          />

          {errors.firstName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.firstName.message}
            </p>
          )}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Last Name
          </label>

          <input
            type="text"
            {...register("lastName")}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter last name"
          />

          {errors.lastName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.lastName.message}
            </p>
          )}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Email Address
          </label>

          <input
            type="email"
            {...register("email")}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter email address"
          />

          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Role
          </label>

          <select
            {...register("role")}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          >
            <option value="attendant">Attendant</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Password
          </label>

          <input
            type="password"
            {...register("password")}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter password"
          />

          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg transition disabled:opacity-70 font-medium"
        >
          {isSubmitting ? "Submitting..." : "Register"}
        </button>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <a
            href="/auth/login"
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
