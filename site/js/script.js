// CampusConnect - vanilla JavaScript (no libraries, no backend)

// ---------- 1. Sample event data (fictional, for demo only) ----------
const EVENTS = [
  { name: "CodeSprint 24h Hackathon", category: "Technical", date: "2027-03-18", time: "9:00 AM", venue: "Computer Lab 3", desc: "Build a working prototype in 24 hours with your team.", featured: true },
  { name: "Robo Race Arena", category: "Technical", date: "2027-03-19", time: "11:00 AM", venue: "Mechanical Workshop", desc: "Design a line-following robot and race it on the track." },
  { name: "Bug Hunt Quiz", category: "Technical", date: "2027-03-18", time: "2:00 PM", venue: "Seminar Hall B", desc: "Spot errors in code snippets faster than other teams." },
  { name: "Rangmanch Group Dance", category: "Cultural", date: "2027-03-19", time: "5:00 PM", venue: "Open Air Theatre", desc: "Teams perform a 5-minute group dance on stage.", featured: true },
  { name: "Open Mic Evening", category: "Cultural", date: "2027-03-20", time: "6:00 PM", venue: "Auditorium", desc: "Sing, recite or perform stand-up in front of the campus." },
  { name: "Street Play Showcase", category: "Cultural", date: "2027-03-19", time: "10:00 AM", venue: "Main Quadrangle", desc: "Short plays on social themes by student drama groups." },
  { name: "Inter-Department Football", category: "Sports", date: "2027-03-18", time: "4:00 PM", venue: "College Ground", desc: "Knockout football tournament between departments.", featured: true },
  { name: "Table Tennis Doubles", category: "Sports", date: "2027-03-19", time: "1:00 PM", venue: "Indoor Sports Hall", desc: "Pair up and play a fast doubles tournament." },
  { name: "Git and Docker Basics", category: "Workshop", date: "2027-03-18", time: "11:30 AM", venue: "Lab 2", desc: "Hands-on session: version control and first containers." },
  { name: "UI Design in 2 Hours", category: "Workshop", date: "2027-03-20", time: "10:00 AM", venue: "Design Studio", desc: "Learn layout, colour and type, then redesign a small page." },
  { name: "Treasure Hunt", category: "Competition", date: "2027-03-20", time: "12:00 PM", venue: "Whole Campus", desc: "Solve clues in teams of four and find the final prize.", featured: true },
  { name: "Pitch in 3 Minutes", category: "Competition", date: "2027-03-20", time: "3:00 PM", venue: "Seminar Hall A", desc: "Present a startup idea to a student panel in three minutes." }
];

// ---------- 2. Helpers ----------
const fmtDate = d => new Date(d + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

// Build one event card as an HTML string
function cardHTML(ev) {
  return `<article class="card cat-${ev.category}">
    <span class="badge">${ev.category}</span>
    <h3>${ev.name}</h3>
    <p>${ev.desc}</p>
    <ul class="meta"><li>Date: ${fmtDate(ev.date)}</li><li>Time: ${ev.time}</li><li>Venue: ${ev.venue}</li></ul>
    <button class="btn btn-dark" data-register="${ev.name}">Register</button>
  </article>`;
}

function renderInto(id, list) {
  const box = document.getElementById(id);
  if (!box) return;                       // this page does not have that container
  box.innerHTML = list.length ? list.map(cardHTML).join("") : '<p class="empty">No events match your search.</p>';
}

// ---------- 3. Mobile navigation ----------
const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open);
  });
}

// ---------- 4. Event rendering, filter and search ----------
renderInto("featured-events", EVENTS.filter(e => e.featured).slice(0, 3));
renderInto("upcoming-events", [...EVENTS].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 4));

let activeCategory = "All";
const searchBox = document.getElementById("search");

function applyFilters() {
  const q = searchBox ? searchBox.value.trim().toLowerCase() : "";
  const result = EVENTS.filter(e =>
    (activeCategory === "All" || e.category === activeCategory) &&
    (e.name + " " + e.desc + " " + e.venue).toLowerCase().includes(q));
  renderInto("events-grid", result);
}

document.querySelectorAll(".chip").forEach(chip => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    activeCategory = chip.dataset.cat;
    applyFilters();
  });
});
if (searchBox) searchBox.addEventListener("input", applyFilters);
applyFilters();

// ---------- 5. Registration modal (demo only, nothing is saved) ----------
const modalBg = document.getElementById("modal-bg");
const modalText = document.getElementById("modal-text");
document.addEventListener("click", e => {
  const btn = e.target.closest("[data-register]");
  if (btn && modalBg) {
    modalText.textContent = 'Demo only: your registration for "' + btn.dataset.register + '" was not saved or sent anywhere.';
    modalBg.classList.add("open");
  }
  if (modalBg && (e.target === modalBg || e.target.id === "modal-close")) modalBg.classList.remove("open");
});
document.addEventListener("keydown", e => { if (e.key === "Escape" && modalBg) modalBg.classList.remove("open"); });

// ---------- 6. Contact form validation (frontend only) ----------
const form = document.getElementById("contact-form");
if (form) {
  form.addEventListener("submit", e => {
    e.preventDefault();                       // stop the page from reloading
    const name = form.elements["name"].value.trim();
    const email = form.elements["email"].value.trim();
    const message = form.elements["message"].value.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // Show or clear an error message under a field; returns true when valid
    const setErr = (id, msg) => { document.getElementById(id).textContent = msg; return msg === ""; };
    const ok1 = setErr("err-name", name.length >= 2 ? "" : "Enter your name (at least 2 letters).");
    const ok2 = setErr("err-email", emailOk ? "" : "Enter a valid email address.");
    const ok3 = setErr("err-message", message.length >= 10 ? "" : "Message must be at least 10 characters.");

    const success = document.getElementById("success");
    if (ok1 && ok2 && ok3) {
      success.classList.add("show");
      form.reset();
    } else {
      success.classList.remove("show");
    }
  });
}

// ---------- 7. Demo login and register forms (frontend only, nothing is stored) ----------
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Show or clear the error text under a field; returns true when valid
function setFieldError(id, msg) {
  document.getElementById("err-" + id).textContent = msg;
  return msg === "";
}

function handleAuthForm(formId, check) {
  const f = document.getElementById(formId);
  if (!f) return;                              // this page does not have that form
  f.addEventListener("submit", e => {
    e.preventDefault();
    const v = n => f.elements[n] ? f.elements[n].value.trim() : "";
    const valid = check(v);                    // runs the page-specific checks
    const success = document.getElementById("success");
    if (valid) { success.classList.add("show"); f.reset(); }
    else { success.classList.remove("show"); }
  });
}

handleAuthForm("login-form", v => {
  const a = setFieldError("email", emailRe.test(v("email")) ? "" : "Enter a valid email address.");
  const b = setFieldError("password", v("password") ? "" : "Enter your password.");
  return a && b;
});

handleAuthForm("register-form", v => {
  const a = setFieldError("name", v("name").length >= 2 ? "" : "Enter your name (at least 2 letters).");
  const b = setFieldError("email", emailRe.test(v("email")) ? "" : "Enter a valid email address.");
  const c = setFieldError("password", v("password").length >= 6 ? "" : "Password must be at least 6 characters.");
  const d = setFieldError("confirm", v("confirm") === v("password") && v("confirm") ? "" : "Passwords do not match.");
  return a && b && c && d;
});
