import { Suspense, useMemo } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@airbus/components-react';
//import { ToastProvider } from '@df/utils';
import { ApiClientProvider, AuthProvider, AxiosHttpClient } from '@df/utils';
import { LoadingScreen } from '@df/ui';

import AppRoutes from './router/AppRoutes';

// Client instances
const queryClient = new QueryClient();
const axiosClient = new AxiosHttpClient({ baseURL: import.meta.env.VITE_API_URL ?? '/api' });

export default function App() {
  return (
    <>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <ApiClientProvider client={axiosClient}>
            <AuthProvider>
              <ThemeProvider brand="airbus">
                {/* <ToastProvider>  */}
                <Suspense fallback={<LoadingScreen />}>
                  <AppRoutes />
                </Suspense>
                {/* </ToastProvider> */}
              </ThemeProvider>
            </AuthProvider>
          </ApiClientProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </>
  );
}
