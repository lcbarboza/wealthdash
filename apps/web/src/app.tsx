export function App() {
  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900">
      <header className="border-b border-neutral-200 bg-white px-6 py-4">
        <h1 className="text-2xl font-bold text-primary-600">Wealth Dash</h1>
        <p className="text-sm text-neutral-500">Portfolio tracker</p>
      </header>

      <main className="mx-auto max-w-4xl p-6">
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
      </main>
    </div>
  );
}
