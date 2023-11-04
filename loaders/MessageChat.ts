import { Message } from "$store/components/AssistentChat/Chat.tsx";
import { StreamProps } from "deco/utils/invoke.ts";

export interface Props extends StreamProps {
  userMessage: string
  apiKey: string
}

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

const url = "https://api.openai.com/v1/chat/completions";

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
  
async function* loader<T>(
  { userMessage, apiKey }: Props,
): AsyncIterableIterator<T> {
  const bearer = 'Bearer ' + apiKey;  
  messages.push({
    "role": "user",
    "content": userMessage,
  })
  
  
  let argumentsInString = ''
  let txtReceived = ''
  const response = await fetch(url, {
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
  })

  const reader = response.body!
    .pipeThrough(new TextDecoderStream())
    .getReader() 

  while(true){   
    let acc = ''
    const { value, done } = await reader.read()

    if(done){
      // if(argumentsInString){
      //   setQuery(JSON.parse(argumentsInString).query)
      // }
      // setCurrentMessage('')  
      // messages.push({role: 'assistant', content: txtReceived})          
      // setMessages([...messages])   
      // setLastUserMessage(null)          
      // return;
      console.log('done');
      break;
    }

    // const decoder = new TextDecoder();
    // const data = decoder.decode(value)
    const lstData = value.split('\n\n');
    for(const data of lstData){
      try {
        // const json = JSON.parse(data.replace('data: ', ''));
        // console.log(json);
        // if(json.choices[0].delta.function_call){
        //   argumentsInString += json.choices[0].delta.function_call.arguments
        // }
        acc += data
        console.log(acc);
        yield JSON.parse(acc)
      } catch (error) {
        continue;
      }
    }
  }

  console.log('fim');
  return;
}
  
export default loader;
  
