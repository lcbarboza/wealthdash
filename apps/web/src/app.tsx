import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/layout/layout';
import { AssetsPage } from './pages/assets-page';
import { DashboardPage } from './pages/dashboard-page';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/assets" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="assets" element={<AssetsPage />} />
          <Route path="assets/:id" element={<AssetsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
