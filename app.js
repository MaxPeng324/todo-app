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
   * 格式化时间显示
   * @function formatTime
   * @param {string} isoString - ISO格式的时间字符串
   * @returns {string} 格式化后的时间字符串
   */
  function formatTime(isoString) {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  /**
   * 从输入框获取文本并添加新的待办事项。
   * 包含空值检查、DOM创建调用、本地存储同步和UI更新。
   * @function addTodo
   * @returns {void}
   */
  function addTodo() {
    const todoText = todoInput.value.trim();
    if (todoText === "") {
      alert("请输入待办事项");
      return;
    }

    const createdAt = new Date().toISOString();
    createTodoElement(todoText, false, createdAt);
    todoInput.value = "";
    saveTodos();
    updateTaskCounter();
    applyFilter();
  }

  /**
   * 动态创建待办事项的DOM结构。
   * 包含文本内容、编辑输入框、编辑/删除按钮以及相关事件绑定。
   * @function createTodoElement
   * @param {string} text - 待办事项的具体显示文本
   * @param {boolean} [completed=false] - 初始状态是否为已完成
   * @param {string} [createdAt] - 任务创建时间（ISO格式）
   * @returns {void}
   */
  function createTodoElement(text, completed = false, createdAt = null) {
    const li = document.createElement("li");
    li.dataset.taskText = text;
    if (createdAt) {
      li.dataset.createdAt = createdAt;
    }
    if (completed) {
      li.classList.add("completed");
    }

    // 创建内容区域
    const contentDiv = document.createElement("div");
    contentDiv.className = "todo-content";
    contentDiv.textContent = text;
    li.appendChild(contentDiv);

    // 创建创建时间显示
    if (createdAt) {
      const timeDiv = document.createElement("div");
      timeDiv.className = "todo-time";
      timeDiv.textContent = formatTime(createdAt);
      li.appendChild(timeDiv);
    }

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
   * 切换指定任务项进入编辑模式。
   * 显示输入框，隐藏静态文本，并自动聚焦到输入框中。
   * @function enterEditMode
   * @param {HTMLElement} li - 目标列表项元素
   * @param {HTMLInputElement} editInput - 该项关联的编辑输入框元素
   * @returns {void}
   */
  function enterEditMode(li, editInput) {
    li.classList.add("editing");
    editInput.focus();
    editInput.select();
  }

  /**
   * 保存编辑后的文本并退出编辑模式。
   * 包含空值校验，校验通过后同步更新DOM文本和数据集。
   * @function saveEdit
   * @param {HTMLElement} li - 目标列表项元素
   * @param {HTMLInputElement} editInput - 编辑输入框元素
   * @param {HTMLElement} contentDiv - 显示任务内容的容器元素
   * @returns {void}
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
   * 放弃编辑并恢复之前的任务文本。
   * 退出编辑模式并还原输入框的值。
   * @function cancelEdit
   * @param {HTMLElement} li - 目标列表项元素
   * @param {HTMLInputElement} editInput - 编辑输入框元素
   * @returns {void}
   */
  function cancelEdit(li, editInput) {
    editInput.value = li.dataset.taskText;
    li.classList.remove("editing");
  }

  /**
   * 重新统计并更新界面上的任务状态计数器。
   * 计算总数、进行中数量和已完成数量，并格式化显示文本。
   * @function updateTaskCounter
   * @returns {void}
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
   * 根据当前选中的过滤器（全部、进行中、已完成）显示或隐藏任务项。
   * 通过操作 CSS 类名 'hidden' 来控制元素的可见性。
   * @function applyFilter
   * @returns {void}
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
   * 将当前列表中的所有待办事项序列化并持久化到本地存储（localStorage）。
   * 存储的数据格式为对象数组：[{text: string, completed: boolean, createdAt: string}]。
   * @function saveTodos
   * @returns {void}
   */
  function saveTodos() {
    const taskItems = todoList.querySelectorAll("li");
    const todos = [];
    taskItems.forEach((item) => {
      const taskText = item.dataset.taskText;
      const isCompleted = item.classList.contains("completed");
      const createdAt = item.dataset.createdAt || null;
      todos.push({ text: taskText, completed: isCompleted, createdAt: createdAt });
    });
    localStorage.setItem("todos", JSON.stringify(todos));
  }

  /**
   * 从本地存储（localStorage）读取并解析已保存的任务数据。
   * 首次加载时重建任务 DOM 树并同步更新计数器与过滤器。
   * @function loadTodos
   * @returns {void}
   */
  function loadTodos() {
    const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
    todoList.innerHTML = "";

    savedTodos.forEach((taskObject) => {
      createTodoElement(taskObject.text, taskObject.completed, taskObject.createdAt);
    });

    updateTaskCounter();
    applyFilter();
  }

  /**
   * 清空所有待办事项列表。
   * 包含操作确认提示，并在清除后同步移除本地存储数据及更新 UI。
   * @function clearAllTodos
   * @returns {void}
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
   * 仅删除状态为已完成的任务项。
   * 包含操作确认提示，删除后同步更新本地存储并重新应用当前过滤器。
   * @function clearCompletedTodos
   * @returns {void}
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
