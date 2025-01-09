document.addEventListener("DOMContentLoaded", () => {
  const todoInput = document.getElementById("todo-input");
  const addTodoButton = document.getElementById("add-todo");
  const todoList = document.getElementById("todo-list");

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
    });

    li.appendChild(deleteButton);

    li.addEventListener("click", () => {
      li.classList.toggle("completed");
    });

    todoList.appendChild(li);
    todoInput.value = "";
  }

  addTodoButton.addEventListener("click", addTodo);

  todoInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addTodo();
    }
  });
});
