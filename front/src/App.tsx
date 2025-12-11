import { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@airbus/components-react';
import { ToastProvider } from '@df/utils';
import { ApiClientProvider, AuthProvider, AxiosHttpClient } from '@df/utils';
import { LoadingScreen } from '@df/ui';

import AppRoutes from './router/AppRoutes';
import { ToastViewport } from './components/Toast/ToastViewport';

// Client instances
const queryClient = new QueryClient();
const axiosClient = new AxiosHttpClient({ baseURL: import.meta.env.VITE_API_URL ?? '/api' });
const basename = import.meta.env.BASE_URL;

export default function App() {
  return (
    <>
      <BrowserRouter basename={basename}>
        <QueryClientProvider client={queryClient}>
          <ApiClientProvider client={axiosClient}>
            <AuthProvider>
              <ToastProvider>
                <ThemeProvider brand="airbus">
                  <Suspense fallback={<LoadingScreen />}>
                    <AppRoutes />
                  </Suspense>
                  <ToastViewport />
                </ThemeProvider>
              </ToastProvider>
            </AuthProvider>
          </ApiClientProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </>
  );
}
