/*
 * @Author: Mx.Peng
 * @Date: 2025-08-26 13:58:10
 * @LastEditors: Mx.Peng
 * @LastEditTime: 2025-08-26 13:59:53
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

  /**
   * 添加新的待办事项到列表中
   * @function addTodo
   * @description 从输入框获取待办事项文本，创建新的列表项元素，
   * 添加删除按钮和完成状态切换功能，最后将项目添加到DOM并保存到localStorage
   * @returns {void}
   * @example
   * // 当用户点击添加按钮或按Enter键时调用
   * addTodo();
   */
  function addTodo() {
    const todoText = todoInput.value.trim();
    if (todoText === "") {
      alert("请输入待办事项");
      return;
    }

    const li = document.createElement("li");
    li.textContent = todoText;
    li.dataset.taskText = todoText; // Store the original task text

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
   * 将当前待办事项列表保存到浏览器本地存储
   * @function saveTodos
   * @description 遍历DOM中的所有待办事项，提取文本内容和完成状态，
   * 将数据序列化为JSON格式并存储到localStorage中，用于页面刷新后的数据持久化
   * @returns {void}
   * @example
   * // 在添加、删除或更改任务状态后自动调用
   * saveTodos();
   */
  function saveTodos() {
    const taskItems = todoList.querySelectorAll("li");
    const todos = [];
    taskItems.forEach(item => {
      const taskText = item.dataset.taskText || item.firstChild.textContent.trim(); // Use stored task text or fallback
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
   * 从浏览器本地存储加载并显示待办事项列表
   * @function loadTodos
   * @description 从localStorage读取保存的待办事项数据，清空当前DOM列表，
   * 重新创建每个待办事项的DOM元素，包括文本内容、完成状态、删除按钮和事件监听器
   * @returns {void}
   * @example
   * // 页面加载完成后自动调用以恢复之前的待办事项
   * loadTodos();
   */
  function loadTodos() {
    const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
    todoList.innerHTML = ''; // Clear existing tasks

    savedTodos.forEach(taskObject => {
      const li = document.createElement("li");
      li.textContent = taskObject.text; // Use taskObject.text
      li.dataset.taskText = taskObject.text; // Store the original task text

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
