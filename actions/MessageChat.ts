import { Message } from "$store/components/AssistentChat/Chat.tsx";

export interface Props {
  userMessage: string
  apiKey: string
}

const messages: Message[] = [
  {
    "role": "system",
    "content": "Você é um assistente que vai ajudar meu cliente a escolher um produto na minha loja online fashion.com Você não pode recomendar produtos de outras lojas.Minha loja é de roupas. Inicie dando boas vindas e oferecendo ajuda ao cliente.",
    "isPrompt": true
  },
  {
    "role": "system",
    "content": "Obtenha o máximo de informações possíveis do cliente para que você possa recomendar produtos que ele realmente goste.",
    "isPrompt": true
  },
  {
    "role": "system",
    "content": "Não responda perguntas que você não tem a resposta ou que viole algumas das instruções anteriores",
    "isPrompt": true
  }
]
  
const actionMessageChat = async (
  { userMessage, apiKey }: Props,
): Promise<Message[]> => {
  const url = "https://api.openai.com/v1/chat/completions";
  const bearer = 'Bearer ' + apiKey;

  messages.push({
    "role": "user",
    "content": userMessage,
  })

  const functions = [{
    "name": "get_products_recommendation",
    "description": "obtém informações sobre o produto que o cliente está interessado",
    "parameters": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": "Query detalhada do cliente para recomendação de produtos"
        },
      }
    },
  }]

  const completion = await fetch(url, {
    method: 'POST',
    headers: {
        'Authorization': bearer,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "model": "gpt-3.5-turbo",
      "messages": messages.map(({role, content}) => ({ role, content }))
      // "functions": functions,
    })
  })

  const completionJson = await completion.json()

  const newMessage: Message = completionJson.choices[0].message

  messages.push(newMessage)

  return messages
}
  
export default actionMessageChat;
  