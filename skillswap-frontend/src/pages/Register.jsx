import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { isEmail, required } from '../utils/validators.js';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('client');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = (event) => {
    event.preventDefault();
    if (!required(name) || !isEmail(email)) {
      setError('Add your name and a valid email');
      return;
    }
    login(email, role);
    navigate(role === 'creator' ? '/creator' : '/marketplace');
  };

  return (
    <section className="auth-card">
      <h1>Create account</h1>
      <form onSubmit={submit}>
        <Input label="Name" value={name} onChange={(event) => setName(event.target.value)} />
        <Input label="Email" value={email} onChange={(event) => setEmail(event.target.value)} error={error} />
        <label className="field">
          <span>Role</span>
          <select value={role} onChange={(event) => setRole(event.target.value)}>
            <option value="client">Client</option>
            <option value="creator">Creator</option>
          </select>
        </label>
        <Button type="submit">Create account</Button>
      </form>
    </section>
  );
}
