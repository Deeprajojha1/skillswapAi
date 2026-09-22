import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import { api } from '../../services/api.js';
import { CATEGORIES } from '../../utils/constants.js';
import { validateGig } from '../../utils/validators.js';

export default function CreateGig() {
  const [values, setValues] = useState({ title: '', category: CATEGORIES[0], price: '', description: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const update = (key, value) => setValues((current) => ({ ...current, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = validateGig(values);
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;
    await api.createGig(values);
    navigate('/creator/gigs');
  };

  return (
    <section className="page-section narrow">
      <h1>Create gig</h1>
      <form className="panel" onSubmit={submit}>
        <Input label="Title" value={values.title} onChange={(event) => update('title', event.target.value)} error={errors.title} />
        <label className="field">
          <span>Category</span>
          <select value={values.category} onChange={(event) => update('category', event.target.value)}>
            {CATEGORIES.map((category) => <option key={category}>{category}</option>)}
          </select>
          {errors.category ? <small>{errors.category}</small> : null}
        </label>
        <Input label="Price" type="number" value={values.price} onChange={(event) => update('price', event.target.value)} error={errors.price} />
        <label className="field">
          <span>Description</span>
          <textarea value={values.description} onChange={(event) => update('description', event.target.value)} />
        </label>
        <Button type="submit">Publish gig</Button>
      </form>
    </section>
  );
}
