import iconMapping from './iconMapping'

export default function Icons(props) {
  return iconMapping[props.value]
}