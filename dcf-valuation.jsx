import { useState, useCallback } from "react";

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #0a0a0f;
  --surface: #111118;
  --surface2: #1a1a24;
  --border: #252535;
  --accent: #00e5ff;
  --accent2: #ff6b35;
  --text: #e8e8f0;
  --muted: #6b6b80;
  --green: #00d97e;
  --red: #ff4757;
  --gold: #ffd700;
}

body { background: var(--bg); color: var(--text); font-family: 'Syne', sans-serif; min-height: 100vh; }

.app {
  min-height: 100vh;
  background:
    radial-gradient(ellipse at 0% 0%, rgba(0,229,255,0.06) 0%, transparent 50%),
    radial-gradient(ellipse at 100% 100%, rgba(255,107,53,0.06) 0%, transparent 50%),
    var(--bg);
}

.header {
  border-bottom: 1px solid var(--border);
  padding: 20px 40px;
  display: flex; align-items: center; gap: 16px;
  background: rgba(17,17,24,0.8);
  backdrop-filter: blur(20px);
  position: sticky; top: 0; z-index: 100;
}
.logo { font-size: 22px; font-weight: 800; letter-spacing: -0.5px; color: var(--accent); }
.logo span { color: var(--text); }
.header-sub {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; color: var(--muted); letter-spacing: 2px; text-transform: uppercase;
  border-left: 1px solid var(--border); padding-left: 16px;
}

.main { max-width: 1400px; margin: 0 auto; padding: 40px; }

.apikey-bar {
  display: flex; align-items: center; gap: 12px;
  background: var(--surface2); border: 1px solid var(--border);
  padding: 12px 20px; margin-bottom: 28px;
}
.apikey-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); white-space: nowrap;
}
.apikey-input {
  flex: 1; background: transparent; border: none; outline: none;
  font-family: 'JetBrains Mono', monospace; font-size: 13px; color: var(--text); letter-spacing: 1px;
}
.apikey-input::placeholder { color: var(--muted); }
.apikey-status {
  font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 1px;
  padding: 4px 10px; white-space: nowrap;
}
.apikey-status.set { color: var(--green); background: rgba(0,217,126,0.1); }
.apikey-status.unset { color: var(--muted); background: rgba(255,255,255,0.04); }

.ticker-section { display: flex; gap: 16px; align-items: flex-end; margin-bottom: 40px; }
.input-group { display: flex; flex-direction: column; gap: 8px; }
.input-label { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); }

.ticker-input {
  background: var(--surface); border: 1px solid var(--border); color: var(--text);
  font-family: 'JetBrains Mono', monospace; font-size: 28px; font-weight: 500;
  padding: 14px 20px; width: 200px; outline: none; text-transform: uppercase;
  letter-spacing: 4px; transition: border-color 0.2s;
}
.ticker-input:focus { border-color: var(--accent); }
.ticker-input::placeholder { color: var(--muted); font-size: 20px; letter-spacing: 2px; }

.analyze-btn {
  background: var(--accent); color: #000; border: none;
  font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700;
  letter-spacing: 1px; text-transform: uppercase; padding: 14px 32px;
  cursor: pointer; height: 64px; transition: all 0.2s;
}
.analyze-btn:hover { background: #33eaff; transform: translateY(-1px); }
.analyze-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

.loading-spinner {
  display: inline-block; width: 16px; height: 16px;
  border: 2px solid rgba(0,0,0,0.3); border-top-color: #000;
  border-radius: 50%; animation: spin 0.8s linear infinite;
  margin-right: 8px; vertical-align: middle;
}
@keyframes spin { to { transform: rotate(360deg); } }

.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; }
.grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; margin-bottom: 24px; }
.grid-4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; margin-bottom: 24px; }

.card {
  background: var(--surface); border: 1px solid var(--border);
  padding: 24px; position: relative; overflow: hidden;
}
.card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, var(--accent), transparent); opacity: 0.5;
}
.card-accent2::before { background: linear-gradient(90deg, var(--accent2), transparent); }
.card-green::before  { background: linear-gradient(90deg, var(--green), transparent); }
.card-gold::before   { background: linear-gradient(90deg, var(--gold), transparent); }

.card-title { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin-bottom: 12px; }
.metric-value { font-size: 36px; font-weight: 800; letter-spacing: -1px; color: var(--text); line-height: 1; }
.metric-value.accent  { color: var(--accent); }
.metric-value.green   { color: var(--green); }
.metric-value.gold    { color: var(--gold); }
.metric-value.accent2 { color: var(--accent2); }
.metric-sub { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--muted); margin-top: 6px; }

