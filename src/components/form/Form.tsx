import { useEffect, useState } from "react";
import { Input } from "./Input";
import { useForm } from "./useForm";
import { useWizard } from "./useWizard";
import Button from "../actions/Button";
import { DropDown } from "./DropDown";
import Toast from "../actions/Toast";
import { useToast } from "../actions/useToast";
import Wizard from "./Wizard";
import { ApiError } from "../../api/client";
import { useGetForm } from "../../api/useGetForms";
import { useRegister } from "../../api/useRegister";
import type { RegistrationDto } from "../../api/types";
import {
  fieldConfig,
  initialValues,
  steps,
  toUserRegistration,
  validate,
  type RegistrationValues,
} from "../../utils/registrationForm";
import { formatDate } from "../../utils/formatDate";

type FormProps = {
  clubId: string;
};

export default function Form({ clubId }: Readonly<FormProps>) {
  const { values, errors, setErrors, handleChange } = useForm(
    initialValues,
    validate
  );
  const { data: form, error: formError } = useGetForm(clubId);
  const formNotFound = formError instanceof ApiError && formError.status === 404;

  const memberTypes = form?.memberTypes ?? [];
  const title = form?.title ?? "Joun club";
  const description = "Please fill choose a memebership and fille out the rest of the form"
  const formId = form?.formId;

  const { currentStep, isLastStep, goToStep, setCurrentStep } = useWizard(
    steps,
    values,
    validate,
    setErrors
  );
  const { register, loading: submitting } = useRegister(clubId, formId ?? "");
  const [registration, setRegistration] = useState<RegistrationDto | null>(null);

  const { toast, open: toastOpen, setOpen: setToastOpen, showToast } = useToast();

  const registrationOpen =
    !form?.registrationOpens || new Date(form.registrationOpens) <= new Date();

  useEffect(() => {
    if (form && !registrationOpen) {
      showToast({
        title: "Registration is closed",
        description: `This club is not open for registration right now. It will open on ${formatDate(form.registrationOpens)}.`,
        duration: Number.POSITIVE_INFINITY,
      });
    }
  }, [form, registrationOpen, showToast]);

  const options = (memberTypes ?? []).flatMap((memberType) =>
    memberType.id ? [{ value: memberType.id, label: memberType.name ?? memberType.id }] : []
  );

  const selectedMembership =
    options.find((o) => o.value === values.memberTypeId)?.label ??
    values.memberTypeId;

  const reviewRows = steps
    .flatMap((step) => step.fields)
    .map((name) => ({
      label: fieldConfig[name].label,
      value: name === "memberTypeId" ? selectedMembership : values[name],
    }));

  function renderField(name: keyof RegistrationValues) {
    const field = fieldConfig[name];
    const common = {
      label: field.label,
      name: field.name,
      value: values[name],
      onChange: handleChange,
      error: errors[name],
      required: true,
      disabled: !registrationOpen,
    };
    if (field.kind === "dropdown") {
      return (
        <DropDown
          key={name}
          {...common}
          placeholder={field.placeholder}
          options={options}
        />
      );
    }
    return <Input key={name} {...common} type={field.type} />;
  }

  const submitRegistration = async () => {
    if (!isLastStep) return;
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      setCurrentStep(0);
      return;
    }
    if (!formId) {
      showToast({ title: "Please wait", description: "Form is still loading." });
      return;
    }
    try {
      const result = await register(toUserRegistration(values));
      setRegistration(result);
      showToast({
        title: "Registration sent",
        description: "We have received your registration.",
      });
    } catch (err) {
      if (err instanceof ApiError && (err.status === 400 || err.status === 422)) {
        showToast({
          title: "Please check your details",
          description: err.detail ?? "Some of the information was not accepted.",
        });
      } else {
        showToast({
          title: "Something went wrong",
          description: err instanceof Error ? err.message : "Please try again.",
        });
      }
    }
  };

  if (formNotFound) {
    return (
      <div className="w-full max-w-md mx-auto py-6 sm:py-8 px-4 sm:px-6 text-left">
        <p className="text-navy">
          The form does not exist. Ask your club owner or check the clubId in
          the URL.
        </p>
      </div>
    );
  }

  if (registration) {
    return (
      <div className="w-full max-w-md mx-auto py-6 sm:py-8 px-4 sm:px-6 text-left">
        <h2 className="text-xl font-bold text-navy">Thanks for registering!</h2>
        <p className="mt-2">
          We have received your registration
          {registration.email ? ` for ${registration.email}` : ""}.
        </p>
        <Toast
          open={toastOpen}
          onOpenChange={setToastOpen}
          title={toast.title}
          description={toast.description}
          duration={toast.duration}
        />
      </div>
    );
  }

  return (
    <form
      className="flex flex-col gap-4 w-full max-w-md mx-auto py-6 sm:py-8 px-4 sm:px-6 text-left"
      onSubmit={(e) => {
        e.preventDefault();
        if (!isLastStep) goToStep(currentStep + 1);
      }}
      noValidate
    >
      <Wizard
        steps={steps}
        currentStep={currentStep}
        onStepClick={goToStep}
      />

      {currentStep === 0 && (
        <>
          <h2 data-testid="formTitle" className="text-xl font-bold text-navy">{title}</h2>
          <h3 className="text-md font-bold text-navy">{description}</h3>
        </>
      )}

      {!isLastStep && steps[currentStep].fields.map(renderField)}

      {currentStep === 2 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-xl font-bold text-navy">{title}</h2>
          <h3 className="text-md font-bold text-navy">Review your details</h3>
          <dl className="flex flex-col gap-2">
            {reviewRows.map((row) => (
              <div key={row.label} className="flex flex-col">
                <dt className="text-sm text-steel">{row.label}</dt>
                <dd className="text-navy">{row.value || "—"}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      <div className="flex flex-wrap gap-2 pt-2">
        <Button
          data-testid="prevbutton"
          type="button"
          className="grow basis-32"
          buttonText="Previous"
          onClick={() => goToStep(currentStep - 1)}
          disabled={currentStep === 0 || !registrationOpen}
        />
        {isLastStep ? (
          <Button
            data-testid="sendbutton"
            type="button"
            isBlue
            className="grow basis-32"
            buttonText={submitting ? "Sending..." : "Send"}
            onClick={submitRegistration}
            disabled={submitting || !registrationOpen}
          />
        ) : (
          <Button
            data-testid="nextbutton"
            type="button"
            isBlue
            className="grow basis-32"
            buttonText="Next"
            onClick={() => goToStep(currentStep + 1)}
            disabled={!registrationOpen}
          />
        )}
      </div>

      <Toast
        data-testid={"toast"+title}
        open={toastOpen}
        onOpenChange={setToastOpen}
        title={toast.title}
        description={toast.description}
        duration={toast.duration}
      />
    </form>
  );
}
