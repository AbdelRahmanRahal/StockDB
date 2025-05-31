export async function login({ email, password }) {
  const response = await fetch('/api/dev-login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    // Extract error message from JSON, if available
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || 'Login request failed.');
  }
  const { user, token } = await response.json();
  return { user, token };
}

export async function register({ first_name, last_name, email, password_hash, user_type }) {
  const response = await fetch('/api/dev-register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      firstName: first_name,
      lastName: last_name,
      email,
      password: password_hash, // we named it “password” server-side
      userType: user_type,
    }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || 'Registration request failed.');
  }
  const { user, token } = await response.json();
  return { user, token };
}