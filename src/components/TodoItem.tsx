import Html from '@kitajs/html';
import type { TodoSelect } from '../db/schema';

const TodoItem = ({ id, title, completed }: TodoSelect) => {
    return (
        <li class="flex items-center justify-between gap-4 w-full border-solid border-b-2 border-b-white/10 py-2 px-2">
            <div class="flex gap-2 items-center">
                <label
                    for={`todoCheckBox-${id}`}
                    class="sr-only"
                >{`Toggle todo with title: ${title}`}</label>
                <input
                    id={`todoCheckBox-${id}`}
                    type="checkbox"
                    checked={completed}
                    hx-patch={`/todos/toggle/${id}`}
                    hx-target="closest li"
                    hx-swap="outerHTML"
                    class="w-5 h-5"
                    aria-label={`Toggle todo with title, ${title}`}
                />
                <span class="text-zinc-100 px-2">{title}</span>
            </div>
            <button
                class="px-2 py-0.5 rounded bg-red-950 border-solid border-2 border-red-500 text-red-300"
                hx-delete={`/todos/${id}`}
                hx-target="closest li"
                hx-swap="outerHTML"
                aria-label={`Delete todo with title, ${title}`}
            >
                Delete
            </button>
        </li>
    );
};

export default TodoItem;
