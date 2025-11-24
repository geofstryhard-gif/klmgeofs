// --------- Settings: update these ----------
const DISCORD_INVITE = "https://discord.gg/your-invite";


const FLEET = [
  {
    name: "Embraer 175",
    code: "E175",
    role: "Regional",
    range: "3,700 km",
    notes: "Used for regional flights in Netherlands.",
    img: "https://upload.wikimedia.org/wikipedia/commons/8/8e/KLM_Cityhopper_Embraer_ERJ-175STD_PH-EXS_at_Schiphol_24-11-2022.jpg"
  },
  {
    name: "Boeing 737-800",
    code: "B738",
    role: "Short/medium haul",
    range: "5,600 km",
    notes: "Workhorse for European network; RNAV-friendly.",
    img: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Berlin_Brandenburg_Airport_KLM_Royal_Dutch_Airlines_Boeing_737-8K2%28WL%29_PH-BXB_%28DSC07657%29.jpg"
  },
  {
    name: "Boeing 777-300ER",
    code: "B77W",
    role: "Long haul",
    range: "13,600 km",
    notes: "Stable at cruise, strong crosswind authority.",
    img: "https://upload.wikimedia.org/wikipedia/commons/f/fb/KLM_Boeing_777-300ER_PH-BVA_%282873338662%29.jpg"
  }
];

const ROUTES = [
  {
    flight: "KL1001",
    dep: "EHAM", depName: "Amsterdam",
    arr: "EGLL", arrName: "London Heathrow",
    distance: "371 nm",
    aircraft: ["E175", "B738"],
    coords: [[52.3105, 4.7683], [51.4700, -0.4543]],
    brief: "Benelux–UK shuttle; expect vectors to ILS 27L, typical tailwinds westbound."
  },
  {
    flight: "KL1275",
    dep: "EHAM", depName: "Amsterdam",
    arr: "LEMD", arrName: "Madrid",
    distance: "738 nm",
    aircraft: ["B738"],
    coords: [[52.3105, 4.7683], [40.4722, -3.5608]],
    brief: "Euro medium-haul; plan RNAV arrivals, watch summer thermals over plateau."
  },
  {
    flight: "KL602",
    dep: "EHAM", depName: "Amsterdam",
    arr: "KSFO", arrName: "San Francisco",
    distance: "4,763 nm",
    aircraft: ["B77W"],
    coords: [[52.3105, 4.7683], [37.6188, -122.375]],
    brief: "North Atlantic; ETOPS planning, long step climbs, coastal STAR to 28L/28R."
  }
];

const EVENTS = [
  {
    title: "Blue Hour Amsterdam Circuit",
    date: "2025-12-03 19:00 CET",
    desc: "Touch-and-go training at EHAM—visuals, crosswinds, short taxi discipline.",
    link: "#"
  },
  {
    title: "Holiday Shuttle: AMS–LHR",
    date: "2025-12-20 18:00 CET",
    desc: "High-traffic group flight; slot times, speed control, final spacing.",
    link: "#"
  },
  {
    title: "Long-haul Showcase: AMS–SFO",
    date: "2026-01-10 15:00 CET",
    desc: "Fuel planning brief, step climb procedures, oceanic coordination.",
    link: "#"
  }
];

// --------- Init links ----------
document.getElementById("discordLink").href = DISCORD_INVITE;
document.getElementById("sopLink").href = SOP_DOCS;

// --------- Fleet render ----------
const fleetGrid = document.getElementById("fleetGrid");
const aircraftSelect = document.getElementById("aircraft");

