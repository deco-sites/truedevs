import { useSignal } from "@preact/signals";
import Modal from "$store/components/ui/Modal.tsx";
import actionMessageChat from "$store/actions/MessageChat.ts";
import { useState, useEffect } from "preact/hooks";
import Spinner from "deco-sites/truedevs/components/ui/Spinner.tsx";
import { Suggestion } from "apps/commerce/types.ts";
import { useSuggestions } from "$store/sdk/useSuggestions.ts";
import { Resolved } from "deco/engine/core/resolver.ts";
import Icon from "deco-sites/truedevs/components/ui/Icon.tsx";
import Slider from "$store/components/ui/Slider.tsx";
import type { Product } from "apps/commerce/types.ts";
import ProductCardSuggestion from "$store/components/product/ProductCardSuggestion.tsx";

export interface Message {
  role: string
  content: string
}

export interface ChatProps {
  apiKey: string
  /**
   * @title Suggestions Integration
   */
  loader: Resolved<Suggestion | null>;
  messagesPrompt: Message[]
}

interface ModalChatProps extends ChatProps {
  open: boolean
}

function carouselProducts(products: Product[]) {
  return (
    <Slider class="carousel">
      {products.map((product, index: number) => (
        <Slider.Item
          index={index}
          class="carousel-item first:ml-4 last:mr-4 min-w-[150px] max-w-[150px]"
        >
          <ProductCardSuggestion
            product={product}
            index={index}
          />
        </Slider.Item>
      ))}
    </Slider>
  )
}

function ModalChat({ open, apiKey = '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', loader, messagesPrompt }: ModalChatProps) {
  const valueInput = useSignal('')
  const query = useSignal('')
  const isLoading = useSignal(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [lastUserMessage, setLastUserMessage] = useState<string | null>(null)
  const [currentMessage, setCurrentMessage] = useState<string>('')
  
  const { setQuery, payload, loading } = useSuggestions(loader);
  const { products = [], searches = [] } = payload.value ?? {};

  async function handleSendMessage() {
    const currentlastUserMessage = valueInput.value
    setLastUserMessage(currentlastUserMessage)
    isLoading.value = true
    valueInput.value = ''
    isLoading.value = false
    await actionMessageChat({ 
      userMessage: currentlastUserMessage, 
      apiKey: apiKey,
       setQuery,
       setCurrentMessage,
       setMessages,
       setLastUserMessage,
    })
  }

  useEffect(() => {console.log(products)},[products])

  return (
    <Modal
      onClose={() => {open = false}}
      open={open}
      class="justify-end items-end"
    >
      <div class="flex flex-col w-full sm:w-[400px] h-full sm:h-[460px] fixed sm:bottom-[1rem] sm:right-[1rem] z-[99] m-4 overflow-hidden rounded-xl bg-[#f2f2f2]">
        <div class="flex flex-col bg-[#f2f2f2] modalChat sm:min-h-[404px] sm:max-h-[404px] overflow-y-auto p-4 pb-0">
          { messages?.filter(({ role }) => role === 'assistant' || role === 'user').map(({role, content}) => role === 'user' ? (
            <div class="flex w-full justify-end pl-2">
              <li class="list-none">
                <span class="flex items-start">
                  <Icon class="mr-2" id="Message" width={40} height={25} strokeWidth={30} />
                  <span>
                    {content}
                  </span>
                </span>
              </li>
            </div>
          ) : (
            <div class="flex w-full justify-start pr-2">
              <li class="list-none">
                { content ? (
                  <span class="flex">
                    <span class="w-10">
                      <Icon class="mr-2" id="MessageIcon" width={40} height={25} strokeWidth={30} />
                    </span>
                    <span>
                      {content}
                    </span>
                  </span>
                  ) : products?.length > 0 ? (
                    <>
                      <span class="flex">
                        <span class="w-10">
                          <Icon class="mr-2" id="MessageIcon" width={40} height={25} strokeWidth={30} />
                        </span>
                        <span>
                          Encontrei estes produtos para você
                        </span>
                      </span>
                    <>{ carouselProducts(products) }</>
                    </>
                  ) : ""
                }
              </li>
            </div>
          ))}
          { lastUserMessage && (
            <div class="flex w-full justify-end pl-2">
              <li class="list-none">
                <span class="flex items-start">
                    <Icon class="mr-2" id="Message" width={40} height={25} strokeWidth={30} />
                    <span>
                      {lastUserMessage}
                    </span>
                  </span>                
              </li>
            </div>
          )}
          { currentMessage && (
            <div class="flex w-full justify-start pr-2">
              <li class="list-none">
                <span class="flex">
                  <span class="w-10">
                    <Icon class="mr-2" id="MessageIcon" width={40} height={25} strokeWidth={30} />
                  </span>
                  <span>
                    {currentMessage}
                  </span>
                </span>
              </li>
            </div>
          )}
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

export default function Chat(props: ChatProps) {
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
        {...props}
        open={openModal.value}
      />
    </>
  )
}
