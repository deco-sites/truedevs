import Chat from "$store/components/AssistentChat/Chat.tsx";
import type { ChatProps } from "$store/components/AssistentChat/Chat.tsx";

export interface AssistentChatProps {
  chat?: ChatProps;
}

export interface SchemaMessageEngine {
  text: string
}

export default function AssistentChat({ chat }: AssistentChatProps) {
  return (
    <section class="fixed bottom-[2rem] right-[2rem] z-50">
      <Chat {...chat } />
    </section>
  )
}