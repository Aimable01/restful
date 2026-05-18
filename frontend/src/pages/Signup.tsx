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
  password: z.string("Enter your password").nonempty("Password is required"),
});

// type ROLE = "attendant" | "admin";
interface signupInputs {
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
  } = useForm<signupInputs>({
    resolver: zodResolver(schema),
  });

  const submit = async (data: signupInputs) => {
    try {
      const response = await API.post("/auth/register", data);
      if (response.data) {
        const responseMessage = response.data.message;
        toast.success(responseMessage);
      }
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        const serverErrorMessage = error.response.data.message;
        toast.error(serverErrorMessage);
      } else {
        toast.error("Something went wrong. Please later");
      }
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit(submit)}>
        <label>First Name</label>
        <input type="text" {...register("firstName")} />
        {errors.firstName && <p>{errors.firstName.message}</p>}
        <label>Last Name</label>
        <input type="text" {...register("lastName")} />
        {errors.lastName && <p>{errors.lastName.message}</p>}

        <label>Email</label>
        <input type="email" {...register("email")} />
        {errors.email && <p>{errors.email.message}</p>}

        <label>Role</label>
        <select {...register("role")}>
          <option value="attendant">Attendant</option>
          <option value="admin">Admin</option>
        </select>

        <label>Password</label>
        <input type="password" {...register("password")} />
        {errors.password && <p>{errors.password.message}</p>}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting" : "Register"}
        </button>
      </form>
    </div>
  );
}
