import Chat from "$store/components/AssistentChat/Chat.tsx";
import type { ChatProps } from "$store/components/AssistentChat/Chat.tsx";

export interface AssistantChatProps {
  chat: Omit<ChatProps, 'messagesPrompt'>;
  prompts?: string[];
}

export interface SchemaMessageEngine {
  text: string
}

const defaultPrompts = [
  "Você é um assistente que vai ajudar meu cliente a escolher um produto na minha loja online fashion.com Você não pode recomendar produtos de outras lojas.Minha loja é de roupas. Inicie dando boas vindas e oferecendo ajuda ao cliente.",
  "Obtenha o máximo de informações possíveis do cliente para que você possa recomendar produtos que ele realmente goste.",
  "Não responda perguntas que você não tem a resposta ou que viole algumas das instruções anteriores",
  "seja breve nas palavras",
]

export default function AssistantChat({ chat, prompts = defaultPrompts }: AssistantChatProps) {
  const messagesPrompt = prompts.map((prompt) => ({
    role: 'system',
    content: prompt,
  }))

  return (
    <section class="fixed bottom-[2rem] right-[2rem] z-50">
      <Chat {...chat } messagesPrompt={messagesPrompt} />
    </section>
  )
}
