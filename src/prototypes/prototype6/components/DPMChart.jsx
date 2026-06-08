import { useState, useRef, useEffect } from 'react';
import { CHART_DATA } from '../data/paymentMethods';

export default function DPMChart() {
  const [region, setRegion] = useState('Europe');
  const canvasRef = useRef(null);
  const data = CHART_DATA[region];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const padding = { top: 20, right: 20, bottom: 30, left: 40 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    ctx.clearRect(0, 0, width, height);

    const allValues = [...data.dpmOn, ...data.dpmOff];
    const minVal = Math.floor(Math.min(...allValues) - 0.5);
    const maxVal = Math.ceil(Math.max(...allValues) + 0.5);
    const range = maxVal - minVal;

    const toX = (i) => padding.left + (i / (data.labels.length - 1)) * chartW;
    const toY = (v) => padding.top + chartH - ((v - minVal) / range) * chartH;

    // Grid lines
    ctx.strokeStyle = '#ebeef1';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (i / 4) * chartH;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
    }

    // Y-axis labels
    ctx.fillStyle = '#6c7688';
    ctx.font = '11px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      const val = minVal + (range * (4 - i)) / 4;
      const y = padding.top + (i / 4) * chartH;
      ctx.fillText(`${val.toFixed(1)}%`, padding.left - 8, y + 4);
    }

    // X-axis labels
    ctx.textAlign = 'center';
    data.labels.forEach((label, i) => {
      if (i % 2 === 0) {
        ctx.fillText(label, toX(i), height - 8);
      }
    });

    // DPM OFF line (baseline/ghost)
    ctx.strokeStyle = '#d8dee4';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    data.dpmOff.forEach((v, i) => {
      if (i === 0) ctx.moveTo(toX(i), toY(v));
      else ctx.lineTo(toX(i), toY(v));
    });
    ctx.stroke();
    ctx.setLineDash([]);

    // DPM ON line
    ctx.strokeStyle = '#675dff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    data.dpmOn.forEach((v, i) => {
      if (i === 0) ctx.moveTo(toX(i), toY(v));
      else ctx.lineTo(toX(i), toY(v));
    });
    ctx.stroke();

    // Fill under DPM ON
    ctx.fillStyle = 'rgba(103, 93, 255, 0.06)';
    ctx.beginPath();
    ctx.moveTo(toX(0), toY(data.dpmOn[0]));
    data.dpmOn.forEach((v, i) => ctx.lineTo(toX(i), toY(v)));
    ctx.lineTo(toX(data.dpmOn.length - 1), toY(data.dpmOff[data.dpmOff.length - 1]));
    data.dpmOff.slice().reverse().forEach((v, i) => {
      ctx.lineTo(toX(data.dpmOff.length - 1 - i), toY(v));
    });
    ctx.closePath();
    ctx.fill();

  }, [region, data]);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-label-medium-emphasized">Conversion impact by region</h3>
          <p className="text-body-small text-subdued mt-0.5">Estimated impact of dynamic payment methods on checkout conversion</p>
        </div>
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="text-body-small border border-border rounded-lg px-3 py-1.5 bg-surface"
        >
          {Object.keys(CHART_DATA).map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>
      <div className="border border-border rounded-lg p-4 bg-surface">
        <canvas ref={canvasRef} width={560} height={200} className="w-full h-[200px]" />
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-[#675dff] rounded" />
            <span className="text-body-small text-subdued">DPM ON</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-[#d8dee4] rounded border-dashed" style={{ borderTop: '2px dashed #d8dee4', height: 0 }} />
            <span className="text-body-small text-subdued">DPM OFF (baseline)</span>
          </div>
        </div>
        <p className="text-body-small text-subdued mt-2 italic">
          Estimated based on similar merchants in your category. Actual results may vary.
        </p>
      </div>
    </div>
  );
}
