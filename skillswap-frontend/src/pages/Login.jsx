import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { isEmail } from '../utils/validators.js';

export default function Login() {
  const [email, setEmail] = useState('client@skillswap.test');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const submit = (event) => {
    event.preventDefault();
    if (!isEmail(email)) {
      setError('Enter a valid email');
      return;
    }
    login(email);
    navigate(location.state?.from ?? '/marketplace');
  };

  return (
    <section className="auth-card">
      <h1>Welcome back</h1>
      <form onSubmit={submit}>
        <Input label="Email" value={email} onChange={(event) => setEmail(event.target.value)} error={error} />
        <Button type="submit">Login</Button>
      </form>
    </section>
  );
}
