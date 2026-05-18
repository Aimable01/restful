import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import axios from "axios";
import { toast } from "sonner";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

const schema = z.object({
  email: z.email().nonempty("Please enter your email"),
  password: z.string().nonempty("Password required"),
});

interface LoginInputs {
  email: string;
  password: string;
}

export default function LoginPage() {
  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
  } = useForm<LoginInputs>({
    resolver: zodResolver(schema),
  });

  const { login } = useAuth();

  const submit = async (data: LoginInputs) => {
    try {
      const response = await API.post("/auth/login", data);

      if (response.data) {
        const token = response.data.token;
        const responseMessage = response.data.message;

        toast.success(responseMessage);

        login(token);
      }
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.data) {
        const serverErrorMessage = error.response.data.message;

        toast.error(serverErrorMessage);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>

        <p className="text-gray-500 mt-2">
          Login to access the parking management system
        </p>
      </div>

      <form onSubmit={handleSubmit(submit)} className="space-y-5">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Email Address
          </label>

          <input
            type="email"
            {...register("email")}
            placeholder="Enter your email"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
          />

          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Password
          </label>

          <input
            type="password"
            {...register("password")}
            placeholder="Enter your password"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
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
          {isSubmitting ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <a
            href="/auth/signup"
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            Register
          </a>
        </p>
      </form>
    </div>
  );
}
