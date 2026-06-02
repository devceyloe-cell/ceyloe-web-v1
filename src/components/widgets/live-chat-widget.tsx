"use client";

import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { siteConfig } from "@/config/site";

const quickMessages = [
  "I'd like to inquire about a sapphire",
  "Can you help with a custom ring design?",
  "Do you offer wholesale pricing?",
  "I'd like to book a consultation",
];

export function LiveChatWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  function sendViaWhatsApp(text: string) {
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/${siteConfig.contact.whatsapp}?text=${encoded}`, "_blank");
    setOpen(false);
    setMessage("");
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-24 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-105 hover:bg-gold hover:text-brand-navy"
        aria-label="Live chat"
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 border border-border bg-surface shadow-xl">
          <div className="border-b border-border bg-surface-elevated px-4 py-3">
            <p className="text-sm font-medium">Chat with Ceyloe</p>
            <p className="text-xs text-muted">We typically reply within a few hours</p>
          </div>
          <div className="space-y-2 p-4">
            <p className="text-xs text-muted">Quick messages:</p>
            {quickMessages.map((msg) => (
              <button
                key={msg}
                type="button"
                onClick={() => sendViaWhatsApp(msg)}
                className="block w-full border border-border px-3 py-2 text-left text-xs transition-colors hover:bg-surface-elevated"
              >
                {msg}
              </button>
            ))}
            <div className="flex gap-2 pt-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border border-border px-3 py-2 text-sm focus:outline-none"
                onKeyDown={(e) => e.key === "Enter" && message && sendViaWhatsApp(message)}
              />
              <button
                type="button"
                onClick={() => message && sendViaWhatsApp(message)}
                className="flex h-10 w-10 items-center justify-center bg-primary text-white hover:bg-gold hover:text-brand-navy"
                aria-label="Send"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
