import React from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Send } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  residentialSuburbOptions,
  standardOptions,
  whoWillAttendOptions,
  type RegisterAttendeeFormData,
} from "./formConfig";
import { RegisteredSelectField, RegisteredTextField } from "./RegisteredField";

interface RegisterAttendeeFormProps {
  disabled: boolean;
  errors: FieldErrors<RegisterAttendeeFormData>;
  onClear: () => void;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  register: UseFormRegister<RegisterAttendeeFormData>;
}

export const RegisterAttendeeForm: React.FC<RegisterAttendeeFormProps> = ({
  disabled,
  errors,
  onClear,
  onSubmit,
  register,
}) => (
  <form
    noValidate
    onSubmit={onSubmit}
    className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm p-5 md:p-6 space-y-6"
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <RegisteredTextField
        label="Child full name"
        registration={register("fullName")}
        placeholder="John Doe"
        disabled={disabled}
        required
        error={errors.fullName?.message}
      />
      <RegisteredTextField
        label="Gender"
        registration={register("gender")}
        placeholder="Male"
        disabled={disabled}
        required
        error={errors.gender?.message}
      />
      <RegisteredTextField
        label="Age"
        registration={register("age")}
        placeholder="13"
        disabled={disabled}
        required
        error={errors.age?.message}
      />
      <RegisteredSelectField
        label="Standard"
        registration={register("standard")}
        placeholder="Select standard"
        options={standardOptions}
        disabled={disabled}
        required
        error={errors.standard?.message}
      />
      <RegisteredTextField
        label="Father full name"
        registration={register("fatherName")}
        placeholder="Peter Doe"
        disabled={disabled}
        required
        error={errors.fatherName?.message}
      />
      <RegisteredTextField
        label="Father WhatsApp"
        registration={register("fatherPhone")}
        placeholder="9324409127"
        disabled={disabled}
        required
        error={errors.fatherPhone?.message}
      />
      <RegisteredTextField
        label="Mother full name"
        registration={register("motherName")}
        placeholder="Mary Doe"
        disabled={disabled}
        required
        error={errors.motherName?.message}
      />
      <RegisteredTextField
        label="Mother WhatsApp"
        registration={register("motherPhone")}
        placeholder="8591091651"
        disabled={disabled}
      />
      <RegisteredSelectField
        label="Residential suburb"
        registration={register("residentialSuburb")}
        placeholder="Select residential suburb"
        options={residentialSuburbOptions}
        disabled={disabled}
        required
        error={errors.residentialSuburb?.message}
      />
      <RegisteredSelectField
        label="Who will attend"
        registration={register("whoWillAttend")}
        placeholder="Select attendee"
        options={whoWillAttendOptions}
        disabled={disabled}
        required
        error={errors.whoWillAttend?.message}
      />
      <RegisteredTextField
        label="Reference name"
        registration={register("referenceName")}
        placeholder="Reference name"
        disabled={disabled}
        required
        error={errors.referenceName?.message}
        className="md:col-span-2"
      />
    </div>

    <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 border-t border-outline-variant pt-5">
      <Button
        type="button"
        variant="secondary"
        onClick={onClear}
        disabled={disabled}
        className="w-full sm:w-auto"
      >
        Clear
      </Button>
      <Button type="submit" disabled={disabled} className="w-full sm:w-auto">
        <Send className="w-4 h-4" />
        {disabled ? "Registering..." : "Register Attendee"}
      </Button>
    </div>
  </form>
);
