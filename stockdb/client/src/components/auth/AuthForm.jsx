export default function AuthForm({ 
  formType, 
  onSubmit, 
  formData, 
  onChange, 
  errors = {}, 
  isLoading = false 
}) {
  const isLogin = formType === 'login';
  const title = isLogin ? 'Welcome back!' : 'Create an account';
  const subtitle = isLogin ? 'Log in to continue' : 'Get started with us today';

  
  return (
    <div className="max-w-md w-full mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-radial from-black to-gray-800 p-10 text-white">
        <h2 className="text-4xl font-bold">{title}</h2>
        <p className="text-blue-100 opacity-90">{subtitle}</p>
      </div>
      
      <form onSubmit={onSubmit} className="p-6 space-y-6">
        {!isLogin && (
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder=" "
                value={formData.firstName || ''}
                onChange={onChange}
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
                required
              />
              <label
                htmlFor="firstName"
                className="absolute text-sm text-gray-500 duration-200 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
              >
                First name
              </label>
            </div>
            <div className="relative">
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder=" "
                value={formData.lastName || ''}
                onChange={onChange}
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
                required
              />
              <label
                htmlFor="lastName"
                className="absolute text-sm text-gray-500 duration-200 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
              >
                Last name
              </label>
            </div>
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
            className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
            required
          />
          <label
            htmlFor="email"
            className="absolute text-sm text-gray-500 duration-200 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
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
            className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            } appearance-none focus:outline-none focus:ring-0 focus:border-black peer`}
            required
          />
          <label
            htmlFor="password"
            className="absolute text-sm text-gray-500 duration-200 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
          >
            Password
          </label>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        {!isLogin && (
          <div className="relative">
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder=" "
              value={formData.confirmPassword}
              onChange={onChange}
              className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              } appearance-none focus:outline-none focus:ring-0 focus:border-black peer`}
              required
            />
            <label
              htmlFor="confirmPassword"
              className="absolute text-sm text-gray-500 duration-200 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
            >
              Confirm Password
            </label>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>
        )}
        {!isLogin && (
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700" htmlFor="userType">
              Account Type
            </label>
            <select
              id="userType"
              name="userType"
              value={formData.userType}
              onChange={onChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
            >
              <option value="Customer">Customer</option>
              <option value="Staff">Staff</option>
            </select>
          </div>
        )}
        
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-radial from-black to-gray-800 text-white py-2 px-4 rounded-md hover:from-gray-800 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 transition-all duration-200 active:scale-[0.98] shadow-md hover:shadow-lg ${
            isLoading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            isLogin ? 'Login' : 'Register'
          )}
        </button>
        
        <div className="text-center text-sm text-gray-600 pt-2">
          {isLogin ? (
            <>
              Don't have an account?{' '}
              <a href="/register" className="text-black hover:underline font-medium">
                Sign up
              </a>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <a href="/login" className="text-black hover:underline font-medium">
                Log in
              </a>
            </>
          )}
        </div>
      </form>
    </div>
  );
}