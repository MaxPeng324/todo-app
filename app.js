/**
  * @file app.js
  * @description Implements the core functionality of a simple to-do list application.
  * Handles adding, deleting, and marking tasks as completed via DOM manipulation.
  */

document.addEventListener("DOMContentLoaded", () => {
  const todoInput = document.getElementById("todo-input");
  const addTodoButton = document.getElementById("add-todo");
  const todoList = document.getElementById("todo-list");

  /**
   * Adds a new to-do item to the list and updates persistent storage.
   *
   * If the input field is empty, displays an alert and does not add a task. The new task is appended to the list with a delete button and supports toggling its completion status. Updates are saved to {@link localStorage}.
   */
  function addTodo() {
    const todoText = todoInput.value.trim();
    if (todoText === "") {
      alert("请输入待办事项");
      return;
    }

    const li = document.createElement("li");
    li.textContent = todoText;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "删除";
    deleteButton.addEventListener("click", () => {
      li.remove();
      saveTodos(); // Call saveTodos after removing a task
    });

    li.appendChild(deleteButton);

    li.addEventListener("click", (event) => {
      // Prevent toggling completed state when delete button is clicked
      if (event.target !== deleteButton) {
        li.classList.toggle("completed");
        saveTodos(); // Call saveTodos after toggling completion
      }
    });

    todoList.appendChild(li);
    todoInput.value = "";
    saveTodos(); // Call saveTodos after adding a new task
  }

  /**
   * Saves the current list of tasks and their completion status to localStorage.
   *
   * Each task is stored as an object with `text` and `completed` properties in a JSON array under the key "todos".
   */
  function saveTodos() {
    const taskItems = todoList.querySelectorAll("li");
    const todos = [];
    taskItems.forEach(item => {
      const taskText = item.firstChild.textContent.trim(); // Ensures only task text is captured
      const isCompleted = item.classList.contains("completed");
      todos.push({ text: taskText, completed: isCompleted });
    });
    localStorage.setItem("todos", JSON.stringify(todos));
  }

  addTodoButton.addEventListener("click", addTodo);

  todoInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addTodo();
    }
  });

  /**
   * Loads saved to-do tasks from localStorage and populates the to-do list in the DOM.
   *
   * Reconstructs each task with its completion status and attaches event handlers for deleting and toggling completion.
   */
  function loadTodos() {
    const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
    todoList.innerHTML = ''; // Clear existing tasks

    savedTodos.forEach(taskObject => {
      const li = document.createElement("li");
      li.textContent = taskObject.text; // Use taskObject.text

      if (taskObject.completed) {
        li.classList.add("completed"); // Apply completed class if true
      }

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "删除";
      deleteButton.addEventListener("click", () => {
        li.remove();
        saveTodos();
      });

      li.appendChild(deleteButton);

      li.addEventListener("click", (event) => {
        if (event.target !== deleteButton) {
          li.classList.toggle("completed");
          saveTodos();
        }
      });

      todoList.appendChild(li);
    });
  }

  // Call loadTodos when the DOM is fully loaded
  loadTodos();
});
