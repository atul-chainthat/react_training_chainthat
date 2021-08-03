import React, { memo, forwardRef } from "react";

const TodoForm = ({ addTodo, inputRef, status }) => {
  console.log("TodoForm");
  return (
    <form onSubmit={addTodo}>
      <input type="text" ref={inputRef} />
      <button
        type="submit"
        disabled={status.some(
          (x) => x.match === "add_todo" && x.type === "request"
        )}
      >
        Add Todo
      </button>
    </form>
  );
};

export default memo(TodoForm);
