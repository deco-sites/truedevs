import { useSignal } from "@preact/signals";
import Modal from "$store/components/ui/Modal.tsx";
import actionMessageChat from "$store/actions/MessageChat.ts";
import { useState, useEffect } from "preact/hooks";
import Spinner from "deco-sites/truedevs/components/ui/Spinner.tsx";
import { Suggestion } from "apps/commerce/types.ts";
import { useSuggestions } from "$store/sdk/useSuggestions.ts";
import { Resolved } from "deco/engine/core/resolver.ts";
import Icon from "deco-sites/truedevs/components/ui/Icon.tsx";
import { asset } from "$fresh/runtime.ts";
import Slider from "$store/components/ui/Slider.tsx";
import type { Product } from "apps/commerce/types.ts";
import ProductCard, {
  Layout as cardLayout,
} from "$store/components/product/ProductCard.tsx";

export interface Message {
  role: string
  content: string
  isPrompt?: boolean
}

export interface ChatProps {
  apiKey: string
  /**
   * @title Suggestions Integration
   */
  loader?: Resolved<Suggestion | null>;
}

interface ModalChatProps extends ChatProps {
  open: boolean
}

function CarouselProducts(products: Product[]) {
  return (
    <Slider class="carousel">
      {products.map((product, index: number) => (
        <Slider.Item
          index={index}
          class="carousel-item first:ml-4 last:mr-4 min-w-[200px] max-w-[200px]"
        >
          <ProductCard
            product={product}
            index={index}
          />
        </Slider.Item>
      ))}
    </Slider>
  )
}

function ModalChat({ open, apiKey, loader }: ModalChatProps) {
  const valueInput = useSignal('')
  const query = useSignal('')
  const isLoading = useSignal(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [lastUserMessage, setLastUserMessage] = useState<string | null>(null)
  const [currentMessage, setCurrentMessage] = useState<string>('')
  
  const { setQuery, payload, loading } = useSuggestions(loader);
  const { products = [], searches = [] } = payload.value ?? {};
  const hasProducts = Boolean(products.length); {/* PRODUTOS ACHADOS */}
  const hasTerms = Boolean(searches.length); {/* TERMOS SEMELHANTES */}
  {/* FUNÇÃO QUE EXECUTA O INTELLISENSE SEARCH */}
  // if (query.value) {
  //   sendEvent({
  //     name: "search",
  //     params: { search_term: value },
  //   });
  // }
  
  // setQuery(value); 

  async function handleSendMessage() {
    setLastUserMessage(valueInput.value)
    isLoading.value = true
    await actionMessageChat({ userMessage: valueInput.value , apiKey: apiKey, setQuery, setCurrentMessage: setCurrentMessage, setMessages })
    valueInput.value = ''
    isLoading.value = false
  }

  useEffect(() => {
    if(query.value) {
      setQuery(query.value)
    }
  }, [query.value])

  useEffect(() => {console.log(currentMessage)}, [currentMessage])
  useEffect(() => {console.log(messages)}, [messages])

  return (
    <Modal
      onClose={() => {open = false}}
      open={open}
      class="justify-end items-end"
    >
      <div class="flex flex-col w-full sm:w-[400px] h-full sm:h-[460px] fixed md:bottom-[1rem] md:right-[1rem] z-[99] m-4 overflow-hidden rounded-2xl bg-[#f2f2f2]">
        <div class="bg-[#f2f2f2]">
          { lastUserMessage && <li class="list-none">{lastUserMessage}</li>}
          { currentMessage && <li class="list-none">truedevbot: {currentMessage}</li>}
          { messages?.filter(message => message.role === 'assistent' && message.role === 'user').map((message) => (
            <li class="list-none">{!!message.content ? `${message.role}: ${message.content}` : products?.length > 0 ? CarouselProducts(products) : ''}</li>
          ))}
        </div>
        <div class="flex w-full">
          <input 
            type="text"
            value={valueInput.value}
            onChange={({currentTarget}) => {valueInput.value = currentTarget!.value}}
            class="border bg-white text-[#181812] flex-shrink-[1] w-full pl-2 outline-none"
            placeholder="Digite sua pergunta..."
          />
          <button
            class="bg-[#00008B] text-white font-bold py-4 px-6 flex-shrink-[2] w-full" 
            onClick={handleSendMessage}
          >
            { isLoading.value === true ? <Spinner size={20} /> : 'Enviar'}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default function Chat({ apiKey, loader }: ChatProps) {
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
        loader={loader}
      />
    </>
  )
}
