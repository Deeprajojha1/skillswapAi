import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createBookingSchema } from '../../features/bookings/bookingSchemas.js';
import Textarea from '../ui/Textarea.jsx';
import Input from '../ui/Input.jsx';
import Button from '../ui/Button.jsx';

export default function BookingForm({ onSubmit, isSubmitting }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(createBookingSchema), defaultValues: { requirements: '', deadline: '' } });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <Textarea
        label="Your requirements"
        required
        rows={5}
        placeholder="Tell the creator exactly what you need, references, and any preferences."
        error={errors.requirements?.message}
        {...register('requirements')}
      />
      <Input
        label="Preferred deadline"
        type="date"
        hint="Optional"
        min={new Date().toISOString().split('T')[0]}
        error={errors.deadline?.message}
        {...register('deadline')}
      />
      <Button type="submit" fullWidth isLoading={isSubmitting} loadingText="Creating booking…">
        Book Gig
      </Button>
    </form>
  );
}
