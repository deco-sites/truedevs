import { useSignal } from "@preact/signals";
import Modal from "$store/components/ui/Modal.tsx";
import actionMessageChat from "$store/actions/MessageChat.ts";
import { AssistentChatProps } from "./index.tsx";

function ModalChat({ open, apiKey }: { open: boolean; apiKey: string }) {
  const valueInput = useSignal('')
  return (
    <Modal
      onClose={() => {open = false}}
      open={open}
      class="justify-end items-end"
    >
      <div class="flex flex-col w-full sm:w-[400px] h-full sm:h-[460px] fixed md:bottom-[1rem] md:right-[1rem] z-[99] m-4">
        <div class="bg-[#f2f2f2]">

        </div>
        <div class="flex w-full">
          <input 
            type="text"
            value={valueInput.value}
            onChange={({target}) => {valueInput.value = target.value}}
            class="border bg-white text-[#181812] flex-shrink-[1] w-full"
            placeholder="Digite sua pergunta..."
          />
          <button
            class="bg-[#00008B] text-white font-bold py-4 px-6 flex-shrink-[2] w-full" 
            onClick={() => actionMessageChat({ text: valueInput.value, apiKey: apiKey })}
          >
            Enviar
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default function Chat({ textInitial, apiKey, schemaMessage }: AssistentChatProps) {
  const openModal = useSignal(false)
  console.log(textInitial, schemaMessage)
  return (
    <>
      <button onClick={() => openModal.value = true}>
        {/* <Icon /> */}
        CHAT
      </button>
      <ModalChat
        apiKey={apiKey}
        open={openModal.value}
      />
    </>
  )
}