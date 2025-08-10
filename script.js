// Theme toggle + year
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;
const savedTheme = localStorage.getItem("theme") || "dark-theme";
body.classList.add(savedTheme);
if (themeToggle) {
  themeToggle.textContent = savedTheme === "dark-theme" ? "🌙" : "☀️";
  themeToggle.addEventListener("click", () => {
    const isDark = body.classList.contains("dark-theme");
    body.classList.toggle("dark-theme", !isDark);
    body.classList.toggle("light-theme", isDark);
    localStorage.setItem("theme", isDark ? "light-theme" : "dark-theme");
    themeToggle.textContent = isDark ? "☀️" : "🌙";
  });
}
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Load data.json
fetch("data.json")
  .then((res) => res.json())
  .then((data) => {
    renderSkills(data.skills || []);
    renderProjects(data.projects || []);
  })
  .catch((e) => console.error("Failed to load data.json", e));

// Render skills
function renderSkills(skills) {
  const ul = document.getElementById("skills-list");
  if (!ul) return;
  ul.innerHTML = "";
  skills.forEach((s) => {
    const li = document.createElement("li");
    li.textContent = s;
    ul.appendChild(li);
  });
}

// Render projects with filters and actions
function renderProjects(allProjects) {
  const projectGrid = document.getElementById("projects-grid");
  const filterBar = document.getElementById("filter-bar");
  if (!projectGrid || !filterBar) return;

  // Collect unique tags
  const tagSet = new Set();
  allProjects.forEach((proj) => (proj.tags || []).forEach((t) => tagSet.add(t)));
  const allTags = Array.from(tagSet).sort();

  // Build filter buttons
  filterBar.innerHTML = "";
  const makeBtn = (label, active = false) => {
    const b = document.createElement("button");
    b.className = "filter-button";
    b.textContent = label;
    if (active) b.classList.add("active");
    return b;
  };
  const showAllBtn = makeBtn("Show All", true);
  filterBar.appendChild(showAllBtn);
  allTags.forEach((t) => filterBar.appendChild(makeBtn(t)));

  // Render cards
  const draw = (projects) => {
    projectGrid.innerHTML = "";
    projects.forEach((project) => {
      const { title, description, tags = [], liveUrl, repoUrl, link } = project;
      const repo = repoUrl || link || null;

      const card = document.createElement("div");
      card.className = "project-card";

      const h3 = document.createElement("h3");
      h3.textContent = title;

      const p = document.createElement("p");
      p.textContent = description;

      const tagList = document.createElement("div");
      tagList.className = "project-tags";
      tags.forEach((t) => {
        const span = document.createElement("span");
        span.className = "project-tag";
        span.textContent = t;
        tagList.appendChild(span);
      });

      const actions = document.createElement("div");
      actions.className = "project-actions";

      if (liveUrl) {
        // Preview inside portfolio
        const preview = document.createElement("a");
        const src = encodeURIComponent(liveUrl);
        const ttl = encodeURIComponent(title);
        preview.href = `preview.html?title=${ttl}&src=${src}`;
        preview.className = "btn";
        preview.textContent = "Preview";
        actions.appendChild(preview);

        // Open live
        const open = document.createElement("a");
        open.href = liveUrl;
        open.target = "_blank";
        open.rel = "noopener noreferrer";
        open.className = "btn";
        open.textContent = "Open Live";
        actions.appendChild(open);
      }

      if (repo) {
        const gh = document.createElement("a");
        gh.href = repo;
        gh.target = "_blank";
        gh.rel = "noopener noreferrer";
        gh.className = "btn secondary";
        gh.textContent = "View GitHub";
        actions.appendChild(gh);
      }

      card.appendChild(h3);
      card.appendChild(p);
      card.appendChild(tagList);
      card.appendChild(actions);
      projectGrid.appendChild(card);
    });
  };

  draw(allProjects);

  // Filtering
  filterBar.addEventListener("click", (e) => {
    if (e.target.tagName !== "BUTTON") return;
    document.querySelectorAll(".filter-button").forEach((b) => b.classList.remove("active"));
    e.target.classList.add("active");
    const selected = e.target.textContent;
    if (selected === "Show All") return draw(allProjects);
    const filtered = allProjects.filter((p) => (p.tags || []).includes(selected));
    draw(filtered);
  });
}
