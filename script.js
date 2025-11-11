const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const filters = document.querySelectorAll('.filter');
const clearCompletedBtn = document.getElementById('clearCompleted');
const themeToggle = document.getElementById('themeToggle');

let currentFilter = 'all';

// ===== Load tasks and theme =====
window.onload = () => {
  const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
  storedTasks.forEach(task => addTaskToDOM(task.text, task.completed));

  const theme = localStorage.getItem('theme');
  if (theme === 'dark') {
    document.body.classList.add('dark');
    themeToggle.textContent = '☀️';
  }
};

// ===== Add task =====
addBtn.addEventListener('click', () => {
  const taskText = taskInput.value.trim();
  if (taskText === '') return;
  addTaskToDOM(taskText);
  saveTask(taskText);
  taskInput.value = '';
});

// ===== Add task to DOM =====
function addTaskToDOM(text, completed = false) {
  const li = document.createElement('li');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = completed;
  checkbox.classList.add('complete-checkbox');

  const span = document.createElement('span');
  span.textContent = text;

  if (completed) li.classList.add('completed');

  checkbox.addEventListener('change', () => {
    li.classList.toggle('completed', checkbox.checked);
    updateLocalStorage();
    applyFilter(currentFilter);
  });

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.classList.add('delete');
  deleteBtn.addEventListener('click', e => {
    e.stopPropagation();
    li.style.opacity = '0';
    li.style.transform = 'translateX(50px)';
    setTimeout(() => {
      li.remove();
      updateLocalStorage();
    }, 300);
  });

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(deleteBtn);
  taskList.appendChild(li);

  // Animation
  setTimeout(() => li.classList.add('show'), 50);
  applyFilter(currentFilter);
}

// ===== Save & Update =====
function saveTask(text) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push({ text, completed: false });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateLocalStorage() {
  const tasks = [];
  document.querySelectorAll('#taskList li').forEach(li => {
    const text = li.querySelector('span').textContent;
    const completed = li.querySelector('.complete-checkbox').checked;
    tasks.push({ text, completed });
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// ===== Filters =====
filters.forEach(btn => {
  btn.addEventListener('click', () => {
    filters.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    applyFilter(currentFilter);
  });
});

function applyFilter(filter) {
  const allTasks = document.querySelectorAll('#taskList li');
  allTasks.forEach(task => {
    switch (filter) {
      case 'all':
        task.style.display = 'flex';
        break;
      case 'active':
        task.style.display = task.classList.contains('completed') ? 'none' : 'flex';
        break;
      case 'completed':
        task.style.display = task.classList.contains('completed') ? 'flex' : 'none';
        break;
    }
  });
}

// ===== Clear Completed =====
clearCompletedBtn.addEventListener('click', () => {
  document.querySelectorAll('#taskList li.completed').forEach(li => {
    li.style.opacity = '0';
    li.style.transform = 'translateX(50px)';
    setTimeout(() => li.remove(), 300);
  });
  setTimeout(updateLocalStorage, 350);
});

// ===== Theme Toggle =====
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  themeToggle.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});
