import { useMemo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Filler,
  type ChartData,
  type ChartOptions,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import type { TrendDataPoint } from '@/lib/types'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend, Filler)

export interface TrendSeries {
  key: keyof TrendDataPoint
  label: string
  color: string
}

interface TrendChartProps {
  points: TrendDataPoint[]
  series: TrendSeries[]
  height?: number
}

/**
 * Thin chart.js wrapper for usage trends. Reads CSS custom properties so the
 * chart follows the active Astryx theme (and dark mode) instead of hardcoding.
 */
export function TrendChart({ points, series, height = 260 }: TrendChartProps) {
  const textColor = useThemeColor('--color-text-secondary', '#64748b')
  const gridColor = useThemeColor('--color-border-subtle', 'rgba(148,163,184,0.2)')

  const data = useMemo<ChartData<'line'>>(() => {
    return {
      labels: points.map((p) => p.date),
      datasets: series.map((s) => ({
        label: s.label,
        data: points.map((p) => Number(p[s.key] ?? 0)),
 borderColor: s.color,
        backgroundColor: s.color + '22',
        tension: 0.3,
        fill: true,
        pointRadius: points.length > 40 ? 0 : 2,
        borderWidth: 2,
      })),
    }
  }, [points, series])

  const options = useMemo<ChartOptions<'line'>>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { labels: { color: textColor } },
        tooltip: { enabled: true },
      },
      scales: {
        x: { ticks: { color: textColor, maxRotation: 0, autoSkip: true }, grid: { color: gridColor } },
        y: { ticks: { color: textColor }, grid: { color: gridColor }, beginAtZero: true },
      },
    }),
    [textColor, gridColor],
  )

  return (
    <div style={{ height }}>
      <Line data={data} options={options} />
    </div>
  )
}

function useThemeColor(cssVar: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback
  const v = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim()
  return v || fallback
}
