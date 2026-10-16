const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const fa = require("react-icons/fa6");
const fs = require("fs");
const { applyTheme } = require(process.env.SKILL + "/scripts/apply_theme.js");

// ---------- palette (matches the Databricks template) ----------
const H = {
  bg: "182C31", deep: "0B1D21", card: "1F3A40", card2: "264850",
  text: "F2EEEC", muted: "A9B8BB", red: "FF3621", amber: "F5A623",
  green: "2BB673", teal: "5FB4C9", grey: "8FA3A8",
};
const THEME = {
  name: "Cascade FinOps",
  headFontFace: "Calibri",
  bodyFontFace: "Calibri",
  colors: {
    dk1: H.deep, lt1: "FFFFFF", dk2: H.bg, lt2: H.text,
    accent1: H.red, accent2: H.amber, accent3: H.green, accent4: H.teal,
    accent5: H.grey, accent6: H.card, hlink: H.teal, folHlink: H.muted,
  },
};

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
pres.title = "Cascade Outfitters — Databricks Spend Review";
pres.author = "Databricks Delivery Solutions Architect";
const C = pres.SchemeColor;
const W = 13.333;
const logo = "image/png;base64," + fs.readFileSync("logo.png").toString("base64");

async function icon(Comp, color = H.text) {
  const svg = ReactDOMServer.renderToStaticMarkup(React.createElement(Comp, { color: "#" + color, size: 256 }));
  const buf = await sharp(Buffer.from(svg)).resize(256, 256).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

// ---------- layouts ----------
pres.defineSlideMaster({
  title: "DARK_TITLE",
  background: { color: C.text1 },
  objects: [
    { image: { data: logo, x: 0.6, y: 0.5, w: 0.75, h: 0.42 } },
    { placeholder: { options: { name: "kicker", type: "body", x: 0.6, y: 1.55, w: 7.6, h: 0.4, fontSize: 13, bold: true, color: C.accent1, charSpacing: 2, margin: 0 }, text: "" } },
    { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 2.0, w: 7.6, h: 2.2, fontSize: 40, bold: true, color: C.background2, valign: "top", align: "left", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "sub", type: "body", x: 0.6, y: 4.5, w: 7.4, h: 1.4, fontSize: 15, color: C.accent5, valign: "top", margin: 0 }, text: "" } },
  ],
});
pres.defineSlideMaster({
  title: "CONTENT",
  background: { color: C.text2 },
  margin: [0.5, 0.6, 0.7, 0.6],
  objects: [
    { image: { data: logo, x: 0.6, y: 6.95, w: 0.38, h: 0.21 } },
    { text: { text: "Cascade Outfitters · Databricks spend review · Confidential", options: { x: 1.1, y: 6.92, w: 6, h: 0.28, fontSize: 10, color: C.accent5, margin: 0 } } },
    { placeholder: { options: { name: "kicker", type: "body", x: 0.6, y: 0.38, w: 9, h: 0.3, fontSize: 12, bold: true, color: C.accent1, charSpacing: 2, margin: 0 }, text: "" } },
    { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 0.7, w: 12.1, h: 0.75, fontSize: 30, bold: true, color: C.background2, valign: "top", align: "left", margin: 0 }, text: "" } },
  ],
  slideNumber: { x: 12.3, y: 6.92, w: 0.5, h: 0.28, fontSize: 10, color: C.accent5, align: "right" },
});

function content(section, kicker, title) {
  const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: section });
  s.addText(kicker, { placeholder: "kicker" });
  s.addText(title, { placeholder: "title" });
  return s;
}
function card(s, x, y, w, h, fill = C.accent6, name) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, fill: { color: fill }, line: { type: "none" }, rectRadius: 0.08, objectName: name });
}
function text(s, t, o) { s.addText(t, Object.assign({ isTextBox: true, margin: 0, color: C.background2, fontSize: 14, valign: "top" }, o)); }
function circleIcon(s, img, x, y, d, fill) {
  s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fill }, line: { type: "none" } });
  s.addImage({ data: img, x: x + d * 0.25, y: y + d * 0.25, w: d * 0.5, h: d * 0.5 });
}

