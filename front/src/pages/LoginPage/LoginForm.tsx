import { Button, FormControl, IconButton, Input, Spinner } from '@airbus/components-react';
import { Visibility, VisibilityOff } from '@airbus/icons/react';
import { LoginPayload, useAuth } from '@df/utils';
import { useEffect, useState } from 'react';
import './login.css';

interface LoginFormProps {
  onSuccess: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const { status, login } = useAuth();

  const [form, setForm] = useState<LoginPayload>({
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      onSuccess();
    }
  }, [status]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(null);
    setLoading(true);

    try {
      console.log(form);
      await login(form);
    } catch (error: any) {
      const errorMessage =
        error.response.status === 401
          ? 'Invalid credentials.'
          : 'Unable to login. Please, try again.';
      setErrors(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const disabledLogin = loading || status === 'bootstrapping' || errors;

  return (
    <form className="loginForm" onSubmit={handleLogin}>
      <FormControl label="Username" required>
        <Input
          className={'loginInputs'}
          value={form.username}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setForm((s) => ({ ...s, username: e.target.value }))
          }
        />
      </FormControl>
      <FormControl label="Password" error={!!errors} errorText={errors ?? ''} required>
        <Input
          className={'loginInputs'}
          value={form.password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setForm((s) => ({ ...s, password: e.target.value }))
          }
          type={showPassword ? 'text' : 'password'}
          endAdornment={
            <IconButton variant="ghost" size="small" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          }
        />
      </FormControl>
      <div className={'loginButton'}>
        <Button type="submit" variant="primary" disabled={disabledLogin} onClick={handleLogin}>
          {loading ? <Spinner size="small" layout="inline" /> : 'Login'}
        </Button>
      </div>
    </form>
  );
}
