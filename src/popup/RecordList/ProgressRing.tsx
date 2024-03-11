export function ProgressRing(props: { progress: number; className?: string }) {
  const { progress, className = "" } = props
  const radius = 20
  const stroke = 3
  const normalizedRadius = radius - stroke * 2
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDashoffset = circumference - (progress / 100) * circumference
  return (
    <div style={{ height: radius * 2, width: radius * 2 }} className={"relative " + className}>
      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke="#2A4DD0"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + " " + circumference}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
        <span>{progress}</span>
      </div>
    </div>
  )
}
