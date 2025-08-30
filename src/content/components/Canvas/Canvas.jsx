export default function Canvas({
  ref = null,
  id = '',
  height = 0,
  width = 0
}) {
  return (
    <canvas
      ref={ref}
      id={id}
      height={height}
      width={width}
    />
  )
}