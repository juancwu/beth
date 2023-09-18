import * as elements from 'typed-html';
import type { TodoSelect } from '../db/schema';

const TodoItem = ({ id, title, completed }: TodoSelect) => {
    return (
        <li class="flex items-center gap-4">
            <span class="text-zinc-100 px-2 text-2xl">{title}</span>
            <input
                type="checkbox"
                checked={completed}
                hx-patch={`/todos/toggle/${id}`}
                hx-target="closest li"
                hx-swap="outerHTML"
            />
            <button
                class="p-2 text-red-400"
                hx-delete={`/todos/${id}`}
                hx-target="closest li"
                hx-swap="outerHTML"
            >
                X
            </button>
        </li>
    );
};

export default TodoItem;
