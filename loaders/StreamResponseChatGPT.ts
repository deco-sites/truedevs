interface Props {
  currentMessage: string
}

const loader = async ({ currentMessage }: Props) => {
  return currentMessage
}

export default loader