import { useSignal } from "@preact/signals";
import Modal from "../ui/Modal";
import actionMessageChat from "../../actions/MessageChat";
import { AssistentChatProps } from ".";

export function ModalChat({ open, apiKey }) {
  const valueInput = useSignal('')
  return (
    <Modal
      onClose={() => open = false}
      open={open}
    >
      <div class="flex flex-col w-full sm:w-[400px] h-full sm:h-[460px]">
        <div class="bg-[#f2f2f2]">

        </div>
        <div class="flex w-full">
          <input 
            type="text"
            value={valueInput.value}
            onChange={({target}) => valueInput.value = target.value}
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