FLEET.forEach(a => {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <img src="${a.img}" alt="${a.name}" style="width:100%;height:160px;object-fit:cover;border-radius:8px;margin-bottom:10px" />
    <h3>${a.name} (${a.code})</h3>
    <p><strong>Role:</strong> ${a.role}</p>
    <p><strong>Range:</strong> ${a.range}</p>
    <p class="muted">${a.notes}</p>
  `;
  fleetGrid.appendChild(card);

  const opt = document.createElement("option");
  opt.value = a.code;
  opt.textContent = `${a.name} (${a.code})`;
  aircraftSelect.appendChild(opt);
});

// --------- Map + routes ----------
const map = L.map("map", { scrollWheelZoom: false }).setView([52.31, 4.77], 4);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors"
}).addTo(map);

const routeList = document.getElementById("routeList");
const routeBrief = document.getElementById("routeBrief");
let drawnRoutes = [];

function clearRoutes() {
  drawnRoutes.forEach(layer => layer.remove());
  drawnRoutes = [];
}

function showRoute(r) {
  clearRoutes();
  const line = L.polyline(r.coords, { color: "#00a1e4", weight: 4 }).addTo(map);
  drawnRoutes.push(line);
  const depMarker = L.circleMarker(r.coords[0], { radius: 6, color: "#0a2c3d" }).addTo(map);
  const arrMarker = L.circleMarker(r.coords[1], { radius: 6, color: "#0a2c3d" }).addTo(map);
  drawnRoutes.push(depMarker, arrMarker);
  map.fitBounds(line.getBounds(), { padding: [20, 20] });

  routeBrief.innerHTML = `
    <p><strong>Flight:</strong> ${r.flight}</p>
    <p><strong>Route:</strong> ${r.dep} (${r.depName}) → ${r.arr} (${r.arrName})</p>
    <p><strong>Distance:</strong> ${r.distance}</p>
    <p><strong>Eligible fleet:</strong> ${r.aircraft.join(", ")}</p>
    <p>${r.brief}</p>
  `;
}

ROUTES.forEach(r => {
  const li = document.createElement("li");
  li.innerHTML = `
    <div><strong>${r.flight}</strong> — ${r.dep} → ${r.arr}</div>
    <div class="muted">${r.depName} to ${r.arrName} • ${r.distance}</div>
  `;
  li.addEventListener("click", () => showRoute(r));
  routeList.appendChild(li);
});

// Default select first route
if (ROUTES[0]) showRoute(ROUTES[0]);

// --------- Events ----------
const eventGrid = document.getElementById("eventGrid");
EVENTS.forEach(e => {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <h3>${e.title}</h3>
    <p><strong>Date:</strong> ${e.date}</p>
    <p>${e.desc}</p>
    <a href="${e.link}" class="btn btn-secondary">Event brief</a>
  `;
  eventGrid.appendChild(card);
});

// --------- Pilot center: demo auth ----------
const loginForm = document.getElementById("loginForm");
const loginStatus = document.getElementById("loginStatus");

loginForm.addEventListener("submit", (ev) => {
  ev.preventDefault();
  const cs = document.getElementById("callsign").value.trim().toUpperCase();
  const pw = document.getElementById("password").value;

  if (!/^KLM\d{3,4}$/.test(cs)) {
    loginStatus.textContent = "Use callsign format: KLM### (e.g., KLM215).";
    return;
  }
  if (pw.length < 6) {
    loginStatus.textContent = "Password must be at least 6 characters.";
    return;
  }
  loginStatus.textContent = `Welcome, ${cs}. Pilot center unlocked for demo.`;
});

// --------- PIREP submission: demo only ----------
const pirepForm = document.getElementById("pirepForm");
const pirepStatus = document.getElementById("pirepStatus");

pirepForm.addEventListener("submit", (ev) => {
  ev.preventDefault();
  const payload = {
    flightNumber: document.getElementById("flightNumber").value.trim().toUpperCase(),
    dep: document.getElementById("dep").value.trim().toUpperCase(),
    arr: document.getElementById("arr").value.trim().toUpperCase(),
    aircraft: document.getElementById("aircraft").value,
    flightTime: document.getElementById("flightTime").value.trim(),
    notes: document.getElementById("notes").value.trim(),
    submittedAt: new Date().toISOString()
  };

  if (!/^[A-Z]{4}$/.test(payload.dep) || !/^[A-Z]{4}$/.test(payload.arr)) {
    pirepStatus.textContent = "Use 4-letter ICAO codes (e.g., EHAM, EGLL).";
    return;
  }
  if (!/^\w{2}\d{3,4}$/.test(payload.flightNumber)) {
    pirepStatus.textContent = "Flight number format example: KL1234.";
    return;
  }
  // Demo: just echo success
  console.log("PIREP:", payload);
  pirepStatus.textContent = "PIREP submitted (demo). Check console log for data.";
  pirepForm.reset();
});

// --------- Applications ----------
const applyForm = document.getElementById("applyForm");
const applyStatus = document.getElementById("applyStatus");

applyForm.addEventListener("submit", (ev) => {
  ev.preventDefault();
  const data = {
    name: document.getElementById("appName").value.trim(),
    email: document.getElementById("appEmail").value.trim(),
    user: document.getElementById("appUser").value.trim(),
    exp: document.getElementById("appExp").value,
    why: document.getElementById("appWhy").value.trim(),
    submittedAt: new Date().toISOString()
  };
  if (!data.name || !data.email || !data.user) {
    applyStatus.textContent = "All required fields must be completed.";
    return;
  }
  console.log("Application:", data);
  applyStatus.textContent = "Application received (demo). We’ll email you within 72 hours.";
  applyForm.reset();
});
