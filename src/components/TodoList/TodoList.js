import NewTodoForm from "../NewTodoForm/NewTodoForm";
import TodoListItem from "../TodoListItem/TodoListItem";
import "./TodoList.css";

const TodoList = ({ todos = [{ text: "hello" }] }) => (
  <div className="list-wrapper">
    <NewTodoForm />
    {todos.map((todo) => (
      <div>
        <TodoListItem todo={todo} />
      </div>
    ))}
  </div>
);
export default TodoList;
