import { Message } from "$store/components/AssistentChat/Chat.tsx";
import { invoke } from "../runtime.ts";
import { isEventStreamResponse } from "deco/utils/invoke.ts";

export interface Props {
  userMessage: string
  apiKey: string
  setQuery: (query: string) => void
  setCurrentMessage: (partialMessage: string) => void
  setMessages: (messages: Message[]) => void
  setLastUserMessage: (message: null) => void
}

  
const actionMessageChat = async (
  { userMessage }: Props,
): Promise<void> => {
  console.log('actionMessageChat', { userMessage });
  try {
    const result = await invoke.apps['assistant-ai'].loaders.MessageChat({ stream:true, userMessage })
    console.log('result', result);
    if (isEventStreamResponse(result)) {
      console.log(result);
      // for await (onmessage of result) {
      //   console.log(onmessage);
      // }
    }
  } catch (error) { console.log(error) }
}
  
export default actionMessageChat;
  
