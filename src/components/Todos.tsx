import * as elements from "typed-html";
import type { Todo } from "../db/schemas";
import TodoItem from "./TodoItem";

type TodosProps = {
  data: Todo[];
};

const Todos = ({ data }: TodosProps) => {
  return (
    <ul id="todosContainer" class="flex items-center justify-center flex-col">
      {data.map((todo) => (
        <TodoItem {...todo} />
      ))}
    </ul>
  );
};

export default Todos;
