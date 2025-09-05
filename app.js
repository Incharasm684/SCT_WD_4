let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "all"; // all | active | completed

// Render tasks
function renderTasks() {
  const listsDiv = document.getElementById("lists");
  listsDiv.innerHTML = "";

  const search = document.getElementById("searchBox").value.toLowerCase();

  // Group by lists
  const grouped = {};
  tasks.forEach(task => {
    if (!grouped[task.list]) grouped[task.list] = [];
    grouped[task.list].push(task);
  });

  for (let listName in grouped) {
    const listBlock = document.createElement("div");
    listBlock.innerHTML = `<h2>📂 ${listName}</h2>`;

    grouped[listName]
      .filter(task => {
        if (filter === "active") return !task.completed;
        if (filter === "completed") return task.completed;
        return true;
      })
      .filter(task => task.title.toLowerCase().includes(search))
      .forEach(task => {
        const div = document.createElement("div");
        div.className = "task" + (task.completed ? " completed" : "");
        div.innerHTML = `
          <span>
            <input type="checkbox" ${task.completed ? "checked" : ""} onclick="toggleTask(${task.id})">
            <strong>${task.title}</strong>
            ${task.dateTime ? `<small> (${task.dateTime})</small>` : ""}
          </span>
          <span>
            <button onclick="editTask(${task.id})">✏</button>
            <button onclick="deleteTask(${task.id})">🗑</button>
          </span>
        `;
        listBlock.appendChild(div);
      });

    listsDiv.appendChild(listBlock);
  }
}

// Add task
function addTask() {
  const title = document.getElementById("taskTitle").value.trim();
  const dateTime = document.getElementById("taskDateTime").value;
  const list = document.getElementById("taskList").value;

  if (!title) return alert("Please enter a task title!");

  const task = {
    id: Date.now(),
    title,
    dateTime,
    list,
    completed: false
  };

  tasks.push(task);
  saveTasks();
  renderTasks();

  document.getElementById("taskTitle").value = "";
  document.getElementById("taskDateTime").value = "";
}

// Toggle completed
function toggleTask(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  saveTasks(); renderTasks();
}

// Edit task
function editTask(id) {
  const task = tasks.find(t => t.id === id);
  const newTitle = prompt("Edit task title:", task.title);
  if (newTitle) {
    task.title = newTitle.trim();
    saveTasks(); renderTasks();
  }
}

// Delete task
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks(); renderTasks();
}

// Add new list dynamically
function addNewList() {
  const newList = prompt("Enter new list name:");
  if (newList) {
    const select = document.getElementById("taskList");
    const option = document.createElement("option");
    option.value = newList;
    option.textContent = newList;
    select.appendChild(option);
    select.value = newList;
  }
}

// Change filter
function setFilter(type) {
  filter = type;
  renderTasks();
}

// Save tasks
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Initial render
renderTasks();