.upside { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 500; margin-top: 8px; padding: 4px 10px; display: inline-block; }
.upside.positive { color: var(--green); background: rgba(0,217,126,0.1); }
.upside.negative { color: var(--red); background: rgba(255,71,87,0.1); }

.section-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; margin-top: 8px; }
.section-title { font-size: 18px; font-weight: 700; letter-spacing: -0.3px; }
.section-line { flex: 1; height: 1px; background: var(--border); }
.section-tag { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 2px; color: var(--muted); }

/* DCF Hero */
.dcf-hero {
  background: var(--surface); border: 1px solid var(--border);
  padding: 36px 40px; position: relative; overflow: hidden;
}
.dcf-hero::before {
  content: ''; position: absolute; inset: 0; pointer-events: none;
  background:
    radial-gradient(ellipse at 20% 50%, rgba(0,217,126,0.08) 0%, transparent 60%),
    radial-gradient(ellipse at 80% 50%, rgba(0,229,255,0.05) 0%, transparent 60%);
}
.dcf-hero::after {
  content: 'INTRINSIC VALUE'; position: absolute; top: 20px; right: 28px;
  font-family: 'JetBrains Mono', monospace; font-size: 10px;
  letter-spacing: 3px; color: var(--border); font-weight: 500;
}
.dcf-hero-inner { display: flex; align-items: center; position: relative; z-index: 1; }
.dcf-hero-main  { flex: 1; }
.dcf-hero-label { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: var(--muted); margin-bottom: 10px; }
.dcf-hero-value { font-size: 80px; font-weight: 800; letter-spacing: -4px; line-height: 1; color: var(--green); text-shadow: 0 0 60px rgba(0,217,126,0.3); }
.dcf-hero-value.overvalued { color: var(--red); text-shadow: 0 0 60px rgba(255,71,87,0.3); }
.dcf-hero-sub { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: var(--muted); margin-top: 10px; }

.dcf-divider { width: 1px; height: 120px; background: var(--border); margin: 0 40px; }
.dcf-hero-stats { display: flex; gap: 40px; }
.dcf-stat { display: flex; flex-direction: column; gap: 6px; }
.dcf-stat-label { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); }
.dcf-stat-val { font-family: 'JetBrains Mono', monospace; font-size: 22px; font-weight: 500; color: var(--text); }

.dcf-verdict {
  margin-top: 20px; padding: 14px 20px;
  display: inline-flex; align-items: center; gap: 12px;
  border: 1px solid; position: relative; z-index: 1;
}
.dcf-verdict.buy     { border-color: rgba(0,217,126,0.3); background: rgba(0,217,126,0.08); color: var(--green); }
.dcf-verdict.sell    { border-color: rgba(255,71,87,0.3);  background: rgba(255,71,87,0.08);  color: var(--red); }
.dcf-verdict.neutral { border-color: rgba(255,215,0,0.3);  background: rgba(255,215,0,0.08);  color: var(--gold); }
.dcf-verdict-text { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 500; }

.dcf-formula-strip {
  background: var(--surface2); border: 1px solid var(--border); border-top: none;
  padding: 14px 40px; display: flex; gap: 8px; align-items: center; flex-wrap: wrap;
  font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--muted);
  margin-bottom: 24px;
}
.formula-piece  { color: var(--text); }
.formula-op     { color: var(--muted); padding: 0 4px; }
.formula-result { color: var(--accent); font-weight: 500; }
.formula-arrow  { color: var(--muted); padding: 0 8px; font-size: 16px; }

.slider-row { display: flex; align-items: center; gap: 16px; margin-bottom: 18px; }
.slider-label { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--muted); width: 160px; flex-shrink: 0; }
.slider-label strong { display: block; font-size: 12px; color: var(--text); font-weight: 500; }
input[type="range"] { flex: 1; -webkit-appearance: none; height: 2px; background: var(--border); outline: none; cursor: pointer; }
input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; background: var(--accent); cursor: pointer; border: 2px solid var(--bg); transition: transform 0.1s; }
input[type="range"]::-webkit-slider-thumb:hover { transform: scale(1.3); }
.slider-value { font-family: 'JetBrains Mono', monospace; font-size: 16px; font-weight: 500; color: var(--accent); width: 60px; text-align: right; }

.data-table { width: 100%; border-collapse: collapse; }
.data-table th { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); padding: 10px 12px; text-align: right; border-bottom: 1px solid var(--border); }
.data-table th:first-child { text-align: left; }
.data-table td { font-family: 'JetBrains Mono', monospace; font-size: 13px; padding: 10px 12px; text-align: right; border-bottom: 1px solid rgba(37,37,53,0.5); color: var(--text); }
.data-table td:first-child { text-align: left; color: var(--muted); font-size: 11px; letter-spacing: 1px; }
.data-table tr:last-child td { border-bottom: none; color: var(--accent); font-weight: 500; }
.data-table tr:hover td { background: rgba(255,255,255,0.02); }

