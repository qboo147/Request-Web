import ReactDOM from 'react-dom/client';
import './index.css';
import { lazy, Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '@lib/redux/redux.config.ts';

const root = ReactDOM.createRoot(document.getElementById('root')!);
const App = lazy(() => import("./App.tsx"));

root.render(
  <BrowserRouter>
    <Provider store={store}>
      <Suspense>
        <App />
      </Suspense>
      <Toaster toastOptions={{
        position: 'top-right',
        style: {
          background: '#475569',
          color: '#ffffff'
        }
      }} />
    </Provider>
  </BrowserRouter>,
);
