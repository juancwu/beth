import Html from '@kitajs/html';
import Base from './Base';
import Nav from './Nav';

const App = () => (
    <Base>
        <Nav />
        <div class="px-6">
            <div class="py-8">
                <form
                    class="text-zinc-100 w-full flex justify-center gap-4"
                    hx-post="/todos"
                    hx-target="#todosContainer"
                    hx-swap="beforeend"
                >
                    <div>
                        <label html-for="todoTitle">Todo Title</label>
                        <input
                            type="text"
                            id="todoTitle"
                            class="block px-4 py-2 text-white rounded"
                            name="title"
                        />
                    </div>
                    <div class="flex items-end">
                        <button
                            type="submit"
                            class="px-8 py-1.5 bg-emerald-950 border-solid border-emerald-500 text-emerald-300 border-2 rounded"
                        >
                            Add
                        </button>
                    </div>
                </form>
                <div class="h-4"></div>
                <div
                    class="lg:px-32 md:px-20"
                    hx-get="/todos"
                    hx-trigger="load"
                    hx-swap="innerHTML"
                ></div>
            </div>
        </div>
    </Base>
);

export default App;
