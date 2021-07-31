import React, { memo, forwardRef } from "react";

const TodoForm = ({ addTodo,  inputRef}) => {
  console.log("TodoForm");
  return (
    <form onSubmit={addTodo}>
      <input type="text" ref={inputRef} />
      <button type="submit">
        Add Todo
      </button>
    </form>
  );
};

export default memo(TodoForm);
