import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import AppShell from "../components/dashboard/AppShell";
import { AUTH_KEYS, EVENT_SESSION_ID, ROUTES } from "../constants";
import { useRegisterAttendee } from "../queries/attendanceQueries";
import { logger } from "../lib/logger";
import {
  emptyRegisterForm,
  registerAttendeeSchema,
  type RegisterAttendeeFormData,
} from "./register-attendee/formConfig";
import { RegisterAttendeeForm } from "./register-attendee/RegisterAttendeeForm";

export const RegisterAttendee: React.FC = () => {
  const navigate = useNavigate();
  const registerAttendeeMutation = useRegisterAttendee(EVENT_SESSION_ID);
  const hasValidSessionId =
    Boolean(EVENT_SESSION_ID) &&
    EVENT_SESSION_ID !== "replace-with-session-id-from-backend-logs";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterAttendeeFormData>({
    resolver: zodResolver(registerAttendeeSchema),
    defaultValues: emptyRegisterForm,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEYS.TOKEN);
    localStorage.removeItem(AUTH_KEYS.ROLE);
    toast.success("Signed out successfully.");
    navigate(ROUTES.LOGIN);
  };

  const handleValidSubmit = (payload: RegisterAttendeeFormData) => {
    if (!hasValidSessionId) {
      toast.error("Session ID missing", {
        description: "Add VITE_EVENT_SESSION_ID in .env from backend logs.",
      });
      return;
    }

    registerAttendeeMutation.mutate(payload, {
      onSuccess: (response) => {
        logger.info("[Register Attendee Page] Success", response);
        toast.success("Attendee registered", {
          description:
            response.message || "Ticket created and sent on WhatsApp.",
        });
        reset(emptyRegisterForm);
        navigate(ROUTES.HOME);
      },
      onError: (error) => {
        logger.error("[Register Attendee Page] Failed", error);
        toast.error("Registration failed", {
          description:
            error.message || "Backend could not register this attendee.",
        });
      },
    });
  };

  const handleInvalidSubmit = () => {
    toast.error("Missing details", {
      description: "Please complete all mandatory fields.",
    });
  };

  return (
    <AppShell onLogout={handleLogout}>
      <main className="flex-1 px-margin-mobile md:px-8 py-6 w-full max-w-[1100px] mx-auto space-y-6 animate-fade-in">
        <header>
          <h2 className="text-headline-lg-mobile md:text-headline-lg font-bold text-primary tracking-tight">
            Register Attendee
          </h2>
          <p className="text-body-sm text-on-surface-variant mt-1">
            Add attendee details, issue QR pass, and send ticket on WhatsApp.
          </p>
        </header>

        <RegisterAttendeeForm
          disabled={registerAttendeeMutation.isPending}
          errors={errors}
          onClear={() => reset(emptyRegisterForm)}
          onSubmit={handleSubmit(handleValidSubmit, handleInvalidSubmit)}
          register={register}
        />
      </main>
    </AppShell>
  );
};

export default RegisterAttendee;
