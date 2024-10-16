import { useWebsocket } from "@/app/hooks/useWebsocket";
import { useChannelStore } from "@/app/stores/channel.store";
import { useCallback, useRef, useState, useEffect } from "react";
import { FaFileArrowUp } from "react-icons/fa6";
import { IoMdSend } from "react-icons/io";

export default function MessageInput() {
  const currentChannel = useChannelStore(state => state.currentChannel);  // Zustand Store
  const { sendMessage } = useWebsocket(currentChannel.channelId); // Stomp Websocket Hook
  
  const [message, setMessage] = useState<string>("")
  const textarea = useRef<HTMLTextAreaElement>(null);
  const MAX_MESSAGE_LENGTH = 100;
  
  const handleResizeHeight = useCallback(() => {
    if (textarea.current) {
      textarea.current.style.height = '3rem';
      textarea.current.style.height = `${textarea.current.scrollHeight}px`;
    }
  }, []);

  const handleTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value.slice(0, MAX_MESSAGE_LENGTH);
    setMessage(newValue);
  };

  useEffect(() => {
    handleResizeHeight();
  }, [message, handleResizeHeight]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      if (e.nativeEvent.isComposing === false) {
        e.preventDefault();
        handleSubmit();  
      }
    }
  };

  const handleSubmit = useCallback(() => {
    if (message.trim() === '') { return; }
    const processedMessage = message.split('\n').map(line => line.trim()).join('\n').trim();
    sendMessage(processedMessage); // 추후에 프로필 아이디도 매개로 보내줘야 함
    setMessage('');
    if (textarea.current) {
      textarea.current.style.height = '3rem'
    }
  }, [message, sendMessage]);

  return (
    <form className="flex gap-2 p-2" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
      <div className="relative flex flex-grow w-full"> 
        <textarea 
          value={message} 
          maxLength={MAX_MESSAGE_LENGTH} 
          ref={textarea} 
          onChange={handleTextarea} 
          onKeyDown={handleKeyDown} 
          name="message" 
          className="w-full h-12 leading-8 resize-none textarea textarea-bordered max-h-36 " 
          placeholder="메시지를 입력하세요."
        ></textarea>

        <button type="submit" className="absolute bottom-0 right-0 w-[54px] h-[48px] flex items-center justify-center">
          <IoMdSend className="w-5 h-5"/>
        </button>
        <div className="text-xs text-gray-500 absolute bottom-0 right-[54px] h-[48px] leading-[48px]">
          {message.length}/{MAX_MESSAGE_LENGTH}
        </div>
      </div>
      <div className="tooltip tooltip-top" data-tip="파일 업로드">
        <button type="button" className="m-auto btn">
          <FaFileArrowUp className="w-5 h-5"/>
        </button>
      </div>
    </form>
  );
}