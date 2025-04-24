export const AuthPage = ({ isSignIn }: { isSignIn: boolean }) => {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded-lg w-80">
        <h2 className="text-xl font-bold text-center mb-6">
          {isSignIn ? "Sign In" : "Sign Up"}
        </h2>
        <form className="space-y-4">
         <div className="flex flex-col h-full">
         <input
            type="text"
            placeholder="Enter your Email"
            name="email"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Enter your Password"
            name="password"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-all duration-200"
          >
            {isSignIn ? "Sign In" : "Sign Up"}
          </button>
         </div>
        </form>
      </div>
    </div>
  );
};
