import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Phone, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const WHATSAPP_NUMBER = "5491159064234";

const QUICK_QUESTIONS = [
  { id: "campus", text: "¿Cómo funciona el campus?" },
  { id: "incluye", text: "¿Qué incluye la maestría?" },
  { id: "modalidad", text: "¿Es solo presencial?" },
  { id: "despues", text: "¿Qué pasa después de los 12 días?" },
];

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isHandoff?: boolean;
}

const INITIAL_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content: "¡Hola! 👋 Soy el asistente virtual de la Maestría en Circulación Pulmonar. Puedo ayudarte con información sobre el programa, los 30 módulos, modalidad (presencial + campus virtual), requisitos y más. ¿En qué puedo ayudarte?"
};

export const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mlcp-assistant`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`
          },
          body: JSON.stringify({
            messages: [...messages, userMessage].map(m => ({
              role: m.role,
              content: m.content
            }))
          })
        }
      );

      if (!response.ok) {
        throw new Error("Error en la respuesta");
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
        isHandoff: data.handoff
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Lo siento, hubo un problema. ¿Te gustaría hablar directamente con nuestro equipo académico?",
          isHandoff: true
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setShowQuickQuestions(false);
    setInput(question);
    // Submit the question automatically
    const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
    setTimeout(() => {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: question
      };
      setMessages(prev => [...prev, userMessage]);
      setIsLoading(true);
      
      fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mlcp-assistant`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`
          },
          body: JSON.stringify({
            messages: [...messages, userMessage].map(m => ({
              role: m.role,
              content: m.content
            }))
          })
        }
      )
        .then(response => {
          if (!response.ok) throw new Error("Error en la respuesta");
          return response.json();
        })
        .then(data => {
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: data.message,
            isHandoff: data.handoff
          };
          setMessages(prev => [...prev, assistantMessage]);
        })
        .catch(error => {
          console.error("Error:", error);
          setMessages(prev => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              role: "assistant",
              content: "Lo siento, hubo un problema. ¿Te gustaría hablar directamente con nuestro equipo académico?",
              isHandoff: true
            }
          ]);
        })
        .finally(() => {
          setIsLoading(false);
          setInput("");
        });
    }, 100);
  };

  const handleWhatsAppHandoff = () => {
    const lastUserMessage = messages.filter(m => m.role === "user").pop();
    const context = lastUserMessage ? encodeURIComponent(
      `Hola, estuve consultando con el asistente virtual sobre: "${lastUserMessage.content}". Me gustaría más información.`
    ) : encodeURIComponent(
      "Hola, estoy interesado/a en la Maestría en Circulación Pulmonar 2026."
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${context}`, "_blank");
  };

  return (
    <>
      {/* Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-20 md:bottom-6 left-4 md:left-6 z-50 flex items-center gap-2 bg-primary hover:bg-primary-dark text-primary-foreground px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            aria-label="Abrir asistente virtual"
          >
            <Bot className="w-6 h-6" />
            <span className="hidden sm:inline font-medium text-sm">
              ¿Tienes dudas?
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-6 md:right-auto z-50 w-auto md:w-[380px] max-h-[70vh] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Asistente MLCP</h3>
                  <p className="text-xs text-primary-foreground/70">Respuestas inmediatas</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                aria-label="Cerrar chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[200px] max-h-[400px]">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-2",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-muted text-foreground rounded-bl-md"
                    )}
                  >
                    {message.content}
                    
                    {/* Handoff button */}
                    {message.isHandoff && (
                      <button
                        onClick={handleWhatsAppHandoff}
                        className="mt-3 w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white py-2 px-4 rounded-xl text-sm font-medium transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        Hablar con el equipo académico
                      </button>
                    )}
                  </div>
                  {message.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-accent" />
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-2 justify-start">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-muted p-3 rounded-2xl rounded-bl-md">
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions - Only show when no user messages yet */}
            {showQuickQuestions && messages.length === 1 && (
              <div className="px-4 pb-3 border-b border-border">
                <p className="text-xs text-muted-foreground mb-2">Preguntas frecuentes:</p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_QUESTIONS.map((q) => (
                    <button
                      key={q.id}
                      onClick={() => handleQuickQuestion(q.text)}
                      disabled={isLoading}
                      className="text-xs bg-primary/10 hover:bg-primary/20 text-primary px-2.5 py-1.5 rounded-full transition-colors disabled:opacity-50"
                    >
                      {q.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escribe tu pregunta..."
                  className="flex-1 text-sm"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || isLoading}
                  className="bg-primary hover:bg-primary-dark"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground text-center mt-2">
                Para consultas específicas, te conectamos con el equipo académico
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
