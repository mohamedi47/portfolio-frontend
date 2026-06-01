// =============================================
// CONFIG — Update this URL after deploying to Render
// =============================================
const API_BASE = "https://portfolio-backend-scl8.onrender.com"; // ← Replace with your Render URL

// =============================================
// Fetch & Render Skills
// =============================================
async function loadSkills() {
  const grid = document.getElementById("skills-grid");
  try {
    const res = await fetch(`${API_BASE}/api/skills`);
    if (!res.ok) throw new Error("Network response not ok");
    const { skills } = await res.json();

    grid.innerHTML = "";
    skills.forEach((skill, i) => {
      const card = document.createElement("div");
      card.className = "skill-card";
      card.style.animationDelay = `${i * 0.06}s`;
      card.innerHTML = `
        <div class="skill-name">${skill.name}</div>
        <div class="skill-level">${skill.level}</div>
        <div class="skill-bar">
          <div class="skill-bar-fill" style="--w:${skill.percent}%"></div>
        </div>
      `;
      grid.appendChild(card);
    });
  } catch (err) {
    grid.innerHTML = `<p class="skill-loading">Could not load skills. Is the backend running?</p>`;
    console.error("Skills fetch error:", err);
  }
}

// =============================================
// Fetch & Render Projects
// =============================================
async function loadProjects() {
  const grid = document.getElementById("projects-grid");
  try {
    const res = await fetch(`${API_BASE}/api/projects`);
    if (!res.ok) throw new Error("Network response not ok");
    const { projects } = await res.json();

    grid.innerHTML = "";
    projects.forEach(project => {
      const card = document.createElement("div");
      card.className = "project-card";
      card.innerHTML = `
        <span class="p-tag">${project.category}</span>
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <div class="p-links">
          ${project.github ? `<a href="${project.github}" target="_blank">GitHub ↗</a>` : ""}
          ${project.live ? `<a href="${project.live}" target="_blank">Live Demo ↗</a>` : ""}
        </div>
      `;
      grid.appendChild(card);
    });
  } catch (err) {
    grid.innerHTML = `<p class="skill-loading">Could not load projects. Is the backend running?</p>`;
    console.error("Projects fetch error:", err);
  }
}

// =============================================
// Contact Form → POST to backend
// =============================================
document.getElementById("contact-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const status = document.getElementById("form-status");
  const btn = e.target.querySelector("button");
  const inputs = e.target.querySelectorAll("input, textarea");

  const [name, email, message] = [...inputs].map(i => i.value);

  btn.textContent = "Sending…";
  btn.disabled = true;

  try {
    const res = await fetch(`${API_BASE}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message })
    });
    const data = await res.json();
    if (res.ok) {
      status.textContent = "✓ Message sent! I'll be in touch soon.";
      e.target.reset();
    } else {
      status.textContent = data.error || "Something went wrong.";
    }
  } catch {
    status.textContent = "Network error — please email me directly.";
  }

  btn.textContent = "Send Message";
  btn.disabled = false;
});

// =============================================
// Scroll Reveal (Intersection Observer)
// =============================================
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

// =============================================
// Init
// =============================================
loadSkills();
loadProjects();
