import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Send } from "lucide-react";
import { toast } from "sonner";
import AppShell from "../components/dashboard/AppShell";
import { Button } from "../components/ui/button";
import { AUTH_KEYS, EVENT_SESSION_ID, ROUTES } from "../constants";
import { useRegisterAttendee } from "../queries/attendanceQueries";
import type { RegisterAttendeeRequest } from "../types";

const emptyRegisterForm: RegisterAttendeeRequest = {
  fullName: "",
  gender: "",
  age: "",
  standard: "",
  fatherName: "",
  fatherPhone: "",
  motherName: "",
  motherPhone: "",
  residentialSuburb: "",
  whoWillAttend: "",
  referenceName: "",
};

const standardOptions = [
  "Pre school",
  "Pre primary",
  "1st to 4th",
  "5th to 8th",
  "9th to 10th",
];

const residentialSuburbOptions = [
  "Virar",
  "Nalasopara",
  "Vasai",
  "Mira-bhayander",
  "Dahisar",
  "Borivali",
  "Kandivali",
  "Malad",
  "Goregoan",
  "Andheri",
  "VileParle",
  "Santacruz",
  "South Mumbai",
];

const whoWillAttendOptions = [
  "Both Parent Coming",
  "Only Mother Coming",
  "Only Father Coming",
  "Guardian Coming",
];

export const RegisterAttendee: React.FC = () => {
  const navigate = useNavigate();
  const registerAttendeeMutation = useRegisterAttendee(EVENT_SESSION_ID);
  const hasValidSessionId =
    Boolean(EVENT_SESSION_ID) && EVENT_SESSION_ID !== "replace-with-session-id-from-backend-logs";
  const [form, setForm] = useState<RegisterAttendeeRequest>(emptyRegisterForm);

  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEYS.TOKEN);
    localStorage.removeItem(AUTH_KEYS.ROLE);
    toast.success("Signed out successfully.");
    navigate(ROUTES.LOGIN);
  };

  const updateField = (field: keyof RegisterAttendeeRequest, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!hasValidSessionId) {
      toast.error("Session ID missing", {
        description: "Add VITE_EVENT_SESSION_ID in .env from backend logs.",
      });
      return;
    }

    const payload: RegisterAttendeeRequest = {
      fullName: form.fullName.trim(),
      gender: form.gender.trim(),
      age: form.age.trim(),
      standard: form.standard.trim(),
      fatherName: form.fatherName.trim(),
      fatherPhone: form.fatherPhone.trim(),
      motherName: form.motherName.trim(),
      motherPhone: form.motherPhone.trim(),
      residentialSuburb: form.residentialSuburb.trim(),
      whoWillAttend: form.whoWillAttend.trim(),
      referenceName: form.referenceName.trim(),
    };

    if (!payload.fullName || !payload.fatherPhone) {
      toast.error("Missing details", {
        description: "Enter child name and father WhatsApp phone number.",
      });
      return;
    }

    registerAttendeeMutation.mutate(payload, {
      onSuccess: (response) => {
        console.log("[Register Attendee Page] Success", response);
        toast.success("Attendee registered", {
          description: response.message || "Ticket created and sent on WhatsApp.",
        });
        setForm(emptyRegisterForm);
        navigate(ROUTES.HOME);
      },
      onError: (error) => {
        console.error("[Register Attendee Page] Failed", error);
        toast.error("Registration failed", {
          description: error.message || "Backend could not register this attendee.",
        });
      },
    });
  };

  return (
    <AppShell onLogout={handleLogout}>
        <main className="flex-1 px-margin-mobile md:px-8 py-6 w-full max-w-[1100px] mx-auto space-y-6 animate-fade-in">
          <div>
            <h2 className="text-headline-lg-mobile md:text-headline-lg font-bold text-primary tracking-tight">
              Register Attendee
            </h2>
            <p className="text-body-sm text-on-surface-variant mt-1">
              Add attendee details, issue QR pass, and send ticket on WhatsApp.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm p-5 md:p-6 space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Child full name" value={form.fullName} onChange={(value) => updateField("fullName", value)} placeholder="John Doe" disabled={registerAttendeeMutation.isPending} required />
              <Field label="Gender" value={form.gender} onChange={(value) => updateField("gender", value)} placeholder="Male" disabled={registerAttendeeMutation.isPending} />
              <Field label="Age" value={form.age} onChange={(value) => updateField("age", value)} placeholder="13" disabled={registerAttendeeMutation.isPending} />
              <SelectField label="Standard" value={form.standard} onChange={(value) => updateField("standard", value)} placeholder="Select standard" options={standardOptions} disabled={registerAttendeeMutation.isPending} />
              <Field label="Father full name" value={form.fatherName} onChange={(value) => updateField("fatherName", value)} placeholder="Peter Doe" disabled={registerAttendeeMutation.isPending} />
              <Field label="Father WhatsApp" value={form.fatherPhone} onChange={(value) => updateField("fatherPhone", value)} placeholder="9324409127" disabled={registerAttendeeMutation.isPending} required />
              <Field label="Mother full name" value={form.motherName} onChange={(value) => updateField("motherName", value)} placeholder="Mary Doe" disabled={registerAttendeeMutation.isPending} />
              <Field label="Mother WhatsApp" value={form.motherPhone} onChange={(value) => updateField("motherPhone", value)} placeholder="8591091651" disabled={registerAttendeeMutation.isPending} />
              <SelectField label="Residential suburb" value={form.residentialSuburb} onChange={(value) => updateField("residentialSuburb", value)} placeholder="Select residential suburb" options={residentialSuburbOptions} disabled={registerAttendeeMutation.isPending} />
              <SelectField label="Who will attend" value={form.whoWillAttend} onChange={(value) => updateField("whoWillAttend", value)} placeholder="Select attendee" options={whoWillAttendOptions} disabled={registerAttendeeMutation.isPending} />
              <Field label="Reference name" value={form.referenceName} onChange={(value) => updateField("referenceName", value)} placeholder="Optional" disabled={registerAttendeeMutation.isPending} className="md:col-span-2" />
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 border-t border-outline-variant pt-5">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setForm(emptyRegisterForm)}
                disabled={registerAttendeeMutation.isPending}
                className="w-full sm:w-auto"
              >
                Clear
              </Button>
              <Button type="submit" disabled={registerAttendeeMutation.isPending} className="w-full sm:w-auto">
                <Send className="w-4 h-4" />
                {registerAttendeeMutation.isPending ? "Registering..." : "Register Attendee"}
              </Button>
            </div>
          </form>
        </main>
    </AppShell>
  );
};

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled: boolean;
  required?: boolean;
  className?: string;
}

interface SelectFieldProps extends FieldProps {
  options: string[];
}

const Field: React.FC<FieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  disabled,
  required = false,
  className = "",
}) => (
  <div className={`space-y-1.5 ${className}`}>
    <label className="text-label-md font-semibold text-on-surface">
      {label}
      {required && <span className="text-error ml-1">*</span>}
    </label>
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
      className="w-full h-11 rounded-lg border border-outline-variant bg-surface-container-lowest px-3 text-body-sm outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 disabled:opacity-60"
      placeholder={placeholder}
    />
  </div>
);

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  options,
  disabled,
  required = false,
  className = "",
}) => (
  <div className={`space-y-1.5 ${className}`}>
    <label className="text-label-md font-semibold text-on-surface">
      {label}
      {required && <span className="text-error ml-1">*</span>}
    </label>
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
      className="w-full h-11 rounded-lg border border-outline-variant bg-surface-container-lowest px-3 text-body-sm outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 disabled:opacity-60"
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

export default RegisterAttendee;
