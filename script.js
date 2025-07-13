// Theme Toggle
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;
const savedTheme = localStorage.getItem("theme") || "dark-theme";
body.classList.add(savedTheme);
themeToggle.textContent = savedTheme === "dark-theme" ? "🌙" : "☀️";
themeToggle.addEventListener("click", () => {
  const isDark = body.classList.contains("dark-theme");
  body.classList.toggle("dark-theme", !isDark);
  body.classList.toggle("light-theme", isDark);
  localStorage.setItem("theme", isDark ? "light-theme" : "dark-theme");
  themeToggle.textContent = isDark ? "☀️" : "🌙";
});

// Load and Render Projects
fetch("/data.json")
  .then((res) => res.json())
  .then((data) => {
    const projectGrid = document.querySelector(".projects-grid");
    projectGrid.innerHTML = ""; // Clear any hardcoded content

    data.projects.forEach((project) => {
      const card = document.createElement("div");
      card.className = "project-card";

      const title = document.createElement("h3");
      title.textContent = project.title;

      const desc = document.createElement("p");
      desc.textContent = project.description;

      const tagList = document.createElement("div");
      tagList.className = "project-tags";
      project.tags.forEach((tag) => {
        const span = document.createElement("span");
        span.className = "project-tag";
        span.textContent = tag;
        tagList.appendChild(span);
      });

      const link = document.createElement("a");
      link.href = project.link;
      link.target = "_blank";
      link.className = "project-link";
      link.textContent = "View on GitHub";

      card.appendChild(title);
      card.appendChild(desc);
      card.appendChild(tagList);
      card.appendChild(link);
      projectGrid.appendChild(card);
    });
  })
  .catch((err) => {
    console.error("Error loading project data:", err);
  });
