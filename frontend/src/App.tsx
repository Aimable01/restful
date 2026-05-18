import Signup from "./pages/Signup";
import { Toaster } from "sonner";

export default function App() {
  return (
    <div>
      <Toaster position="top-right" />
      <Signup />
    </div>
  );
}
