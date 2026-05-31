import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import API from "../api/axios";
import { toast } from "sonner";
import axios from "axios";
import { useState } from "react";

const schema = z.object({
  firstName: z.string().nonempty("First name is required"),
  lastName: z.string().nonempty("Last name is required"),
  email: z.email("Enter a valid email").nonempty("Email is required"),
  role: z.string(),
  password: z.string().nonempty("Password is required"),
});

const otpSchema = z.object({
  email: z.email("Enter a valid email").nonempty("Email is required"),
  otp: z.string().nonempty("OTP is required"),
});

interface SignupInputs {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  password: string;
}

interface OTPInputs {
  email: string;
  otp: string;
}

export default function SignupPage() {
  const [showOTP, setShowOTP] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const {
    handleSubmit: handleSignupSubmit,
    register: registerSignup,
    formState: { isSubmitting: isSignupSubmitting, errors: signupErrors },
  } = useForm<SignupInputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      role: "attendant",
    },
  });

  const {
    handleSubmit: handleOTPSubmit,
    register: registerOTP,
    formState: { isSubmitting: isOTPSumbitting, errors: otpErrors },
  } = useForm<OTPInputs>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      email: registeredEmail,
    },
  });

  const submit = async (data: SignupInputs) => {
    try {
      const response = await API.post("/auth/register", data);

      if (response.data) {
        const responseMessage = response.data.message;

        toast.success(responseMessage);

        setRegisteredEmail(data.email);
        setShowOTP(true);
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

  const verifyOTP = async (data: OTPInputs) => {
    try {
      const response = await API.post("/auth/verify-otp", data);

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

  if (showOTP) {
    return (
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Verify OTP</h1>

          <p className="text-gray-500 mt-2">Enter the OTP sent to your email</p>
        </div>

        <form onSubmit={handleOTPSubmit(verifyOTP)} className="space-y-5">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Email Address
            </label>

            <input
              type="email"
              {...registerOTP("email")}
              defaultValue={registeredEmail}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter email address"
            />

            {otpErrors.email && (
              <p className="text-red-500 text-sm mt-1">
                {otpErrors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              OTP Code
            </label>

            <input
              type="text"
              {...registerOTP("otp")}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter 6-digit OTP"
              maxLength={6}
            />

            {otpErrors.otp && (
              <p className="text-red-500 text-sm mt-1">
                {otpErrors.otp.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isOTPSumbitting}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg transition disabled:opacity-70 font-medium"
          >
            {isOTPSumbitting ? "Verifying..." : "Verify OTP"}
          </button>

          <p className="text-center text-sm text-gray-500">
            <button
              type="button"
              onClick={() => setShowOTP(false)}
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              Back to Register
            </button>
          </p>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>

        <p className="text-gray-500 mt-2">
          Register a new parking system account
        </p>
      </div>

      <form onSubmit={handleSignupSubmit(submit)} className="space-y-5">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            First Name
          </label>

          <input
            type="text"
            {...registerSignup("firstName")}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter first name"
          />

          {signupErrors.firstName && (
            <p className="text-red-500 text-sm mt-1">
              {signupErrors.firstName.message}
            </p>
          )}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Last Name
          </label>

          <input
            type="text"
            {...registerSignup("lastName")}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter last name"
          />

          {signupErrors.lastName && (
            <p className="text-red-500 text-sm mt-1">
              {signupErrors.lastName.message}
            </p>
          )}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Email Address
          </label>

          <input
            type="email"
            {...registerSignup("email")}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter email address"
          />

          {signupErrors.email && (
            <p className="text-red-500 text-sm mt-1">
              {signupErrors.email.message}
            </p>
          )}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Role
          </label>

          <select
            {...registerSignup("role")}
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
            {...registerSignup("password")}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter password"
          />

          {signupErrors.password && (
            <p className="text-red-500 text-sm mt-1">
              {signupErrors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSignupSubmitting}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg transition disabled:opacity-70 font-medium"
        >
          {isSignupSubmitting ? "Submitting..." : "Register"}
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
