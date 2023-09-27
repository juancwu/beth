import Html from '@kitajs/html';
import type { TodoSelect } from '../db/schema';
import TodoItem from './TodoItem';

type TodosProps = {
    data: TodoSelect[];
};

const Todos = ({ data }: TodosProps) => {
    return (
        <ul
            id="todosContainer"
            class="flex items-center justify-center flex-col"
        >
            {data.map((todo) => (
                <TodoItem {...todo} />
            ))}
        </ul>
    );
};

export default Todos;
