import { Button, FormControl, IconButton, Input, Spinner } from '@airbus/components-react';
import { Visibility, VisibilityOff } from '@airbus/icons/react';
import { LoginPayload, useAuth } from '@df/utils';
import { useEffect, useState } from 'react';
import './login.css';
import { useTranslation } from 'react-i18next';

interface LoginFormProps {
  onSuccess: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const { status, login } = useAuth();
  const { t } = useTranslation('login')

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
          ? t('invalid_credentials')
          : t('unable_login');
      setErrors(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const disabledLogin = loading || status === 'bootstrapping' || errors;

  return (
    <form className="loginForm" onSubmit={handleLogin}>
      <FormControl label={t('username')} required>
        <Input
          className={'loginInputs'}
          value={form.username}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setForm((s) => ({ ...s, username: e.target.value }))
          }
        />
      </FormControl>
      <FormControl label={t('password')} error={!!errors} errorText={errors ?? ''} required>
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
        <Button type="submit" variant="primary" onClick={handleLogin}>
          {loading ? <Spinner size="small" layout="inline" /> : t('login')}
        </Button>
      </div>
    </form>
  );
}
