const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const search = document.getElementById('search');
const progressText = document.getElementById('progress-text');
const progressFill = document.getElementById('progress-fill');
const emptyState = document.getElementById('empty-state');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const undoToast = document.getElementById('undo-toast');
const undoBtn = document.getElementById('undo-btn');

let todos = JSON.parse(localStorage.getItem('todos')) || [];
let recentlyDeleted = null;

document.addEventListener('DOMContentLoaded', () => {
  renderTodos();
  checkTheme();
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (text !== '') {
    todos.push({ text, completed: false });
    input.value = '';
    saveAndRender();
  }
});

list.addEventListener('click', (e) => {
  const li = e.target.closest('li');
  const index = li?.dataset.index;

  if (e.target.tagName === 'SPAN' || e.target.tagName === 'LI') {
    todos[index].completed = !todos[index].completed;
    saveAndRender();
  }

  if (e.target.tagName === 'BUTTON') {
    recentlyDeleted = todos.splice(index, 1)[0];
    showUndo();
    saveAndRender();
  }
});

search.addEventListener('input', renderTodos);

themeToggle.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  updateThemeIcon(isDark);
});

undoBtn.addEventListener('click', () => {
  if (recentlyDeleted) {
    todos.push(recentlyDeleted);
    recentlyDeleted = null;
    hideUndo();
    saveAndRender();
  }
});

function renderTodos() {
  const searchTerm = search.value.trim().toLowerCase();
  const filteredTodos = todos.filter(todo => todo.text.toLowerCase().includes(searchTerm));
  list.innerHTML = '';

  filteredTodos.forEach((todo, index) => {
    const li = document.createElement('li');
    li.dataset.index = index;

    li.classList.toggle('completed', todo.completed);
    li.innerHTML = `
      <span>${todo.text}</span>
      <button class="delete-btn">Delete</button>
    `;
    list.appendChild(li);
  });

  const completedCount = todos.filter(todo => todo.completed).length;
  progressText.textContent = `${completedCount} of ${todos.length} completed`;
  progressFill.style.width = todos.length === 0 ? '0%' : `${(completedCount / todos.length) * 100}%`;

  // 🎉 You're all caught up!
  if (todos.length > 0 && completedCount === todos.length) {
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';
  }
}

function saveAndRender() {
  localStorage.setItem('todos', JSON.stringify(todos));
  renderTodos();
}

function showUndo() {
  undoToast.style.display = 'flex';
  setTimeout(() => {
    hideUndo();
  }, 3000);
}

function hideUndo() {
  undoToast.style.display = 'none';
}

function updateThemeIcon(isDark) {
  themeIcon.src = isDark ? 'bx-sun.svg' : 'bx-moon.svg';
}

function checkTheme() {
  const theme = localStorage.getItem('theme');
  if (theme === 'dark') {
    document.body.classList.add('dark');
    themeIcon.src = 'bx-sun.svg';
  } else {
    document.body.classList.remove('dark');
    themeIcon.src = 'bx-moon.svg';
  }
}
