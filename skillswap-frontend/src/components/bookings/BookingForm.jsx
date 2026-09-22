import { useState } from 'react';
import { CalendarCheck } from 'lucide-react';
import { api } from '../../services/api.js';
import Button from '../ui/Button.jsx';
import Input from '../ui/Input.jsx';

export default function BookingForm({ gig, onBooked }) {
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    const booking = await api.createBooking({ gigId: gig.id, date, note, amount: gig.price });
    onBooked?.(booking);
  };

  return (
    <form className="panel" onSubmit={submit}>
      <Input label="Preferred date" type="date" value={date} onChange={(event) => setDate(event.target.value)} required />
      <label className="field">
        <span>Project note</span>
        <textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Share goals, timeline, or references" />
      </label>
      <Button type="submit"><CalendarCheck size={18} />Request booking</Button>
    </form>
  );
}
