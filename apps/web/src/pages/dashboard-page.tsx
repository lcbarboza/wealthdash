export function DashboardPage() {
  return (
    <div className="p-6">
      <h2 className="mb-6 text-xl font-bold text-neutral-900">Dashboard</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-neutral-200 bg-white p-4">
          <p className="text-xs font-medium text-neutral-500">Total Value</p>
          <p className="text-xl font-semibold text-neutral-900">R$ 0,00</p>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-4">
          <p className="text-xs font-medium text-neutral-500">Daily Change</p>
          <p className="text-xl font-semibold text-success-600">+0,00%</p>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-4">
          <p className="text-xs font-medium text-neutral-500">Alerts</p>
          <p className="text-xl font-semibold text-warning-600">0</p>
        </div>
      </div>

      <div className="mt-8 rounded-lg border border-neutral-200 bg-white p-6 text-center">
        <p className="text-sm text-neutral-500">
          Dashboard details will be available here once positions and market data are configured.
        </p>
      </div>
    </div>
  );
}
