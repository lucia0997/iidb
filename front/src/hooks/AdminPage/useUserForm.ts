import { useMemo, useState } from "react";
import { UserFormValues } from "../../pages/AdminPage/AdminPage.types";
import { FormErrors, useApplyApiErrors, useForm } from "@df/utils";

type UseUserFormProps = {
  initial?: Partial<UserFormValues> | null;
  onSubmit: (vals: UserFormValues) => Promise<void> | void;
  mode?: 'create' | 'edit';
};

export const useUserForm = ({ initial, onSubmit, mode: externalMode }: UseUserFormProps) => {
  const inferredMode: 'create' | 'edit' =
    initial && typeof initial.username === 'string' && initial.username.trim().length > 0
      ? 'edit'
      : 'create';

  const finalMode = externalMode ?? inferredMode;

  const [apiErrorMsg, setApiError] = useState<string | null>(null);

  const validate = useMemo(
    () =>
      (v: UserFormValues): FormErrors<UserFormValues> => {
        const e: FormErrors<UserFormValues> = {};
        if (finalMode === 'create') {
          if (!v.username?.trim()) e.username = 'Required';
          if (!v.groups?.length) e.groups = 'Select a group';
        } else {
          if (!v.first_name?.trim()) e.first_name = 'Required';
          if (!v.last_name?.trim()) e.last_name = 'Required';
          if (v.email && !v.email.includes('@')) e.email = 'Invalid email';
          if (!v.groups?.length) e.groups = 'Select a group';
        }
        return e;
      },
    [finalMode]
  );

  const form = useForm<UserFormValues>(
    {
      username: '',
      first_name: '',
      last_name: '',
      email: '',
      groups: [],
      is_active: true,
      ...initial,
    },
    validate
  );

  const applyApiErrors = useApplyApiErrors(
    (errors) => form.setErrors((prev) => ({ ...(prev ?? {}), ...errors })),
    setApiError
  );

  const username = form.bindText('username');
  const firstName = form.bindText('first_name');
  const lastName = form.bindText('last_name');
  const email = form.bindText('email');
  const isActive = form.bindCheckbox('is_active');
  const groupSelect = form.bindSelectSingle(
    'groups',
    (arr) => (Array.isArray(arr) && arr.length ? String(arr[0]) : ''),
    (s) => {
      const n = Number.parseInt(s, 10);
      return Number.isFinite(n) ? [n] : [];
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    await form.submit(async (vals) => {
      try {
        await onSubmit(vals);
      } catch (error) {
        console.error('Caught error in UserForm:', error);
        applyApiErrors(error);
        throw error;
      }
    });
  };

  return {
    mode: finalMode,
    apiErrorMsg,
    setApiError,
    isSubmitting: form.isSubmitting,
    isDirty: form.isDirty,
    username,
    firstName,
    lastName,
    email,
    isActive,
    groupSelect,
    handleSubmit,
  };
};
