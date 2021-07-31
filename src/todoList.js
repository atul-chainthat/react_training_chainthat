import React, { memo } from "react";

const TodoList = ({ todoList, toggleTodo, deleteTodo, status }) => {
  console.log("TodoList");
  return (
    <div className="todo-list-container">
      {todoList.map((todo, index) => {
        return (
          <div key={todo.id} className="todo-list-wrapper">
            <input
              type="checkbox"
              name="isDone"
              id="isDone"
              checked={todo.isDone}
              disabled={status === "update_data"}
              onChange={() => toggleTodo(todo)}
            />
            <span
              style={{
                textDecoration: todo.isDone ? "line-through" : "none",
              }}
            >
              {todo.text}
            </span>
            <button
              type="button"
              disabled={status === "delete_data"}
              onClick={() => deleteTodo(todo)}
            >
              Delete Todo
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default memo(TodoList);
