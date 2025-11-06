// Utility to generate random integer between min and max inclusive
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Format time as HH:MM
function formatTime(hour, minute) {
  const h = hour.toString().padStart(2, "0");
  const m = minute.toString().padStart(2, "0");
  return `${h}:${m}`;
}

// Update invoice data randomly
function updateInvoice() {
  const amount = (Math.random() * 1000 + 100).toFixed(2);
  document.getElementById("invoice-amount").textContent = amount;
  document.getElementById("invoice-due").textContent = `$${amount}`;
  // Random date range within last 3 months
  const start = new Date();
  start.setMonth(start.getMonth() - randomInt(1, 3));
  const end = new Date();
  const options = { day: "numeric", month: "long", year: "numeric" };
  document.getElementById(
    "invoice-date"
  ).textContent = `${start.toLocaleDateString("en-US", options)} - ${end.toLocaleDateString(
    "en-US",
    options
  )}`;
}

// Consumption chart bars data and rendering
const consumptionSvg = document.getElementById("consumption-chart");
const consumptionTooltip = document.getElementById("consumption-tooltip");
const barWidth = 15;
const barGap = 10;
const maxBarHeight = 90;
const chartHeight = 112;

function renderConsumptionChart() {
  consumptionSvg.innerHTML = "";
  const barsCount = 12; // 12 bars for months approx
  const bars = [];
  for (let i = 0; i < barsCount; i++) {
    // Random height between 10 and maxBarHeight
    bars[i] = randomInt(10, maxBarHeight);
  }
  // Find max height bar index for tooltip
  let maxIndex = 0;
  let maxHeight = 0;
  bars.forEach((h, i) => {
    if (h > maxHeight) {
      maxHeight = h;
      maxIndex = i;
    }
  });

  // Draw bars
  bars.forEach((height, i) => {
    const x = i * (barWidth + barGap) + 10;
    const y = chartHeight - height - 10;
    const color = i === maxIndex ? "#F97316" : "#6B7280";
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", x);
    rect.setAttribute("y", y);
    rect.setAttribute("width", barWidth);
    rect.setAttribute("height", height);
    rect.setAttribute("fill", color);
    consumptionSvg.appendChild(rect);
  });

  // Tooltip position and text
  const tooltipX = maxIndex * (barWidth + barGap) + 10;
  consumptionTooltip.style.left = tooltipX + "px";
  consumptionTooltip.textContent = `${maxHeight} kWh`;
}

// Planned Outages random time and date
function updateOutages() {
  // Random start hour between 0 and 20
  const startHour = randomInt(0, 20);
  const startMinute = randomInt(0, 59);
  // Duration between 1 and 3 hours
  const duration = randomInt(1, 3);
  let endHour = startHour + duration;
  let endMinute = startMinute;
  if (endHour > 23) endHour = 23;
  const startTime = formatTime(startHour, startMinute);
  const endTime = formatTime(endHour, endMinute);
  document.getElementById("outage-time").textContent = `${startTime} - ${endTime}`;

  // Random date: today or next 5 days
  const today = new Date();
  const outageDate = new Date(today);
  outageDate.setDate(today.getDate() + randomInt(0, 5));
  const options = { day: "numeric", month: "long", year: "numeric" };
  const isToday = outageDate.toDateString() === today.toDateString();
  document.getElementById("outage-date").textContent = `${outageDate.toLocaleDateString(
    "en-US",
    options
  )} ${isToday ? "(Today)" : ""}`;
}

// Update CO2 reduction and trees saved randomly
function updateCO2() {
  const co2 = (Math.random() * 30).toFixed(1);
  const trees = randomInt(1, 10);
  document.getElementById("co2-reduction").textContent = co2;
  document.getElementById("trees-saved").textContent = `${trees} trees`;
}

// Update consumption bars percentages and widths
function updateConsumptionBars() {
  const consumption = randomInt(50, 100);
  const cost = randomInt(10, 50);
  const carbon = randomInt(20, 60);
  const heating = randomInt(40, 80);

  document.getElementById("bar-consumption-percent").textContent = consumption + "%";
  document.getElementById("bar-consumption").style.width = consumption + "%";

  document.getElementById("bar-cost-percent").textContent = cost + "%";
  document.getElementById("bar-cost").style.width = cost + "%";

  document.getElementById("bar-carbon-percent").textContent = carbon + "%";
  document.getElementById("bar-carbon").style.width = carbon + "%";

  document.getElementById("bar-heating-percent").textContent = heating + "%";
  document.getElementById("bar-heating").style.width = heating + "%";
}