.sensitivity-wrapper { overflow-x: auto; }
.sens-table { width: 100%; border-collapse: collapse; font-family: 'JetBrains Mono', monospace; font-size: 12px; }
.sens-table th { padding: 10px 14px; text-align: center; font-size: 10px; letter-spacing: 1px; color: var(--muted); border-bottom: 1px solid var(--border); }
.sens-table th.corner { background: var(--surface2); }
.sens-table th.col-header { color: var(--accent); }
.sens-table td { padding: 9px 14px; text-align: center; border: 1px solid rgba(37,37,53,0.3); transition: all 0.15s; }
.sens-table td.row-label { text-align: left; color: var(--accent2); font-size: 11px; background: rgba(255,107,53,0.05); }
.sens-table td:hover { z-index: 1; transform: scale(1.05); }
.sens-cell-low      { background: rgba(255,71,87,0.15);  color: var(--red); }
.sens-cell-mid-low  { background: rgba(255,71,87,0.06);  color: #ff8a95; }
.sens-cell-neutral  { background: rgba(255,255,255,0.04); color: var(--text); }
.sens-cell-mid-high { background: rgba(0,217,126,0.06);  color: #66e8b4; }
.sens-cell-high     { background: rgba(0,217,126,0.15);  color: var(--green); }
.sens-cell-base     { outline: 2px solid var(--accent); outline-offset: -2px; }

.chart-bar-row  { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
.chart-bar-label{ font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--muted); width: 80px; text-align: right; }
.chart-bar-wrap { flex: 1; background: var(--border); height: 20px; }
.chart-bar-fill { height: 100%; background: linear-gradient(90deg, var(--accent), rgba(0,229,255,0.4)); transition: width 0.6s ease; }
.chart-bar-val  { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--accent); width: 80px; }

.company-strip { display: flex; gap: 24px; align-items: center; margin-bottom: 32px; padding: 20px 24px; background: var(--surface); border: 1px solid var(--border); flex-wrap: wrap; }
.company-name  { font-size: 28px; font-weight: 800; letter-spacing: -0.5px; }
.company-sector{ font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--muted); margin-top: 4px; }
.company-stat  { text-align: center; padding: 0 20px; border-left: 1px solid var(--border); }
.company-stat-val  { font-family: 'JetBrains Mono', monospace; font-size: 18px; font-weight: 500; }
.company-stat-label{ font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--muted); letter-spacing: 1.5px; margin-top: 3px; }

.wacc-breakdown { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin-top: 16px; }
.wacc-item { background: var(--surface2); border: 1px solid var(--border); padding: 12px; }
.wacc-item-label { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--muted); letter-spacing: 1px; margin-bottom: 4px; }
.wacc-item-val   { font-family: 'JetBrains Mono', monospace; font-size: 16px; font-weight: 500; color: var(--text); }

.note-box  { background: rgba(0,229,255,0.05); border: 1px solid rgba(0,229,255,0.15); color: var(--muted); padding: 12px 16px; font-family: 'JetBrains Mono', monospace; font-size: 11px; margin-top: 16px; line-height: 1.6; }
.error-box { background: rgba(255,71,87,0.1); border: 1px solid rgba(255,71,87,0.3); color: var(--red); padding: 16px 20px; font-family: 'JetBrains Mono', monospace; font-size: 13px; margin-bottom: 24px; }

.placeholder { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 100px 40px; text-align: center; gap: 16px; }
.placeholder-icon  { font-size: 64px; opacity: 0.3; }
.placeholder-title { font-size: 28px; font-weight: 800; letter-spacing: -0.5px; opacity: 0.5; }
.placeholder-sub   { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: var(--muted); max-width: 400px; line-height: 1.6; }

