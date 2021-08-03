import React, { useCallback, useRef, useState } from "react";
import useStatus from "./useStatus";
import axiosInstance from "../utils/axiosInstance";

const useTodo = () => {
  const { status, updateStatus } = useStatus();
  const [todoList, setTodoList] = useState([]);
  const inputRef = useRef();

  const loadData = useCallback(async () => {
    try {
      updateStatus("load_data_request");

      const res = await axiosInstance.get("todoList");

      setTodoList(res.data);
      updateStatus("load_data_success");
    } catch (error) {
      updateStatus("load_data_fail");
    }
  }, []);

  const addTodo = useCallback(async (event) => {
    event.preventDefault();
    try {
      updateStatus("add_todo_request");

      const res = await axiosInstance.post("todoList", {
        text: inputRef.current.value,
        isDone: false,
      });

      setTodoList([...todoList, res.data]);
      updateStatus("add_todo_success");
      inputRef.current.value = "";
    } catch (error) {
      updateStatus("add_todo_fail");
    }
  }, []);

  const toggleTodo = useCallback(async (todo) => {
    try {
      updateStatus("update_todo_request", todo.id);

      const res = await axiosInstance.put(`todoList/${todo.id}`, {
        ...todo,
        isDone: !todo.isDone,
      });

      setTodoList(tl => tl.map((x) => (x.id === todo.id ? res.data : x)));
      updateStatus("update_todo_success", todo.id);
    } catch (error) {
      updateStatus("update_todo_fail", todo.id);
    }
  }, []);

  const deleteTodo = useCallback(async (todo) => {
    try {
      updateStatus("delete_todo_request", todo.id);

      const res = await axiosInstance.delete(`todoList/${todo.id}`);

      setTodoList(tl => tl.filter((x) => x.id !== todo.id));
      updateStatus("delete_todo_success", todo.id);
    } catch (error) {
      updateStatus("delete_todo_fail", todo.id);
    }
  }, []);

  return {
    loadData,
    todoList,
    addTodo,
    toggleTodo,
    deleteTodo,
    inputRef,
    status
  };
};

export default useTodo;
