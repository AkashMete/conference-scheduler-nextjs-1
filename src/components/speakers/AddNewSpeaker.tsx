import { Input } from '@/components/common/Input';
import { queryClient } from '@/utils/react-query-client';
import {
  useAddSpeakerMutation,
  useConferenceBySlugQuery,
} from '@/utils/__generated__/graphql';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

type AddNewSpeakerValues = {
  name: string;
  social: string;
  jobTitle: string;
  avatarUrl: string;
};

export function AddNewSpeaker() {
  const {
    query: { conferenceSlug },
  } = useRouter();

  const {
    data: conferenceBySlug,
    status: conferenceBySlugStatus,
    error: conferenceBySlugError,
  } = useConferenceBySlugQuery({ slug: conferenceSlug as string });

  const {
    mutateAsync: addSpeaker,
    status: addSpeakerStatus,
    error: addSpeakerError,
  } = useAddSpeakerMutation({
    onSuccess: () => queryClient.refetchQueries({ type: 'active' }),
  });

  const error = addSpeakerError || conferenceBySlugError;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddNewSpeakerValues>({
    reValidateMode: 'onBlur',
    defaultValues: {
      name: '',
      social: '',
      jobTitle: '',
      avatarUrl: 'https://via.placeholder.com/350x350',
    },
  });

  async function onSubmit(values: AddNewSpeakerValues) {
    try {
      await addSpeaker({
        speaker: {
          name: values.name,
          social: values.social,
          job_description: values.jobTitle,
          avatar_url: values.avatarUrl,
          conference_id: conferenceBySlug.conferences?.[0].id,
        },
      });

      reset({
        name: '',
        social: '',
        jobTitle: '',
        avatarUrl: 'https://via.placeholder.com/350x350',
      });
    } catch {
      // This error is handled by useAddSpeakerMutatio
    }
  }

  if (conferenceBySlugStatus === 'loading') {
    return null;
  }

  return (
    <div className="bg-card w-full px-12 pt-10 pb-10 border border-gray-700 rounded-md">
      <form
        className="grid grid-flow-row gap-8"
        onSubmit={handleSubmit(onSubmit)}
      >
        {error ? (
          <div className="bg-opacity-10 px-4 py-4 text-sm text-white bg-red-500 rounded-md">
            Error:{' '}
            {error instanceof Error
              ? error.message
              : 'Unknown error occurred. Please try again.'}
          </div>
        ) : null}

        <Input
          {...register('avatarUrl', {
            required: { value: true, message: 'This field is required.' },
          })}
          id="avatarUrl"
          label="Avatar URL"
          placeholder="Avatar URL"
          error={errors?.avatarUrl?.message}
          disabled={addSpeakerStatus === 'loading'}
        />

        <Input
          {...register('name', {
            required: { value: true, message: 'This field is required.' },
          })}
          id="speakerName"
          label="Name"
          placeholder="Name"
          error={errors?.name?.message}
          disabled={addSpeakerStatus === 'loading'}
        />

        <Input
          {...register('social', {
            required: { value: true, message: 'This field is required.' },
          })}
          id="social"
          label="Twitter Tag"
          placeholder="Twitter Tag"
          error={errors?.social?.message}
          disabled={addSpeakerStatus === 'loading'}
        />

        <Input
          {...register('jobTitle', {
            required: { value: true, message: 'This field is required.' },
          })}
          id="jobTitle"
          label="Job Title"
          placeholder="Job Title"
          error={errors?.jobTitle?.message}
          disabled={addSpeakerStatus === 'loading'}
        />

        <div className="flex flex-col">
          <button
            type="submit"
            disabled={addSpeakerStatus === 'loading'}
            className="bg-header py-3 text-xs font-medium text-white border-gray-500 rounded-md"
          >
            {addSpeakerStatus === 'loading' ? 'Loading...' : 'Add New Speaker'}
          </button>
        </div>
      </form>
    </div>
  );
}
