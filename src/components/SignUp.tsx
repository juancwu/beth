import Html from '@kitajs/html';

export type SignUpProps = {
    error?: string;
};

export const SignUp = ({ error = '' }: SignUpProps) => (
    <div class="h-full w-full flex items-center justify-center">
        <div>
            <h2 class="text-4xl text-center text-zinc-100">Sign Up</h2>
            <div id="error" class="text-red-500 text-center">
                {error}
            </div>
            <div class="py-4"></div>
            <form
                id="form"
                class="text-zinc-100 flex items-center justify-center gap-4 flex-col"
                hx-post="/auth/sign-up"
            >
                <div>
                    <label html-for="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        class="block px-4 py-2 text-white rounded"
                        name="email"
                        placeholder="Enter your email"
                        required="true"
                    />
                </div>
                <div>
                    <label html-for="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        class="block px-4 py-2 text-white rounded"
                        name="password"
                        placeholder="Enter your password"
                        required="true"
                        min="8"
                    />
                </div>
                <div class="h-2"></div>
                <button
                    type="submit"
                    class="px-6 py-2 rounded bg-blue-950 border-solid border-blue-500 border-2 text-blue-300"
                >
                    Sign Up
                </button>
            </form>
            <div class="py-4"></div>
            <div class="flex items-center justify-center">
                <a class="text-blue-400 underline" href="/auth/sign-in">
                    Sign In
                </a>
            </div>
        </div>
    </div>
);
