import { useParams } from 'react-router-dom'
import { Redirect } from '@shopify/app-bridge/actions'
import { useAppBridge } from '@shopify/app-bridge-react'
import { useAppMutation, useAuthenticatedFetch } from '../../../hooks'
import { useForm, useField } from '@shopify/react-form'
import {
  Button,
  Card,
  Form,
  Select,
  SkeletonBodyText,
  SkeletonDisplayText,
  TextField,
} from '@shopify/polaris'
import { toast } from 'react-toastify'
// import {
//   Method,
//   RequirementType,
// } from '@shopify/discount-app-components'

const todaysDate = new Date()
// Metafield that will be used for storing function configuration
const METAFIELD_NAMESPACE = '$app:volume-discount'
const METAFIELD_CONFIGURATION_KEY = 'function-configuration'

export default function Discount() {
  const { functionId } = useParams()
  const app = useAppBridge()
  const redirect = Redirect.create(app)

  const createAutomaticDiscountMutation = useAppMutation({
    url: `/api/discounts/automatic`,
  })
  const createCodeDiscountMutation = useAppMutation({
    url: `/api/discounts/code`,
  })

  // Define base discount form fields
  const {
    fields: {
      title,
      // code,
      method,
      // combinesWith,
      // requirementType,
      // requirementSubtotal,
      // requirementQuantity,
      // usageTotalLimit,
      // usageOncePerCustomer,
      // startDate,
      // endDate,
      configuration,
    },
    submit,
    // submitting,
    // dirty,
    // reset,
    // submitErrors,
    // makeClean,
  } = useForm({
    fields: {
      title: useField(''),
      method: useField('automatic'),
      code: useField(''),
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
        quantity: useField('1'),
        percentage: useField('0'),
      },
    },
    onSubmit: async (form) => {
      try {
        // Create the discount using the added express endpoints
        const discount = {
          functionId,
          title: form.title,
          // combinesWith: form.combinesWith,
          // startsAt: form.startDate,
          startsAt: new Date().toISOString(),
          // endsAt: form.endDate,
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
        const mutation =
          form.method === 'automatic'
            ? createAutomaticDiscountMutation
            : createCodeDiscountMutation

        const variables =
          form.method === 'automatic'
            ? { discount }
            : { discount: { ...discount, code: form.code } }

        toast.promise(() => mutation.mutateAsync(variables, {}), {
          pending: 'discountを作成中',
          success: 'discountを作成しました 👌',
          error: 'discountの作成に失敗しました 🤯',
        })

        return { status: 'success' }
      } catch (error) {
        toast.error('discountの作成に失敗しました 🤯')
        return { status: 'fail', errors: error }
      }
    },
  })

  return (
    <div className="p-4 space-y-4">
      <h1>Discount</h1>
      <div className="max-w-[600px]">
        <Card>
          <Form onSubmit={submit}>
            <div className="flex flex-col gap-4">
              <TextField autoComplete="off" label="Title" {...title} />
              <Select
                label="Method"
                options={[
                  { label: 'Automatic discount', value: 'automatic' },
                  { label: 'Discount code', value: 'code' },
                ]}
                name="method"
                {...method}
              />
              <TextField
                label="Minimum quantity"
                {...configuration.quantity}
                autoComplete="off"
              />
              <TextField
                label="Discount percentage"
                {...configuration.percentage}
                type="number"
                step={0.5}
                suffix="%"
                autoComplete="off"
              />

              <Button submit primary>
                Create
              </Button>
            </div>
          </Form>
        </Card>
        <div className="mt-8">
          <Button
            onClick={() =>
              // Redirect to discounts page
              redirect.dispatch(Redirect.Action.ADMIN_SECTION, {
                name: Redirect.ResourceType.Discount,
              })
            }
          >
            Discountページへ戻る
          </Button>
        </div>
      </div>
    </div>
  )
}
