import { Message } from "$store/components/AssistentChat/Chat.tsx";

export interface Props {
  userMessage: string
  apiKey: string
  setQuery: (query: string) => void
  setCurrentMessage: (partialMessage: string) => void
  setMessages: (messages: Message[]) => void
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
  { userMessage, apiKey, setQuery, setCurrentMessage, setMessages }: Props,
): Promise<Message[] | null> => {
  try {
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
    
    let txtReceived = ''
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
      const reader = response.body.getReader();
      // read() returns a promise that resolves when a value has been received
      reader.read().then(function pump({ done, value }) {
        if (done) {
          // Do something with last chunk of data then exit reader
          setCurrentMessage('')  
          messages.push({role: 'assistent', content: txtReceived})
          setMessages([...messages])        
          return;
        }
        // Otherwise do something here to process current chunk
        const decoder = new TextDecoder();
        const data = decoder.decode(value)
        const lstData = data.split('\n\n');
  
        lstData.forEach((data) => {
          try{
            const json = JSON.parse(data.replace('data: ', ''));
            if(json['choices'][0]['delta']['content']){
              const txt = json['choices'][0]['delta']['content'];
              txtReceived += txt;
              setCurrentMessage(txtReceived)  
            }
          }catch(e){}
        })
        // Read some more, and call this function again
        return reader.read().then(pump);
      });
    })
    .catch((err) => console.error(err));

  
    // const completionJson = await completion.json()    
    // const choice = completionJson.choices[0]

    // if (choice.finish_reason === 'function_call') {
    //   const functionArgs = JSON.parse(choice.message.function_call.arguments);
    //   setQuery(functionArgs.query)
    // }
  
    // const newMessage: Message = completionJson.choices[0].message
  } catch (error) {
    console.log(error)
    return null
  }
}
  
export default actionMessageChat;
  