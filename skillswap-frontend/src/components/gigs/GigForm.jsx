import { useEffect, useState } from 'react';
import { useForm, useWatch, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Info } from 'lucide-react';
import { gigFormSchema } from '../../features/gigs/gigSchemas.js';
import { GIG_CATEGORIES } from '../../lib/constants.js';
import Input from '../ui/Input.jsx';
import Textarea from '../ui/Textarea.jsx';
import Select from '../ui/Select.jsx';
import Button from '../ui/Button.jsx';
import GigImageUploader from './GigImageUploader.jsx';
import Image from '../ui/Image.jsx';

const categoryOptions = GIG_CATEGORIES.map((category) => ({ value: category, label: category }));

export default function GigForm({
  mode = 'create',
  defaultValues,
  existingImageUrl,
  onSubmit,
  isSubmitting,
  onValuesChange,
}) {
  const [imageFile, setImageFile] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(gigFormSchema),
    defaultValues: {
      title: '',
      description: '',
      category: GIG_CATEGORIES[0],
      rate: '',
      duration: '1 day',
      ...defaultValues,
    },
  });

  const watchedValues = useWatch({ control });

  useEffect(() => {
    onValuesChange?.({ ...watchedValues, imageFile });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(watchedValues), imageFile]);

  function submit(values) {
    onSubmit({ ...values, imageFile });
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5" noValidate>
      <Input
        label="Title"
        required
        placeholder="e.g. I will design a modern logo for your brand"
        error={errors.title?.message}
        {...register('title')}
      />

      <Textarea
        label="Description"
        required
        rows={6}
        placeholder="Describe exactly what clients get, your process, and turnaround time."
        error={errors.description?.message}
        {...register('description')}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <Select label="Category" required options={categoryOptions} error={errors.category?.message} {...field} />
          )}
        />
        <Input
          label="Duration"
          required
          placeholder="e.g. 2 days"
          error={errors.duration?.message}
          {...register('duration')}
        />
      </div>

      <Input
        label="Rate (INR)"
        type="number"
        min="1"
        step="1"
        required
        placeholder="e.g. 1500"
        error={errors.rate?.message}
        {...register('rate')}
      />

      {mode === 'create' ? (
        <GigImageUploader file={imageFile} onChange={setImageFile} />
      ) : (
        <div>
          <p className="mb-1.5 block text-sm font-medium text-slate-700">Gig image</p>
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <Image src={existingImageUrl} alt="Current gig" className="aspect-[16/9] w-full" />
          </div>
          <p className="mt-2 flex items-start gap-1.5 text-xs text-slate-500">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            The image can only be set when a gig is first created.
          </p>
        </div>
      )}

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          isLoading={isSubmitting}
          loadingText={mode === 'create' ? 'Publishing…' : 'Saving…'}
        >
          {mode === 'create' ? 'Publish Gig' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}
