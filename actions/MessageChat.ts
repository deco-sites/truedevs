export interface Props {
  text: string
  apiKey: string
}

interface ResultRDStationSuccess {
  event_uuid: string;
}
  
const actionMessageChat = async (
  props: Props,
): Promise<ResultRDStationSuccess> => {
  const url = "https://api.openai.com/v1/chat/completions";
  const bearer = 'Bearer ' + props.apiKey;
  const completion = await fetch(url, {
    method: 'POST',
    headers: {
        'Authorization': bearer,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "model": "gpt-3.5-turbo",
      "messages": [
        {
          "role": "system",
          "content": "You are a helpful assistant."
        },
        {
          "role": "user",
          "content": 'Oii'
        }
      ],
    })
  })

  return completion.json());
}
  
export default actionMessageChat;
  