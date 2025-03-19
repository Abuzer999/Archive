import type { StepResetPassword } from "~/types/stepReset";

export const useStep = () => {
  const step = useState<StepResetPassword>("step", () => "email");
  const saveEmail = useState<string>("saveEmail", () => "");

  return {
    step,
    saveEmail
  };
};
