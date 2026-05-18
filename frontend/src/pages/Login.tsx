import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import axios from "axios";
import { toast } from "sonner";
import API from "../api/axios";

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

  const submit = async (data: LoginInputs) => {
    try {
      const response = await API.post("/auth/login", data);
      if (response.data) {
        const token = response.data.token;
        localStorage.setItem("token", token);
        const responseMessage = response.data.message;
        toast.success(responseMessage);
      }
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        const serverErrorMessage = error.response.data.message;
        toast.error(serverErrorMessage);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div>
      <p>Login page</p>
      <form onSubmit={handleSubmit(submit)}>
        <label>Email</label>
        <input type="email" {...register("email")} />
        {errors.email && <p>{errors.email.message}</p>}
        <label>Password</label>
        <input type="password" {...register("password")} />
        {errors.password && <p>{errors.password.message}</p>}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
