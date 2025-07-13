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
fetch("data.json")
  .then((res) => res.json())
  .then((data) => {
    const allProjects = data.projects;
    const projectGrid = document.getElementById("projects-grid");
    const filterBar = document.getElementById("filter-bar");

    // Get unique tags
    const tagSet = new Set();
    allProjects.forEach((proj) => proj.tags.forEach((tag) => tagSet.add(tag)));
    const allTags = Array.from(tagSet).sort();

    // Create Filter Buttons
    const createButton = (label, isActive = false) => {
      const btn = document.createElement("button");
      btn.textContent = label;
      btn.className = "filter-button";
      if (isActive) btn.classList.add("active");
      return btn;
    };

    const showAllBtn = createButton("Show All", true);
    filterBar.appendChild(showAllBtn);
    allTags.forEach((tag) => {
      const tagBtn = createButton(tag);
      filterBar.appendChild(tagBtn);
    });

    // Render Projects
    const renderProjects = (projects) => {
      projectGrid.innerHTML = "";
      projects.forEach((project) => {
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
    };

    renderProjects(allProjects); // Initial load

    // Filter Logic
    filterBar.addEventListener("click", (e) => {
      if (e.target.tagName !== "BUTTON") return;

      const selected = e.target.textContent;
      document.querySelectorAll(".filter-button").forEach((btn) =>
        btn.classList.remove("active")
      );
      e.target.classList.add("active");

      if (selected === "Show All") {
        renderProjects(allProjects);
      } else {
        const filtered = allProjects.filter((proj) =>
          proj.tags.includes(selected)
        );
        renderProjects(filtered);
      }
    });
  })
  .catch((err) => console.error("Error loading data.json", err));
