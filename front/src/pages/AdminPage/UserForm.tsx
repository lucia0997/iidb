import { useMemo } from "react";
import { useGroupOptions } from "../../hooks/AdminPage/useGroupOptions";
import { UserFormProps } from "./AdminPage.types";
import { useUserForm } from "../../hooks/AdminPage/useUserForm";
import { Button, Checkbox, FormControl, Input, Select } from "@airbus/components-react";

export const UserForm = ({ initial, submitting, onSubmit, mode }: UserFormProps) => {

  const { groupOptions, loadingGroups } = useGroupOptions()

  const options = useMemo(() => [...groupOptions], [groupOptions]);

  const {
    mode: inferredMode,
    apiErrorMsg,
    isSubmitting,
    isDirty,
    username,
    firstName,
    lastName,
    email,
    isActive,
    groupSelect,
    handleSubmit
  } = useUserForm({ initial, onSubmit, mode })

  const effectiveMode = mode ?? inferredMode;

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
      {effectiveMode === 'create' ? (
        <>
          <FormControl
            label="Username"
            required
            error={!!username.error}
            errorText={username.error}
          >
            <Input
              className={'userFormInputs'}
              value={username.value}
              onChange={username.onChange}
              onBlur={username.onBlur}
              placeholder="UXXXXX / CXXXXX"
            />
          </FormControl>
        </>
      ) : (
        <>
          <FormControl label="Username" required>
            <Input value={username.value} disabled />
          </FormControl>
          <FormControl label="First name" required>
            <Input
              disabled
              className={'userFormInputs'}
              value={firstName.value}
              onChange={firstName.onChange}
              onBlur={firstName.onBlur}
              placeholder="First Name"
            />
          </FormControl>
          <FormControl label="Last name" required>
            <Input
              disabled
              className={'userFormInputs'}
              value={lastName.value}
              onChange={lastName.onChange}
              onBlur={lastName.onBlur}
              placeholder="Last Name"
            />
          </FormControl>
          <FormControl
            label="Email"
            required
            error={!!email.error}
            errorText={email.error}
          >
            <Input
              disabled
              className={'userFormInputs'}
              value={email.value}
              onChange={email.onChange}
              onBlur={email.onBlur}
              placeholder="example@example.es"
            />
          </FormControl>
        </>
      )}

      <FormControl
        label="Groups"
        required
        error={!!groupSelect.error}
        errorText={groupSelect.error}
      >
        <Select
          placeholder="Select Groups"
          options={options}
          loading={loadingGroups}
          value={groupSelect.value}
          onChange={groupSelect.onChange}
          onBlur={groupSelect.onBlur}
        />
      </FormControl>
      {mode === 'edit' && (
        <FormControl label="Active">
          <Checkbox
            checked={!!isActive.checked}
            onChange={isActive.onChange}
            onBlur={isActive.onBlur}
          />
        </FormControl>
      )}
      {apiErrorMsg && <div style={{ color: 'crimson' }}>{apiErrorMsg}</div>}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <Button
          type="submit"
          variant="primary"
          disabled={submitting || isSubmitting || !isDirty}
        >
          {submitting || isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
};