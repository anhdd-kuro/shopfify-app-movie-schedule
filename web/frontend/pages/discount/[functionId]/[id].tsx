import { useParams } from 'react-router-dom'
import { Redirect } from '@shopify/app-bridge/actions'
import { useAppBridge } from '@shopify/app-bridge-react'
import {
  useAppQuery,
  useAuthenticatedFetch,
  useAppMutation,
} from '../../../hooks'
import { useForm, useField } from '@shopify/react-form'
import {
  Button,
  Card,
  Form,
  Select,
  SkeletonBodyText,
  TextField,
} from '@shopify/polaris'
import { SkeletonDisplayText } from '@shopify/polaris'

const todaysDate = new Date()
// Metafield that will be used for storing function configuration
const METAFIELD_NAMESPACE = '$app:volume-discount'
const METAFIELD_CONFIGURATION_KEY = 'function-configuration'

export default function Discount() {
  const { id, functionId } = useParams()

  const { data, isLoading } = useAppQuery<{
    title: string
    quantity: number
    percentage: number
  }>({
    url: `/api/discounts/${id}`,
  })

  console.log(data)
  const app = useAppBridge()
  const redirect = Redirect.create(app)
  const authenticatedFetch = useAuthenticatedFetch()

  // Define base discount form fields
  const {
    fields: {
      discountTitle,
      discountCode,
      discountMethod,
      combinesWith,
      requirementType,
      requirementSubtotal,
      requirementQuantity,
      usageTotalLimit,
      usageOncePerCustomer,
      startDate,
      endDate,
      configuration,
    },
    submit,
    submitting,
    dirty,
    reset,
    submitErrors,
    makeClean,
  } = useForm({
    fields: {
      discountTitle: useField(data?.title),
      discountMethod: useField('automatic'),
      discountCode: useField(''),
      combinesWith: useField({
        orderDiscounts: false,
        productDiscounts: false,
        shippingDiscounts: false,
      }),
      requirementType: useField(''),
      requirementSubtotal: useField('0'),
      requirementQuantity: useField('0'),
      usageTotalLimit: useField(null),
      usageOncePerCustomer: useField(false),
      startDate: useField(todaysDate),
      endDate: useField(null),
      configuration: {
        // Add quantity and percentage configuration to form data
        quantity: useField(`${data?.quantity}`),
        percentage: useField(`${data?.percentage}`),
      },
    },
    onSubmit: async (form) => {
      // Create the discount using the added express endpoints
      const discount = {
        functionId,
        title: form.discountTitle,
        combinesWith: form.combinesWith,
        startsAt: form.startDate,
        endsAt: form.endDate,
        metafields: [
          {
            namespace: METAFIELD_NAMESPACE,
            key: METAFIELD_CONFIGURATION_KEY,
            type: 'json',
            value: JSON.stringify({
              // Populate metafield from form data
              quantity: parseInt(form.configuration.quantity),
              percentage: parseFloat(form.configuration.percentage),
            }),
          },
        ],
      }

      let response
      if (form.discountMethod === 'automatic') {
        response = await authenticatedFetch('/api/discounts/automatic', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            discount: {
              ...discount,
            },
          }),
        })
      } else {
        response = await authenticatedFetch('/api/discounts/code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            discount: {
              ...discount,
              code: form.discountCode,
            },
          }),
        })
      }

      const data = (await response.json()).data
      const remoteErrors = data.discountCreate.userErrors
      if (remoteErrors.length > 0) {
        return { status: 'fail', errors: remoteErrors }
      }

      redirect.dispatch(Redirect.Action.ADMIN_SECTION, {
        name: Redirect.ResourceType.Discount,
      })
      return { status: 'success' }
    },
  })

  return (
    <div className="p-4 space-y-4">
      <h1>Discount</h1>
      <div className="max-w-[600px]">
        <Card>
          <Form onSubmit={submit}>
            {isLoading ? (
              <div className="flex flex-col gap-4">
                <SkeletonDisplayText />
                <SkeletonBodyText lines={1} />
                <SkeletonDisplayText />
                <SkeletonBodyText lines={1} />
                <SkeletonDisplayText />
                <SkeletonBodyText lines={1} />
                <SkeletonDisplayText />
                <SkeletonBodyText lines={1} />
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <TextField
                  autoComplete="off"
                  label="Title"
                  {...discountTitle}
                />
                <Select
                  label="Method"
                  options={[
                    { label: 'Automatic discount', value: 'automatic' },
                    { label: 'Discount code', value: 'code' },
                  ]}
                  {...discountMethod}
                />
                <TextField
                  label="Minimum quantity"
                  {...configuration.quantity}
                  autoComplete="off"
                />
                <TextField
                  label="Discount percentage"
                  {...configuration.percentage}
                  suffix="%"
                  autoComplete="off"
                />

                <Button submit primary>
                  Create
                </Button>
              </div>
            )}
          </Form>
        </Card>
      </div>
    </div>
  )
}
