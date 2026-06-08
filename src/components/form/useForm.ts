import React from "react";

export function useForm<T extends Record<string, string>>(
  initialValues: T,
  validate?: (values: T) => Record<string, string>
) {
  const [values, setValues] = React.useState<T>(initialValues);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  function handleChange(name: string, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(onValid: (values: T) => void) {
    return (e: SubmitEvent) => {
      e.preventDefault();
      const validationErrors = validate ? validate(values) : {};
      setErrors(validationErrors);

      if (Object.keys(validationErrors).length === 0) {
        onValid(values);
      }
    };
  }

  return { values, errors, setErrors, handleChange, handleSubmit };
}
