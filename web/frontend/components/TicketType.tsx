import { useState } from 'react'
import { Checkbox } from '@shopify/polaris'
import { Tooltip } from 'react-tooltip'
import clsx from 'clsx'

export default function TicketTypes() {
  const [checkboxState, setCheckboxState] = useState([
    {
      label: '一般',
      checked: true,
      group: 'age',
      price: 1000,
      disabled: false,
    },
    {
      label: '小学生',
      checked: true,
      group: 'age',
      price: 500,
      disabled: false,
    },
    { label: '学生', checked: true, group: 'age', price: 800, disabled: false },
    {
      label: 'シニア',
      checked: true,
      group: 'age',
      price: 700,
      disabled: true,
    },
    {
      label: 'レイトショー (終了10時以降)',
      checked: true,
      group: 'time',
      price: 1200,
      disabled: false,
    },
    {
      label: '団体割引（一般）',
      checked: true,
      group: 'discount',
      price: 900,
      disabled: false,
    },
    {
      label: '団体割引（学生）',
      checked: true,
      group: 'discount',
      price: 700,
      disabled: false,
    },
    {
      label: '火曜日の割引',
      checked: true,
      group: 'discount',
      price: 800,
      disabled: false,
    },
    {
      label: '木曜日の割引',
      checked: true,
      group: 'discount',
      price: 800,
      disabled: false,
    },
    {
      label: 'シニア',
      checked: true,
      group: 'discount',
      price: 500,
      disabled: false,
    },
    {
      label: 'ムビチケ当日券（一般）',
      checked: true,
      group: 'movieTicket',
      price: 1500,
      disabled: false,
    },
    {
      label: 'ムビチケ当日券（小人）',
      checked: true,
      group: 'movieTicket',
      price: 1000,
      disabled: false,
    },
  ])

  const handleCheckboxChange = (index: number) => {
    const newState = [...checkboxState]
    newState[index].checked = !newState[index].checked
    setCheckboxState(newState)
  }

  const ageCheckboxes = checkboxState.filter(
    (checkbox) => checkbox.group === 'age'
  )
  const timeCheckboxes = checkboxState.filter(
    (checkbox) => checkbox.group === 'time'
  )
  const discountCheckboxes = checkboxState.filter(
    (checkbox) => checkbox.group === 'discount'
  )
  const movieTicketCheckboxes = checkboxState.filter(
    (checkbox) => checkbox.group === 'movieTicket'
  )

  return (
    <dl className="space-y-4">
      <dt className="font-bold text-lg">年齢週別</dt>
      <dd className="flex gap-8">
        {ageCheckboxes.map((checkbox, index) => (
          <CheckboxWithTooltip
            key={checkbox.label}
            {...checkbox}
            onChange={() => handleCheckboxChange(index)}
          />
        ))}
      </dd>

      <dt className="font-bold text-lg">時間種別</dt>
      <dd className="flex gap-8">
        {timeCheckboxes.map((checkbox, index) => (
          <CheckboxWithTooltip
            key={checkbox.label}
            {...checkbox}
            onChange={() => handleCheckboxChange(index)}
          />
        ))}
      </dd>

      <dt className="font-bold text-lg">団体割引</dt>
      <dd className="flex gap-8">
        {discountCheckboxes.map((checkbox, index) => (
          <>
            <CheckboxWithTooltip
              key={checkbox.label}
              {...checkbox}
              onChange={() => handleCheckboxChange(index)}
            />
          </>
        ))}
      </dd>

      <dt className="font-bold text-lg">ムビチケ</dt>
      <dd className="flex gap-8">
        {movieTicketCheckboxes.map((checkbox, index) => (
          <CheckboxWithTooltip
            key={checkbox.label}
            {...checkbox}
            onChange={() => handleCheckboxChange(index)}
          />
        ))}
      </dd>
    </dl>
  )
}

const CheckboxWithTooltip = ({
  label,
  price,
  checked,
  onChange,
  disabled,
}: {
  label: string
  price: number
  checked: boolean
  disabled: boolean
  onChange: () => void
}) => {
  return (
    <div data-tooltip-id={label} className={clsx(disabled && 'text-gray-400')}>
      <Checkbox
        label={label}
        checked={checked && !disabled}
        onChange={!disabled && onChange}
      />
      <Tooltip id={label} opacity={1}>
        <div>
          <p>{price.toLocaleString('ja-JP')}円</p>
        </div>
      </Tooltip>
    </div>
  )
}
