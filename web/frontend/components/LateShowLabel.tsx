import clsx from 'clsx'

export default function LateShowLabel({
  rounded = true,
}: {
  rounded?: boolean
}) {
  return (
    <div
      className={clsx(
        'bg-[#6372e5] py-1 px-4 flex items-center justify-center overflow-hidden',
        rounded && 'rounded-md'
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 20 20"
        fill="#fff"
      >
        <title>moon</title>
        <path d="M17.39 15.14A7.33 7.33 0 0 1 11.75 1.6c.23-.11.56-.23.79-.34a8.19 8.19 0 0 0-5.41.45 9 9 0 1 0 7 16.58 8.42 8.42 0 0 0 4.29-3.84 5.3 5.3 0 0 1-1.03.69z" />
      </svg>
    </div>
  )
}