@media (max-width: 900px) {
  .main { padding: 20px; }
  .grid-4 { grid-template-columns: 1fr 1fr; }
  .grid-3, .grid-2 { grid-template-columns: 1fr; }
  .wacc-breakdown { grid-template-columns: 1fr 1fr; }
  .dcf-hero-inner { flex-direction: column; align-items: flex-start; }
  .dcf-divider { display: none; }
  .dcf-hero-stats { flex-wrap: wrap; gap: 20px; margin-top: 20px; }
  .dcf-hero-value { font-size: 52px; }
}
`;

const fmt  = (n, dec = 1) => (n == null || isNaN(n) ? "—" : Number(n).toFixed(dec));
const fmtB = (n) => {
  if (n == null || isNaN(n)) return "—";
  const abs = Math.abs(n);
  if (abs >= 1e12) return `$${(n/1e12).toFixed(2)}T`;
  if (abs >= 1e9)  return `$${(n/1e9).toFixed(2)}B`;
  if (abs >= 1e6)  return `$${(n/1e6).toFixed(2)}M`;
  return `$${Number(n).toFixed(0)}`;
};
const fmtP = (n) => (n == null || isNaN(n) ? "—" : `${(n*100).toFixed(1)}%`);

function runDCF({ fcf, revenue, ebitda, cash, debt, shares, wacc, growthRate, terminalGrowth, projYears }) {
  const w = wacc / 100, g = growthRate / 100, tg = terminalGrowth / 100;
  let baseFCF = fcf > 0 ? fcf : ebitda * 0.6;
  if (!baseFCF || baseFCF <= 0) baseFCF = revenue * 0.08;

  const projectedFCF = [];
  let pv = 0;
  for (let i = 1; i <= projYears; i++) {
    const cf = baseFCF * Math.pow(1 + g, i);
    const discounted = cf / Math.pow(1 + w, i);
    projectedFCF.push({ year: `Y${i}`, cf, discounted });
    pv += discounted;
  }
  const terminalFCF   = baseFCF * Math.pow(1 + g, projYears) * (1 + tg);
  const terminalValue = terminalFCF / (w - tg);
  const pvTerminal    = terminalValue / Math.pow(1 + w, projYears);
  const enterpriseValue = pv + pvTerminal;
  const equityValue     = enterpriseValue + (cash || 0) - (debt || 0);
  const perShareValue   = shares > 0 ? equityValue / shares : null;
  return { projectedFCF, pv, pvTerminal, terminalValue, enterpriseValue, equityValue, perShareValue };
}

function buildSensitivity(base) {
  const waccRange   = [-2,-1,0,1,2].map(d => base.wacc + d);
  const growthRange = [-2,-1,0,1,2].map(d => base.growthRate + d);
  const matrix = growthRange.map(gr =>
    waccRange.map(wc => runDCF({ ...base, wacc: wc, growthRate: gr }).perShareValue)
  );
  return { waccRange, growthRange, matrix };
}

export default function DCFApp() {
  const [apiKey,      setApiKey]      = useState("");
  const [ticker,      setTicker]      = useState("");
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");
  const [data,        setData]        = useState(null);
  const [assumptions, setAssumptions] = useState({ wacc: 10, growthRate: 5, terminalGrowth: 2.5, projYears: 5 });

  const fetchAndAnalyze = useCallback(async (sym) => {
    if (!sym) return;
    if (!apiKey.trim()) { setError("Please enter your Anthropic API key above."); return; }
    setLoading(true); setError(""); setData(null);

    const prompt = `You are a financial data API. Return ONLY a valid JSON object (no markdown, no backticks, no explanation) for the stock ticker: ${sym.toUpperCase()}

Return this exact JSON structure with real estimated numbers:
{
  "name": "Company Full Name",
  "sector": "Sector / Industry",
  "currentPrice": 0,
  "revenue": 0,
  "ebitda": 0,
  "freeCashFlow": 0,
  "netIncome": 0,
  "totalDebt": 0,
  "cash": 0,
  "sharesOutstanding": 0,
  "beta": 0,
  "revenueGrowth3yr": 0,
  "ebitdaMargin": 0,
  "analystTargetPrice": null,
  "suggestedWACC": 0,
  "suggestedGrowthRate": 0,
  "suggestedTerminalGrowth": 2.5,
  "waccComponents": {
    "riskFreeRate": 4.5,
    "equityRiskPremium": 5.5,
    "costOfDebt": 4.0,
    "taxRate": 0.21,
    "debtWeight": 0.2,
    "equityWeight": 0.8
  }
}

