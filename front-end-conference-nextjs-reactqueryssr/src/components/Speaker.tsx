import { useAuthenticated } from '@nhost/react';
import {
  useDeleteSpeakerMutation,
  useTalksQuery,
  useConferencesQueryQuery,
} from '../utils/__generated__/graphql';
import { queryClient } from '../utils/react-query-client';
import { useSpeakersQuery } from '../utils/__generated__/graphql';

/**
 * Speaker is conference speaker type with a name, social, job, and avatarUrl property, all of which are strings.
 * @property {string} name - The name of the speaker
 * @property {string} social - The social media handle of the speaker.
 * @property {string} job - The job title of the speaker
 * @property {string} avatarUrl - The URL of the speaker's avatar.
 */
export type Speaker = {
  id: string;
  name: string;
  social: string;
  job: string;
  avatarUrl: string;
};

export function Speaker({ id, avatarUrl, name, social, job }: Speaker) {
  const isAuthenticated = useAuthenticated();

  const { mutateAsync } = useDeleteSpeakerMutation({
    onSuccess: () => {
      queryClient.fetchQuery(useSpeakersQuery.getKey());
      queryClient.fetchQuery(useConferencesQueryQuery.getKey());
    },
  });

  return (
    <div className="bg-card relative flex flex-col px-4 py-5 transition-all duration-150 ease-in border border-gray-700 rounded-md">
      {isAuthenticated ? (
        <button
          className="right-2 bottom-3 opacity-80 absolute text-red-500"
          onClick={async () => {
            await mutateAsync({
              id,
            });
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      ) : null}
      <img
        className="object-cover rounded-md aspect-square p-0.5"
        width={350}
        height={350}
        src={avatarUrl}
      />
      <div className="py-2">
        <h1 className="text-lg font-medium text-white">{name}</h1>
        <h2 className="text-dim text-xs font-medium">@{social}</h2>
        <h2 className="text-dim mt-2 text-sm font-medium">{job}</h2>
      </div>
    </div>
  );
}
