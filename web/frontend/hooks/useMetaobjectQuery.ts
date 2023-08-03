import { useMemo } from 'react'
import { useAppQuery } from './useAppQuery'
import { QueryKey, UseQueryOptions } from 'react-query'

export const useMetaObjectQuery = <T extends { metaobjects: any }>({
  url,
  reactQueryOptions,
  referenceKeys,
}: {
  url: string
  referenceKeys?: string[]
  reactQueryOptions?: UseQueryOptions<T, unknown, T, QueryKey>
}) => {
  const { data, ...result } = useAppQuery<T>({
    url,
    reactQueryOptions,
  })

  const parsedData = useMemo(() => {
    const _parsedData = data.metaobjects.nodes.map((node: any) => {
      const fields = node.fields.reduce((acc: any, field: any) => {
        if (referenceKeys.includes(field.key)) acc[field.key] = field.references
        else acc[field.key] = acc[field.key] = field.value
        return acc
      }, {})

      return fields
    })

    return _parsedData
  }, [data])

  return {
    parsedData,
    ...result,
    data,
  }
}
