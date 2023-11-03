import Chat from "$store/components/AssistentChat/Chat.tsx";
import type { Props as SearchbarProps } from "$store/components/search/Searchbar.tsx";

export interface AssistentChatProps {
  textInitial: string;
  apiKey: string;
  schemaMessage: SchemaMessageEngine[]
  engineSuggestion: SearchbarProps;
}

export interface SchemaMessageEngine {
  text: string
}

export default function AssistentChat({ textInitial, apiKey, schemaMessage, engineSuggestion }: AssistentChatProps) {
  return (
    <section class="fixed bottom-[2rem] right-[2rem] z-50">
      <Chat {...{ textInitial, apiKey, schemaMessage, engineSuggestion }} />
    </section>
  )
}