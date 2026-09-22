import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, ShieldCheck } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Input from '../../components/ui/Input.jsx';
import Textarea from '../../components/ui/Textarea.jsx';
import Button from '../../components/ui/Button.jsx';
import { ProfileSkeleton } from '../../components/ui/Skeleton.jsx';
import { useCurrentUser, useUpdateProfile } from '../../features/users/userHooks.js';
import { selectCurrentUser } from '../../app/store/slices/authSlice.js';

const profileSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(80),
  bio: z.string().trim().max(500, 'Bio must be under 500 characters').optional().or(z.literal('')),
  skills: z.string().optional().or(z.literal('')),
});

export default function Profile() {
  const user = useSelector(selectCurrentUser);
  const { isLoading } = useCurrentUser();
  const updateProfile = useUpdateProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({ resolver: zodResolver(profileSchema) });

  useEffect(() => {
    if (user) {
      reset({ name: user.name || '', bio: user.bio || '', skills: (user.skills || []).join(', ') });
    }
  }, [user, reset]);

  function onSubmit(values) {
    updateProfile.mutate({
      name: values.name,
      bio: values.bio || '',
      skills: values.skills
        ? values.skills
            .split(',')
            .map((skill) => skill.trim())
            .filter(Boolean)
        : [],
    });
  }

  if (isLoading || !user) {
    return (
      <DashboardLayout title="Profile">
        <ProfileSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Profile" description="Manage your public information.">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5">
          <Avatar name={user.name} size="lg" />
          <div>
            <h2 className="text-base font-semibold text-slate-900">{user.name}</h2>
            <p className="flex items-center gap-1 text-xs text-slate-500">
              <Mail className="h-3 w-3" /> {user.email}
            </p>
            <Badge tone="brand" icon={ShieldCheck} className="mt-1.5 capitalize">
              {user.role}
            </Badge>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6" noValidate>
          <Input label="Full name" required error={errors.name?.message} {...register('name')} />
          <Textarea
            label="Bio"
            rows={4}
            placeholder="Tell clients and creators a bit about yourself."
            error={errors.bio?.message}
            {...register('bio')}
          />
          <Input
            label="Skills"
            hint="Comma-separated, e.g. Branding, Illustration, Figma"
            error={errors.skills?.message}
            {...register('skills')}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!isDirty}
              isLoading={updateProfile.isPending}
              loadingText="Saving…"
            >
              Save changes
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
