import { toast } from 'react-toastify'
import { useAppQuery } from '../hooks'
import { SmartCollection } from '@shopify/shopify-api/rest/admin/2023-04/smart_collection'

// fetch metafields for a collection
const useMetafieldsQuery = (collectionId: string) => {
  const { data: metafields } = useAppQuery({
    url: `/api/collections/${collectionId}/metafields`,
    reactQueryOptions: {
      onSuccess: () => {
        toast.success('Metafields fetched successfully')
      },
    },
  })

  return metafields
}

export default function Shows() {
  const { data: collections, isLoading } = useAppQuery<SmartCollection[]>({
    url: '/api/collections',
    reactQueryOptions: {
      onSuccess: (data) => {
        console.log(data)
        toast.success('Collections fetched successfully')
      },
    },
  })

  return (
    <>
      {isLoading && <p>Loading...</p>}
      <div className="flex flex-wrap gap-4">
        {collections?.map((collection) => (
          <div key={collection.id} className="w-1/4">
            <div className="bg-white rounded-lg shadow-lg">
              <img
                className="w-full h-48 object-cover object-center"
                // @ts-ignore-next-line
                src={collection.image?.src || ''}
                alt={collection.title}
              />
              <div className="p-4">
                <h2 className="text-gray-900 font-bold text-2xl mb-2">
                  {collection.title}
                </h2>
                <div
                  dangerouslySetInnerHTML={{ __html: collection.body_html }}
                />
                <ul>
                  {/* {useMetafieldsQuery(collection.id).map((metafield) => (
                    <li key={metafield.id}>
                      <p className="text-gray-700">
                        {metafield.key}: {metafield.value}
                      </p>
                    </li>
                  ))} */}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