// Annual Expense chart paths generation
const annualPath1 = document.getElementById("annual-expense-path1");
const annualPath2 = document.getElementById("annual-expense-path2");
const annualTooltip = document.getElementById("annual-tooltip");

// Generate smooth path from points
function generateSmoothPath(points, closePath = true) {
  if (points.length < 2) return "";
  let d = `M${points[0].x} ${points[0].y} `;
  for (let i = 1; i < points.length; i++) {
    const cpX = (points[i - 1].x + points[i].x) / 2;
    d += `Q${cpX} ${points[i - 1].y} ${points[i].x} ${points[i].y} `;
  }
  if (closePath) {
    d += `L${points[points.length - 1].x} 200 L${points[0].x} 200 Z`;
  }
  return d;
}

// Generate random points for annual expense chart
function generateAnnualPoints() {
  const points1 = [];
  const points2 = [];
  const width = 700;
  const height = 200;
  const months = 12;
  const step = width / (months - 1);

  for (let i = 0; i < months; i++) {
    // Y values between 10 and 70 for first path
    const y1 = randomInt(10, 70);
    // Y values between 80 and 130 for second path
    const y2 = randomInt(80, 130);
    points1.push({ x: i * step, y: y1 });
    points2.push({ x: i * step, y: y2 });
  }
  return { points1, points2 };
}

// Update annual expense chart and tooltip
function updateAnnualExpense() {
  const { points1, points2 } = generateAnnualPoints();
  annualPath1.setAttribute("d", generateSmoothPath(points1));
  annualPath2.setAttribute("d", generateSmoothPath(points2));

  // Find max y in points1 for tooltip
  let maxIndex = 0;
  let maxY = 1000;
  points1.forEach((p, i) => {
    if (p.y < maxY) {
      maxY = p.y;
      maxIndex = i;
    }
  });

  // Position tooltip near max point
  const tooltipX = points1[maxIndex].x;
  const tooltipY = maxY + 20;
  annualTooltip.style.left = tooltipX + "px";
  annualTooltip.style.top = tooltipY + "px";

  // Random kBtu value for tooltip
  const kbtu = (Math.random() * 100).toFixed(1);
  annualTooltip.innerHTML = `Changing ${kbtu} kBtu<br>Event Status`;
}

// Main update function to refresh all dynamic data
function updateDashboard() {
  updateInvoice();
  renderConsumptionChart();
  updateOutages();
  updateCO2();
  updateConsumptionBars();
  updateAnnualExpense();
}

// Initial update
updateDashboard();

// Update every 2 seconds for faster moments
setInterval(updateDashboard, 2000);

// My Meters data and rendering
const metersContainer = document.getElementById("meters-container");

// Initial meters data with new names
let meters = [
  { name: "Computer Lab", active: true },
  { name: "EC Labs", active: true },
  { name: "Computer Lab 2", active: true },
  { name: "EC Lab 2", active: true },
];

// Create speedometer SVG element for meter
function createSpeedometer(value) {
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", "0 0 80 80");
  svg.setAttribute("class", "speedometer");

  // Background circle
  const bgCircle = document.createElementNS(svgNS, "circle");
  bgCircle.setAttribute("cx", "40");
  bgCircle.setAttribute("cy", "40");
  bgCircle.setAttribute("r", "35");
  bgCircle.setAttribute("stroke", "#6B7280");
  bgCircle.setAttribute("stroke-width", "6");
  bgCircle.setAttribute("fill", "none");
  svg.appendChild(bgCircle);

  // Foreground arc (partial circle)
  const fgCircle = document.createElementNS(svgNS, "circle");
  fgCircle.setAttribute("cx", "40");
  fgCircle.setAttribute("cy", "40");
  fgCircle.setAttribute("r", "35");
  fgCircle.setAttribute("stroke", "#F97316");
  fgCircle.setAttribute("stroke-width", "6");
  fgCircle.setAttribute("fill", "none");
  fgCircle.setAttribute("stroke-linecap", "round");
  fgCircle.setAttribute("stroke-dasharray", 219.911); // circumference ~2πr
  fgCircle.setAttribute("stroke-dashoffset", 219.911);
  svg.appendChild(fgCircle);

  // Needle line
  const needle = document.createElementNS(svgNS, "line");
  needle.setAttribute("x1", "40");
  needle.setAttribute("y1", "40");
  needle.setAttribute("x2", "40");
  needle.setAttribute("y2", "10");
  needle.setAttribute("class", "needle");
  needle.setAttribute("stroke", "#F97316");
  needle.setAttribute("stroke-width", "2");
  needle.setAttribute("stroke-linecap", "round");
  svg.appendChild(needle);

  // Center circle
  const centerCircle = document.createElementNS(svgNS, "circle");
  centerCircle.setAttribute("cx", "40");
  centerCircle.setAttribute("cy", "40");
  centerCircle.setAttribute("r", "5");
  centerCircle.setAttribute("class", "center-circle");
  svg.appendChild(centerCircle);

  // Animate needle and arc based on value (0-100)
  function update(value) {
    // Needle rotation from -90deg (0) to 90deg (100)
    const rotation = (value * 180) / 100 - 90;
    needle.style.transform = `rotate(${rotation}deg)`;

    // Arc stroke dashoffset (full circle circumference 219.911)
    const offset = 219.911 - (219.911 * value) / 100;
    fgCircle.setAttribute("stroke-dashoffset", offset);
  }

  update(value);

  return { svg, update };
}

