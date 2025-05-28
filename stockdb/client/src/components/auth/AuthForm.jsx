export default function AuthForm({ formType, onSubmit, formData, onChange }) {
  const isLogin = formType === 'login';

  return (
    <form onSubmit={onSubmit} className="space-y-4 w-full max-w-sm mx-auto">
      {!isLogin && (
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={onChange}
          className="w-full p-2 border rounded"
          required
        />
      )}
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={onChange}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={onChange}
        className="w-full p-2 border rounded"
        required
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        {isLogin ? 'Login' : 'Register'}
      </button>
    </form>
  );
}
