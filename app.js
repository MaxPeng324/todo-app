/*
 * @Author: Mx.Peng
 * @Date: 2025-08-26 13:58:10
 * @LastEditors: Mx.Peng
 * @LastEditTime: 2026-01-11 09:30:00
 * @Description: Enhanced TodoList with filter, edit, and counter functionality
 */

/**
 * @file app.js
 * @description Enhanced to-do list application with filtering, editing, task counter,
 * and improved user experience with animations.
 */

document.addEventListener("DOMContentLoaded", () => {
  const todoInput = document.getElementById("todo-input");
  const addTodoButton = document.getElementById("add-todo");
  const clearAllButton = document.getElementById("clear-all");
  const clearCompletedButton = document.getElementById("clear-completed");
  const todoList = document.getElementById("todo-list");
  const taskCountEl = document.getElementById("task-count");
  const filterButtons = document.querySelectorAll(".filter-btn");

  let currentFilter = "all";

  /**
   * 添加新的待办事项到列表中
   * @function addTodo
   */
  function addTodo() {
    const todoText = todoInput.value.trim();
    if (todoText === "") {
      alert("请输入待办事项");
      return;
    }

    createTodoElement(todoText, false);
    todoInput.value = "";
    saveTodos();
    updateTaskCounter();
    applyFilter();
  }

  /**
   * 创建待办事项DOM元素
   * @param {string} text - 待办事项文本
   * @param {boolean} completed - 是否完成
   */
  function createTodoElement(text, completed = false) {
    const li = document.createElement("li");
    li.dataset.taskText = text;
    if (completed) {
      li.classList.add("completed");
    }

    // 创建内容区域
    const contentDiv = document.createElement("div");
    contentDiv.className = "todo-content";
    contentDiv.textContent = text;
    li.appendChild(contentDiv);

    // 创建编辑输入框（隐藏状态）
    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.className = "edit-input";
    editInput.value = text;
    li.appendChild(editInput);

    // 创建按钮容器
    const buttonsDiv = document.createElement("div");
    buttonsDiv.className = "todo-buttons";

    // 编辑按钮
    const editButton = document.createElement("button");
    editButton.textContent = "编辑";
    editButton.className = "edit-btn";
    editButton.addEventListener("click", (e) => {
      e.stopPropagation();
      enterEditMode(li, editInput);
    });
    buttonsDiv.appendChild(editButton);

    // 删除按钮
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "删除";
    deleteButton.addEventListener("click", (e) => {
      e.stopPropagation();
      li.remove();
      saveTodos();
      updateTaskCounter();
      applyFilter();
    });
    buttonsDiv.appendChild(deleteButton);

    li.appendChild(buttonsDiv);

    // 创建编辑操作按钮（隐藏状态）
    const editActionsDiv = document.createElement("div");
    editActionsDiv.className = "edit-actions";

    const saveButton = document.createElement("button");
    saveButton.textContent = "保存";
    saveButton.className = "save-btn";
    saveButton.addEventListener("click", (e) => {
      e.stopPropagation();
      saveEdit(li, editInput, contentDiv);
    });
    editActionsDiv.appendChild(saveButton);

    const cancelButton = document.createElement("button");
    cancelButton.textContent = "取消";
    cancelButton.className = "cancel-btn";
    cancelButton.addEventListener("click", (e) => {
      e.stopPropagation();
      cancelEdit(li, editInput);
    });
    editActionsDiv.appendChild(cancelButton);

    li.appendChild(editActionsDiv);

    // 点击切换完成状态（不在编辑模式时）
    contentDiv.addEventListener("click", () => {
      if (!li.classList.contains("editing")) {
        li.classList.toggle("completed");
        saveTodos();
        updateTaskCounter();
        applyFilter();
      }
    });

    todoList.appendChild(li);
  }

  /**
   * 进入编辑模式
   */
  function enterEditMode(li, editInput) {
    li.classList.add("editing");
    editInput.focus();
    editInput.select();
  }

  /**
   * 保存编辑
   */
  function saveEdit(li, editInput, contentDiv) {
    const newText = editInput.value.trim();
    if (newText === "") {
      alert("待办事项不能为空");
      return;
    }

    li.dataset.taskText = newText;
    contentDiv.textContent = newText;
    editInput.value = newText;
    li.classList.remove("editing");
    saveTodos();
  }

  /**
   * 取消编辑
   */
  function cancelEdit(li, editInput) {
    editInput.value = li.dataset.taskText;
    li.classList.remove("editing");
  }

  /**
   * 更新任务计数器
   */
  function updateTaskCounter() {
    const allTasks = todoList.querySelectorAll("li");
    const activeTasks = Array.from(allTasks).filter(
      (task) => !task.classList.contains("completed")
    );
    const completedTasks = allTasks.length - activeTasks.length;

    taskCountEl.textContent = `共 ${allTasks.length} 个任务 (进行中: ${activeTasks.length}, 已完成: ${completedTasks})`;
  }

  /**
   * 应用过滤器
   */
  function applyFilter() {
    const allTasks = todoList.querySelectorAll("li");

    allTasks.forEach((task) => {
      task.classList.remove("hidden");

      if (currentFilter === "active" && task.classList.contains("completed")) {
        task.classList.add("hidden");
      } else if (currentFilter === "completed" && !task.classList.contains("completed")) {
        task.classList.add("hidden");
      }
    });
  }

  /**
   * 保存待办事项到本地存储
   */
  function saveTodos() {
    const taskItems = todoList.querySelectorAll("li");
    const todos = [];
    taskItems.forEach((item) => {
      const taskText = item.dataset.taskText;
      const isCompleted = item.classList.contains("completed");
      todos.push({ text: taskText, completed: isCompleted });
    });
    localStorage.setItem("todos", JSON.stringify(todos));
  }

  /**
   * 从本地存储加载待办事项
   */
  function loadTodos() {
    const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
    todoList.innerHTML = "";

    savedTodos.forEach((taskObject) => {
      createTodoElement(taskObject.text, taskObject.completed);
    });

    updateTaskCounter();
    applyFilter();
  }

  /**
   * 清除所有待办事项
   */
  function clearAllTodos() {
    if (todoList.children.length === 0) {
      alert("当前没有任务需要清除");
      return;
    }

    if (confirm("确定要清除所有待办事项吗？")) {
      todoList.innerHTML = "";
      localStorage.removeItem("todos");
      updateTaskCounter();
    }
  }

  /**
   * 清除已完成的待办事项
   */
  function clearCompletedTodos() {
    const completedTasks = todoList.querySelectorAll("li.completed");

    if (completedTasks.length === 0) {
      alert("当前没有已完成的任务");
      return;
    }

    if (confirm(`确定要清除 ${completedTasks.length} 个已完成的待办事项吗？`)) {
      completedTasks.forEach((task) => task.remove());
      saveTodos();
      updateTaskCounter();
      applyFilter();
    }
  }

  // 事件监听器
  addTodoButton.addEventListener("click", addTodo);

  todoInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addTodo();
    }
  });

  clearAllButton.addEventListener("click", clearAllTodos);
  clearCompletedButton.addEventListener("click", clearCompletedTodos);

  // 过滤按钮事件
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // 移除所有active类
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      // 添加active类到当前按钮
      button.classList.add("active");
      // 设置当前过滤器
      currentFilter = button.dataset.filter;
      // 应用过滤
      applyFilter();
    });
  });

  // 页面加载时初始化
  loadTodos();
});
