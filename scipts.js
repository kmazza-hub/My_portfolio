// Theme Toggle
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

// Check for saved theme in localStorage
const savedTheme = localStorage.getItem("theme") || "dark-theme";
body.classList.add(savedTheme);

// Update the toggle button icon
themeToggle.textContent = savedTheme === "dark-theme" ? "🌙" : "☀️";

// Add event listener to toggle theme
themeToggle.addEventListener("click", () => {
  const isDark = body.classList.contains("dark-theme");

  body.classList.toggle("dark-theme", !isDark);
  body.classList.toggle("light-theme", isDark);

  localStorage.setItem("theme", isDark ? "light-theme" : "dark-theme");
  themeToggle.textContent = isDark ? "☀️" : "🌙";
});
