import * as elements from "typed-html";
import Base from "./Base";

const App = () => (
  <Base>
    <div class="py-4"></div>
    <h1 class="text-5xl text-center text-blue-400">BETH TODO APP</h1>
    <div class="py-4"></div>
    <form
      class="text-zinc-100 w-full flex justify-center gap-4"
      hx-post="/todos"
      hx-target="#todosContainer"
      hx-swap="beforeend"
    >
      <label html-for="todoTitle">Todo Title</label>
      <input type="text" id="todoTitle" class="text-zinc-900" name="title" />
      <button type="submit" class="px-6 hover:text-blue-400 transition">
        Add
      </button>
    </form>
    <div
      class="px-8"
      hx-get="/todos"
      hx-trigger="load"
      hx-swap="innerHTML"
    ></div>
  </Base>
);

export default App;
