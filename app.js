const STORAGE_KEY = "my-app-entries";

const form = document.getElementById("entry-form");
const input = document.getElementById("entry-input");
const list = document.getElementById("entry-list");
const emptyState = document.getElementById("empty-state");

function loadEntries() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function render() {
  const entries = loadEntries();
  list.innerHTML = "";

  entries.forEach((text, index) => {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = text;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "✕";
    removeBtn.setAttribute("aria-label", "Remove");
    removeBtn.addEventListener("click", () => {
      const updated = loadEntries();
      updated.splice(index, 1);
      saveEntries(updated);
      render();
    });

    li.appendChild(span);
    li.appendChild(removeBtn);
    list.appendChild(li);
  });

  emptyState.classList.toggle("visible", entries.length === 0);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  const entries = loadEntries();
  entries.unshift(text);
  saveEntries(entries);
  input.value = "";
  render();
});

render();

// Register the service worker so the app can launch offline.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js");
  });
}
