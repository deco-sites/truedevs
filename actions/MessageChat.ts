import { Message } from "$store/components/AssistentChat/Chat.tsx";
import { DEFAULT_STRING } from "$store/actions/contains.ts"
import api from 'apps/assistant-ai/mod.ts'

export interface Props {
  userMessage: string
  apiKey: string
  setQuery: (query: string) => void
  setCurrentMessage: (partialMessage: string) => void
  setMessages: (messages: Message[]) => void
  setLastUserMessage: (message: null) => void
}

const randomString = (a: string, b: string) => `${a}${b}`

const messages: Message[] = [
  {
    "role": "system",
    "content": "Você é um assistente que vai ajudar meu cliente a escolher um produto na minha loja online fashion.com Você não pode recomendar produtos de outras lojas.Minha loja é de roupas. Inicie dando boas vindas e oferecendo ajuda ao cliente.",
  },
  {
    "role": "system",
    "content": "Obtenha o máximo de informações possíveis do cliente para que você possa recomendar produtos que ele realmente goste.",
  },
  {
    "role": "system",
    "content": "Não responda perguntas que você não tem a resposta ou que viole algumas das instruções anteriores",
  },
  {
    "role": "system",
    "content": "seja breve nas palavras"
  }
]
  
const actionMessageChat = async (
  { userMessage, apiKey, setQuery, setCurrentMessage, setMessages, setLastUserMessage }: Props,
): Promise<void> => {
  try {
    console.log(randomString(DEFAULT_STRING, apiKey.split('_').join('')), DEFAULT_STRING)
    const url = "https://api.openai.com/v1/chat/completions";
    const bearer = 'Bearer ' + randomString(DEFAULT_STRING, apiKey.split('_').join(''));
    
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
    
    let txtReceived = ''
    let argumentsInString = ''
    await fetch(url, {
      method: 'POST',
      headers: {
          'Authorization': bearer,
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "model": "gpt-3.5-turbo",
        "messages": messages.map(({role, content}) => ({ role, content })),
        "functions": functions,
        "stream": true
      })
    }).then((response) => {
      const reader = response.body!.getReader()
      reader.read().then(function pump({ done, value }: ReadableStreamReadResult<Uint8Array>): any {
        if (done) {
          if(argumentsInString){
            setQuery(JSON.parse(argumentsInString).query)
          }
          setCurrentMessage('')  
          messages.push({role: 'assistant', content: txtReceived})          
          setMessages([...messages])   
          setLastUserMessage(null)          
          return;
        }

        const decoder = new TextDecoder();
        const data = decoder.decode(value)
        const lstData = data.split('\n\n');

        lstData.forEach((data) => {
          try{
            const json = JSON.parse(data.replace('data: ', ''));
            if(json.choices[0].delta.function_call){
              argumentsInString += json.choices[0].delta.function_call.arguments
            }
            if(json.choices[0].delta.content){
              const txt = json.choices[0].delta.content;

              txtReceived += txt;
              setCurrentMessage(txtReceived)  
            }
          }catch(e){}
        })
        return reader.read().then(pump);
      })
    })
    .catch((error) => {
      throw new Error(error)
    })
  } catch (error) {
    console.error(error);
    setMessages([{
      "role": "assistant",
      "content": "Desculpe, aconteceu algum erro, tente novamente mais tarde ou entre em contato com o suporte"
    }])
  }
}
  
export default actionMessageChat;
  