(async () => {
  const I = {};
  for (const [k, n, c] of [
    ["q", "FaCircleQuestion", H.text], ["coins", "FaCoins", H.text], ["chart", "FaChartLine", H.text],
    ["shield", "FaShieldHalved", H.text], ["eye", "FaEye", H.text], ["userx", "FaUserXmark", H.text],
    ["branch", "FaCodeBranch", H.text], ["bell", "FaBell", H.text], ["tags", "FaTags", H.text],
    ["db", "FaDatabase", H.text], ["users", "FaUsers", H.text], ["play", "FaPlay", H.text],
    ["wand", "FaWandMagicSparkles", H.text], ["rocket", "FaRocket", H.text], ["cal", "FaCalendarCheck", H.text],
    ["lock", "FaLock", H.text], ["gears", "FaGears", H.text], ["down", "FaArrowTrendDown", H.text],
    ["target", "FaBullseye", H.text], ["scale", "FaScaleBalanced", H.text],
  ]) I[k] = await icon(fa[n], c);

  // ================= 1. Title =================
  pres.addSection({ title: "Opening" });
  let s = pres.addSlide({ masterName: "DARK_TITLE", sectionTitle: "Opening" });
  s.addText("CASCADE OUTFITTERS  ×  DATABRICKS", { placeholder: "kicker" });
  s.addText("Databricks spend: what happened, what it's worth, and the plan", { placeholder: "title" });
  s.addText("Findings, live demo and a 90-day plan\nPrepared for Michelle Grant (COO), David Okonkwo (CTO) and Sarah Lindqvist (VP Engineering) · October 2026", { placeholder: "sub" });
  card(s, 8.75, 1.55, 4.0, 4.35, C.text2, "hero card");
  text(s, "MONTHLY RUN-RATE", { x: 9.15, y: 1.9, w: 3.3, h: 0.3, fontSize: 12, bold: true, color: C.accent5, charSpacing: 2 });
  text(s, "$179k", { x: 9.15, y: 2.25, w: 3.3, h: 0.9, fontSize: 54, bold: true, color: C.accent5 });
  s.addImage({ data: I.down, x: 9.2, y: 3.25, w: 0.42, h: 0.42 });
  text(s, "~$75k", { x: 9.15, y: 3.75, w: 3.3, h: 0.9, fontSize: 54, bold: true, color: C.accent1 });
  text(s, "without touching Project Atlas, the workload earning $1.27M a month", { x: 9.15, y: 4.75, w: 3.3, h: 0.9, fontSize: 14, color: C.background2 });
  s.addNotes("Open with empathy and the bottom line. 'Michelle, you have a board finance committee in two weeks. Our goal today is to give you a number you can defend, a plan you can start Monday, and controls so this doesn't recur.' Don't explain the hero numbers yet; they're a teaser for the exec summary.");

  // ================= 2. Objectives & agenda =================
  s = content("Opening", "TODAY'S OBJECTIVES", "Three questions we'll answer in the next hour");
  const objs = [
    [I.chart, "Why did spend triple?", "A number you can trust, and which workloads, which changes, which dates"],
    [I.scale, "What is it worth?", "Separate waste from the spend that's earning money, and protect the latter"],
    [I.shield, "How do we stop it recurring?", "Guardrails that don't slow engineering before the Nov 1 freeze"],
  ];
  objs.forEach(([ic, h, b], i) => {
    const y = 1.75 + i * 1.6;
    card(s, 0.6, y, 6.6, 1.35, C.accent6, "objective " + (i + 1));
    circleIcon(s, ic, 0.85, y + 0.32, 0.7, C.accent1);
    text(s, h, { x: 1.8, y: y + 0.25, w: 5.2, h: 0.4, fontSize: 18, bold: true });
    text(s, b, { x: 1.8, y: y + 0.68, w: 5.2, h: 0.6, fontSize: 14, color: C.accent5 });
  });
  text(s, "AGENDA", { x: 7.8, y: 1.75, w: 4.9, h: 0.3, fontSize: 12, bold: true, color: C.accent5, charSpacing: 2 });
  const agenda = [["5", "Objectives: did we get them right?"], ["10", "Your context: what the data can't tell us"], ["20", "Findings and live demo"], ["15", "Plan, trade-offs and your questions"], ["5", "Decisions, owners and dates"]];
  agenda.forEach(([m, t], i) => {
    const y = 2.2 + i * 0.86;
    s.addShape(pres.shapes.OVAL, { x: 7.8, y, w: 0.62, h: 0.62, fill: { color: C.text1 }, line: { color: C.accent1, width: 1.5 } });
    text(s, m, { x: 7.8, y, w: 0.62, h: 0.62, fontSize: 15, bold: true, align: "center", valign: "middle", color: C.accent1 });
    text(s, t, { x: 8.6, y: y + 0.12, w: 4.2, h: 0.4, fontSize: 15 });
  });
  text(s, "minutes", { x: 7.8, y: 6.5, w: 2, h: 0.25, fontSize: 10, color: C.accent5 });
  s.addNotes("Confirm the objectives and ask each person what a good outcome looks like. Michelle: the board story. David: proof the numbers are right, and governance that scales. Sarah: no blame and no slowdown before freeze. Ask permission: 'The data told me WHAT happened. I'd like 10 minutes to hear WHY from you before I show findings.'");

  // ================= 3. Discovery =================
  s = content("Opening", "DISCOVERY", "Before the findings: what only you can tell us");
  const qs = [
    ["MICHELLE", "What does the board need to see in two weeks: a number, a trend or a plan? How firm is the Q4 budget?"],
    ["MICHELLE", "How is Project Atlas measured and reported? Who uses the executive dashboard, and how often?"],
    ["DAVID", "Who are Stratus Partners, and is that engagement still active? Who reads the clickstream backfill output?"],
    ["DAVID", "Any recent pricing or contract changes? Are budgets, alerts or compute policies in place today?"],
    ["SARAH", "What's frozen for peak, and from when? What freshness do Salesforce and inventory consumers need?"],
    ["SARAH", "Is the GPU exploration cluster still in active use? What keeps developers from auto-terminating?"],
  ];
  qs.forEach(([who, q], i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = 0.6 + col * 4.1, y = 1.75 + row * 2.45;
    card(s, x, y, 3.85, 2.2, C.accent6, "question " + (i + 1));
    circleIcon(s, I.q, x + 0.25, y + 0.25, 0.55, C.accent1);
    text(s, who, { x: x + 0.95, y: y + 0.37, w: 2.6, h: 0.3, fontSize: 12, bold: true, color: C.accent1, charSpacing: 2 });
    text(s, q, { x: x + 0.25, y: y + 0.95, w: 3.35, h: 1.15, fontSize: 14 });
  });
  s.addNotes("Ask, listen, summarise back, and visibly write answers down. Adapt the rest of the pitch to what you hear: e.g. if the Stratus SOW has ended, move those savings from 'likely' to 'confirmed'. Ask the dashboard question neutrally ('how often is it viewed?'), never 'why did you make it refresh every 15 minutes'.");

  // ================= 4. Exec summary =================
  pres.addSection({ title: "Findings" });
  s = content("Findings", "EXECUTIVE SUMMARY", "The problem is real, but it's been mismeasured");
  const stats = [
    ["$162k", "September actual spend", "3.7× June. Finance's dashboard showed $220k", C.background2],
    ["$179k", "October monthly run-rate", "and still climbing on its current path", C.background2],
    ["$90–106k", "addressable per month", "mostly configuration fixes, doable this week", C.accent1],
    ["76×", "Project Atlas return", "$1.27M/mo incremental revenue on $17k/mo", C.accent3],
  ];
  stats.forEach(([n, l, d, col], i) => {
    const x = 0.6 + i * 3.08;
    card(s, x, 1.75, 2.85, 2.9, C.accent6, "stat " + (i + 1));
    text(s, n, { x: x + 0.25, y: 2.0, w: 2.45, h: 0.95, fontSize: i === 2 ? 36 : 44, bold: true, color: col, valign: "middle" });
    text(s, l, { x: x + 0.25, y: 3.05, w: 2.45, h: 0.4, fontSize: 15, bold: true });
    text(s, d, { x: x + 0.25, y: 3.5, w: 2.45, h: 0.9, fontSize: 13, color: C.accent5 });
  });
  card(s, 0.6, 4.95, 12.1, 1.65, C.text1, "so what");
  s.addImage({ data: I.target, x: 0.95, y: 5.4, w: 0.7, h: 0.7 });
  text(s, [
    { text: "The so-what: ", options: { bold: true, color: C.accent1 } },
    { text: "about two-thirds of the run-rate is waste or inefficiency, created by reasonable decisions made without guardrails. Fix it this week and the run-rate falls to ~$75k. Cutting 40% across the board would hit the one initiative earning 76× its cost." },
  ], { x: 1.95, y: 5.2, w: 10.5, h: 1.2, fontSize: 16, valign: "middle" });
  s.addNotes("Michelle needs this slide most. One sentence: 'The problem is real, but the numbers you've been shown are wrong, and most of it is fixable without cutting Atlas.' If she asks 'can you hit 40%?': 'Yes, on run-rate, about 55%, and without the blanket cut.' Use '$90–106k' as a range because the Stratus and GPU items depend on today's answers.");

  // ================= 5. Mismeasured =================
  s = content("Findings", "TRUST THE NUMBERS FIRST", "Finance has been looking at the wrong number");
  s.addChart(pres.charts.BAR, [
    { name: "Finance dashboard (customer cost table)", labels: ["Jun", "Jul", "Aug", "Sep"], values: [59.1, 94.4, 198.4, 219.7] },
    { name: "Corrected (point-in-time pricing)", labels: ["Jun", "Jul", "Aug", "Sep"], values: [43.6, 62.3, 125.9, 161.8] },
  ], {
    x: 0.6, y: 1.65, w: 7.4, h: 4.95, barDir: "col", barGapWidthPct: 60,
    chartColors: [H.grey, H.red], showLegend: true, legendPos: "b", legendColor: H.text, legendFontSize: 12, legendFontFace: "+mn-lt",
    showValue: true, dataLabelPosition: "outEnd", dataLabelColor: H.text, dataLabelFontSize: 11, dataLabelFormatCode: '"$"0"k"', dataLabelFontFace: "+mn-lt",
    catAxisLabelColor: H.muted, valAxisLabelColor: H.muted, catAxisLabelFontSize: 12, valAxisLabelFontSize: 11, catAxisLabelFontFace: "+mn-lt", valAxisLabelFontFace: "+mn-lt",
    valAxisLabelFormatCode: '"$"0"k"', valGridLine: { color: "2E4E55", size: 0.5 }, catGridLine: { style: "none" }, valAxisLineShow: false,
    showTitle: true, title: "Monthly spend, $k (list price)", titleColor: H.text, titleFontSize: 14, titleFontFace: "+mn-lt",
  });
  const pts = [
    ["+35–58%", "overstated each month", "The cost table's price join ignored effective dates, so usage on any SKU with a price change was counted once per price version."],
    ["$350k", "Q3 actual vs $165k budget", "2.1× over budget. Serious, but not the 3.1× ($512k) Finance's view implies."],
    ["27,087 = 27,087", "records reconciled", "Fixed in code with point-in-time pricing. Row counts and DBUs now match the raw usage table exactly."],
  ];
  pts.forEach(([n, l, d], i) => {
    const y = 1.65 + i * 1.7;
    card(s, 8.35, y, 4.35, 1.5, C.accent6, "evidence " + (i + 1));
    text(s, n, { x: 8.6, y: y + 0.15, w: 3.9, h: 0.45, fontSize: 22, bold: true, color: C.accent1 });
    text(s, l, { x: 8.6, y: y + 0.58, w: 3.9, h: 0.3, fontSize: 13, bold: true });
    text(s, d, { x: 8.6, y: y + 0.88, w: 3.9, h: 0.6, fontSize: 11, color: C.accent5 });
  });
  s.addNotes("This is the credibility moment. Michelle: 'Spend really has nearly quadrupled, but Finance's dashboard overstates it by about a third, so any plan built on it starts from a false baseline.' David: 'The cost table joined usage to list prices on SKU only. All-purpose compute has two price rows after the September repricing, so those rows were double-counted. I replaced it with a point-in-time join and reconciled row counts and DBUs to raw.' Don't blame Alex: 'the code was a reasonable first pass that was never validated.'");

  // ================= 6. What changed & when =================
  s = content("Findings", "WHAT CHANGED, AND WHEN", "Six step changes explain most of the growth");
  const ev = [
    ["Jul 18", "GPU exploration cluster created, auto-termination off", "+$24k", H.red],
    ["Aug 1", "Contractor clusters and a backfill job that fails 70% of the time", "+$36k", H.red],
    ["Aug 5", "Salesforce ingestion switched from daily to continuous", "+$6k", H.amber],
    ["Aug 25", "Inventory forecast changed from daily to every 15 minutes", "+$6k", H.red],
    ["Sep 1", "All-purpose list price repriced, $0.55 to $0.65/DBU", "+$10k", H.grey],
    ["Sep 8", "BI warehouse resized 3.3× plus a 15-minute dashboard refresh", "+$27k", H.amber],
  ];
  s.addShape(pres.shapes.LINE, { x: 0.9, y: 2.55, w: 11.5, h: 0, line: { color: H.grey, width: 1.5 } });
  ev.forEach(([d, t, v, col], i) => {
    const x = 0.6 + i * 2.05;
    s.addShape(pres.shapes.OVAL, { x: x + 0.15, y: 2.4, w: 0.3, h: 0.3, fill: { color: col }, line: { color: H.bg, width: 2 } });
    text(s, d, { x, y: 1.85, w: 1.9, h: 0.4, fontSize: 16, bold: true });
    card(s, x, 2.95, 1.9, 2.0, C.accent6, "event " + (i + 1));
    text(s, v, { x: x + 0.18, y: 3.1, w: 1.6, h: 0.5, fontSize: 24, bold: true, color: col });
    text(s, "per month", { x: x + 0.18, y: 3.6, w: 1.6, h: 0.25, fontSize: 11, color: C.accent5 });
    text(s, t, { x: x + 0.18, y: 3.95, w: 1.6, h: 1.65, fontSize: 13 });
  });
  text(s, [
    { text: "How to read this: ", options: { bold: true, color: C.accent1 } },
    { text: "gradual growth is demand. A step change on a single date is a configuration change, and every step here has a config-history or audit-log trail. Figures are October run-rate." },
  ], { x: 0.6, y: 5.3, w: 12.1, h: 0.7, fontSize: 15, color: C.background2 });
  s.addNotes("Describe the changes, not the people. Each one was a sensible local decision: exploring faster, fresher sales data, an intraday forecast test, a faster exec dashboard. None had a guardrail or an owner watching cost. The September repricing explains about $10k of growth, so it's price, not usage. David will know this one.");

  // ================= 7. Where the money goes =================
  s = content("Findings", "WASTE, INEFFICIENCY OR INVESTMENT", "Where the $179k a month actually goes");
  s.addChart(pres.charts.DOUGHNUT, [{ name: "Oct run-rate", labels: ["Waste", "Inefficiency", "Investment", "Healthy baseline"], values: [69, 53, 18, 39] }], {
    x: 0.6, y: 1.6, w: 5.2, h: 5.0, holeSize: 58, chartColors: [H.red, H.amber, H.green, H.grey],
    showLegend: false, showPercent: false, showValue: true, dataLabelFormatCode: '"$"0"k"', dataLabelColor: H.deep, dataLabelFontSize: 13, dataLabelFontBold: true, dataLabelFontFace: "+mn-lt",
    showTitle: false,
  });
  text(s, "$179k", { x: 2.2, y: 3.65, w: 2.0, h: 0.6, fontSize: 30, bold: true, align: "center" });
  text(s, "per month", { x: 2.2, y: 4.25, w: 2.0, h: 0.3, fontSize: 12, color: C.accent5, align: "center" });
  const buckets = [
    [H.red, "Waste: stop it", "$69k", "Idle GPU cluster, contractor resources, a failing backfill job and a forecast running 96 times a day."],
    [H.amber, "Inefficiency: right-size it", "$53k", "An oversized, always-warm BI warehouse, always-on ingestion, and dev clusters that never auto-terminate."],
    [H.green, "Investment: protect it", "$18k", "Project Atlas recommendations: $1.27M a month in incremental revenue (A/B-measured)."],
    [H.grey, "Healthy baseline: keep it", "$39k", "Orders ETL, customer 360, finance close, shared analytics. Shared analytics is what good looks like: policy, auto-termination and tags."],
  ];
  buckets.forEach(([col, h, v, d], i) => {
    const y = 1.6 + i * 1.27;
    card(s, 6.2, y, 6.5, 1.12, C.accent6, "bucket " + (i + 1));
    s.addShape(pres.shapes.OVAL, { x: 6.45, y: y + 0.2, w: 0.3, h: 0.3, fill: { color: col }, line: { type: "none" } });
    text(s, h, { x: 6.95, y: y + 0.15, w: 4.2, h: 0.35, fontSize: 15, bold: true });
    text(s, v, { x: 11.2, y: y + 0.12, w: 1.3, h: 0.4, fontSize: 18, bold: true, color: col, align: "right" });
    text(s, d, { x: 6.95, y: y + 0.52, w: 5.55, h: 0.55, fontSize: 11, color: C.accent5 });
  });
  s.addNotes("This answers Michelle's 'are we getting anything for it?'. Point at green first: Atlas is the investment, so protect it. Some 'waste' items (contractor resources, GPU cluster) are pending today's discovery answers; say so. Ask Sarah to confirm the baseline workloads are business-critical, which builds her confidence that we're not targeting her teams.");

  // ================= 8. Findings table =================
  s = content("Findings", "FINDINGS AND SAVINGS", "Six fixes, most of them configuration changes");
  const hdr = (t, al = "left") => ({ text: t, options: { bold: true, color: H.text, fill: { color: H.deep }, align: al, fontSize: 13 } });
  const row = (cells, hi) => cells.map((c, j) => ({ text: c, options: { color: j === 3 ? (hi || H.red) : H.text, bold: j === 3, align: j === 1 || j === 3 ? "right" : "left", fill: { color: H.card }, fontSize: 13 } }));
  const rows = [
    [hdr("Finding"), hdr("Run-rate", "right"), hdr("Fix"), hdr("Saving/mo", "right"), hdr("Effort")],
    row(["BI warehouse resized 3.3× with a 15-minute refresh", "$30.7k", "Medium size, 10-min auto-stop, refresh once each morning", "$27k", "Minutes"]),
    row(["GPU exploration cluster running 24×7", "$24.0k", "60-min auto-termination; on demand only", "$22k", "Minutes"]),
    row(["3 contractor clusters + backfill job (70% failures)", "$36.3k", "Stop and offboard, once the SOW status is confirmed", "up to $36k", "Minutes"]),
    row(["Inventory forecast every 15 minutes", "$8.6k", "Daily now; 4× a day for peak, as code", "$6k", "Minutes"]),
    row(["Salesforce ingestion always on", "$6.2k", "Triggered: hourly in business hours, or daily", "$6k", "Minutes"]),
    row(["Dev clusters that never auto-terminate", "$16.1k", "Dev compute policy: 60-min auto-termination", "$9k", "Days"]),
    [{ text: "Total addressable", options: { bold: true, color: H.text, fill: { color: H.deep }, fontSize: 14 } }, { text: "$122k", options: { bold: true, color: H.text, fill: { color: H.deep }, align: "right", fontSize: 14 } }, { text: "Range reflects open discovery items", options: { color: H.muted, fill: { color: H.deep }, fontSize: 12 } }, { text: "$90–106k", options: { bold: true, color: H.red, fill: { color: H.deep }, align: "right", fontSize: 14 } }, { text: "", options: { fill: { color: H.deep } } }],
  ];
  s.addTable(rows, { x: 0.6, y: 1.65, w: 12.1, colW: [3.7, 1.25, 4.55, 1.4, 1.2], rowH: 0.6, border: { type: "solid", color: H.bg, pt: 2 }, fontFace: "Calibri", valign: "middle", margin: [0.06, 0.12, 0.06, 0.12] });
  s.addNotes("Read the top three, then the total. Every fix is reversible and none touches production code before the freeze. For David: savings assume the warehouse returns to its pre-Sep-8 average, the GPU cluster runs 10% of the time, contractor resources go to zero, and the forecast job returns to its Jun–Jul average. Sarah: the dev policy is 60 minutes, not 10, and there's an exception path.");

  // ================= 9. Root causes =================
  s = content("Findings", "ROOT CAUSES", "It's a process gap, not a people problem");
  const rc = [
    [I.shield, "No guardrails", "Compute policies exist on only one shared cluster. Seven clusters run with auto-termination off."],
    [I.eye, "No visibility", "No budgets or alerts. Finance's cost table was wrong, and 18% of September spend can't be attributed to any team."],
    [I.userx, "No offboarding", "Contractor accounts and compute kept running with no owner in the team directory."],
    [I.branch, "No change control", "Schedule, size and refresh changes were made directly in the UI, with no review and no cost check."],
  ];
  rc.forEach(([ic, h, d], i) => {
    const col = i % 2, r = Math.floor(i / 2);
    const x = 0.6 + col * 6.15, y = 1.7 + r * 2.0;
    card(s, x, y, 5.95, 1.8, C.accent6, "cause " + (i + 1));
    circleIcon(s, ic, x + 0.3, y + 0.45, 0.85, C.accent1);
    text(s, h, { x: x + 1.45, y: y + 0.3, w: 4.25, h: 0.4, fontSize: 18, bold: true });
    text(s, d, { x: x + 1.45, y: y + 0.75, w: 4.25, h: 0.95, fontSize: 13, color: C.accent5 });
  });
  card(s, 0.6, 5.85, 12.1, 0.8, C.text1, "principle");
  text(s, "Every one of these was a reasonable decision made without a guardrail. Fix the system, not the people.", { x: 0.9, y: 5.85, w: 11.5, h: 0.8, fontSize: 17, italic: true, valign: "middle", color: C.background2 });
  s.addNotes("Sarah may ask 'so my team wasted $100k?'. Answer: 'No. Your teams moved fast, which is what you asked of them. The platform had no guardrails, no visibility and no change review. That's what we fix.' Give credit: shared-analytics already shows the right pattern.");

  // ================= 10. Demo =================
  pres.addSection({ title: "Demo" });
  s = content("Demo", "LIVE DEMO", "Cascade FinOps: Workload Cost Review");
  const demo = [
    ["1", "Corrected monthly trend", "Next to Finance's version, so the gap is visible"],
    ["2", "Top workloads by run-rate", "Coloured by waste, inefficiency, investment and baseline"],
    ["3", "Findings and savings plan", "Every row traceable to config history and the audit log"],
    ["4", "Cost by cost center", "Including the 18% nobody owns today"],
  ];
  demo.forEach(([n, h, d], i) => {
    const y = 1.7 + i * 1.18;
    s.addShape(pres.shapes.OVAL, { x: 0.6, y: y + 0.1, w: 0.62, h: 0.62, fill: { color: C.accent1 }, line: { type: "none" } });
    text(s, n, { x: 0.6, y: y + 0.1, w: 0.62, h: 0.62, fontSize: 18, bold: true, align: "center", valign: "middle" });
    text(s, h, { x: 1.45, y: y + 0.05, w: 5.4, h: 0.4, fontSize: 17, bold: true });
    text(s, d, { x: 1.45, y: y + 0.47, w: 5.4, h: 0.4, fontSize: 13, color: C.accent5 });
  });
  card(s, 7.3, 1.7, 5.4, 2.55, C.accent6, "ask it live");
  circleIcon(s, I.wand, 7.55, 1.95, 0.6, C.accent1);
  text(s, "Ask it live", { x: 8.35, y: 2.05, w: 4.1, h: 0.4, fontSize: 17, bold: true });
  text(s, [
    { text: "What did Finance BI spend last month?", options: { bullet: true, breakLine: true } },
    { text: "Which clusters ran over the weekend?", options: { bullet: true, breakLine: true } },
    { text: "What is unattributed spend by owner?", options: { bullet: true } },
  ], { x: 7.6, y: 2.7, w: 4.9, h: 1.4, fontSize: 14, paraSpaceAfter: 6 });
  card(s, 7.3, 4.45, 5.4, 1.95, C.accent6, "built as code");
  circleIcon(s, I.gears, 7.55, 4.7, 0.6, C.accent4);
  text(s, "Built as code, yours to keep", { x: 8.35, y: 4.8, w: 4.1, h: 0.4, fontSize: 17, bold: true });
  text(s, "Deployed with Declarative Automation Bundles on Unity Catalog. Your platform team can re-run it in any workspace, including the new EU workspaces.", { x: 7.6, y: 5.35, w: 4.9, h: 1.0, fontSize: 13, color: C.accent5 });
  s.addNotes("Switch to the dashboard. Keep it to about 8 minutes. Lead with the question, then show the answer: 'Michelle asked which team is responsible, so here it is by cost center, including what nobody owns.' Invite a live question. If the demo breaks, fall back to screenshots in the appendix. For David: 'It's a bundle in your repo. One command deploys it to any workspace.'");

  // ================= 11. Plan =================
  pres.addSection({ title: "Plan" });
  s = content("Plan", "THE PLAN", "Three phases, sequenced around your Nov 1 freeze");
  const ph = [
    [I.rocket, "THIS WEEK", "Config only, no freeze risk", ["Right-size BI warehouse and refresh", "Auto-terminate the GPU cluster", "Stop contractor resources and revoke access", "Revert inventory schedule; Salesforce to triggered", "Fix Finance's cost table"], "Up to ~$97k/mo", "Platform team + Finance BI", H.red],
    [I.lock, "BEFORE NOV 1", "Dev workspace only", ["Dev compute policy: 60-min auto-termination, size caps, mandatory cost-center tag", "Exception path for long jobs", "Budgets and alerts per cost center", "Peak schedule (4× a day, Nov 15–Dec 31) as code"], "~$9k/mo + no recurrence", "Eng leads + Platform", H.amber],
    [I.cal, "Q1, AFTER PEAK", "Make it permanent", ["Policies in production", "Serverless budget policies for attribution", "Chargeback dashboard and monthly FinOps review", "Governance as code with PR review and CI deploy", "Offboarding runbook; EU workspaces inherit it all"], "Predictable spend", "CTO office + Finance", H.green],
  ];
  ph.forEach(([ic, h, sub, items, val, own, col], i) => {
    const x = 0.6 + i * 4.1;
    card(s, x, 1.65, 3.85, 5.0, C.accent6, "phase " + (i + 1));
    circleIcon(s, ic, x + 0.25, 1.9, 0.6, col);
    text(s, h, { x: x + 1.0, y: 1.92, w: 2.7, h: 0.3, fontSize: 15, bold: true, color: col, charSpacing: 1 });
    text(s, sub, { x: x + 1.0, y: 2.22, w: 2.7, h: 0.3, fontSize: 12, color: C.accent5 });
    text(s, items.map((t, k) => ({ text: t, options: { bullet: true, breakLine: k < items.length - 1 } })), { x: x + 0.25, y: 2.75, w: 3.4, h: 2.55, fontSize: 13, paraSpaceAfter: 5 });
    text(s, val, { x: x + 0.25, y: 5.45, w: 3.4, h: 0.4, fontSize: 18, bold: true, color: col });
    text(s, "Owner: " + own, { x: x + 0.25, y: 5.9, w: 3.4, h: 0.5, fontSize: 12, color: C.accent5 });
  });
  s.addNotes("Sarah's concern is the freeze: phase 1 is configuration only, and phase 2 touches dev only, with an exception path. David's concern is recurrence: phases 2 and 3 are governance as code. Michelle: phase 1 alone takes the run-rate from $179k to about $82k. Ask: 'Who can approve the phase 1 changes this week?'");

  // ================= 12. Run-rate path =================
  s = content("Plan", "THE NUMBER FOR THE BOARD", "From $179k to ~$75k a month, and an honest Q4");
  s.addChart(pres.charts.BAR, [{ name: "Monthly run-rate", labels: ["Today (Oct)", "After this week", "After dev policies", "Q4 budget"], values: [179, 82, 73, 61] }], {
    x: 0.6, y: 1.65, w: 7.4, h: 4.95, barDir: "col", barGapWidthPct: 50,
    chartColors: [H.grey, H.red, H.red, H.teal], showLegend: false,
    showValue: true, dataLabelPosition: "outEnd", dataLabelColor: H.text, dataLabelFontSize: 13, dataLabelFontBold: true, dataLabelFormatCode: '"$"0"k"', dataLabelFontFace: "+mn-lt",
    catAxisLabelColor: H.muted, valAxisLabelColor: H.muted, catAxisLabelFontSize: 12, valAxisLabelFontSize: 11, catAxisLabelFontFace: "+mn-lt", valAxisLabelFontFace: "+mn-lt",
    valAxisLabelFormatCode: '"$"0"k"', valGridLine: { color: "2E4E55", size: 0.5 }, catGridLine: { style: "none" }, valAxisLineShow: false,
    showTitle: true, title: "Monthly run-rate, $k", titleColor: H.text, titleFontSize: 14, titleFontFace: "+mn-lt",
  });
  card(s, 8.35, 1.65, 4.35, 2.35, C.accent6, "honest q4");
  text(s, "The honest Q4", { x: 8.6, y: 1.85, w: 3.9, h: 0.4, fontSize: 17, bold: true, color: C.accent1 });
  text(s, "Even after the fixes we land around $73–82k a month, against a $61k budget. The gap is Project Atlas plus peak-season load, not waste.", { x: 8.6, y: 2.3, w: 3.9, h: 1.6, fontSize: 14 });
  card(s, 8.35, 4.2, 4.35, 2.4, C.text1, "recommendation");
  text(s, "Recommendation", { x: 8.6, y: 4.4, w: 3.9, h: 0.4, fontSize: 17, bold: true, color: C.accent3 });
  text(s, "Fix the waste now, and ask the board for a Q4 revision of about +$15k a month, justified by Atlas's 76× return. That's a growth story, not a cost overrun.", { x: 8.6, y: 4.85, w: 3.9, h: 1.65, fontSize: 14 });
  s.addNotes("Don't promise $61k a month. If Michelle pushes: 'I could get you there by cutting Atlas, and I'd advise strongly against it. It returns about $1.27M a month in incremental revenue.' Her one board sentence is on the closing slide.");

  // ================= 13. How it stays fixed =================
  s = content("Plan", "HOW IT STAYS FIXED", "Guardrails, not gates");
  const g = [
    [I.shield, "Compute policies", "Sensible defaults: auto-termination, size caps, required tags. An exception path, so nobody is blocked at 2am."],
    [I.tags, "Budget policies and tags", "Every serverless and classic dollar lands on a cost center. Chargeback becomes possible."],
    [I.bell, "Budgets and alerts", "Alerts per cost center at 80% and 100%. Surprises surface in days, not on the invoice."],
    [I.db, "System tables dashboard", "This prototype, refreshed daily from system tables and owned by the platform team."],
    [I.branch, "Governance as code", "Policies, jobs and dashboards in a bundle, PR-reviewed and deployed by CI to every workspace, including EU."],
    [I.users, "Monthly FinOps review", "30 minutes with Finance, Platform and Eng leads. Review the top movers and agree actions."],
  ];
  g.forEach(([ic, h, d], i) => {
    const col = i % 3, r = Math.floor(i / 3);
    const x = 0.6 + col * 4.1, y = 1.7 + r * 2.5;
    card(s, x, y, 3.85, 2.25, C.accent6, "control " + (i + 1));
    circleIcon(s, ic, x + 0.25, y + 0.25, 0.65, r === 0 ? C.accent1 : C.accent4);
    text(s, h, { x: x + 1.1, y: y + 0.38, w: 2.6, h: 0.4, fontSize: 16, bold: true });
    text(s, d, { x: x + 0.25, y: y + 1.05, w: 3.4, h: 1.1, fontSize: 13, color: C.accent5 });
  });
  s.addNotes("David's question is 'how do I know this won't recur with three more workspaces?'. Answer: it's code. Budgets alert but don't hard-stop; policies prevent. On ownership, David wants central, Sarah wants per-team. Propose both: platform owns the guardrails, teams own their budgets, and Finance chairs the monthly review. Then ask Michelle to decide.");

  // ================= 14. Next steps =================
  s = content("Plan", "MUTUAL ACTION PLAN", "What happens on Monday");
  const ah = (t) => ({ text: t, options: { bold: true, color: H.text, fill: { color: H.deep }, fontSize: 13 } });
  const ar = (a, o, d) => [a, o, d].map((t, j) => ({ text: t, options: { color: j === 2 ? H.red : H.text, bold: j === 2, fill: { color: H.card }, fontSize: 13 } }));
  s.addTable([
    [ah("Action"), ah("Owner"), ah("By")],
    ar("Confirm Stratus SOW status, revoke access, stop resources", "David (Platform)", "Mon Oct 19"),
    ar("Approve and apply the phase 1 configuration fixes", "David + Sarah", "Tue Oct 20"),
    ar("Agree the executive dashboard refresh cadence", "Michelle + Finance BI", "Tue Oct 20"),
    ar("Review the dev compute policy with eng leads", "Sarah + Databricks DSA", "Fri Oct 23"),
    ar("Budgets and alerts live for every cost center", "Platform + Databricks DSA", "Thu Oct 29"),
    ar("Board narrative and revised Q4 number", "Michelle + Databricks DSA", "Before committee"),
  ], { x: 0.6, y: 1.65, w: 7.9, colW: [4.1, 2.2, 1.6], rowH: 0.58, border: { type: "solid", color: H.bg, pt: 2 }, fontFace: "Calibri", valign: "middle", margin: [0.06, 0.12, 0.06, 0.12] });
  card(s, 8.85, 1.65, 3.85, 4.1, C.accent6, "databricks commits");
  circleIcon(s, I.target, 9.1, 1.9, 0.6, C.accent1);
  text(s, "What Databricks commits to", { x: 9.85, y: 1.95, w: 2.7, h: 0.6, fontSize: 15, bold: true });
  const commits = ["Weekly cost review with your platform team for six weeks", "Compute policy and budget templates, ready to apply", "This dashboard handed over as code", "Our account team to discuss commit options. No promises today on credits"];
  text(s, commits.map((t, k) => ({ text: t, options: { bullet: true, breakLine: k < commits.length - 1 } })), { x: 9.1, y: 2.75, w: 3.4, h: 2.9, fontSize: 14, paraSpaceAfter: 8 });
  s.addNotes("Close with names and dates. Recap any decisions taken in the room. Offer: 'I'll send the dashboard link, the queries and this plan by 10am tomorrow.' If asked about credits, don't commit: it's a commercial conversation for the account team. The bigger lever is the run-rate we can fix this week.");

  // ================= 15. Close =================
  s = pres.addSlide({ masterName: "DARK_TITLE", sectionTitle: "Plan" });
  s.addText("ONE SENTENCE FOR THE BOARD", { placeholder: "kicker" });
  s.addText("Spend grew faster than our guardrails, not faster than its value", { placeholder: "title" });
  s.addText("We can cut the run-rate by more than half without touching the initiative returning 76×, and put controls in place so it can't silently recur.", { placeholder: "sub" });
  card(s, 8.75, 1.55, 4.0, 4.35, C.text2, "closing stats");
  [["$179k → ~$75k", "monthly run-rate", C.accent1], ["76×", "Atlas return, protected", C.accent3], ["This week", "most fixes are configuration only", C.background2]].forEach(([n, l, col], i) => {
    const y = 1.9 + i * 1.3;
    text(s, n, { x: 9.15, y, w: 3.3, h: 0.6, fontSize: 28, bold: true, color: col });
    text(s, l, { x: 9.15, y: y + 0.6, w: 3.3, h: 0.35, fontSize: 13, color: C.accent5 });
  });
  s.addNotes("Hand Michelle the sentence. Then stop talking and invite questions: 'What would you push back on?'");

  // ================= 16. Appendix =================
  pres.addSection({ title: "Appendix" });
  s = content("Appendix", "APPENDIX", "Method and assumptions");
  const m1 = ["Data: Cascade system-table snapshot, Jun 1–Oct 11 2026 (billing, compute, jobs, pipelines, audit)", "Cost = DBUs × list price valid at usage time (point-in-time join). Excludes negotiated discounts and, for classic compute, cloud VM costs", "October run-rate = Oct 1–11 cost × 30/11. Spiky workloads (month-end close, weekly training) use September", "Reconciliation: 27,087 usage records and total DBUs match raw exactly"];
  const m2 = ["Warehouse: back to its pre-Sep-8 daily average", "GPU cluster: 10% of its current hours", "Contractor resources: zero, pending SOW confirmation", "Inventory job: Jun–Jul monthly average. Salesforce: pre-Aug-5 average × 4 (hourly)", "Dev clusters: off-hours cost removed by 60-min auto-termination", "Atlas ROI: incremental revenue (A/B lift from biz KPIs), not profit"];
  card(s, 0.6, 1.65, 5.95, 4.2, C.accent6, "method");
  text(s, "Method", { x: 0.85, y: 1.85, w: 5.4, h: 0.4, fontSize: 17, bold: true, color: C.accent1 });
  text(s, m1.map((t, k) => ({ text: t, options: { bullet: true, breakLine: k < m1.length - 1 } })), { x: 0.85, y: 2.35, w: 5.5, h: 3.4, fontSize: 14, paraSpaceAfter: 8 });
  card(s, 6.75, 1.65, 5.95, 4.2, C.accent6, "assumptions");
  text(s, "Savings assumptions", { x: 7.0, y: 1.85, w: 5.4, h: 0.4, fontSize: 17, bold: true, color: C.accent1 });
  text(s, m2.map((t, k) => ({ text: t, options: { bullet: true, breakLine: k < m2.length - 1 } })), { x: 7.0, y: 2.35, w: 5.5, h: 3.4, fontSize: 14, paraSpaceAfter: 8 });
  s.addNotes("For David's deep-dive questions. Keep the SQL open in another tab in case he asks to see it.");

  await pres.writeFile({ fileName: "Cascade_FinOps_Review.pptx" });
  await applyTheme("Cascade_FinOps_Review.pptx", THEME);
  console.log("written");
})();
