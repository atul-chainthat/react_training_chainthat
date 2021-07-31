import React, { PureComponent, createRef } from "react";
import "./todo.css";

class App extends PureComponent {
  state = {
    todoList: [],
  };

  inputRef = createRef();

  addTodo = (event) => {
    event.preventDefault();

    this.setState(
      ({ todoList, todoText }) => {
        return {
          todoList: [
            ...todoList,
            {
              id: new Date().valueOf(),
              text: this.inputRef.current.value,
              isDone: false,
            },
          ],
        };
      },
      () => {
        this.inputRef.current.value = "";
      }
    );
  };

  toggleTodo = (todo) => {
    this.setState(({ todoList }) => {
      const index = todoList.findIndex((item) => item.id === todo.id);
      return {
        todoList: [
          ...todoList.slice(0, index),
          { ...todo, isDone: !todo.isDone },
          ...todoList.slice(index + 1),
        ],
      };
    });
  };

  render() {
    console.log("render");
    const { todoText, todoList } = this.state;
    return (
      <>
        <h1>Todo App</h1>

        <form onSubmit={this.addTodo}>
          <input type="text" ref={this.inputRef} />
          <button type="submit">Add Todo</button>
        </form>
        <div>
          {todoList.map((todo, index) => {
            return (
              <div key={todo.id} className="todo-list-wrapper">
                <input
                  type="checkbox"
                  name="isDone"
                  id="isDone"
                  checked={todo.isDone}
                  onChange={() => this.toggleTodo(todo)}
                />
                <span
                  style={{
                    textDecoration: todo.isDone ? "line-through" : "none",
                  }}
                >
                  {todo.text}
                </span>
                <button type="button">Delete Todo</button>
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

export default App;
