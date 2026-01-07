
import React, { useState, useEffect, useRef } from 'react';
import { 
  Download, 
  Video, 
  Wand2, 
  Trash2, 
  Smartphone, 
  HelpCircle,
  Hash,
  MessageSquare,
  Heart,
  Check,
  CheckCheck
} from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import { Profile, Platform, Message, MessageStatus } from './types.ts';
import ProfileEditor from './components/ProfileEditor.tsx';
import ChatPreview from './components/ChatPreview.tsx';
import { generateChatScript } from './services/gemini.ts';

const INITIAL_SENDER: Profile = {
  name: 'Alex',
  avatar: 'https://picsum.photos/seed/alex/200',
};

const INITIAL_RECEIVER: Profile = {
  name: 'Jordan',
  avatar: 'https://picsum.photos/seed/jordan/200',
  subtext: 'Online',
};

const INITIAL_SCRIPT = `> Yo! How's your day going?
< Pretty good, just built a chat maker app.
> No way, that's sick!
< Yeah, check it out!`;

const App: React.FC = () => {
  const [sender, setSender] = useState<Profile>(INITIAL_SENDER);
  const [receiver, setReceiver] = useState<Profile>(INITIAL_RECEIVER);
  const [platform, setPlatform] = useState<Platform>('Tinder');
  const [script, setScript] = useState<string>(INITIAL_SCRIPT);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [globalStatus, setGlobalStatus] = useState<MessageStatus>('read');
  
  const typingTimeoutRef = useRef<number | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    parseScript();
  }, [script, globalStatus]);

  const parseScript = () => {
    const lines = script.split('\n');
    const newMessages: Message[] = lines
      .filter(line => line.trim())
      .map((line, index) => {
        const isSenderLine = line.trim().startsWith('>');
        const isReceiverLine = line.trim().startsWith('<');
        const text = line.replace(/^[><]\s*/, '').trim();
        
        if (!isSenderLine && !isReceiverLine) return null;

        const date = new Date();
        const timestamp = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return {
          id: `${index}-${text}`,
          text,
          sender: isSenderLine ? 'sender' : 'receiver',
          timestamp,
          status: isSenderLine ? globalStatus : undefined
        } as Message;
      })
      .filter(Boolean) as Message[];
    
    setMessages(newMessages);
  };

  const handleScriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setScript(e.target.value);
    
    setIsTyping(true);
    if (typingTimeoutRef.current) {
      window.clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = window.setTimeout(() => {
      setIsTyping(false);
    }, 1500);
  };

  const handleGeminiMagic = async () => {
    setIsGenerating(true);
    const scenario = prompt("What's the chat about? (e.g., awkward breakup, first date, prank)") || "A funny first date conversation";
    const newScript = await generateChatScript(sender.name, receiver.name, scenario);
    if (newScript) {
      setScript(newScript);
    }
    setIsGenerating(false);
  };

  const handleCapture = async () => {
    if (previewRef.current) {
      try {
        const dataUrl = await htmlToImage.toPng(previewRef.current, {
          quality: 1,
          pixelRatio: 2,
        });
        const link = document.createElement('a');
        link.download = `chat-mock-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error("Capture failed", error);
        alert("Failed to capture image.");
      }
    }
  };

  const handleRecord = async () => {
    if (isRecording) {
      recorderRef.current?.stop();
      setIsRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false
      });
      
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/mp4' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat-record-${Date.now()}.mp4`;
        a.click();
        stream.getTracks().forEach(t => t.stop());
      };

      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Recording failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      <aside className="w-full lg:w-[450px] lg:h-screen lg:overflow-y-auto bg-white border-r border-slate-200 p-6 shadow-xl z-30">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-xl text-white">
              <MessageSquare size={24} />
            </div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">ChatMock Studio</h1>
          </div>
          <p className="text-slate-500 text-sm">Create realistic fake chat screenshots and videos.</p>
        </header>

        <section className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <ProfileEditor label="Sender" profile={sender} onChange={setSender} />
            <ProfileEditor label="Receiver" profile={receiver} onChange={setReceiver} />
          </div>

          <div className="grid grid-cols-1 gap-4">
             <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-slate-500 uppercase">
                  <Smartphone size={16} /> Platform
                </div>
                <div className="flex flex-wrap gap-2">
                  {(['Tinder', 'WhatsApp', 'iMessage', 'Instagram', 'Messenger'] as Platform[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPlatform(p)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        platform === p 
                        ? 'bg-slate-800 text-white shadow-md' 
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-slate-500 uppercase">
                  <CheckCheck size={16} /> Message Status
                </div>
                <div className="flex gap-2">
                  {(['sent', 'delivered', 'read'] as MessageStatus[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setGlobalStatus(s)}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold capitalize transition-all border ${
                        globalStatus === s 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-sm' 
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative group">
            <div className="flex items-center justify-between mb-3 text-sm font-semibold text-slate-500 uppercase">
              <div className="flex items-center gap-2">
                <Hash size={16} /> Conversation
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handleGeminiMagic}
                  disabled={isGenerating}
                  className="flex items-center gap-1.5 px-3 py-1 bg-violet-600 text-white rounded-md text-xs hover:bg-violet-700 transition-colors shadow-sm disabled:opacity-50"
                >
                  <Wand2 size={12} /> {isGenerating ? 'Thinking...' : 'AI Magic'}
                </button>
                <button 
                  onClick={() => setScript('')}
                  className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <textarea
              value={script}
              onChange={handleScriptChange}
              className="w-full h-80 bg-white border border-slate-200 rounded-lg p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner"
              placeholder="Start with > for sender or < for receiver..."
            />
          </div>
        </section>

        <footer className="mt-12 text-center text-slate-400 text-xs flex items-center justify-center gap-1">
           Built for Creators <Heart size={10} className="text-red-400" fill="currentColor" />
        </footer>
      </aside>

      <main className="flex-1 p-8 flex flex-col items-center justify-center bg-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-400/10 blur-[100px] rounded-full"></div>

        <div className="z-10 flex flex-col items-center w-full max-w-2xl">
          <ChatPreview 
            platform={platform} 
            sender={sender} 
            receiver={receiver} 
            messages={messages} 
            containerRef={previewRef}
            isTyping={isTyping}
          />

          <div className="mt-8 flex gap-4 w-full justify-center">
            <button
              onClick={handleCapture}
              className="flex items-center gap-2 px-6 py-3 bg-white text-slate-800 rounded-2xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all border border-slate-200"
            >
              <Download size={20} className="text-blue-500" />
              Save Screenshot
            </button>
            <button
              onClick={handleRecord}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all border border-slate-200 ${
                isRecording ? 'bg-red-500 text-white' : 'bg-white text-slate-800'
              }`}
            >
              <Video size={20} className={isRecording ? 'text-white' : 'text-red-500'} />
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
