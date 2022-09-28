import { Loader } from '@/components/common/Loader';
import { SpeakerCard } from '@/components/speakers/SpeakerCard';
import { useConferenceBySlugQuery } from '@/utils/__generated__/graphql';
import { useRouter } from 'next/router';

export function SpeakersGrid() {
  const {
    query: { conferenceSlug },
  } = useRouter();

  const { data, status, error } = useConferenceBySlugQuery({
    slug: conferenceSlug as string,
  });

  if (status === 'error' && error) {
    return (
      <div className="bg-opacity-10 w-full max-w-xl px-4 py-4 mx-auto text-sm bg-red-500 rounded-md">
        <h1 className="pb-2 text-xl font-medium leading-none text-center text-white">
          {error instanceof Error
            ? error.message
            : 'Unknown error occurred. Please try again.'}
        </h1>
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className="flex mx-auto">
        <Loader />
      </div>
    );
  }

  const { speakers } = data?.conferences?.[0] || {};

  return (
    <div className="grid w-full grid-cols-4 gap-6">
      {speakers.length === 0
        ? 'There are no speakers yet.'
        : speakers?.map((speaker) => {
            return (
              <SpeakerCard
                key={speaker.id}
                id={speaker.id}
                avatar_url={
                  speaker.avatar_url || 'https://via.placeholder.com/350x350'
                }
                name={speaker.name}
                social={speaker.social}
                job_description={speaker.job_description}
              />
            );
          })}
    </div>
  );
}