// Render meters in container
function renderMeters() {
  // Clear all except add meter button
  metersContainer.querySelectorAll(".meter-item").forEach((el) => el.remove());

  meters.forEach((meter, index) => {
    const meterBtn = document.createElement("button");
    meterBtn.type = "button";
    meterBtn.className =
      "meter-item rounded-lg p-4 flex flex-col items-center justify-center text-xs font-semibold cursor-pointer " +
      (meter.active ? "bg-[#22D3EE] text-black" : "bg-[#6B7280] text-[#A1A1AA]");
    meterBtn.style.position = "relative";

    // Speedometer with random initial value
    const speedValue = randomInt(0, 100);
    const { svg, update } = createSpeedometer(speedValue);
    meterBtn.appendChild(svg);

    // Meter name below speedometer
    const nameSpan = document.createElement("span");
    nameSpan.textContent = meter.name;
    nameSpan.className = "mt-2";
    meterBtn.appendChild(nameSpan);

    // Animate speedometer needle every 2 seconds with new random value
    setInterval(() => {
      const newValue = randomInt(0, 100);
      update(newValue);
    }, 2000);

    metersContainer.appendChild(meterBtn);
  });
}

renderMeters();

// Add Meter modal logic
const addMeterBtn = document.getElementById("add-meter-btn");
const addMeterModal = document.getElementById("add-meter-modal");
const addMeterForm = document.getElementById("add-meter-form");
const cancelAddMeterBtn = document.getElementById("cancel-add-meter");
const meterNameInput = document.getElementById("meter-name");

addMeterBtn.addEventListener("click", () => {
  meterNameInput.value = "";
  addMeterModal.classList.remove("hidden");
  meterNameInput.focus();
});

cancelAddMeterBtn.addEventListener("click", () => {
  addMeterModal.classList.add("hidden");
});

addMeterForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = meterNameInput.value.trim();
  if (name) {
    meters.push({ name, active: true });
    renderMeters();
    addMeterModal.classList.add("hidden");
  }
});

// Sidebar navigation logic
const navButtons = document.querySelectorAll(".nav-btn");
const sections = {
  dashboard: document.getElementById("dashboard-section"),
  invoices: document.getElementById("invoices-section"),
  "planned-outages": document.getElementById("planned-outages-section"),
  "tariff-tracker": document.getElementById("tariff-tracker-section"),
  "cost-reducing": document.getElementById("cost-reducing-section"),
  service: document.getElementById("service-section"),
};

function showSection(sectionKey) {
  Object.entries(sections).forEach(([key, section]) => {
    if (key === sectionKey) {
      section.classList.remove("hidden");
    } else {
      section.classList.add("hidden");
    }
  });
  navButtons.forEach((btn) => {
    if (btn.dataset.section === sectionKey) {
      btn.classList.add("bg-[#F97316]", "text-white");
      btn.classList.remove("text-[#A1A1AA]");
      btn.setAttribute("aria-current", "page");
    } else {
      btn.classList.remove("bg-[#F97316]", "text-white");
      btn.classList.add("text-[#A1A1AA]");
      btn.removeAttribute("aria-current");
    }
  });
}

navButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    showSection(btn.dataset.section);
  });
});

// Clicking Electrocon logo resets to dashboard
document.getElementById("nav-Wattwatch").addEventListener("click", () => {
  showSection("dashboard");
});

// Initialize showing dashboard
showSection("dashboard");
