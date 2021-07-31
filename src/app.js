import React, { PureComponent, createRef } from "react";
import TodoList from "./todoList";
import TodoForm from "./todoForm";
import TodoFilter from "./todoFilter";
import axiosInstance from "./utils/axiosInstance";
import "./todo.css";

class App extends PureComponent {
  state = {
    todoList: [],
    filter: "all",
    status: "idle",
  };

  inputRef = createRef();

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    try {
      this.setState({ status: "load_data" });
      const res = await axiosInstance.get("todoList");
      this.setState({ status: "load_data_request" });
      this.setState({ todoList: res.data, loading: false, status: "idle" });
    } catch (error) {
      console.log(error.message);
      this.setState({ status: "load_data_error" });
    }
  };

  addTodo = async (event) => {
    try {
      event.preventDefault();

      this.setState({ status: "add_data" });
      const res = await axiosInstance.post("todoList", {
        text: this.inputRef.current.value,
        isDone: false,
      });

      this.setState(
        ({ todoList, todoText }) => {
          return {
            todoList: [...todoList, res.data],
            filter: "all",
            status: "idle",
          };
        },
        () => {
          this.inputRef.current.value = "";
        }
      );
    } catch (error) {
      this.setState({ status: "add_data_error" });
    }
  };

  toggleTodo = async (todo) => {
    try {
      this.setState({ status: "update_data" });
      const res = await axiosInstance.put(
        `todoList/${todo.id}`,
        { ...todo, isDone: !todo.isDone }
      );

      this.setState(({ todoList }) => {
        const index = todoList.findIndex((item) => item.id === todo.id);
        return {
          todoList: [
            ...todoList.slice(0, index),
            res.data,
            ...todoList.slice(index + 1),
          ],
          status: "idle",
        };
      });
    } catch (error) {
      this.setState({ status: "update_data_error" });
    }
  };

  deleteTodo = async (todo) => {
    try {
      this.setState({ status: "delete_data" });
      await axiosInstance.delete(`todoList/${todo.id}`);

      this.setState(({ todoList }) => {
        const index = todoList.findIndex((item) => item.id === todo.id);
        return {
          todoList: [...todoList.slice(0, index), ...todoList.slice(index + 1)],
          status: "idle",
        };
      });
    } catch (error) {
      this.setState({ status: "delete_data_error" });
    }
  };

  render() {
    const { filter, todoList, status } = this.state;
    const filteredTodo = todoList.filter((todo) => {
      switch (filter) {
        case "pending":
          return !todo.isDone;
        case "completed":
          return todo.isDone;
        default:
          return true;
      }
    });

    if (status === "load_data") {
      return <h1>Loading...</h1>;
    }

    if (status.includes("error")) {
      return (
        <div>
          <h1>Try After Sometime!</h1>
          <button type="button" onClick={this.fetchData}>
            Retry
          </button>
        </div>
      );
    }

    return (
      <div className="container">
        <h1>Todo App</h1>
        <TodoForm addTodo={this.addTodo} inputRef={this.inputRef} />
        <TodoList
          status={status}
          todoList={filteredTodo}
          toggleTodo={this.toggleTodo}
          deleteTodo={this.deleteTodo}
        />
        <TodoFilter
          filter={filter}
          applyFilter={(filterType) => this.setState({ filter: filterType })}
        />
      </div>
    );
  }
}

export default App;
