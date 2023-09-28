import Html from '@kitajs/html';

const Nav = () => {
    return (
        <div class="px-6 border-b-solid border-b-2 border-b-white/10">
            <div class="py-4 flex justify-between">
                <div class="flex items-center">
                    <h1 class="text-zinc-400 text-center">BETH TODO APP</h1>
                </div>
                <button
                    hx-post="/auth/sign-out"
                    class="px-6 py-1 rounded bg-white/5 border-solid border-white/10 text-zinc-400 border-2"
                >
                    Sign Out
                </button>
            </div>
        </div>
    );
};

export default Nav;
