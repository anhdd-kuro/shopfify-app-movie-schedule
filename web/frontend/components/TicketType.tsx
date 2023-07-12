import { useState } from 'react'
import { Checkbox } from '@shopify/polaris'
import { Tooltip } from 'react-tooltip'
import clsx from 'clsx'

export default function TicketTypes({ isLateShow }: { isLateShow?: boolean }) {
  const [checkboxState, setCheckboxState] = useState([
    {
      id: 1,
      label: '一般',
      checked: !isLateShow,
      group: 'age',
      price: 1800,
      disabled: isLateShow,
      description: 'デフォルトで選択されています',
    },
    {
      id: 2,
      label: '中・小学生',
      checked: true,
      group: 'age',
      price: 500,
      disabled: false,
      description: '中学は要学生証',
    },
    {
      id: 3,
      label: '幼児',
      checked: true,
      group: 'age',
      price: 800,
      disabled: false,
      description: '3～6歳',
    },
    {
      id: 4,
      label: 'シニア',
      checked: true,
      group: 'age',
      price: 700,
      disabled: true,
      description: '60歳以上',
    },
    {
      id: 5,
      label: 'レイトショー (終了10時以降)',
      checked: isLateShow,
      group: 'time',
      price: 1200,
      disabled: !isLateShow,
      description: '20時以降の上映回',
    },
    {
      id: 6,
      label: '団体割引（一般）',
      checked: true,
      group: 'discount',
      price: 900,
      disabled: false,
      description: '10名以上',
    },
    {
      id: 7,
      label: '団体割引（学生）',
      checked: true,
      group: 'discount',
      price: 700,
      disabled: false,
      description: '10名以上, 要学生証',
    },
    {
      id: 8,
      label: 'KBCシネマ会員サービスデー',
      checked: true,
      group: 'discount',
      price: 800,
      disabled: false,
      description: '毎週火・木曜日、会員限定',
    },
    {
      id: 9,
      label: 'ムビチケ当日券（一般）',
      checked: true,
      group: 'movieTicket',
      price: 1500,
      disabled: false,
      description: 'ムビチケ当日券',
    },
    {
      id: 10,
      label: 'ムビチケ当日券（小人）',
      checked: true,
      group: 'movieTicket',
      price: 1000,
      disabled: false,
      description: 'ムビチケ当日券',
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
      <dt className="font-bold text-lg">年齢種別</dt>
      <dd className="flex gap-8">
        {ageCheckboxes.map((checkbox, index) => (
          <CheckboxWithTooltip
            key={checkbox.id}
            {...checkbox}
            onChange={() => handleCheckboxChange(index)}
          />
        ))}
      </dd>

      <dt className="font-bold text-lg">時間種別</dt>
      <dd className="flex gap-8">
        {timeCheckboxes.map((checkbox, index) => (
          <CheckboxWithTooltip
            key={checkbox.id}
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
              key={checkbox.id}
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
            key={checkbox.id}
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
  description,
  checked,
  onChange,
  disabled,
}: {
  label: string
  description: string
  price: number
  checked: boolean
  disabled: boolean
  onChange: () => void
}) => {
  return (
    <div data-tooltip-id={label} className={clsx(disabled && 'text-gray-400')}>
      <div className="flex items-center gap-2">
        <Checkbox
          label={label}
          checked={checked && !disabled}
          onChange={!disabled && onChange}
        />
      </div>
      <Tooltip id={label} opacity={1}>
        <div className="text-center">
          <p>{price.toLocaleString('ja-JP')}円</p>
          <p>{description}</p>
        </div>
      </Tooltip>
    </div>
  )
}
