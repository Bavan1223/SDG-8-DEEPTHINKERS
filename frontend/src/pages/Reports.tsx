/* ============================================================
   AgriAgent – Reports Page
   Aggregated analytics: yield, water, market trends
   ============================================================ */

import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { YieldChart } from '../components/charts/YieldChart';
import { MarketChart } from '../components/charts/MarketChart';
import { Button } from '../components/common/Button';

const YIELD_DATA = [
  { month: 'Jul', yield: 18, target: 20 },
  { month: 'Aug', yield: 22, target: 20 },
  { month: 'Sep', yield: 25, target: 22 },
  { month: 'Oct', yield: 19, target: 22 },
  { month: 'Nov', yield: 28, target: 25 },
  { month: 'Dec', yield: 30, target: 25 },
];

const MARKET_TREND = [
  { date: 'Jan', price: 2200 }, { date: 'Feb', price: 2450 },
  { date: 'Mar', price: 2600 }, { date: 'Apr', price: 2800 },
];

const WATER_LOG = [
  { month: 'Jan', used: 280000, saved: 40000 },
  { month: 'Feb', used: 310000, saved: 30000 },
  { month: 'Mar', used: 350000, saved: 20000 },
  { month: 'Apr', used: 260000, saved: 60000 },
];

const Reports: React.FC = () => {
  const { t } = useTranslation();
  const reportRef = useRef<HTMLDivElement>(null);

  const printReport = () => {
    const printWindow = window.open('', '_blank', 'width=960,height=800');
    if (!printWindow) return;

    const CHART_H = 140; // px
    const maxYield = Math.max(...YIELD_DATA.map(d => d.yield), ...YIELD_DATA.map(d => d.target));

    const yieldBars = YIELD_DATA.map((d, i) => {
      const actualH   = Math.round((d.yield  / maxYield) * CHART_H);
      const targetH   = Math.round((d.target / maxYield) * CHART_H);
      const above     = d.yield >= d.target;
      const colW      = 60;
      const left      = i * (colW + 10);
      return `
        <!-- month group at x=${left} -->
        <g transform="translate(${left},0)">
          <!-- target bar (grey bg, behind) -->
          <rect x="22" y="${CHART_H - targetH}" width="16" height="${targetH}" rx="3" fill="#94a3b8" opacity="0.55"/>
          <!-- actual bar -->
          <rect x="2"  y="${CHART_H - actualH}" width="16" height="${actualH}"  rx="3" fill="${above ? '#22c55e' : '#f59e0b'}"/>
          <!-- value label -->
          <text x="10" y="${CHART_H - actualH - 4}" text-anchor="middle" font-size="9" font-weight="700" fill="#333">${d.yield}</text>
          <!-- month label -->
          <text x="${colW/2}" y="${CHART_H + 14}" text-anchor="middle" font-size="10" fill="#555" font-weight="500">${d.month}</text>
        </g>`;
    }).join('');

    const svgW   = YIELD_DATA.length * 70;
    const yieldChart = `
      <svg width="100%" viewBox="0 0 ${svgW} ${CHART_H + 30}" xmlns="http://www.w3.org/2000/svg" overflow="visible">
        <!-- baseline -->
        <line x1="0" y1="${CHART_H}" x2="${svgW}" y2="${CHART_H}" stroke="#e2e8f0" stroke-width="1.5"/>
        ${yieldBars}
      </svg>`;

    // SVG line chart for market price
    const prices  = MARKET_TREND.map(d => d.price);
    const minP    = Math.min(...prices) - 200;
    const maxP    = Math.max(...prices) + 200;
    const mW      = 340; const mH = 120;
    const mPoints = MARKET_TREND.map((d, i) => {
      const x = (i / (MARKET_TREND.length - 1)) * (mW - 40) + 20;
      const y = mH - ((d.price - minP) / (maxP - minP)) * (mH - 20) - 10;
      return { x, y, d };
    });
    const polyline = mPoints.map(p => `${p.x},${p.y}`).join(' ');
    const areaPath = `M ${mPoints[0].x},${mH} ` +
      mPoints.map(p => `L ${p.x},${p.y}`).join(' ') +
      ` L ${mPoints[mPoints.length-1].x},${mH} Z`;

    const marketChart = `
      <svg width="100%" viewBox="0 0 ${mW} ${mH + 24}" xmlns="http://www.w3.org/2000/svg">
        <!-- area fill -->
        <defs>
          <linearGradient id="mg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#22c55e" stop-opacity="0.25"/>
            <stop offset="100%" stop-color="#22c55e" stop-opacity="0.03"/>
          </linearGradient>
        </defs>
        <path d="${areaPath}" fill="url(#mg)"/>
        <!-- grid lines -->
        ${[0.25, 0.5, 0.75].map(f => {
          const y = mH - f * (mH - 20) - 10;
          const val = Math.round(minP + f * (maxP - minP));
          return `<line x1="20" y1="${y}" x2="${mW-10}" y2="${y}" stroke="#e2e8f0" stroke-width="0.8"/>
                  <text x="18" y="${y + 3}" text-anchor="end" font-size="8" fill="#999">${val}</text>`;
        }).join('')}
        <!-- baseline -->
        <line x1="20" y1="${mH}" x2="${mW - 10}" y2="${mH}" stroke="#ddd" stroke-width="1"/>
        <!-- line -->
        <polyline points="${polyline}" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linejoin="round"/>
        <!-- dots + labels -->
        ${mPoints.map(p => `
          <circle cx="${p.x}" cy="${p.y}" r="4" fill="#22c55e" stroke="#fff" stroke-width="1.5"/>
          <text x="${p.x}" y="${p.y - 8}" text-anchor="middle" font-size="9" font-weight="700" fill="#333">₹${p.d.price.toLocaleString('en-IN')}</text>
          <text x="${p.x}" y="${mH + 14}" text-anchor="middle" font-size="9" fill="#555">${p.d.date}</text>
        `).join('')}
      </svg>`;

    const waterRows = WATER_LOG.map(row => {
      const eff = Math.round((row.saved / (row.used + row.saved)) * 100);
      return `
        <tr>
          <td style="padding:10px 14px;border-bottom:1px solid #eee;font-weight:600;">${row.month}</td>
          <td style="padding:10px 14px;border-bottom:1px solid #eee;">${row.used.toLocaleString('en-IN')}</td>
          <td style="padding:10px 14px;border-bottom:1px solid #eee;color:#1a7a4a;font-weight:600;">${row.saved.toLocaleString('en-IN')}</td>
          <td style="padding:10px 14px;border-bottom:1px solid #eee;">
            <span style="padding:2px 10px;border-radius:999px;font-size:12px;font-weight:600;background:${eff > 15 ? '#dcfce7' : '#fef9c3'};color:${eff > 15 ? '#15803d' : '#92400e'};">${eff}%</span>
          </td>
        </tr>`;
    }).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8"/>
          <title>AgriAgent – Reports &amp; Analytics</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: 'Segoe UI', Arial, sans-serif; background: #fff; color: #111; padding: 32px; }
            .header { border-bottom: 3px solid #16a34a; padding-bottom: 16px; margin-bottom: 28px; display:flex; justify-content:space-between; align-items:flex-end; }
            .header h1 { font-size: 26px; font-weight: 800; color: #111; }
            .header p  { font-size: 13px; color: #555; margin-top: 4px; }
            .badge     { background: #dcfce7; color: #15803d; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 600; }
            .section   { margin-bottom: 28px; }
            .section-title { font-size: 15px; font-weight: 700; color: #111; margin-bottom: 14px; display:flex; align-items:center; gap:6px; }
            .card      { border: 1px solid #e5e7eb; border-radius: 10px; padding: 20px; background: #fafafa; }
            .charts-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 28px; }
            .chart-bars { display: flex; align-items: flex-end; gap: 6px; height: 140px; padding-top: 20px; }
            .legend    { display: flex; gap: 16px; margin-top: 12px; font-size: 11px; color: #555; }
            .legend-dot{ width: 10px; height: 10px; border-radius: 2px; display: inline-block; margin-right: 4px; }
            table      { width: 100%; border-collapse: collapse; font-size: 13px; }
            thead th   { background: #f0fdf4; color: #166534; text-align: left; padding: 10px 14px; font-weight: 600; border-bottom: 2px solid #bbf7d0; }
            .footer    { margin-top: 32px; border-top: 1px solid #e5e7eb; padding-top: 12px; font-size: 11px; color: #999; display:flex; justify-content:space-between; }
            @media print { body { padding: 16px; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1>🌾 Reports &amp; Analytics</h1>
              <p>Kharif 2025 – Season Report &nbsp;|&nbsp; Generated: ${new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'long', year:'numeric' })}</p>
            </div>
            <span class="badge">AgriAgent Smart Farming OS</span>
          </div>

          <!-- Charts row -->
          <div class="charts-row">
            <!-- Yield Chart -->
            <div class="card">
              <div class="section-title">🌾 Yield Analysis (Quintals/Acre)</div>
              ${yieldChart}
              <div class="legend">
                <span><span class="legend-dot" style="background:#22c55e;"></span>Above target</span>
                <span><span class="legend-dot" style="background:#f59e0b;"></span>Below target</span>
                <span><span class="legend-dot" style="background:#94a3b8;opacity:0.6;"></span>Target</span>
              </div>
            </div>

            <div class="card">
              <div class="section-title">📈 Tomato Price Trend (₹/Quintal)</div>
              ${marketChart}
            </div>
          </div>

          <!-- Water Usage -->
          <div class="section">
            <div class="section-title">💧 Water Usage Report</div>
            <div class="card" style="padding:0;overflow:hidden;">
              <table>
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Water Used (L)</th>
                    <th>Water Saved (L)</th>
                    <th>Efficiency</th>
                  </tr>
                </thead>
                <tbody>${waterRows}</tbody>
              </table>
            </div>
          </div>

          <div class="footer">
            <span>Generated by AgriAgent v1.0 – Smart Farming Operating System</span>
            <span>Confidential – For authorized farmers only</span>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    setTimeout(() => { printWindow.focus(); printWindow.print(); printWindow.close(); }, 400);
  };




  return (
    <div className="p-4 md:p-8 animate-fade-in">
      <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">{t('reports.title')}</h1>
          <p className="text-slate-400 mt-1">Kharif 2025 – Season Report</p>
        </div>
        <Button
          id="download-report-btn"
          variant="secondary"
          icon={<span>📥</span>}
          onClick={printReport}
        >
          {t('reports.download')}
        </Button>
      </div>

      {/* ── Everything inside reportRef gets captured for printing ── */}
      <div ref={reportRef}>
        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <YieldChart data={YIELD_DATA} />
          <MarketChart data={MARKET_TREND} cropName="Tomato" />
        </div>

        {/* Water log table */}
        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-surface-border">
            <h2 className="text-base font-semibold text-white">💧 {t('reports.water_usage')}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-border">
                  {['Month', 'Water Used (L)', 'Water Saved (L)', 'Efficiency'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs text-slate-400 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {WATER_LOG.map((row) => {
                  const eff = Math.round((row.saved / (row.used + row.saved)) * 100);
                  return (
                    <tr key={row.month} className="border-b border-surface-border/50 hover:bg-surface-border/30">
                      <td className="px-4 py-3 font-medium text-white">{row.month}</td>
                      <td className="px-4 py-3 text-slate-300">{row.used.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-primary-400 font-medium">{row.saved.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${eff > 15 ? 'bg-primary-900/50 text-primary-300' : 'bg-amber-900/50 text-amber-300'}`}>
                          {eff}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
