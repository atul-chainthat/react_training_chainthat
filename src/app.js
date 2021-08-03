import React, {
  PureComponent,
  createRef,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import TodoList from "./todoList";
import TodoForm from "./todoForm";
import TodoFilter from "./todoFilter";
import { v4 as uuidv4 } from "uuid";
import axiosInstance from "./utils/axiosInstance";
import "./todo.css";
import Error from "./error";
import useStatus from "./hooks/useStatus";
import useTodo from "./hooks/useTodo";

const App = () => {
  const [filter, setFilter] = useState("all");
  const {
    loadData,
    addTodo,
    todoList,
    inputRef,
    toggleTodo,
    deleteTodo,
    status,
  } = useTodo();

  useEffect(() => {
    loadData();

    return () => {};
  }, [loadData]);

  if (status.some((x) => x.match === "load_data" && x.type === "request")) {
    return <h1>Loading....</h1>;
  }

  if (status.some((x) => x.match === "load_data" && x.type === "fail")) {
    return (
      <div>
        <h1>Try After Sometime!</h1>
        <button type="button" onClick={loadData}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Todo App</h1>
      <TodoForm addTodo={addTodo} inputRef={inputRef} status={status} />
      <TodoList
        status={status}
        todoList={todoList}
        toggleTodo={toggleTodo}
        deleteTodo={deleteTodo}
      />

      <TodoFilter
        filter={filter}
        applyFilter={(filterType) => setFilter(filterType)}
      />
    </div>
  );
};

// class App extends PureComponent {
//   state = {
//     todoList: [],
//     filter: "all",
//     status: [],
//   };

//   inputRef = createRef();

//   listRef = [];

//   componentDidMount() {
//     this.fetchData();
//   }

//   fetchData = async () => {
//     const uniqueId = uuidv4();
//     try {
//       this.setState(({ status }) => ({
//         status: [...status, { id: uniqueId, name: "load_data_request" }],
//       }));
//       const res = await axiosInstance.get("todoList");
//       this.setState(({ status }) => {
//         const updatedStatusList = status.filter((x) => x.id !== uniqueId);
//         return {
//           todoList: res.data,
//           loading: false,
//           status: updatedStatusList,
//         };
//       });
//     } catch (error) {
//       console.log(error.message);
//       this.setState(({ status }) => {
//         const updatedStatusList = status.map((x) => {
//           if (x.id === uniqueId) {
//             return { ...x, name: "load_data_error" };
//           }
//           return x;
//         });

//         return { status: updatedStatusList };
//       });
//     }
//   };

//   addTodo = async (event) => {
//     const uniqueId = uuidv4();
//     try {
//       event.preventDefault();

//       this.setState(({ status }) => ({
//         status: [...status, { id: uniqueId, name: "add_data" }],
//       }));

//       const res = await axiosInstance.post("todoList", {
//         text: this.inputRef.current.value,
//         isDone: false,
//       });

//       this.setState(
//         ({ todoList, status }) => {
//           const updatedStatusList = status.filter((x) => x.id !== uniqueId);
//           return {
//             todoList: [...todoList, res.data],
//             filter: "all",
//             status: updatedStatusList,
//           };
//         },
//         () => {
//           this.inputRef.current.value = "";
//         }
//       );
//     } catch (error) {
//       this.setState(({ status }) => {
//         const updatedStatusList = status.map((x) => {
//           if (x.id === uniqueId) {
//             return { ...x, name: "add_data_error" };
//           }
//           return x;
//         });

//         return { status: updatedStatusList };
//       });
//     }
//   };

//   toggleTodo = async (todo) => {
//     const uniqueId = uuidv4();
//     try {

//       // this.listRef.find(x => x.id === todo.id).ref.disabled = true;
//       // // if(this.listRef.current[todo.id]) {
//       // //   this.listRef.current[todo.id].disabled = true
//       // // }
//       // // document.getElementById(`is_done_${todo.id}`).disabled = true
//       this.setState(({ status }) => {
//         let updatedStatus = status;

//         const index = status.findIndex((x) => x.statusId === todo.id);

//         if (index === -1) {
//           updatedStatus = [
//             ...status,
//             { id: uniqueId, name: "update_data", statusId: todo.id },
//           ];
//         } else {
//           updatedStatus = [
//             ...status.slice(0, index),
//             { ...status[index], name: "update_data" },
//             ...status.slice(index + 1),
//           ];
//         }
//         return {
//           status: updatedStatus,
//         };
//       });

//       const res = await axiosInstance.put(`todoList/${todo.id}`, {
//         ...todo,
//         isDone: !todo.isDone,
//       });

//       this.setState(({ todoList, status }) => {
//         const index = todoList.findIndex((item) => item.id === todo.id);
//         const updatedStatusList = status.filter((x) => x.id !== uniqueId);
//         return {
//           todoList: [
//             ...todoList.slice(0, index),
//             res.data,
//             ...todoList.slice(index + 1),
//           ],
//           status: updatedStatusList,
//         };
//       });
//     } catch (error) {
//       this.setState(({ status }) => {
//         const updatedStatusList = status.map((x) => {
//           if (x.id === uniqueId) {
//             return { ...x, name: "update_data_error" };
//           }
//           return x;
//         });

//         return { status: updatedStatusList };
//       });
//     }
//     //  finally {
//     //   this.listRef.find(x => x.id === todo.id).ref.disabled = false;
//     // }
//   };

//   deleteTodo = async (todo) => {
//     const uniqueId = uuidv4();
//     try {
//       this.setState(({ status }) => ({
//         status: [
//           ...status,
//           { id: uniqueId, name: "delete_data", statusId: todo.id },
//         ],
//       }));
//       await axiosInstance.delete(`todoList/${todo.id}`);

//       this.setState(({ todoList, status }) => {
//         const index = todoList.findIndex((item) => item.id === todo.id);
//         const updatedStatusList = status.filter((x) => x.id !== uniqueId);
//         return {
//           todoList: [...todoList.slice(0, index), ...todoList.slice(index + 1)],
//           status: updatedStatusList,
//         };
//       });
//     } catch (error) {
//       this.setState(({ status }) => {
//         const updatedStatusList = status.map((x) => {
//           if (x.id === uniqueId) {
//             return { ...x, name: "delete_data_error" };
//           }
//           return x;
//         });

//         return { status: updatedStatusList };
//       });
//     }
//   };

//   render() {
//     const { filter, todoList, status } = this.state;
//     const filteredTodo = todoList.filter((todo) => {
//       switch (filter) {
//         case "pending":
//           return !todo.isDone;
//         case "completed":
//           return todo.isDone;
//         default:
//           return true;
//       }
//     });

//     if (status.some((x) => x.name === "load_data")) {
//       return <h1>Loading...</h1>;
//     }

//     if (status.some((x) => x.name.includes("load_data_error"))) {
//       return (
//         <div>
//           <h1>Try After Sometime!</h1>
//           <button type="button" onClick={this.fetchData}>
//             Retry
//           </button>
//         </div>
//       );
//     }

//     return (
//       <div className="container">
//         <h1>Todo App</h1>
//         <TodoForm addTodo={this.addTodo} inputRef={this.inputRef} />
//         <TodoList
//           status={status}
//           todoList={filteredTodo}
//           toggleTodo={this.toggleTodo}
//           deleteTodo={this.deleteTodo}
//           ref={this.listRef}
//         />
//         <TodoFilter
//           filter={filter}
//           applyFilter={(filterType) => this.setState({ filter: filterType })}
//         />
//       </div>
//     );
//   }
// }

export default App;
