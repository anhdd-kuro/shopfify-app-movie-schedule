import { UseMutationOptions, UseMutationResult, useMutation } from 'react-query'
import { useAuthenticatedFetch } from './useAuthenticatedFetch'
import { useMemo } from 'react'

type AppMutationOptions<TData, TVariables> = {
  url: string
  fetchInit?: RequestInit
  reactQueryOptions?: UseMutationOptions<TData, unknown, TVariables>
}

type AppMutationResult<TData, TVariables> = UseMutationResult<
  TData,
  unknown,
  TVariables,
  unknown
>

/**
 * A hook for mutating your custom app data.
 * @desc A thin wrapper around useAuthenticatedFetch and react-query's useMutation.
 *
 * @param {Object} options - The options for your mutation. Accepts 3 keys:
 *
 * 1. url: The URL to mutate. E.g: /api/widgets/1`
 * 2. fetchInit: The init options for fetch.  See: https://developer.mozilla.org/en-US/docs/Web/API/fetch#parameters
 * 3. reactQueryOptions: The options for `useMutation`. See: https://react-query.tanstack.com/reference/useMutation
 *
 * @returns Return value of useMutation.  See: https://react-query.tanstack.com/reference/useMutation.
 */
export const useAppMutation = <TData, TVariables>({
  url,
  fetchInit = {},
  reactQueryOptions,
}: AppMutationOptions<TData, TVariables>): AppMutationResult<
  TData,
  TVariables
> => {
  const authenticatedFetch = useAuthenticatedFetch()

  const mutation = useMemo(() => {
    return async (variables: TVariables) => {
      console.log(variables)
      const response = await authenticatedFetch(url, {
        ...fetchInit,
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(variables),
      })

      return response.json() as Promise<TData>
    }
  }, [url, JSON.stringify(fetchInit)])

  return useMutation<TData, unknown, TVariables, unknown>(mutation, {
    ...reactQueryOptions,
  })
}
