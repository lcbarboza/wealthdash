import type { AllocationInsightsResponse } from '../../types/insights';
import { InsightCard } from './insight-card';
import { InsightsSummaryBanner } from './insights-summary';

interface AllocationSectionProps {
  data: AllocationInsightsResponse;
}

export function AllocationSection({ data }: AllocationSectionProps) {
  return (
    <section className="space-y-4">
      <div className="border-b border-neutral-100 pb-3">
        <h3 className="text-sm font-semibold tracking-wide text-neutral-900 uppercase">
          Asset Allocation Analysis
        </h3>
        <p className="mt-1 text-xs text-neutral-500">
          Rule-based analysis of your portfolio allocation and diversification
        </p>
      </div>

      <InsightsSummaryBanner summary={data.summary} />

      {data.insights.length > 0 && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {data.insights.map((insight) => (
            <InsightCard
              key={insight.id}
              severity={insight.severity}
              title={insight.title}
              description={insight.description}
            />
          ))}
        </div>
      )}
    </section>
  );
}
