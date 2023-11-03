import { useSignal } from "@preact/signals";
import Modal from "$store/components/ui/Modal.tsx";
import actionMessageChat from "$store/actions/MessageChat.ts";
import { AssistentChatProps } from "./index.tsx";
import { useState, useEffect } from "preact/hooks";
import Spinner from "deco-sites/truedevs/components/ui/Spinner.tsx";
import { Suggestion } from "apps/commerce/types.ts";
import { useSuggestions } from "$store/sdk/useSuggestions.ts";
import { Resolved } from "deco/engine/core/resolver.ts";
import { sendEvent } from "$store/sdk/analytics.tsx";
import Icon from "deco-sites/truedevs/components/ui/Icon.tsx";

export interface Message {
  role: string
  content: string
  isPrompt?: boolean
}

export interface ModalChatProps {
  open: boolean
  apiKey: string
  loader: Resolved<Suggestion | null>;
}

function ModalChat({ open, apiKey, loader }: ModalChatProps) {
  const valueInput = useSignal('')
  const isLoading = useSignal(false)
  const [messages, setMessages] = useState<Message[]>([])
  
  const { setQuery, payload, loading } = useSuggestions(loader);
  const { products = [], searches = [] } = payload.value ?? {};
  const hasProducts = Boolean(products.length); {/* PRODUTOS ACHADOS */}
  const hasTerms = Boolean(searches.length); {/* TERMOS SEMELHANTES */}
  {/* FUNÇÃO QUE EXECUTA O INTELLISENSE SEARCH */}
  {/* if (value) {
    sendEvent({
      name: "search",
      params: { search_term: value },
    });
  }
  
  setQuery(value); */}

  async function handleSendMessage() {
    isLoading.value = true
    const response = await actionMessageChat({ userMessage: valueInput.value , apiKey: apiKey })
    setMessages([...response])
    valueInput.value = ''
    isLoading.value = false
  }

  useEffect(() => {
    console.log(messages)
  }, [messages])

  return (
    <Modal
      onClose={() => {open = false}}
      open={open}
      class="justify-end items-end"
    >
      <div class="flex flex-col w-full sm:w-[400px] h-full sm:h-[460px] fixed md:bottom-[1rem] md:right-[1rem] z-[99] m-4 overflow-hidden rounded-2xl bg-[#f2f2f2]">
        <div class="bg-[#f2f2f2]">
          {messages?.filter(message => !message.isPrompt).map((message) => (
            <li>{message.role}: {message.content}</li>
          ))}
        </div>
        <div class="flex w-full">
          <input 
            type="text"
            value={valueInput.value}
            onChange={({target}) => {valueInput.value = target!.value}}
            class="border bg-white text-[#181812] flex-shrink-[1] w-full"
            placeholder="Digite sua pergunta..."
          />
          <button
            class="bg-[#00008B] text-white font-bold py-4 px-6 flex-shrink-[2] w-full" 
            onClick={handleSendMessage}
          >
            { isLoading.value === true ? <Spinner size={30} /> : 'Enviar'}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default function Chat({ textInitial, apiKey, schemaMessage, engineSuggestion }: AssistentChatProps) {
  const openModal = useSignal(false)

  return (
    <>
      <button
        class="bg-[#00008B] text-white border-none rounded-full p-4"
        onClick={() => openModal.value = true}
      >
        <Icon id="Message" size={40} />
      </button>
      <ModalChat
        apiKey={apiKey}
        open={openModal.value}
        { ...engineSuggestion }
      />
    </>
  )
}