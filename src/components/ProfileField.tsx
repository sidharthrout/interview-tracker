interface ProfileFieldProps {
  icon: React.ReactNode
  label: string
  value: string | null | undefined
}

export default function ProfileField({ icon, label, value }: ProfileFieldProps) {
  if (!value) return null

  return (
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0 mt-1 text-gray-400">
        {icon}
      </div>
      <div>
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="text-base text-gray-900">{value}</dd>
      </div>
    </div>
  )
}