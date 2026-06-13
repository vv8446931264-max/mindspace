"use client";

import { getChartData } from "@/lib/moodEngine";
import type { MoodHistoryEntry } from "@/types";

type Props = {
  history: MoodHistoryEntry[];
};

function moodColor(mood: number): string {
  if (mood === 0) return "#E2E8F0";
  if (mood <= 3) return "#F87171";
  if (mood <= 6) return "#FBBF24";
  return "#52C9A0";
}

const W = 320;
const H = 100;
const PADDING = { top: 8, right: 8, bottom: 24, left: 24 };
const CHART_W = W - PADDING.left - PADDING.right;
const CHART_H = H - PADDING.top - PADDING.bottom;

export default function MoodChart({ history }: Props) {
  const data = getChartData(history);
  const hasData = data.some((d) => d.mood > 0);

  const xStep = CHART_W / 6;

  function xPos(i: number): number {
    return PADDING.left + i * xStep;
  }

  function yPos(mood: number): number {
    if (mood === 0) return PADDING.top + CHART_H; // bottom baseline for missing
    return PADDING.top + CHART_H - ((mood - 1) / 9) * CHART_H;
  }

  const filledPoints = data.filter((d) => d.mood > 0);

  const pathD =
    filledPoints.length > 1
      ? filledPoints
          .map((d, i) => {
            const allIdx = data.indexOf(d);
            const x = xPos(allIdx);
            const y = yPos(d.mood);
            return `${i === 0 ? "M" : "L"} ${x} ${y}`;
          })
          .join(" ")
      : "";

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
        📈 7-Day Mood Trend
      </h3>

      {!hasData ? (
        <div className="h-[100px] flex items-center justify-center bg-slate-50 rounded-xl border border-slate-100">
          <p className="text-sm text-slate-400">
            Log your first entry to see your trend
          </p>
        </div>
      ) : (
        <>
          <svg
            width={W}
            height={H}
            viewBox={`0 0 ${W} ${H}`}
            aria-label="7-day mood trend chart"
            role="img"
            className="w-full h-auto"
          >
            {/* Gridlines */}
            {[2, 5, 8].map((v) => (
              <line
                key={v}
                x1={PADDING.left}
                y1={yPos(v)}
                x2={W - PADDING.right}
                y2={yPos(v)}
                stroke="#F1F5F9"
                strokeWidth={1}
              />
            ))}

            {/* Y axis labels */}
            {[2, 5, 8].map((v) => (
              <text
                key={v}
                x={PADDING.left - 4}
                y={yPos(v) + 4}
                textAnchor="end"
                fontSize={9}
                fill="#94A3B8"
              >
                {v}
              </text>
            ))}

            {/* Area fill */}
            {pathD && (
              <path
                d={`${pathD} V ${PADDING.top + CHART_H} H ${xPos(data.indexOf(filledPoints[0]))} Z`}
                fill="#5B8DEF"
                fillOpacity={0.08}
                strokeLinejoin="round"
              />
            )}

            {/* Line */}
            {pathD && (
              <path
                d={pathD}
                fill="none"
                stroke="#5B8DEF"
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            )}

            {/* Data points */}
            {data.map((d, i) => (
              <circle
                key={d.date}
                cx={xPos(i)}
                cy={d.mood > 0 ? yPos(d.mood) : PADDING.top + CHART_H}
                r={d.mood > 0 ? 4 : 2}
                fill={moodColor(d.mood)}
                stroke="white"
                strokeWidth={1.5}
              />
            ))}

            {/* X axis labels */}
            {data.map((d, i) => (
              <text
                key={d.date}
                x={xPos(i)}
                y={H - 4}
                textAnchor="middle"
                fontSize={9}
                fill="#94A3B8"
              >
                {d.label}
              </text>
            ))}
          </svg>

          {/* Screen-reader-only data table */}
          <table className="sr-only">
            <caption>7-day mood trend</caption>
            <thead>
              <tr>
                <th>Date</th>
                <th>Day</th>
                <th>Mood (1–10)</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.date}>
                  <td>{d.date}</td>
                  <td>{d.label}</td>
                  <td>{d.mood > 0 ? d.mood : "Not logged"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
