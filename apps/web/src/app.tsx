import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/layout/layout';
import { AssetsPage } from './pages/assets-page';
import { DashboardPage } from './pages/dashboard-page';
import { InsightsPage } from './pages/insights-page';
import { WalletsPage } from './pages/wallets-page';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/assets" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="assets" element={<AssetsPage />} />
          <Route path="assets/:id" element={<AssetsPage />} />
          <Route path="wallets" element={<WalletsPage />} />
          <Route path="wallets/:id" element={<WalletsPage />} />
          <Route path="insights" element={<InsightsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
