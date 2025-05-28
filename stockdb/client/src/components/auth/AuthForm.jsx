export default function AuthForm({ formType, onSubmit, formData, onChange }) {
  const isLogin = formType === 'login';
  const title = isLogin ? 'Welcome back' : 'Create an account';
  const subtitle = isLogin ? 'Log in to continue' : 'Get started with us today';

  return (
    <div className="max-w-md w-full mx-auto bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
      <div className="bg-radial from-stone-950 to-gray-800 p-6 text-white">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-blue-100 opacity-90">{subtitle}</p>
      </div>
      
      <form onSubmit={onSubmit} className="p-6 space-y-6">
        {!isLogin && (
          <div className="relative">
            <input
              type="text"
              id="username"
              name="username"
              placeholder=" "
              value={formData.username}
              onChange={onChange}
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              required
            />
            <label
              htmlFor="username"
              className="absolute text-sm text-gray-500 duration-200 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
            >
              Username
            </label>
          </div>
        )}
        
        <div className="relative">
          <input
            type="email"
            id="email"
            name="email"
            placeholder=" "
            value={formData.email}
            onChange={onChange}
            className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            required
          />
          <label
            htmlFor="email"
            className="absolute text-sm text-gray-500 duration-200 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
          >
            Email
          </label>
        </div>
        
        <div className="relative">
          <input
            type="password"
            id="password"
            name="password"
            placeholder=" "
            value={formData.password}
            onChange={onChange}
            className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            required
          />
          <label
            htmlFor="password"
            className="absolute text-sm text-gray-500 duration-200 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
          >
            Password
          </label>
        </div>
        
        <button
          type="submit"
          className="w-full bg-radial from-stone-950 to-gray-800 text-white py-2 px-4 rounded-md hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 active:scale-[0.98] shadow-md hover:shadow-lg"
        >
          {isLogin ? 'Login' : 'Register'}
        </button>
        
        <div className="text-center text-sm text-gray-600 pt-2">
          {isLogin ? (
            <>
              Don't have an account?{' '}
              <a href="/register" className="text-blue-600 hover:underline font-medium">
                Sign up
              </a>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <a href="/login" className="text-blue-600 hover:underline font-medium">
                Log in
              </a>
            </>
          )}
        </div>
      </form>
    </div>
  );
}