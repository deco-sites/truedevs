import Chat from "./Chat";

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
    <section class="fixed w-[100vw] h-[100vh] bottom-[2rem] right-[2rem]">
      <Chat {...{ textInitial, apiKey, schemaMessage }} />
    </section>
  )
}