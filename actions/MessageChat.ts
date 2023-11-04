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
  { userMessage, apiKey }: Props,
): Promise<void> => {
  console.log('actionMessageChat', { userMessage, apiKey });
  const result = await invoke["deco-sites/truedevs"].loaders.MessageChat({ stream:true, userMessage, apiKey })
  console.log('result', result);
  if (isEventStreamResponse(result)) {
    console.log(result);
    // for await (onmessage of result) {
    //   console.log(onmessage);
    // }
  }
}
  
export default actionMessageChat;
  
