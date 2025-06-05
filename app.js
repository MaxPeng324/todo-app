/*
 * @Author: Mx.Peng
 * @Date: 2025-05-19 14:43:53
 * @LastEditors: Mx.Peng
 * @LastEditTime: 2025-06-05 10:20:27
 * @Description: 
 */
 /**
  * @file app.js
  * @description Implements the core functionality of a simple to-do list application.
  * Handles adding, deleting, and marking tasks as completed via DOM manipulation.
  */

document.addEventListener("DOMContentLoaded", () => {
  const todoInput = document.getElementById("todo-input");
  const addTodoButton = document.getElementById("add-todo");
  const todoList = document.getElementById("todo-list");

  function addTodo() {
    const todoText = todoInput.value.tr();
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
