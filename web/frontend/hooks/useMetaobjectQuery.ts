import { useMemo } from 'react'
import { useAppQuery } from './useAppQuery'
import { QueryKey, UseQueryOptions } from 'react-query'

type ListReferences = {
  nodes:
    | {
        handle: string
        id: string
        fields: {
          key: string
          value: string | number | null
        }[]
      }[]
    | null
}

type Reference = {
  image: {
    url: string
    altText: string
  } | null
} | null

type MetaobjectResult = {
  metaobjects: {
    nodes: {
      handle: string
      id: string
      fields: [
        {
          key: string
          value: string | number | null
          references: ListReferences | null
          reference: Reference
        },
      ]
    }[]
  }
}

export const useMetaobjectQuery = <
  T extends Record<string, string | number | ListReferences | Reference>,
>({
  url,
  reactQueryOptions,
  referenceKeys,
  listReferencesKeys,
}: {
  url: string
  referenceKeys?: string[]
  listReferencesKeys?: string[]
  reactQueryOptions?: UseQueryOptions<
    MetaobjectResult,
    unknown,
    MetaobjectResult,
    QueryKey
  >
}) => {
  const { data, ...result } = useAppQuery<MetaobjectResult>({
    url,
    reactQueryOptions,
  })

  const parsedData = useMemo(() => {
    const _parsedData = data?.metaobjects?.nodes?.map((node) => {
      const fields = node.fields.reduce((acc, field) => {
        if (listReferencesKeys?.includes(field.key)) {
          acc[field.key as keyof T] = field.references as T[keyof T]
          return acc
        }
        if (referenceKeys?.includes(field.key)) {
          acc[field.key as keyof T] = field.reference as T[keyof T]
          return acc
        }

        acc[field.key as keyof T] = field.value as T[keyof T]
        return acc
      }, {} as T)

      return fields
    })

    return _parsedData
  }, [data, referenceKeys])

  return {
    parsedData,
    ...result,
    data,
  }
}
