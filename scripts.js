document.addEventListener("DOMContentLoaded", loadTasks);

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

taskForm.addEventListener("submit", function (e) {
    e.preventDefault();
    addTask(taskInput.value.trim());
    taskInput.value = "";
});

function addTask(description) {
    if (description === "") return;

    const task = {
        id: Date.now(),
        description,
        completed: false
    };

    const tasks = getTasksFromStorage();
    tasks.push(task);
    saveTasksToStorage(tasks);
    renderTask(task);
}

function renderTask(task) {
    const li = document.createElement("li");
    li.setAttribute("data-id", task.id);
    if (task.completed) li.classList.add("completed");

    li.innerHTML = `
        <label class="task-label">
            <input type="checkbox" class="check-complete" ${task.completed ? "checked" : ""}>
            <span class="task-text">${task.description}</span>
        </label>
        <div class="task-buttons">
            <button class="edit" title="Edit">&#9998;</button>
            <button class="delete" title="Delete">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 5h4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0V6h-3v6.5a.5.5 0 0 1-1 0v-7z"/>
                    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1 0-2h4a1 1 0 0 1 2 0h4a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3a.5.5 0 0 0 0 1h11a.5.5 0 0 0 0-1h-11z"/>
                </svg>
            </button>
        </div>
    `;

    taskList.appendChild(li);
}

function loadTasks() {
    const tasks = getTasksFromStorage();
    tasks.forEach(renderTask);
}

function getTasksFromStorage() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
}

function saveTasksToStorage(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

taskList.addEventListener("click", function (e) {
    const target = e.target.closest("button");
    const li = target.closest("li");
    const id = Number(li.getAttribute("data-id"));

    if (target.classList.contains("delete")) {
        deleteTask(id, li);
    } else if (target.classList.contains("edit")) {
        editTask(id, li);
    }
});

taskList.addEventListener("change", function (e) {
    if (e.target.classList.contains("check-complete")) {
        const li = e.target.closest("li");
        const id = Number(li.getAttribute("data-id"));
        completeTask(id, li, e.target.checked);
    }
});

function deleteTask(id, li) {
    let tasks = getTasksFromStorage();
    tasks = tasks.filter(task => task.id !== id);
    saveTasksToStorage(tasks);
    li.remove();
}

function completeTask(id, li, checked) {
    const tasks = getTasksFromStorage();
    const task = tasks.find(task => task.id === id);
    if (task) {
        task.completed = checked;
        saveTasksToStorage(tasks);
        li.classList.toggle("completed", checked);
    }
}

function editTask(id, li) {
    const span = li.querySelector(".task-text");
    const oldText = span.textContent;
    const newText = prompt("Edit your task:", oldText);

    if (newText && newText.trim() !== "") {
        const tasks = getTasksFromStorage();
        const task = tasks.find(task => task.id === id);
        if (task) {
            task.description = newText.trim();
            saveTasksToStorage(tasks);
            span.textContent = newText.trim();
        }
    }
}
