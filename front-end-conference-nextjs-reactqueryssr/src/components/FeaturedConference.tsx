import { getDatesInRange } from '@/utils/getDatesInRange';
import {
  Conferences,
  useConferencesQueryQuery,
} from '@/utils/__generated__/graphql';
import { Agenda } from './Agenda';
import { useState } from 'react';
import { useAddEmailMutation } from '@/utils/__generated__/graphql';

export function FeaturedConference() {
  const { data, isLoading, isError } = useConferencesQueryQuery();
  const [email, setEmail] = useState('');
  const { mutateAsync, isLoading: addEmailIsLoading } = useAddEmailMutation();
  const [submitState, setSubmitState] = useState<
    'UNSUBMITTED' | 'SUCCESS' | 'ERROR'
  >('UNSUBMITTED');
  const [error, setError] = useState<Error | null>(null);

  if (isError) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

  const featuredConference: Pick<
    Conferences,
    'id' | 'name' | 'start_date' | 'end_date' | 'location'
  > = data.conferences[0];

  if (!featuredConference) {
    return null;
  }

  return (
    <div className="">
      <div className=" max-w-4xl mx-auto">
        <div className="py-8 text-center">
          <h1 className="text-dim text-[68px] font-semibold leading-none drop-shadow-sm">
            <span className="stroke">
              {featuredConference.name.substring(
                0,
                featuredConference.name.lastIndexOf(' '),
              )}
            </span>{' '}
            <span className="gradient">
              {featuredConference.name.split(' ').splice(-1)}
            </span>
          </h1>
          <div className="max-w-sm mx-auto mt-2 space-y-1 text-center">
            <p> {featuredConference.location}</p>
            <p className="text-list text-center">
              {`${new Date(featuredConference.start_date).toDateString()} to 
              ${new Date(featuredConference.end_date).toDateString()}`}
            </p>
          </div>
          <div className="mx-auto mt-6">
            {submitState === 'SUCCESS' && (
              <h1 className="text-list mt-1 font-medium">
                Thank you for subscribing!
              </h1>
            )}
            {submitState === 'ERROR' && (
              <div className="flex flex-col space-y-3">
                <p className="text-list font-medium">{error.message}</p>
                <button
                  className="bg-card flex flex-col px-2 py-2 mx-auto text-xs text-center rounded-md"
                  onClick={() => {
                    setSubmitState('UNSUBMITTED');
                  }}
                >
                  Try again
                </button>
              </div>
            )}
            {submitState === 'UNSUBMITTED' && (
              <form
                className="bg-card bg-opacity-80 w-fit flex px-1 py-2 mx-auto space-x-3 border-gray-800 rounded-lg"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (email === '') return;
                  try {
                    await mutateAsync({
                      ticket: {
                        conference_id: featuredConference.id,
                        email,
                      },
                    });
                    setSubmitState('SUCCESS');
                  } catch (error) {
                    setSubmitState('ERROR');
                    setError(error);
                  }
                }}
              >
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email to register..."
                  type={'email'}
                  className="focus:outline-none px-3 py-1 text-sm text-white bg-transparent rounded-md outline-none"
                ></input>
                <button
                  className="bg-gradient-to-r from-indigo-800 to-pink-900 flex flex-col px-2 py-2 text-sm font-medium text-white rounded-md"
                  type="submit"
                >
                  {!isLoading ? (
                    'Register'
                  ) : (
                    <>
                      <svg
                        role="status"
                        className="animate-spin self-center inline w-4 h-4 mr-2 text-white align-middle"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="#E5E7EB"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentColor"
                        />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <Agenda
        amountOfDays={getDatesInRange(
          featuredConference.start_date,
          featuredConference.end_date,
        )}
      />
    </div>
  );
}