All monetary values must be raw USD numbers (not in billions). Return ONLY the JSON object, nothing else.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey.trim(),
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
          model: "claude-opus-4-6",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }]
        })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || `HTTP ${res.status}`);
      }

      const raw    = await res.json();
      const text   = raw.content?.map(c => c.text || "").join("") || "";
      const clean  = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);

      setData(parsed);
      setAssumptions(a => ({
        ...a,
        wacc:           parsed.suggestedWACC           ?? 10,
        growthRate:     parsed.suggestedGrowthRate      ?? 5,
        terminalGrowth: parsed.suggestedTerminalGrowth  ?? 2.5
      }));
    } catch (e) {
      setError(`Error: ${e.message}. Check your API key and ticker symbol.`);
    } finally {
      setLoading(false);
    }
  }, [apiKey]);

  const handleSubmit = () => fetchAndAnalyze(ticker.trim());

  const dcf  = data ? runDCF({ fcf: data.freeCashFlow, revenue: data.revenue, ebitda: data.ebitda, cash: data.cash, debt: data.totalDebt, shares: data.sharesOutstanding, ...assumptions }) : null;
  const sens = data && dcf ? buildSensitivity({ fcf: data.freeCashFlow, revenue: data.revenue, ebitda: data.ebitda, cash: data.cash, debt: data.totalDebt, shares: data.sharesOutstanding, ...assumptions }) : null;

  const upside = dcf && data?.currentPrice && dcf.perShareValue
    ? ((dcf.perShareValue - data.currentPrice) / data.currentPrice) * 100
    : null;

  const allSensVals = sens ? sens.matrix.flat().filter(Boolean) : [];
  const sensMin = Math.min(...allSensVals);
  const sensMax = Math.max(...allSensVals);
  const getSensClass = (val, isBase) => {
    if (!val) return "";
    const pct = (val - sensMin) / (sensMax - sensMin);
    let cls = pct < 0.2 ? "sens-cell-low" : pct < 0.4 ? "sens-cell-mid-low" : pct < 0.6 ? "sens-cell-neutral" : pct < 0.8 ? "sens-cell-mid-high" : "sens-cell-high";
    if (isBase) cls += " sens-cell-base";
    return cls;
  };

  const maxPV   = dcf ? Math.max(dcf.pv, dcf.pvTerminal) : 1;
  const isOver  = upside !== null && upside < 0;
  const verdict = upside === null ? "neutral" : upside > 15 ? "buy" : upside < -15 ? "sell" : "neutral";
  const verdictMsg = verdict === "buy"
    ? `Undervalued by ${upside?.toFixed(1)}% — trading below intrinsic value`
    : verdict === "sell"
    ? `Overvalued by ${Math.abs(upside||0).toFixed(1)}% — trading above intrinsic value`
    : `Fairly valued — within 15% of intrinsic estimate`;

  return (
    <>
      <style>{STYLE}</style>
      <div className="app">
        <div className="header">
          <div className="logo">DCF<span>Lens</span></div>
          <div className="header-sub">Intrinsic Value Engine</div>
        </div>

        <div className="main">
          {/* API Key */}
          <div className="apikey-bar">
            <div className="apikey-label">Anthropic API Key</div>
            <input className="apikey-input" type="password" placeholder="sk-ant-..." value={apiKey} onChange={e => setApiKey(e.target.value)} />
            <div className={`apikey-status ${apiKey.trim().startsWith("sk-ant") ? "set" : "unset"}`}>
              {apiKey.trim().startsWith("sk-ant") ? "✓ Key set" : "Not set"}
            </div>
          </div>

          {/* Ticker */}
          <div className="ticker-section">
            <div className="input-group">
              <div className="input-label">Stock Ticker</div>
              <input className="ticker-input" value={ticker} onChange={e => setTicker(e.target.value.toUpperCase())} onKeyDown={e => e.key === "Enter" && handleSubmit()} placeholder="AAPL" maxLength={6} />
            </div>
            <button className="analyze-btn" onClick={handleSubmit} disabled={loading || !ticker.trim()}>
              {loading && <span className="loading-spinner" />}
              {loading ? "Analyzing..." : "Run DCF →"}
            </button>
          </div>

          {error && <div className="error-box">⚠ {error}</div>}

          {!data && !loading && (
            <div className="placeholder">
              <div className="placeholder-icon">◎</div>
              <div className="placeholder-title">Enter a Ticker to Begin</div>
              <div className="placeholder-sub">Add your Anthropic API key above, then type any US stock ticker (e.g. AAPL, MSFT, JNJ, TSLA) and press Run DCF.</div>
            </div>
          )}

          {data && dcf && (
            <>
              {/* Company Strip */}
              <div className="company-strip">
                <div style={{ flex: 1 }}>
                  <div className="company-name">{data.name} <span style={{ color: "var(--accent)", fontSize: 20 }}>{ticker.toUpperCase()}</span></div>
                  <div className="company-sector">{data.sector}</div>
                </div>
                <div className="company-stat"><div className="company-stat-val">${fmt(data.currentPrice, 2)}</div><div className="company-stat-label">Current Price</div></div>
                <div className="company-stat"><div className="company-stat-val">{fmtB(data.revenue)}</div><div className="company-stat-label">Revenue (TTM)</div></div>
                <div className="company-stat"><div className="company-stat-val">{fmtP(data.ebitdaMargin)}</div><div className="company-stat-label">EBITDA Margin</div></div>
                <div className="company-stat"><div className="company-stat-val">{fmt(data.beta, 2)}x</div><div className="company-stat-label">Beta</div></div>
                <div className="company-stat"><div className="company-stat-val">{fmtP(data.revenueGrowth3yr)}</div><div className="company-stat-label">3yr Rev CAGR</div></div>
              </div>

              {/* ── DCF INTRINSIC VALUE HERO ── */}
              <div className="section-header">
                <div className="section-title">DCF Intrinsic Value</div>
                <div className="section-line" />
                <div className="section-tag">CORE OUTPUT</div>
              </div>

              <div className="dcf-hero">
                <div className="dcf-hero-inner">
                  <div className="dcf-hero-main">
                    <div className="dcf-hero-label">DCF-Based Intrinsic Value Per Share</div>
                    <div className={`dcf-hero-value${isOver ? " overvalued" : ""}`}>
                      ${dcf.perShareValue != null ? dcf.perShareValue.toFixed(2) : "—"}
                    </div>
                    <div className="dcf-hero-sub">
                      {assumptions.projYears}-year FCF projection · {assumptions.wacc}% WACC · {assumptions.growthRate}% growth · {assumptions.terminalGrowth}% terminal
                    </div>
                    <div className={`dcf-verdict ${verdict}`}>
                      <span style={{ fontSize: 18 }}>{verdict === "buy" ? "◆" : verdict === "sell" ? "◇" : "◈"}</span>
                      <span className="dcf-verdict-text">{verdictMsg}</span>
                    </div>
                  </div>
                  <div className="dcf-divider" />
                  <div className="dcf-hero-stats">
                    <div className="dcf-stat">
                      <div className="dcf-stat-label">Current Price</div>
                      <div className="dcf-stat-val" style={{ color: "var(--gold)" }}>${fmt(data.currentPrice, 2)}</div>
                    </div>
                    <div className="dcf-stat">
                      <div className="dcf-stat-label">Enterprise Value</div>
                      <div className="dcf-stat-val">{fmtB(dcf.enterpriseValue)}</div>
                    </div>
                    <div className="dcf-stat">
                      <div className="dcf-stat-label">Equity Value</div>
                      <div className="dcf-stat-val">{fmtB(dcf.equityValue)}</div>
                    </div>
                    <div className="dcf-stat">
                      <div className="dcf-stat-label">Margin of Safety</div>
                      <div className="dcf-stat-val" style={{ color: upside != null && upside >= 0 ? "var(--green)" : "var(--red)" }}>
                        {upside != null ? `${upside > 0 ? "+" : ""}${upside.toFixed(1)}%` : "—"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Formula Strip */}
              <div className="dcf-formula-strip">
                <span>Σ PV(FCFs)</span>
                <span className="formula-piece">{fmtB(dcf.pv)}</span>
                <span className="formula-op">+</span>
                <span>PV(Terminal Value)</span>
                <span className="formula-piece">{fmtB(dcf.pvTerminal)}</span>
                <span className="formula-op">=</span>
                <span>Enterprise Value</span>
                <span className="formula-piece">{fmtB(dcf.enterpriseValue)}</span>
                <span className="formula-op">+ Cash {fmtB(data.cash)} − Debt {fmtB(data.totalDebt)}</span>
                <span className="formula-op">=</span>
                <span>Equity Value</span>
                <span className="formula-piece">{fmtB(dcf.equityValue)}</span>
                <span className="formula-op">÷ {data.sharesOutstanding ? (data.sharesOutstanding/1e6).toFixed(0) : "?"}M shares</span>
                <span className="formula-arrow">→</span>
                <span className="formula-result">${dcf.perShareValue?.toFixed(2)} / share</span>
              </div>

              {/* Valuation Cards */}
              <div className="section-header">
                <div className="section-title">Valuation Summary</div>
                <div className="section-line" />
                <div className="section-tag">DCF OUTPUT</div>
              </div>
              <div className="grid-4">
                <div className="card">
                  <div className="card-title">Enterprise Value</div>
                  <div className="metric-value accent">{fmtB(dcf.enterpriseValue)}</div>
                  <div className="metric-sub">PV FCF + Terminal Value</div>
                </div>
                <div className="card card-accent2">
                  <div className="card-title">Equity Value</div>
                  <div className="metric-value accent2">{fmtB(dcf.equityValue)}</div>
                  <div className="metric-sub">EV + Cash − Debt</div>
                </div>
                <div className="card card-green">
                  <div className="card-title">Intrinsic Value / Share</div>
                  <div className="metric-value green">${fmt(dcf.perShareValue, 2)}</div>
                  <div className="metric-sub">Equity Value ÷ Shares</div>
                  {upside !== null && (
                    <div className={`upside ${upside >= 0 ? "positive" : "negative"}`}>
                      {upside >= 0 ? "▲" : "▼"} {Math.abs(upside).toFixed(1)}% {upside >= 0 ? "Upside" : "Downside"}
                    </div>
                  )}
                </div>
                <div className="card card-gold">
                  <div className="card-title">Analyst Target</div>
                  <div className="metric-value gold">{data.analystTargetPrice ? `$${fmt(data.analystTargetPrice, 2)}` : "N/A"}</div>
                  <div className="metric-sub">Consensus Price Target</div>
                </div>
              </div>

              {/* Bridge + FCF Table */}
              <div className="grid-2">
                <div className="card">
                  <div className="card-title">Value Components</div>
                  <div style={{ marginTop: 16 }}>
                    <div className="chart-bar-row">
                      <div className="chart-bar-label" style={{ fontSize: 10 }}>PV of FCFs</div>
                      <div className="chart-bar-wrap"><div className="chart-bar-fill" style={{ width: `${Math.min((dcf.pv/maxPV)*100,100)}%` }} /></div>
                      <div className="chart-bar-val">{fmtB(dcf.pv)}</div>
                    </div>
                    <div className="chart-bar-row">
                      <div className="chart-bar-label" style={{ fontSize: 10 }}>Terminal Value</div>
                      <div className="chart-bar-wrap"><div className="chart-bar-fill" style={{ width: `${Math.min((dcf.pvTerminal/maxPV)*100,100)}%`, background: "linear-gradient(90deg,var(--accent2),rgba(255,107,53,0.3))" }} /></div>
                      <div className="chart-bar-val">{fmtB(dcf.pvTerminal)}</div>
                    </div>
                  </div>
                  <div style={{ borderTop: "1px solid var(--border)", marginTop: 12, paddingTop: 12, fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "var(--muted)" }}>
                    Terminal value = <strong style={{ color: "var(--accent)" }}>{((dcf.pvTerminal/dcf.enterpriseValue)*100).toFixed(0)}%</strong> of total EV
                  </div>
                </div>
                <div className="card">
                  <div className="card-title">Projected Cash Flows</div>
                  <table className="data-table" style={{ marginTop: 8 }}>
                    <thead><tr><th>Year</th><th>Projected FCF</th><th>Discounted PV</th></tr></thead>
                    <tbody>
                      {dcf.projectedFCF.map(r => <tr key={r.year}><td>{r.year}</td><td>{fmtB(r.cf)}</td><td>{fmtB(r.discounted)}</td></tr>)}
                      <tr><td>Terminal</td><td>{fmtB(dcf.terminalValue)}</td><td>{fmtB(dcf.pvTerminal)}</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Assumptions */}
              <div className="section-header">
                <div className="section-title">Assumptions</div>
                <div className="section-line" />
                <div className="section-tag">ADJUSTABLE</div>
              </div>
              <div className="grid-2">
                <div className="card">
                  <div className="card-title">Model Parameters</div>
                  <div style={{ marginTop: 16 }}>
                    {[
                      { key: "wacc",           label: "WACC",            sub: "Weighted Avg Cost of Capital", min: 5,  max: 20, step: 0.5,  suffix: "%" },
                      { key: "growthRate",     label: "Revenue Growth",  sub: "Annual growth for projection", min: -5, max: 30, step: 0.5,  suffix: "%" },
                      { key: "terminalGrowth", label: "Terminal Growth", sub: "Perpetuity growth rate",       min: 0,  max: 5,  step: 0.25, suffix: "%" },
                      { key: "projYears",      label: "Projection Years",sub: "DCF forecast horizon",         min: 3,  max: 10, step: 1,    suffix: "yr" },
                    ].map(({ key, label, sub, min, max, step, suffix }) => (
                      <div className="slider-row" key={key}>
                        <div className="slider-label"><strong>{label}</strong>{sub}</div>
                        <input type="range" min={min} max={max} step={step} value={assumptions[key]} onChange={e => setAssumptions(a => ({ ...a, [key]: parseFloat(e.target.value) }))} />
                        <div className="slider-value">{assumptions[key]}{suffix}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="card">
                  <div className="card-title">WACC Breakdown</div>
                  <div style={{ marginTop: 8, fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "var(--muted)", lineHeight: 1.8 }}>
                    WACC = (E/V × Re) + (D/V × Rd × (1−Tax))<br />
                    <span style={{ color: "var(--accent)" }}>Applied Rate: {assumptions.wacc}%</span>
                  </div>
                  {data.waccComponents && (
                    <>
                      <div className="wacc-breakdown">
                        {[
                          { label: "Risk-Free Rate",      val: `${data.waccComponents.riskFreeRate}%` },
                          { label: "Equity Risk Premium", val: `${data.waccComponents.equityRiskPremium}%` },
                          { label: "Beta",                val: `${fmt(data.beta, 2)}x` },
                          { label: "Cost of Debt",        val: `${data.waccComponents.costOfDebt}%` },
                          { label: "Tax Rate",            val: `${(data.waccComponents.taxRate*100).toFixed(0)}%` },
                          { label: "Debt Weight",         val: `${(data.waccComponents.debtWeight*100).toFixed(0)}%` },
                        ].map(({ label, val }) => (
                          <div className="wacc-item" key={label}>
                            <div className="wacc-item-label">{label}</div>
                            <div className="wacc-item-val">{val}</div>
                          </div>
                        ))}
                      </div>
                      <div className="note-box" style={{ marginTop: 16 }}>
                        Re = {data.waccComponents.riskFreeRate}% + {fmt(data.beta,2)} × {data.waccComponents.equityRiskPremium}%
                        = {fmt(parseFloat(data.waccComponents.riskFreeRate) + data.beta * parseFloat(data.waccComponents.equityRiskPremium), 1)}%
                        &nbsp;→ Applied WACC: <strong style={{ color: "var(--accent)" }}>{assumptions.wacc}%</strong>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Sensitivity */}
              <div className="section-header">
                <div className="section-title">Sensitivity Analysis</div>
                <div className="section-line" />
                <div className="section-tag">PRICE / SHARE</div>
              </div>
              <div className="card">
                <div className="card-title">Intrinsic Value vs WACC & Growth Rate — outlined cell = base case</div>
                <div className="sensitivity-wrapper" style={{ marginTop: 16 }}>
                  <table className="sens-table">
                    <thead>
                      <tr>
                        <th className="corner">Growth ↓ / WACC →</th>
                        {sens.waccRange.map((w,i) => <th key={i} className="col-header">{w.toFixed(1)}%</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {sens.growthRange.map((g,gi) => (
                        <tr key={gi}>
                          <td className="row-label">{g.toFixed(1)}% growth</td>
                          {sens.waccRange.map((w,wi) => {
                            const val = sens.matrix[gi][wi];
                            return <td key={wi} className={getSensClass(val, wi===2 && gi===2)}>{val ? `$${val.toFixed(0)}` : "—"}</td>;
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{ display: "flex", gap: 32, marginTop: 20, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "var(--muted)", letterSpacing: "1.5px", marginBottom: 8 }}>SCENARIO RANGE</div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, lineHeight: 1.8 }}>
                      Bull ({fmt(assumptions.growthRate+2,1)}% gr / {fmt(assumptions.wacc-2,1)}% WACC): <strong style={{ color: "var(--green)" }}>${sens.matrix[0]?.[0]?.toFixed(0)??"—"}</strong><br/>
                      Base ({fmt(assumptions.growthRate,1)}% gr / {fmt(assumptions.wacc,1)}% WACC): <strong style={{ color: "var(--accent)" }}>${dcf.perShareValue?.toFixed(0)??"—"}</strong><br/>
                      Bear ({fmt(assumptions.growthRate-2,1)}% gr / {fmt(assumptions.wacc+2,1)}% WACC): <strong style={{ color: "var(--red)" }}>${sens.matrix[4]?.[4]?.toFixed(0)??"—"}</strong>
                    </div>
                  </div>
                  {data.currentPrice && (
                    <div>
                      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "var(--muted)", letterSpacing: "1.5px", marginBottom: 8 }}>CURRENT PRICE</div>
                      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 22, fontWeight: 600, color: "var(--gold)" }}>${fmt(data.currentPrice,2)}</div>
                      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "var(--muted)", marginTop: 4 }}>
                        Margin of safety: <span style={{ color: upside>=0?"var(--green)":"var(--red)" }}>{upside?.toFixed(1)}%</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Financial Summary */}
              <div className="section-header" style={{ marginTop: 24 }}>
                <div className="section-title">Financial Summary</div>
                <div className="section-line" />
                <div className="section-tag">KEY METRICS</div>
              </div>
              <div className="grid-3">
                {[
                  { label: "Revenue",            val: fmtB(data.revenue) },
                  { label: "EBITDA",             val: fmtB(data.ebitda) },
                  { label: "Free Cash Flow",     val: fmtB(data.freeCashFlow) },
                  { label: "Net Income",         val: fmtB(data.netIncome) },
                  { label: "Total Debt",         val: fmtB(data.totalDebt) },
                  { label: "Cash & Equivalents", val: fmtB(data.cash) },
                ].map(({ label, val }) => (
                  <div className="card" key={label}>
                    <div className="card-title">{label}</div>
                    <div className="metric-value" style={{ fontSize: 26 }}>{val}</div>
                  </div>
                ))}
              </div>

              <div className="note-box">
                ⚠ This tool uses AI-estimated financial data for educational purposes. Always verify with SEC filings or Bloomberg before making investment decisions. Not financial advice.
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
