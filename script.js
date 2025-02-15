// Global Variables
let tasks = [];
let currentUser = null;

document.addEventListener("DOMContentLoaded", () => {
    checkLogin();
});

function checkLogin() {
    currentUser = localStorage.getItem("currentUser");
    if (currentUser && localStorage.getItem(currentUser)) {
        const userData = JSON.parse(localStorage.getItem(currentUser));
        tasks = userData.tasks || [];
        displayTodoList();
        document.getElementById('auth-section').style.display = 'none';
        document.getElementById('todo-section').style.display = 'block';
    } else {
        localStorage.removeItem("currentUser"); // Invalid user cleanup
    }
}

function signup() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !password) {
        alert("Username and password cannot be empty!");
        return;
    }

    if (localStorage.getItem(username)) {
        alert("Username already exists!");
    } else {
        localStorage.setItem(username, JSON.stringify({ password: password, tasks: [] }));
        alert("Signup successful! Please log in.");
    }
}

function login() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    const userData = JSON.parse(localStorage.getItem(username));

    if (userData && userData.password === password) {
        localStorage.setItem("currentUser", username);
        currentUser = username; // Ensure `currentUser` is updated
        tasks = userData.tasks || [];
        displayTodoList();
        document.getElementById('auth-section').style.display = 'none';
        document.getElementById('todo-section').style.display = 'block';
    } else {
        alert("Invalid username or password.");
    }
}

function saveAndExit() {
    saveTasks();
    localStorage.removeItem("currentUser");
    currentUser = null;
    tasks = [];
    document.getElementById('auth-section').style.display = 'block';
    document.getElementById('todo-section').style.display = 'none';
    document.getElementById('todo-list').innerHTML = '';
}

function addTask() {
    const taskText = document.getElementById('new-task').value.trim();
    if (!taskText) return;

    tasks.push({ text: taskText, completed: false });
    saveTasks();
    displayTodoList();
    document.getElementById('new-task').value = '';
}

function displayTodoList() {
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = '';

    tasks.forEach((task, index) => {
        const li = document.createElement('li');

       
        const span = document.createElement('span');
        span.textContent = task.text;
        if (task.completed) span.classList.add('completed');
        span.onclick = () => toggleTask(index);

        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'X';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.onclick = (event) => {
            event.stopPropagation(); // Prevent toggle on click
            deleteTask(index);
        };

        li.appendChild(span);
        li.appendChild(deleteBtn);
        todoList.appendChild(li);
    });
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    displayTodoList();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    displayTodoList();
}

function saveTasks() {
    if (currentUser && localStorage.getItem(currentUser)) {
        const userData = JSON.parse(localStorage.getItem(currentUser)) || {};
        userData.tasks = tasks;
        localStorage.setItem(currentUser, JSON.stringify(userData));
    }
}
