import Html from '@kitajs/html';

export type SignUpProps = {
    error?: string;
};

export const SignUp = ({ error = '' }: SignUpProps) => (
    <>
        <div class="py-4"></div>
        <h1 class="text-5xl text-center text-blue-400">BETH TODO APP</h1>
        <div class="py-2"></div>
        <h2 class="text-4xl text-center text-zinc-100">Sign Up</h2>
        <div class="py-4"></div>
        <div id="error" class="text-red-500 text-center">
            {error}
        </div>
        <div class="py-4"></div>
        <form
            id="form"
            class="text-zinc-100 flex items-center justify-center gap-4 flex-col"
            hx-post="/auth/sign-up"
            hx-target="#error"
            hx-swap="innerHTML"
        >
            <label html-for="email">Email</label>
            <input type="email" id="email" class="text-zinc-900" name="email" />
            <label html-for="password">Password</label>
            <input
                type="password"
                id="password"
                class="text-zinc-900"
                name="password"
            />
            <button type="submit" class="px-6 bg-blue-800">
                Sign Up
            </button>
        </form>
        <div class="py-4"></div>
        <div class="flex items-center justify-center">
            <a class="text-blue-400 underline" href="/auth/sign-in">
                Sign In
            </a>
        </div>
    </>
);
