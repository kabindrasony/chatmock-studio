
import React, { useRef, useEffect } from 'react';
import { Camera, Phone, Info, MoreVertical, Send, Smile, Paperclip, ChevronLeft, Video, Mic, Image as ImageIcon, Plus, ThumbsUp, Check, CheckCheck } from 'lucide-react';
import { Platform, Profile, Message, MessageStatus } from '../types.ts';

interface ChatPreviewProps {
  platform: Platform;
  sender: Profile;
  receiver: Profile;
  messages: Message[];
  containerRef: React.RefObject<HTMLDivElement>;
  isTyping?: boolean;
}

const TypingDots = () => (
  <div className="flex gap-1 py-1 items-center">
    <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
    <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
    <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"></div>
  </div>
);

const ChatPreview: React.FC<ChatPreviewProps> = ({ platform, sender, receiver, messages, containerRef, isTyping = false }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const renderStatusIcon = (status: MessageStatus | undefined) => {
    if (!status) return null;
    
    switch (status) {
      case 'sent':
        return <Check size={12} className="text-slate-400" />;
      case 'delivered':
        return <CheckCheck size={12} className="text-slate-400" />;
      case 'read':
        return <CheckCheck size={12} className="text-blue-500" />;
      default:
        return null;
    }
  };

  // Fix: Implemented renderInput to provide platform-specific chat input UI
  const renderInput = () => {
    switch (platform) {
      case 'Tinder':
        return (
          <div className="p-4 border-t bg-white flex items-center gap-3">
            <div className="flex-1 bg-slate-100 rounded-full px-4 py-2 text-sm text-slate-400">
              Type a message...
            </div>
            <button className="text-slate-300 font-bold text-sm uppercase">Send</button>
          </div>
        );
      case 'WhatsApp':
        return (
          <div className="p-2 bg-[#f0f2f5] flex items-center gap-2">
            <div className="flex items-center gap-4 text-slate-500 px-1">
              <Smile size={24} />
              <Paperclip size={22} className="-rotate-45" />
            </div>
            <div className="flex-1 bg-white rounded-lg px-3 py-2 text-[15px] text-slate-400 shadow-sm">
              Type a message
            </div>
            <div className="w-11 h-11 bg-[#00a884] rounded-full flex items-center justify-center text-white">
              <Mic size={20} fill="currentColor" />
            </div>
          </div>
        );
      case 'iMessage':
        return (
          <div className="px-2 py-3 bg-white flex items-center gap-2 border-t">
            <div className="flex items-center gap-3 text-slate-400 px-1">
              <Camera size={24} />
              <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                <Plus size={16} />
              </div>
            </div>
            <div className="flex-1 bg-white border border-slate-200 rounded-full px-4 py-1.5 text-[15px] text-slate-400 flex justify-between items-center">
              iMessage
              <Mic size={18} className="text-slate-300" />
            </div>
          </div>
        );
      case 'Instagram':
        return (
          <div className="p-3 bg-white flex items-center gap-3 border-t">
            <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center text-white">
              <Camera size={20} fill="currentColor" />
            </div>
            <div className="flex-1 border border-slate-200 rounded-full px-4 py-2 text-[14px] text-slate-400 flex items-center justify-between">
              Message...
              <div className="flex items-center gap-3 text-slate-800">
                <Mic size={20} />
                <ImageIcon size={20} />
                <Plus size={20} className="border border-slate-800 rounded-sm p-0.5" />
              </div>
            </div>
          </div>
        );
      case 'Messenger':
        return (
          <div className="p-2 bg-white flex items-center gap-3 border-t">
            <div className="flex items-center gap-3 text-blue-500">
              <Plus size={22} className="bg-blue-500 text-white rounded-full" />
              <Camera size={24} fill="currentColor" />
              <ImageIcon size={24} fill="currentColor" />
              <Mic size={24} fill="currentColor" />
            </div>
            <div className="flex-1 bg-slate-100 rounded-full px-4 py-1.5 text-[15px] text-slate-500">
              Aa
            </div>
            <ThumbsUp size={24} fill="currentColor" className="text-blue-500" />
          </div>
        );
      default:
        return null;
    }
  };

  const renderHeader = () => {
    switch (platform) {
      case 'Tinder':
        return (
          <div className="bg-white px-4 py-3 border-b flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 shrink-0">
              {receiver.avatar && <img src={receiver.avatar} className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-800 leading-tight">{receiver.name}</h3>
              <p className="text-[11px] text-slate-400 uppercase tracking-tight">Matched on Tinder</p>
            </div>
            <button className="text-slate-300"><Info size={20} /></button>
          </div>
        );
      case 'WhatsApp':
        return (
          <div className="bg-[#075e54] text-white px-3 py-2 flex items-center gap-2">
            <ChevronLeft size={20} />
            <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-300">
              {receiver.avatar && <img src={receiver.avatar} className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium">{receiver.name}</h3>
              <p className="text-[10px] opacity-80">
                {isTyping ? 'typing...' : (receiver.subtext || 'online')}
              </p>
            </div>
            <div className="flex items-center gap-4 px-2">
              <Phone size={16} fill="white" />
              <Camera size={18} fill="white" />
              <MoreVertical size={18} />
            </div>
          </div>
        );
      case 'iMessage':
        return (
          <div className="bg-slate-50 border-b p-3 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-300 mb-1 border-2 border-white shadow-sm">
              {receiver.avatar && <img src={receiver.avatar} className="w-full h-full object-cover" />}
            </div>
            <h3 className="text-xs font-semibold flex items-center gap-1">
              {receiver.name} <span className="w-1.5 h-1.5 bg-blue-500 rounded-full inline-block"></span>
            </h3>
            <span className="text-[9px] text-slate-400 font-medium">iMessage</span>
          </div>
        );
      case 'Instagram':
        return (
          <div className="bg-white px-4 py-3 border-b flex items-center gap-3">
            <ChevronLeft size={24} className="text-slate-800" />
            <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 shrink-0">
              {receiver.avatar && <img src={receiver.avatar} className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-sm text-slate-800 leading-tight">{receiver.name}</h3>
              <p className="text-[11px] text-slate-400">Instagram</p>
            </div>
            <div className="flex items-center gap-4">
              <Phone size={20} className="text-slate-800" />
              <Video size={22} className="text-slate-800" />
            </div>
          </div>
        );
      case 'Messenger':
        return (
          <div className="bg-white px-3 py-2 border-b flex items-center gap-2 shadow-sm">
            <ChevronLeft size={24} className="text-blue-500" />
            <div className="relative">
              <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-200">
                {receiver.avatar && <img src={receiver.avatar} className="w-full h-full object-cover" />}
              </div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex-1 ml-1">
              <h3 className="text-[15px] font-bold text-slate-900 leading-tight">{receiver.name}</h3>
              <p className="text-[11px] text-slate-500">{isTyping ? 'Typing...' : (receiver.subtext || 'Active now')}</p>
            </div>
            <div className="flex items-center gap-4 text-blue-500">
              <Phone size={20} fill="currentColor" />
              <Video size={22} fill="currentColor" />
              <Info size={20} fill="currentColor" />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderTypingIndicator = () => {
    if (!isTyping) return null;

    switch (platform) {
      case 'Tinder':
        return (
          <div className="flex items-start mb-4">
            <div className="bg-slate-100 text-slate-400 rounded-2xl rounded-tl-none px-4 py-2 text-sm shadow-sm">
              <TypingDots />
            </div>
          </div>
        );
      case 'iMessage':
        return (
          <div className="flex flex-col items-start mb-2">
            <div className="bg-[#E9E9EB] text-slate-500 rounded-[20px] rounded-bl-sm px-4 py-2 text-[15px] shadow-sm">
              <TypingDots />
            </div>
          </div>
        );
      case 'Instagram':
        return (
          <div className="flex mb-2 items-start">
            <div className="w-7 h-7 rounded-full overflow-hidden bg-slate-200 mt-auto mr-2 shrink-0">
              {receiver.avatar && <img src={receiver.avatar} className="w-full h-full object-cover" />}
            </div>
            <div className="bg-slate-100 text-slate-400 rounded-[22px] px-4 py-1.5 border border-slate-200">
              <TypingDots />
            </div>
          </div>
        );
      case 'Messenger':
        return (
          <div className="flex mb-1.5 items-start">
            <div className="w-7 h-7 rounded-full overflow-hidden bg-slate-200 mt-auto mr-2 shrink-0">
              {receiver.avatar && <img src={receiver.avatar} className="w-full h-full object-cover" />}
            </div>
            <div className="bg-[#E4E6EB] text-slate-400 rounded-[18px] px-3 py-1.5">
              <TypingDots />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderMessage = (msg: Message, index: number) => {
    const isSender = msg.sender === 'sender';
    const isLast = index === messages.length - 1;
    
    switch (platform) {
      case 'Tinder':
        return (
          <div key={msg.id} className={`flex flex-col mb-4 ${isSender ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
              isSender 
                ? 'bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53] text-white rounded-tr-none' 
                : 'bg-slate-100 text-slate-800 rounded-tl-none'
            }`}>
              {msg.text}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 uppercase font-semibold">{msg.timestamp}</span>
          </div>
        );
      case 'WhatsApp':
        return (
          <div key={msg.id} className={`flex mb-2 ${isSender ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-lg px-2 py-1 text-[13px] shadow-sm relative ${
              isSender ? 'bg-[#dcf8c6]' : 'bg-white'
            }`}>
              {msg.text}
              <div className="text-[9px] text-slate-400 text-right mt-1 ml-4 inline-flex items-center gap-1">
                {msg.timestamp} {isSender && renderStatusIcon(msg.status)}
              </div>
            </div>
          </div>
        );
      case 'iMessage':
        return (
          <div key={msg.id} className={`flex flex-col mb-2 ${isSender ? 'items-end' : 'items-start'}`}>
             <div className={`max-w-[70%] rounded-[20px] px-4 py-2 text-[15px] leading-tight ${
              isSender 
                ? 'bg-[#007AFF] text-white rounded-br-sm' 
                : 'bg-[#E9E9EB] text-black rounded-bl-sm'
            }`}>
              {msg.text}
            </div>
            {isSender && msg.status && (
              <span className="text-[10px] text-slate-400 mt-1 px-1 text-right font-medium">
                {msg.status === 'read' ? 'Read' : 'Delivered'}
              </span>
            )}
          </div>
        );
      case 'Instagram':
        return (
          <div key={msg.id} className={`flex flex-col ${isSender ? 'items-end' : 'items-start'}`}>
            <div className={`flex mb-2 ${isSender ? 'justify-end' : 'justify-start'}`}>
              {!isSender && (
                <div className="w-7 h-7 rounded-full overflow-hidden bg-slate-200 mt-auto mr-2 shrink-0">
                  {receiver.avatar && <img src={receiver.avatar} className="w-full h-full object-cover" />}
                </div>
              )}
              <div className={`max-w-[75%] rounded-[22px] px-4 py-2.5 text-[14px] leading-snug ${
                isSender 
                  ? 'bg-gradient-to-tr from-[#6366f1] via-[#a855f7] to-[#ec4899] text-white' 
                  : 'bg-slate-100 text-slate-900 border border-slate-200'
              }`}>
                {msg.text}
              </div>
            </div>
            {isSender && isLast && msg.status === 'read' && (
              <span className="text-[10px] text-slate-400 mb-2 mr-2">Seen</span>
            )}
          </div>
        );
      case 'Messenger':
        return (
          <div key={msg.id} className={`flex flex-col ${isSender ? 'items-end' : 'items-start'}`}>
            <div className={`flex mb-1.5 ${isSender ? 'justify-end' : 'justify-start'}`}>
              {!isSender && (
                <div className="w-7 h-7 rounded-full overflow-hidden bg-slate-200 mt-auto mr-2 shrink-0">
                  {receiver.avatar && <img src={receiver.avatar} className="w-full h-full object-cover" />}
                </div>
              )}
              <div className={`max-w-[75%] rounded-[18px] px-3.5 py-2 text-[15px] leading-tight ${
                isSender 
                  ? 'bg-[#0084FF] text-white' 
                  : 'bg-[#E4E6EB] text-slate-900'
              }`}>
                {msg.text}
              </div>
            </div>
            {isSender && isLast && (
              <div className="mb-2 mr-1">
                {msg.status === 'read' ? (
                  <div className="w-3 h-3 rounded-full overflow-hidden bg-slate-200">
                    {receiver.avatar && <img src={receiver.avatar} className="w-full h-full object-cover opacity-80" />}
                  </div>
                ) : msg.status === 'delivered' ? (
                  <div className="w-3.5 h-3.5 rounded-full bg-blue-500 flex items-center justify-center">
                    <Check size={8} className="text-white" />
                  </div>
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border border-slate-300 flex items-center justify-center">
                    <Check size={8} className="text-slate-300" />
                  </div>
                )}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const getBackground = () => {
    if (platform === 'WhatsApp') return 'bg-[#e5ddd5]';
    return 'bg-white';
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full max-w-[375px] aspect-[9/19] bg-black rounded-[48px] p-3 shadow-2xl overflow-hidden border-8 border-slate-900 mx-auto"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-slate-900 rounded-b-3xl z-20"></div>
      
      <div className={`h-full w-full rounded-[38px] overflow-hidden flex flex-col relative ${getBackground()}`}>
        {renderHeader()}
        
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-30">
              <div className="w-24 h-24 rounded-full border-4 border-dashed border-slate-400 mb-4"></div>
              <p className="text-sm font-medium">Start typing below...</p>
            </div>
          ) : (
            <>
              {messages.map((m, i) => renderMessage(m, i))}
              {renderTypingIndicator()}
            </>
          )}
        </div>

        {renderInput()}
      </div>
    </div>
  );
};

export default ChatPreview;
