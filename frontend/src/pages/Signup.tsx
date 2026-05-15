import { z } from "zod";

const schema = z.object({
  firstName: z.string().nonempty("First name is required"),
  lastName: z.string().nonempty("Last name is required"),
  email: z.email("Enter a valid email").nonempty("Email is required"),
});

export default function Signup() {
  return (
    <div>
      <form action="">
        <input type="text" />
      </form>
    </div>
  );
}
