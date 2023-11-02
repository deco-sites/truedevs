import Chat from "$store/components/AssistentChat/Chat.tsx";

export interface AssistentChatProps {
  textInitial: string;
  apiKey: string;
  schemaMessage: SchemaMessageEngine[]
}

export interface SchemaMessageEngine {
  text: string
}

export default function AssistentChat({ textInitial, apiKey, schemaMessage }: AssistentChatProps) {
  return (
    <section class="fixed bottom-[2rem] right-[2rem]">
      <Chat {...{ textInitial, apiKey, schemaMessage }} />
    </section>
  )
}