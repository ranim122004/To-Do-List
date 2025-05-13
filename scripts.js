document.addEventListener("DOMContentLoaded", loadTasks);

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

// Accessibility-friendly empty state message
const emptyMessage = document.createElement("p");
emptyMessage.id = "emptyMessage";
emptyMessage.textContent = "No tasks yet! 🎉";
emptyMessage.style.textAlign = "center";
emptyMessage.style.marginTop = "20px";
emptyMessage.style.color = "white";
emptyMessage.setAttribute("role", "status");
emptyMessage.setAttribute("aria-live", "polite");

taskForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const input = taskInput.value.trim();
    if (input === "") return;
    addTask(input);
    taskInput.value = "";
});

function addTask(description) {
    const trimmedDesc = description.trim();
    if (!trimmedDesc) return;

    const task = {
        id: Date.now(),
        description: trimmedDesc,
        completed: false
    };

    const tasks = getTasksFromStorage();
    tasks.push(task);
    saveTasksToStorage(tasks);
    renderTask(task);
    updateEmptyMessage();
}

function renderTask(task) {
    const li = document.createElement("li");
    li.setAttribute("data-id", task.id);
    li.classList.add("fade-in");
    if (task.completed) li.classList.add("completed");

    li.innerHTML = `
        <label class="task-label">
            <input type="checkbox" class="check-complete" ${task.completed ? "checked" : ""} aria-label="Mark task as completed">
            <span class="task-text">${task.description}</span>
        </label>
        <div class="task-buttons">
            <button class="edit" title="Edit Task" aria-label="Edit Task">&#9998;</button>
            <button class="delete" title="Delete Task" aria-label="Delete Task">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor"
                    viewBox="0 0 16 16" role="img" aria-label="Delete " aria-hidden="true">
                    <title>Delete Task </title>
                    <path d="M5.5 5.5A.5.5 0 0 1 6 5h4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0V6h-3v6.5a.5.5 0 0 1-1 0v-7z"/>
                    <path fill-rule="evenodd"
                        d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1 0-2h4a1 1 0 0 1 2 0h4a1 1 0 0 1 1 1zM4.118 4 
                        4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3a.5.5 0 0 0 0 1h11a.5.5 0 0 0 0-1h-11z"/>
                </svg>
            </button>
        </div>
    `;

    taskList.appendChild(li);
}

function loadTasks() {
    const tasks = getTasksFromStorage();
    if (tasks.length === 0) {
        taskList.parentNode.appendChild(emptyMessage);
    } else {
        tasks.forEach(renderTask);
    }
}

function updateEmptyMessage() {
    const tasks = getTasksFromStorage();
    const hasTasks = tasks.length > 0;
    const existingMessage = document.getElementById("emptyMessage");

    if (!hasTasks && !existingMessage) {
        taskList.parentNode.appendChild(emptyMessage);
    } else if (hasTasks && existingMessage) {
        existingMessage.remove();
    }
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
    const tasks = getTasksFromStorage();
    const updatedTasks = tasks.filter(task => task.id !== id);
    saveTasksToStorage(updatedTasks);
    li.remove();
    updateEmptyMessage();
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

    const trimmedNew = newText?.trim();
    if (trimmedNew) {
        const tasks = getTasksFromStorage();
        const task = tasks.find(task => task.id === id);
        if (task) {
            task.description = trimmedNew;
            saveTasksToStorage(tasks);
            span.textContent = trimmedNew;
        }
    }
}
