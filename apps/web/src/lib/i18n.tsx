import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
] as const;

export type LanguageCode = (typeof languages)[number]["code"];

const defaultLanguage: LanguageCode = "en";

type Message = { role: "ai" | "user"; text: string; cta?: boolean };

type Translation = {
  nav: {
    links: { label: string; href: string }[];
    call: string;
    book: string;
    language: string;
  };
  hero: {
    badge: string;
    title: { before: string; highlight: string; after: string };
    description: string;
    primaryCta: string;
    secondaryCta: string;
    ratingSuffix: string;
    certifications: string[];
    statLabel: string;
    chatGreeting: string;
    chatReply: string;
    topPills: [string, string];
  };
  trust: {
    kicker: string;
    title: string;
    ratingLabel: string;
    reviews: { name: string; text: string; rating: number }[];
    certs: string[];
    before: string;
    after: string;
    transformation: string;
    visits: string;
  };
  services: {
    kicker: string;
    title: string;
    description: string;
    learnMore: string;
    items: { title: string; desc: string }[];
  };
  ai: {
    kicker: string;
    title: string;
    description: string;
    items: { title: string; desc: string }[];
  };
  chatDemo: {
    kicker: string;
    title: string;
    description: string;
    bullets: string[];
    replay: string;
    status: string;
    cta: string;
    inputPlaceholder: string;
    script: Message[];
  };
  booking: {
    kicker: string;
    title: string;
    description: string;
    serviceLabel: string;
    availableTimes: string;
    namePlaceholder: string;
    whatsappPlaceholder: string;
    confirm: string;
    confirmed: string;
    disclaimer: string;
    services: {
      whitening: string;
      implants: string;
      invisalign: string;
      cleaning: string;
      emergency: string;
    };
  };
  workflow: {
    kicker: string;
    title: string;
    description: string;
    steps: { title: string; desc: string }[];
  };
  testimonials: {
    kicker: string;
    title: string;
    items: { name: string; role: string; text: string }[];
  };
  faq: {
    kicker: string;
    title: string;
    items: { q: string; a: string }[];
  };
  footer: {
    ctaTitle: string;
    ctaDescription: string;
    book: string;
    tagline: string;
    contact: string;
    hours: string;
    services: string;
    hoursWeekdays: string;
    hoursSaturday: string;
    hoursSunday: string;
    servicesList: string[];
    rights: string;
    compliance: string;
  };
  floating: {
    aiTitle: string;
    aiStatus: string;
    aiGreeting: string;
    inputPlaceholder: string;
  };
};

const translations: Record<LanguageCode, Translation> = {
  en: {
    nav: {
      links: [
        { label: "Services", href: "#services" },
        { label: "AI Features", href: "#ai" },
        { label: "Booking", href: "#booking" },
        { label: "Reviews", href: "#testimonials" },
        { label: "FAQ", href: "#faq" },
      ],
      call: "Call",
      book: "Book Appointment",
      language: "Language",
    },
    hero: {
      badge: "AI-Powered Dental Concierge — Now Live 24/7",
      title: {
        before: "The future of",
        highlight: "luxury dentistry",
        after: "is intelligent.",
      },
      description:
        "Meet Aria — our AI dental assistant. She answers questions, qualifies your needs, books your visit, and sends WhatsApp reminders. All in under 60 seconds.",
      primaryCta: "Book Appointment",
      secondaryCta: "Talk to AI Assistant",
      ratingSuffix: "· 2,400+ patients",
      certifications: ["ADA Certified", "HIPAA Secure"],
      statLabel: "Avg. booking time",
      chatGreeting: "Hi! I can book your visit in 60 seconds. What's bothering you?",
      chatReply: "I want teeth whitening 🦷",
      topPills: ["Luxury concierge", "24/7 AI enabled"],
    },
    trust: {
      kicker: "Trusted nationwide",
      title: "Loved by patients. Recognized by experts.",
      ratingLabel: "· 2,400+ reviews",
      reviews: [
        { name: "Sarah M.", text: "Booked in under a minute via the AI chat. Whitening was flawless.", rating: 5 },
        { name: "James K.", text: "Most premium dental experience I've ever had. Worth every penny.", rating: 5 },
        { name: "Priya R.", text: "Their AI even reminded me on WhatsApp. Concierge level care.", rating: 5 },
      ],
      certs: ["ADA Certified", "AACD Member", "HIPAA Secure", "Top 1% USA"],
      before: "Before",
      after: "After",
      transformation: "Smile Transformation",
      visits: "Veneers · 2 visits",
    },
    services: {
      kicker: "Our Services",
      title: "Concierge dental care, end-to-end.",
      description: "Every treatment delivered with precision technology and a five-star experience.",
      learnMore: "Learn more",
      items: [
        { title: "Teeth Whitening", desc: "Up to 8 shades brighter in a single visit using premium-grade whitening." },
        { title: "Dental Implants", desc: "Permanent, natural-looking implants placed by award-winning specialists." },
        { title: "Cosmetic Dentistry", desc: "Veneers, bonding, and smile design tailored to your face shape." },
        { title: "Invisalign", desc: "Clear aligners with AI progress tracking and remote check-ins." },
        { title: "Emergency Care", desc: "Same-day urgent appointments. Our AI triages within 60 seconds." },
        { title: "General Dentistry", desc: "Cleanings, checkups, and preventive care with a luxury touch." },
      ],
    },
    ai: {
      kicker: "Powered by AI",
      title: "An invisible assistant working for your smile.",
      description: "Six AI systems working in harmony — so patients get instant help and our doctors stay focused on care.",
      items: [
        { title: "24/7 AI Chat Assistant", desc: "Aria answers patient questions in 30+ languages, any time of day." },
        { title: "Instant Appointment Booking", desc: "Real-time calendar sync. Patients book in under a minute." },
        { title: "WhatsApp Reminders", desc: "Smart reminders cut no-shows by 73%." },
        { title: "AI Voice Receptionist", desc: "Natural voice agent answers calls and books appointments." },
        { title: "Automated Follow-ups", desc: "Post-treatment care messages sent at the perfect moment." },
        { title: "Smart Lead Qualification", desc: "Aria scores leads and routes high-value patients to our team first." },
      ],
    },
    chatDemo: {
      kicker: "Live AI Demo",
      title: "Watch Aria book a real appointment.",
      description: "Aria understands symptoms, asks clarifying questions, suggests slots, and confirms — all conversationally.",
      bullets: [
        "Understands medical context, not just keywords",
        "Routes urgent cases to a human in under 30 seconds",
        "Speaks 30+ languages fluently",
      ],
      replay: "Replay Demo",
      status: "Online · responds instantly",
      cta: "View confirmation",
      inputPlaceholder: "Type a message...",
      script: [
        { role: "ai", text: "Hi! I'm Aria, your dental assistant. What brings you in today?" },
        { role: "user", text: "My front tooth has been sensitive for a week." },
        { role: "ai", text: "Got it. Any pain when drinking cold water, or only when chewing?" },
        { role: "user", text: "Mostly cold drinks." },
        { role: "ai", text: "That sounds like enamel sensitivity. Dr. Chen has openings tomorrow at 10:00 AM and Friday at 2:30 PM. Want me to book one?" },
        { role: "user", text: "Tomorrow 10 AM works." },
        { role: "ai", text: "Perfect — booking confirmed. I'll send a WhatsApp reminder one hour before. ✨", cta: true },
      ],
    },
    booking: {
      kicker: "Book in 60 seconds",
      title: "Reserve your appointment.",
      description: "Pick a time that works. We'll send a WhatsApp confirmation instantly.",
      serviceLabel: "Service",
      availableTimes: "Available times",
      namePlaceholder: "Full name",
      whatsappPlaceholder: "WhatsApp number",
      confirm: "Confirm Appointment",
      confirmed: "Confirmed — see you soon!",
      disclaimer: "By booking, you agree to receive WhatsApp reminders. No spam, ever.",
      services: {
        whitening: "Whitening",
        implants: "Implants",
        invisalign: "Invisalign",
        cleaning: "Cleaning",
        emergency: "Emergency",
      },
    },
    workflow: {
      kicker: "Automation Workflow",
      title: "From hello to appointment in 5 steps.",
      description: "A seamless, automated journey — no friction, no delays.",
      steps: [
        { title: "Visitor", desc: "Lands on your site" },
        { title: "AI Chat", desc: "Aria qualifies needs" },
        { title: "WhatsApp", desc: "Conversation continues" },
        { title: "Appointment", desc: "Booked instantly" },
        { title: "Confirmation", desc: "Reminder sent" },
      ],
    },
    testimonials: {
      kicker: "Patient Stories",
      title: "Quiet luxury. Loud results.",
      items: [
        { name: "Olivia Bennett", role: "Patient · NYC", text: "From the AI chat to the gold-leaf reception, every detail screams premium. My veneers are flawless." },
        { name: "Marcus Reed", role: "Patient · LA", text: "I rebooked my whole family. Aria handled scheduling, reminders, even my insurance questions." },
        { name: "Anya Sharma", role: "Patient · Miami", text: "The Invisalign tracking on WhatsApp is genius. I never missed a step." },
        { name: "Daniel Cho", role: "Patient · Chicago", text: "Emergency at 11pm — AI booked me a 7am slot. Saved my front tooth and my pitch the next day." },
      ],
    },
    faq: {
      kicker: "FAQ",
      title: "Questions, answered.",
      items: [
        { q: "Is the AI assistant secure with my health data?", a: "Yes. Aria is HIPAA-compliant and end-to-end encrypted. Your data never trains public models." },
        { q: "Do you accept insurance?", a: "We accept most major US insurance providers and offer transparent in-house financing." },
        { q: "How fast can I get an appointment?", a: "Most patients book within 60 seconds. Same-day emergency slots are reserved daily." },
        { q: "What if I need to talk to a human?", a: "Aria escalates to our team in under 30 seconds, 7 days a week." },
        { q: "Where are you located?", a: "Flagship clinic in Manhattan, NYC — with virtual consultations available nationwide." },
      ],
    },
    footer: {
      ctaTitle: "Ready for your best smile?",
      ctaDescription: "Book in 60 seconds with Aria, your AI dental assistant.",
      book: "Book Appointment",
      tagline: "Luxury dental care, intelligently delivered.",
      contact: "Contact",
      hours: "Hours",
      services: "Services",
      hoursWeekdays: "Mon–Fri · 8am – 8pm",
      hoursSaturday: "Sat · 9am – 5pm",
      hoursSunday: "Sun · AI assistant 24/7",
      servicesList: ["Teeth Whitening", "Dental Implants", "Invisalign", "Emergency Care"],
      rights: "All rights reserved.",
      compliance: "HIPAA Compliant · ADA Certified · AACD Member",
    },
    floating: {
      aiTitle: "Aria · AI Assistant",
      aiStatus: "Typically replies instantly",
      aiGreeting: "Hi! I can answer questions or book your visit. What can I help with?",
      inputPlaceholder: "Type a message...",
    },
  },
  hi: {
    nav: {
      links: [
        { label: "सेवाएं", href: "#services" },
        { label: "एआई फीचर्स", href: "#ai" },
        { label: "बुकिंग", href: "#booking" },
        { label: "रिव्यू", href: "#testimonials" },
        { label: "FAQ", href: "#faq" },
      ],
      call: "कॉल करें",
      book: "अपॉइंटमेंट बुक करें",
      language: "भाषा",
    },
    hero: {
      badge: "एआई-पावर्ड डेंटल कंसीयर्ज — अब 24/7 लाइव",
      title: {
        before: "लक्ज़री डेंटिस्ट्री का",
        highlight: "भविष्य",
        after: "अब इंटेलिजेंट है।",
      },
      description:
        "मिलिए Aria से — हमारी AI डेंटल असिस्टेंट। यह सवालों के जवाब देती है, आपकी ज़रूरत समझती है, विज़िट बुक करती है, और WhatsApp रिमाइंडर भेजती है। सब कुछ 60 सेकंड से कम में।",
      primaryCta: "अपॉइंटमेंट बुक करें",
      secondaryCta: "AI असिस्टेंट से बात करें",
      ratingSuffix: "· 2,400+ मरीज",
      certifications: ["ADA प्रमाणित", "HIPAA सुरक्षित"],
      statLabel: "औसत बुकिंग समय",
      chatGreeting: "हाय! मैं आपकी विज़िट 60 सेकंड में बुक कर सकती हूँ। आपको किस बात की परेशानी है?",
      chatReply: "मुझे टीथ व्हाइटनिंग चाहिए 🦷",
      topPills: ["लक्ज़री कंसीयर्ज", "24/7 AI सक्रिय"],
    },
    trust: {
      kicker: "देशभर में भरोसेमंद",
      title: "मरीजों की पसंद। एक्सपर्ट्स की मान्यता।",
      ratingLabel: "· 2,400+ रिव्यू",
      reviews: [
        { name: "Sarah M.", text: "AI चैट से एक मिनट में बुकिंग हो गई। व्हाइटनिंग कमाल की थी।", rating: 5 },
        { name: "James K.", text: "यह अब तक का सबसे प्रीमियम डेंटल अनुभव था। हर पैसे की कीमत वसूल।", rating: 5 },
        { name: "Priya R.", text: "इनकी AI ने WhatsApp पर रिमाइंड भी भेजा। बिल्कुल कंसीयर्ज-लेवल केयर।", rating: 5 },
      ],
      certs: ["ADA प्रमाणित", "AACD सदस्य", "HIPAA सुरक्षित", "USA में शीर्ष 1%"],
      before: "पहले",
      after: "बाद में",
      transformation: "स्माइल ट्रांसफॉर्मेशन",
      visits: "विनीयर्स · 2 विज़िट",
    },
    services: {
      kicker: "हमारी सेवाएं",
      title: "कंसीयर्ज डेंटल केयर, शुरू से अंत तक।",
      description: "हर ट्रीटमेंट प्रिसीजन टेक्नोलॉजी और फाइव-स्टार अनुभव के साथ।",
      learnMore: "और जानें",
      items: [
        { title: "टीथ व्हाइटनिंग", desc: "एक ही विज़िट में प्रीमियम-ग्रेड व्हाइटनिंग से 8 शेड तक चमक।" },
        { title: "डेंटल इम्प्लांट्स", desc: "अवार्ड-विनिंग स्पेशलिस्ट्स द्वारा प्राकृतिक दिखने वाले स्थायी इम्प्लांट्स।" },
        { title: "कॉस्मेटिक डेंटिस्ट्री", desc: "विनीयर्स, बॉन्डिंग और फेस-शेप के अनुसार स्माइल डिज़ाइन।" },
        { title: "इनविज़लाइन", desc: "AI प्रोग्रेस ट्रैकिंग और रिमोट चेक-इन के साथ क्लियर अलाइनर्स।" },
        { title: "इमरजेंसी केयर", desc: "उसी दिन अर्जेंट अपॉइंटमेंट। हमारी AI 60 सेकंड में ट्रायज करती है।" },
        { title: "जनरल डेंटिस्ट्री", desc: "क्लीनिंग, चेकअप और प्रिवेंटिव केयर, लक्ज़री टच के साथ।" },
      ],
    },
    ai: {
      kicker: "एआई द्वारा संचालित",
      title: "आपकी मुस्कान के लिए काम करने वाला एक अदृश्य असिस्टेंट।",
      description: "छह AI सिस्टम एक साथ काम करते हैं — ताकि मरीजों को तुरंत मदद मिले और डॉक्टर केयर पर फोकस कर सकें।",
      items: [
        { title: "24/7 AI चैट असिस्टेंट", desc: "Aria दिन-रात 30+ भाषाओं में मरीजों के सवालों के जवाब देती है।" },
        { title: "इंस्टेंट अपॉइंटमेंट बुकिंग", desc: "रीयल-टाइम कैलेंडर सिंक। मरीज एक मिनट से कम में बुक करते हैं।" },
        { title: "WhatsApp रिमाइंडर्स", desc: "स्मार्ट रिमाइंडर नो-शो को 73% तक कम करते हैं।" },
        { title: "AI वॉइस रिसेप्शनिस्ट", desc: "नेचुरल वॉइस एजेंट कॉल उठाता है और अपॉइंटमेंट बुक करता है।" },
        { title: "ऑटोमेटेड फॉलो-अप्स", desc: "पोस्ट-ट्रीटमेंट केयर मैसेज सही समय पर भेजे जाते हैं।" },
        { title: "स्मार्ट लीड क्वालिफिकेशन", desc: "Aria लीड्स को स्कोर करती है और हाई-वैल्यू मरीजों को पहले रूट करती है।" },
      ],
    },
    chatDemo: {
      kicker: "लाइव AI डेमो",
      title: "देखिए Aria कैसे असली अपॉइंटमेंट बुक करती है।",
      description: "Aria लक्षण समझती है, जरूरी सवाल पूछती है, स्लॉट सुझाती है और कन्फर्म करती है — सब कुछ बातचीत की तरह।",
      bullets: [
        "सिर्फ कीवर्ड नहीं, मेडिकल संदर्भ भी समझती है",
        "अर्जेंट केस 30 सेकंड में इंसान तक पहुंचाती है",
        "30+ भाषाओं में सहज बातचीत करती है",
      ],
      replay: "डेमो फिर चलाएं",
      status: "ऑनलाइन · तुरंत जवाब",
      cta: "कन्फर्मेशन देखें",
      inputPlaceholder: "मैसेज टाइप करें...",
      script: [
        { role: "ai", text: "हाय! मैं Aria हूँ, आपकी डेंटल असिस्टेंट। आज आपको किस वजह से आना है?" },
        { role: "user", text: "मेरे सामने वाले दाँत में एक हफ्ते से संवेदनशीलता है।" },
        { role: "ai", text: "समझ गई। ठंडा पानी पीने पर दर्द होता है, या सिर्फ चबाने पर?" },
        { role: "user", text: "ज़्यादातर ठंडी ड्रिंक्स पर।" },
        { role: "ai", text: "यह एनामेल सेंसिटिविटी लग रही है। Dr. Chen के पास कल 10:00 AM और शुक्रवार 2:30 PM के स्लॉट हैं। क्या मैं एक बुक कर दूँ?" },
        { role: "user", text: "कल 10 AM ठीक है।" },
        { role: "ai", text: "परफेक्ट — आपकी बुकिंग कन्फर्म हो गई। मैं एक घंटे पहले WhatsApp रिमाइंडर भेज दूँगी। ✨", cta: true },
      ],
    },
    booking: {
      kicker: "60 सेकंड में बुक करें",
      title: "अपना अपॉइंटमेंट रिज़र्व करें।",
      description: "जो समय आपके लिए सही हो, उसे चुनें। हम तुरंत WhatsApp कन्फर्मेशन भेजेंगे।",
      serviceLabel: "सेवा",
      availableTimes: "उपलब्ध समय",
      namePlaceholder: "पूरा नाम",
      whatsappPlaceholder: "WhatsApp नंबर",
      confirm: "अपॉइंटमेंट कन्फर्म करें",
      confirmed: "कन्फर्म हो गया — जल्द मिलते हैं!",
      disclaimer: "बुकिंग करके आप WhatsApp रिमाइंडर्स के लिए सहमति देते हैं। कोई स्पैम नहीं।",
      services: {
        whitening: "व्हाइटनिंग",
        implants: "इम्प्लांट्स",
        invisalign: "इनविज़लाइन",
        cleaning: "क्लीनिंग",
        emergency: "इमरजेंसी",
      },
    },
    workflow: {
      kicker: "ऑटोमेशन वर्कफ़्लो",
      title: "हैलो से अपॉइंटमेंट तक सिर्फ 5 स्टेप्स।",
      description: "एक स्मूद, ऑटोमेटेड जर्नी — बिना किसी फ्रिक्शन या देरी के।",
      steps: [
        { title: "विज़िटर", desc: "आपकी साइट पर आता है" },
        { title: "AI चैट", desc: "Aria ज़रूरत समझती है" },
        { title: "WhatsApp", desc: "बातचीत आगे बढ़ती है" },
        { title: "अपॉइंटमेंट", desc: "तुरंत बुक हो जाता है" },
        { title: "कन्फर्मेशन", desc: "रिमाइंडर भेजा जाता है" },
      ],
    },
    testimonials: {
      kicker: "मरीजों की कहानियाँ",
      title: "शांत लक्ज़री। ज़बरदस्त रिज़ल्ट्स।",
      items: [
        { name: "Olivia Bennett", role: "मरीज · NYC", text: "AI चैट से लेकर गोल्ड-लीफ रिसेप्शन तक, हर डिटेल प्रीमियम लगती है। मेरे विनीयर्स बेहतरीन हैं।" },
        { name: "Marcus Reed", role: "मरीज · LA", text: "मैंने पूरे परिवार की रीबुकिंग कर दी। Aria ने शेड्यूलिंग, रिमाइंडर्स, यहाँ तक कि इंश्योरेंस सवाल भी संभाल लिए।" },
        { name: "Anya Sharma", role: "मरीज · Miami", text: "WhatsApp पर Invisalign ट्रैकिंग कमाल की है। मैंने एक भी स्टेप मिस नहीं किया।" },
        { name: "Daniel Cho", role: "मरीज · Chicago", text: "रात 11 बजे इमरजेंसी थी — AI ने 7 AM स्लॉट बुक कर दिया। मेरा फ्रंट टूथ और अगला दिन दोनों बच गए।" },
      ],
    },
    faq: {
      kicker: "FAQ",
      title: "सवालों के जवाब।",
      items: [
        { q: "क्या AI असिस्टेंट मेरे हेल्थ डेटा के लिए सुरक्षित है?", a: "हाँ। Aria HIPAA-compliant और end-to-end encrypted है। आपका डेटा public models को train नहीं करता।" },
        { q: "क्या आप इंश्योरेंस स्वीकार करते हैं?", a: "हम US के ज्यादातर major insurance providers स्वीकार करते हैं और transparent financing भी देते हैं।" },
        { q: "मुझे कितनी जल्दी अपॉइंटमेंट मिल सकता है?", a: "अधिकांश मरीज 60 सेकंड के भीतर बुक कर लेते हैं। same-day emergency slots रोज़ reserve रहते हैं।" },
        { q: "अगर मुझे किसी इंसान से बात करनी हो तो?", a: "Aria 30 सेकंड के अंदर हमारी टीम तक escalate कर देती है, हफ्ते के 7 दिन।" },
        { q: "आप कहाँ स्थित हैं?", a: "हमारा flagship clinic Manhattan, NYC में है — और nationwide virtual consultations उपलब्ध हैं।" },
      ],
    },
    footer: {
      ctaTitle: "अपनी सबसे अच्छी मुस्कान के लिए तैयार हैं?",
      ctaDescription: "Aria, आपकी AI डेंटल असिस्टेंट के साथ 60 सेकंड में बुक करें।",
      book: "अपॉइंटमेंट बुक करें",
      tagline: "लक्ज़री डेंटल केयर, बुद्धिमानी से डिलीवर की गई।",
      contact: "संपर्क",
      hours: "समय",
      services: "सेवाएं",
      hoursWeekdays: "सोम–शुक्र · सुबह 8 बजे – रात 8 बजे",
      hoursSaturday: "शनिवार · सुबह 9 बजे – शाम 5 बजे",
      hoursSunday: "रविवार · AI असिस्टेंट 24/7",
      servicesList: ["टीथ व्हाइटनिंग", "डेंटल इम्प्लांट्स", "इनविज़लाइन", "इमरजेंसी केयर"],
      rights: "सभी अधिकार सुरक्षित।",
      compliance: "HIPAA compliant · ADA certified · AACD member",
    },
    floating: {
      aiTitle: "Aria · AI असिस्टेंट",
      aiStatus: "आमतौर पर तुरंत जवाब देती है",
      aiGreeting: "हाय! मैं सवालों के जवाब दे सकती हूँ या आपकी विज़िट बुक कर सकती हूँ। मैं किसमें मदद करूँ?",
      inputPlaceholder: "मैसेज टाइप करें...",
    },
  },
  es: {
    nav: {
      links: [
        { label: "Servicios", href: "#services" },
        { label: "Funciones IA", href: "#ai" },
        { label: "Reserva", href: "#booking" },
        { label: "Reseñas", href: "#testimonials" },
        { label: "FAQ", href: "#faq" },
      ],
      call: "Llamar",
      book: "Reservar cita",
      language: "Idioma",
    },
    hero: {
      badge: "Conserje dental con IA — Disponible 24/7",
      title: {
        before: "El futuro de la",
        highlight: "odontología de lujo",
        after: "es inteligente.",
      },
      description:
        "Conoce a Aria, nuestra asistente dental con IA. Responde preguntas, entiende tus necesidades, agenda tu visita y envía recordatorios por WhatsApp. Todo en menos de 60 segundos.",
      primaryCta: "Reservar cita",
      secondaryCta: "Hablar con la IA",
      ratingSuffix: "· 2,400+ pacientes",
      certifications: ["Certificado ADA", "Seguro HIPAA"],
      statLabel: "Tiempo promedio de reserva",
      chatGreeting: "¡Hola! Puedo reservar tu visita en 60 segundos. ¿Qué te molesta?",
      chatReply: "Quiero un blanqueamiento dental 🦷",
      topPills: ["Conserje de lujo", "IA activa 24/7"],
    },
    trust: {
      kicker: "Confiado a nivel nacional",
      title: "Amado por pacientes. Reconocido por expertos.",
      ratingLabel: "· 2,400+ reseñas",
      reviews: [
        { name: "Sarah M.", text: "Reservé en menos de un minuto por el chat de IA. El blanqueamiento fue perfecto.", rating: 5 },
        { name: "James K.", text: "La experiencia dental más premium que he tenido. Valió cada centavo.", rating: 5 },
        { name: "Priya R.", text: "La IA incluso me recordó por WhatsApp. Atención tipo concierge.", rating: 5 },
      ],
      certs: ["Certificado ADA", "Miembro AACD", "Seguro HIPAA", "Top 1% EE.UU."],
      before: "Antes",
      after: "Después",
      transformation: "Transformación de sonrisa",
      visits: "Carillas · 2 visitas",
    },
    services: {
      kicker: "Nuestros servicios",
      title: "Atención dental concierge, de principio a fin.",
      description: "Cada tratamiento con tecnología de precisión y una experiencia de cinco estrellas.",
      learnMore: "Más información",
      items: [
        { title: "Blanqueamiento", desc: "Hasta 8 tonos más brillante en una sola visita con blanqueamiento premium." },
        { title: "Implantes dentales", desc: "Implantes permanentes y naturales colocados por especialistas premiados." },
        { title: "Odontología estética", desc: "Carillas, bonding y diseño de sonrisa adaptado a tu rostro." },
        { title: "Invisalign", desc: "Alineadores transparentes con seguimiento por IA y revisiones remotas." },
        { title: "Urgencias", desc: "Citas urgentes el mismo día. Nuestra IA clasifica en 60 segundos." },
        { title: "Odontología general", desc: "Limpiezas, chequeos y prevención con un toque de lujo." },
      ],
    },
    ai: {
      kicker: "Impulsado por IA",
      title: "Un asistente invisible trabajando por tu sonrisa.",
      description: "Seis sistemas de IA trabajando en armonía para ayudar al paciente al instante y liberar a los doctores.",
      items: [
        { title: "Asistente IA 24/7", desc: "Aria responde preguntas en más de 30 idiomas, a cualquier hora." },
        { title: "Reserva instantánea", desc: "Sincronización en tiempo real. Los pacientes reservan en menos de un minuto." },
        { title: "Recordatorios por WhatsApp", desc: "Los recordatorios inteligentes reducen las ausencias en 73%." },
        { title: "Recepcionista de voz con IA", desc: "Un agente de voz natural responde llamadas y agenda citas." },
        { title: "Seguimientos automáticos", desc: "Mensajes posteriores al tratamiento enviados en el momento ideal." },
        { title: "Calificación inteligente de leads", desc: "Aria prioriza y dirige primero a los pacientes de alto valor." },
      ],
    },
    chatDemo: {
      kicker: "Demo en vivo",
      title: "Mira cómo Aria agenda una cita real.",
      description: "Aria entiende síntomas, hace preguntas, sugiere horarios y confirma todo de forma conversacional.",
      bullets: [
        "Entiende contexto médico, no solo palabras clave",
        "Escala casos urgentes a un humano en menos de 30 segundos",
        "Habla más de 30 idiomas con fluidez",
      ],
      replay: "Repetir demo",
      status: "En línea · responde al instante",
      cta: "Ver confirmación",
      inputPlaceholder: "Escribe un mensaje...",
      script: [
        { role: "ai", text: "¡Hola! Soy Aria, tu asistente dental. ¿Qué te trae hoy?" },
        { role: "user", text: "Mi diente frontal ha estado sensible durante una semana." },
        { role: "ai", text: "Entiendo. ¿Te duele al tomar agua fría o solo al masticar?" },
        { role: "user", text: "Sobre todo con bebidas frías." },
        { role: "ai", text: "Parece sensibilidad del esmalte. La Dra. Chen tiene disponibilidad mañana a las 10:00 y el viernes a las 2:30. ¿Te reservo una?" },
        { role: "user", text: "Mañana a las 10 me sirve." },
        { role: "ai", text: "Perfecto, reserva confirmada. Te enviaré un recordatorio por WhatsApp una hora antes. ✨", cta: true },
      ],
    },
    booking: {
      kicker: "Reserva en 60 segundos",
      title: "Reserva tu cita.",
      description: "Elige el horario que más te convenga. Enviaremos la confirmación por WhatsApp al instante.",
      serviceLabel: "Servicio",
      availableTimes: "Horarios disponibles",
      namePlaceholder: "Nombre completo",
      whatsappPlaceholder: "Número de WhatsApp",
      confirm: "Confirmar cita",
      confirmed: "Confirmado — ¡nos vemos pronto!",
      disclaimer: "Al reservar, aceptas recibir recordatorios por WhatsApp. Sin spam.",
      services: {
        whitening: "Blanqueamiento",
        implants: "Implantes",
        invisalign: "Invisalign",
        cleaning: "Limpieza",
        emergency: "Urgencia",
      },
    },
    workflow: {
      kicker: "Flujo de automatización",
      title: "De hola a cita en 5 pasos.",
      description: "Un recorrido fluido y automatizado, sin fricción ni demoras.",
      steps: [
        { title: "Visitante", desc: "Llega a tu sitio" },
        { title: "Chat IA", desc: "Aria entiende la necesidad" },
        { title: "WhatsApp", desc: "La conversación continúa" },
        { title: "Cita", desc: "Se agenda al instante" },
        { title: "Confirmación", desc: "Se envía recordatorio" },
      ],
    },
    testimonials: {
      kicker: "Historias de pacientes",
      title: "Lujo silencioso. Resultados evidentes.",
      items: [
        { name: "Olivia Bennett", role: "Paciente · NYC", text: "Desde el chat con IA hasta la recepción con detalles dorados, todo se siente premium. Mis carillas quedaron perfectas." },
        { name: "Marcus Reed", role: "Paciente · LA", text: "Volví a reservar para toda mi familia. Aria gestionó horarios, recordatorios e incluso dudas del seguro." },
        { name: "Anya Sharma", role: "Paciente · Miami", text: "El seguimiento de Invisalign por WhatsApp es brillante. No me perdí ningún paso." },
        { name: "Daniel Cho", role: "Paciente · Chicago", text: "Urgencia a las 11 pm: la IA me reservó a las 7 am. Salvó mi diente frontal y mi presentación del día siguiente." },
      ],
    },
    faq: {
      kicker: "FAQ",
      title: "Preguntas, resueltas.",
      items: [
        { q: "¿La asistente con IA protege mis datos de salud?", a: "Sí. Aria cumple con HIPAA y usa cifrado de extremo a extremo. Tus datos no entrenan modelos públicos." },
        { q: "¿Aceptan seguro?", a: "Aceptamos la mayoría de los seguros principales en EE.UU. y ofrecemos financiación transparente." },
        { q: "¿Qué tan rápido puedo conseguir una cita?", a: "La mayoría reserva en 60 segundos. Hay cupos de urgencia todos los días." },
        { q: "¿Y si necesito hablar con una persona?", a: "Aria escala a nuestro equipo en menos de 30 segundos, los 7 días." },
        { q: "¿Dónde están ubicados?", a: "Nuestra clínica principal está en Manhattan, NYC, con consultas virtuales en todo el país." },
      ],
    },
    footer: {
      ctaTitle: "¿Listo para tu mejor sonrisa?",
      ctaDescription: "Reserva en 60 segundos con Aria, tu asistente dental con IA.",
      book: "Reservar cita",
      tagline: "Odontología de lujo, entregada con inteligencia.",
      contact: "Contacto",
      hours: "Horario",
      services: "Servicios",
      hoursWeekdays: "Lun–Vie · 8am – 8pm",
      hoursSaturday: "Sáb · 9am – 5pm",
      hoursSunday: "Dom · Asistente IA 24/7",
      servicesList: ["Blanqueamiento", "Implantes dentales", "Invisalign", "Urgencias"],
      rights: "Todos los derechos reservados.",
      compliance: "Cumple HIPAA · Certificado ADA · Miembro AACD",
    },
    floating: {
      aiTitle: "Aria · Asistente IA",
      aiStatus: "Suele responder al instante",
      aiGreeting: "¡Hola! Puedo responder preguntas o reservar tu visita. ¿Cómo te ayudo?",
      inputPlaceholder: "Escribe un mensaje...",
    },
  },
  fr: {
    nav: {
      links: [
        { label: "Services", href: "#services" },
        { label: "Fonctions IA", href: "#ai" },
        { label: "Réservation", href: "#booking" },
        { label: "Avis", href: "#testimonials" },
        { label: "FAQ", href: "#faq" },
      ],
      call: "Appeler",
      book: "Prendre rendez-vous",
      language: "Langue",
    },
    hero: {
      badge: "Concierge dentaire IA — Disponible 24h/24",
      title: {
        before: "L'avenir de la",
        highlight: "dentisterie de luxe",
        after: "est intelligent.",
      },
      description:
        "Voici Aria, notre assistante dentaire IA. Elle répond aux questions, comprend vos besoins, planifie votre visite et envoie des rappels WhatsApp. Le tout en moins de 60 secondes.",
      primaryCta: "Prendre rendez-vous",
      secondaryCta: "Parler à l'IA",
      ratingSuffix: "· 2 400+ patients",
      certifications: ["Certifié ADA", "Sécurisé HIPAA"],
      statLabel: "Temps moyen de réservation",
      chatGreeting: "Bonjour ! Je peux réserver votre visite en 60 secondes. Quel est votre souci ?",
      chatReply: "Je veux un blanchiment dentaire 🦷",
      topPills: ["Concierge premium", "IA active 24h/24"],
    },
    trust: {
      kicker: "Approuvé dans tout le pays",
      title: "Aimé par les patients. Recommandé par les experts.",
      ratingLabel: "· 2 400+ avis",
      reviews: [
        { name: "Sarah M.", text: "Réservé en moins d'une minute via le chat IA. Le blanchiment était parfait.", rating: 5 },
        { name: "James K.", text: "L'expérience dentaire la plus premium que j'aie jamais eue. Chaque euro en valait la peine.", rating: 5 },
        { name: "Priya R.", text: "L'IA m'a même rappelé sur WhatsApp. Un niveau de service concierge.", rating: 5 },
      ],
      certs: ["Certifié ADA", "Membre AACD", "Sécurisé HIPAA", "Top 1% USA"],
      before: "Avant",
      after: "Après",
      transformation: "Transformation du sourire",
      visits: "Facettes · 2 visites",
    },
    services: {
      kicker: "Nos services",
      title: "Soins dentaires concierge, de bout en bout.",
      description: "Chaque traitement associe technologie de précision et expérience cinq étoiles.",
      learnMore: "En savoir plus",
      items: [
        { title: "Blanchiment", desc: "Jusqu'à 8 teintes plus blanches en une seule séance grâce à un protocole premium." },
        { title: "Implants dentaires", desc: "Implants permanents et naturels posés par des spécialistes primés." },
        { title: "Dentisterie esthétique", desc: "Facettes, bonding et design du sourire adaptés à votre visage." },
        { title: "Invisalign", desc: "Aligneurs transparents avec suivi IA et contrôles à distance." },
        { title: "Urgences", desc: "Rendez-vous le jour même. Notre IA vous oriente en 60 secondes." },
        { title: "Dentisterie générale", desc: "Détartrages, contrôles et prévention avec une touche de luxe." },
      ],
    },
    ai: {
      kicker: "Propulsé par l'IA",
      title: "Un assistant invisible au service de votre sourire.",
      description: "Six systèmes IA travaillent ensemble pour aider les patients instantanément et laisser les médecins se concentrer sur les soins.",
      items: [
        { title: "Assistant IA 24/7", desc: "Aria répond aux questions des patients dans plus de 30 langues, à toute heure." },
        { title: "Réservation instantanée", desc: "Synchronisation en temps réel. Les patients réservent en moins d'une minute." },
        { title: "Rappels WhatsApp", desc: "Des rappels intelligents réduisent les absences de 73 %." },
        { title: "Réceptionniste vocale IA", desc: "Un agent vocal naturel répond aux appels et prend les rendez-vous." },
        { title: "Suivis automatisés", desc: "Messages post-traitement envoyés au moment idéal." },
        { title: "Qualification intelligente", desc: "Aria note les leads et priorise les patients à forte valeur." },
      ],
    },
    chatDemo: {
      kicker: "Démo IA en direct",
      title: "Regardez Aria prendre un vrai rendez-vous.",
      description: "Aria comprend les symptômes, pose les bonnes questions, propose des créneaux et confirme la réservation.",
      bullets: [
        "Comprend le contexte médical, pas seulement les mots-clés",
        "Redirige les cas urgents vers un humain en moins de 30 secondes",
        "Parle plus de 30 langues couramment",
      ],
      replay: "Relancer la démo",
      status: "En ligne · réponse instantanée",
      cta: "Voir la confirmation",
      inputPlaceholder: "Écrivez un message...",
      script: [
        { role: "ai", text: "Bonjour ! Je suis Aria, votre assistante dentaire. Qu'est-ce qui vous amène aujourd'hui ?" },
        { role: "user", text: "Ma dent de devant est sensible depuis une semaine." },
        { role: "ai", text: "D'accord. Avez-vous mal en buvant froid ou seulement en mâchant ?" },
        { role: "user", text: "Surtout avec les boissons froides." },
        { role: "ai", text: "Cela ressemble à une sensibilité de l'émail. Le Dr Chen a des disponibilités demain à 10h00 et vendredi à 14h30. Je vous réserve ?" },
        { role: "user", text: "Demain 10h me convient." },
        { role: "ai", text: "Parfait — rendez-vous confirmé. Je vous enverrai un rappel WhatsApp une heure avant. ✨", cta: true },
      ],
    },
    booking: {
      kicker: "Réservez en 60 secondes",
      title: "Réservez votre rendez-vous.",
      description: "Choisissez l'horaire qui vous convient. Nous enverrons une confirmation WhatsApp immédiatement.",
      serviceLabel: "Service",
      availableTimes: "Horaires disponibles",
      namePlaceholder: "Nom complet",
      whatsappPlaceholder: "Numéro WhatsApp",
      confirm: "Confirmer le rendez-vous",
      confirmed: "Confirmé — à très vite !",
      disclaimer: "En réservant, vous acceptez de recevoir des rappels WhatsApp. Aucun spam.",
      services: {
        whitening: "Blanchiment",
        implants: "Implants",
        invisalign: "Invisalign",
        cleaning: "Nettoyage",
        emergency: "Urgence",
      },
    },
    workflow: {
      kicker: "Flux d'automatisation",
      title: "Du premier bonjour au rendez-vous en 5 étapes.",
      description: "Un parcours fluide et automatisé, sans friction ni attente.",
      steps: [
        { title: "Visiteur", desc: "Arrive sur votre site" },
        { title: "Chat IA", desc: "Aria comprend le besoin" },
        { title: "WhatsApp", desc: "La conversation continue" },
        { title: "Rendez-vous", desc: "Réservé instantanément" },
        { title: "Confirmation", desc: "Rappel envoyé" },
      ],
    },
    testimonials: {
      kicker: "Témoignages patients",
      title: "Luxe discret. Résultats éclatants.",
      items: [
        { name: "Olivia Bennett", role: "Patiente · NYC", text: "Du chat IA à la réception aux finitions dorées, tout respire le premium. Mes facettes sont parfaites." },
        { name: "Marcus Reed", role: "Patient · LA", text: "J'ai reprogrammé toute ma famille. Aria a géré les rendez-vous, les rappels et même les questions d'assurance." },
        { name: "Anya Sharma", role: "Patiente · Miami", text: "Le suivi Invisalign sur WhatsApp est génial. Je n'ai raté aucune étape." },
        { name: "Daniel Cho", role: "Patient · Chicago", text: "Urgence à 23h — l'IA m'a réservé un créneau à 7h. Elle a sauvé ma dent et ma présentation du lendemain." },
      ],
    },
    faq: {
      kicker: "FAQ",
      title: "Vos questions, nos réponses.",
      items: [
        { q: "L'assistante IA protège-t-elle mes données de santé ?", a: "Oui. Aria est conforme HIPAA et chiffrée de bout en bout. Vos données n'entraînent jamais de modèles publics." },
        { q: "Acceptez-vous les assurances ?", a: "Nous acceptons la plupart des grandes assurances américaines et proposons des financements transparents." },
        { q: "À quelle vitesse puis-je obtenir un rendez-vous ?", a: "La plupart des patients réservent en 60 secondes. Des créneaux d'urgence sont gardés chaque jour." },
        { q: "Et si je veux parler à un humain ?", a: "Aria vous met en relation avec notre équipe en moins de 30 secondes, 7j/7." },
        { q: "Où êtes-vous situés ?", a: "Notre clinique phare se trouve à Manhattan, NYC, avec des consultations virtuelles dans tout le pays." },
      ],
    },
    footer: {
      ctaTitle: "Prêt pour votre plus beau sourire ?",
      ctaDescription: "Réservez en 60 secondes avec Aria, votre assistante dentaire IA.",
      book: "Prendre rendez-vous",
      tagline: "Dentisterie de luxe, délivrée intelligemment.",
      contact: "Contact",
      hours: "Horaires",
      services: "Services",
      hoursWeekdays: "Lun–Ven · 8h – 20h",
      hoursSaturday: "Sam · 9h – 17h",
      hoursSunday: "Dim · Assistant IA 24/7",
      servicesList: ["Blanchiment", "Implants dentaires", "Invisalign", "Urgences"],
      rights: "Tous droits réservés.",
      compliance: "Conforme HIPAA · Certifié ADA · Membre AACD",
    },
    floating: {
      aiTitle: "Aria · Assistante IA",
      aiStatus: "Répond généralement instantanément",
      aiGreeting: "Bonjour ! Je peux répondre à vos questions ou réserver votre visite. Comment puis-je vous aider ?",
      inputPlaceholder: "Écrivez un message...",
    },
  },
  de: {
    nav: {
      links: [
        { label: "Leistungen", href: "#services" },
        { label: "KI-Funktionen", href: "#ai" },
        { label: "Buchung", href: "#booking" },
        { label: "Bewertungen", href: "#testimonials" },
        { label: "FAQ", href: "#faq" },
      ],
      call: "Anrufen",
      book: "Termin buchen",
      language: "Sprache",
    },
    hero: {
      badge: "KI-gestützter Dental-Concierge — Jetzt 24/7 live",
      title: {
        before: "Die Zukunft der",
        highlight: "Luxus-Zahnmedizin",
        after: "ist intelligent.",
      },
      description:
        "Lernen Sie Aria kennen — unsere KI-Dentalassistentin. Sie beantwortet Fragen, versteht Ihre Bedürfnisse, bucht Ihren Termin und sendet WhatsApp-Erinnerungen. Alles in unter 60 Sekunden.",
      primaryCta: "Termin buchen",
      secondaryCta: "Mit KI sprechen",
      ratingSuffix: "· 2.400+ Patienten",
      certifications: ["ADA-zertifiziert", "HIPAA-sicher"],
      statLabel: "Durchschnittliche Buchungszeit",
      chatGreeting: "Hallo! Ich kann Ihren Termin in 60 Sekunden buchen. Wobei haben Sie Beschwerden?",
      chatReply: "Ich möchte Zahnaufhellung 🦷",
      topPills: ["Luxury Concierge", "24/7 KI aktiv"],
    },
    trust: {
      kicker: "Landesweit vertraut",
      title: "Von Patienten geliebt. Von Experten anerkannt.",
      ratingLabel: "· 2.400+ Bewertungen",
      reviews: [
        { name: "Sarah M.", text: "In weniger als einer Minute per KI-Chat gebucht. Die Aufhellung war perfekt.", rating: 5 },
        { name: "James K.", text: "Die hochwertigste Zahnarzt-Erfahrung, die ich je hatte. Jeden Cent wert.", rating: 5 },
        { name: "Priya R.", text: "Die KI hat mich sogar per WhatsApp erinnert. Concierge-Niveau pur.", rating: 5 },
      ],
      certs: ["ADA-zertifiziert", "AACD-Mitglied", "HIPAA-sicher", "Top 1% USA"],
      before: "Vorher",
      after: "Nachher",
      transformation: "Smile-Transformation",
      visits: "Veneers · 2 Besuche",
    },
    services: {
      kicker: "Unsere Leistungen",
      title: "Concierge-Zahnmedizin von Anfang bis Ende.",
      description: "Jede Behandlung mit Präzisionstechnologie und einem Fünf-Sterne-Erlebnis.",
      learnMore: "Mehr erfahren",
      items: [
        { title: "Zahnaufhellung", desc: "Bis zu 8 Nuancen heller in nur einem Termin mit Premium-Whitening." },
        { title: "Zahnimplantate", desc: "Dauerhafte, natürlich wirkende Implantate von ausgezeichneten Spezialisten." },
        { title: "Ästhetische Zahnmedizin", desc: "Veneers, Bonding und Smile Design passend zu Ihrer Gesichtsform." },
        { title: "Invisalign", desc: "Klare Aligner mit KI-Fortschrittskontrolle und Remote-Check-ins." },
        { title: "Notfallversorgung", desc: "Dringende Termine am selben Tag. Unsere KI triagiert in 60 Sekunden." },
        { title: "Allgemeine Zahnmedizin", desc: "Reinigung, Vorsorge und Kontrollen mit luxuriösem Anspruch." },
      ],
    },
    ai: {
      kicker: "Mit KI betrieben",
      title: "Ein unsichtbarer Assistent arbeitet für Ihr Lächeln.",
      description: "Sechs KI-Systeme arbeiten zusammen, damit Patienten sofort Hilfe erhalten und Ärzte sich auf die Behandlung konzentrieren können.",
      items: [
        { title: "24/7 KI-Chat-Assistent", desc: "Aria beantwortet Patientenfragen in über 30 Sprachen – rund um die Uhr." },
        { title: "Sofortige Terminbuchung", desc: "Echtzeit-Kalendersync. Patienten buchen in unter einer Minute." },
        { title: "WhatsApp-Erinnerungen", desc: "Intelligente Erinnerungen senken No-Shows um 73 %." },
        { title: "KI-Sprachrezeption", desc: "Ein natürlicher Sprachagent beantwortet Anrufe und bucht Termine." },
        { title: "Automatisierte Nachsorge", desc: "Nachsorge-Nachrichten werden im perfekten Moment gesendet." },
        { title: "Intelligente Lead-Qualifizierung", desc: "Aria priorisiert hochwertige Patientenanfragen zuerst." },
      ],
    },
    chatDemo: {
      kicker: "Live-KI-Demo",
      title: "Sehen Sie, wie Aria einen echten Termin bucht.",
      description: "Aria versteht Symptome, stellt Rückfragen, schlägt Zeitfenster vor und bestätigt die Buchung – ganz natürlich.",
      bullets: [
        "Versteht medizinischen Kontext, nicht nur Stichwörter",
        "Leitet dringende Fälle in unter 30 Sekunden an Menschen weiter",
        "Spricht über 30 Sprachen fließend",
      ],
      replay: "Demo erneut abspielen",
      status: "Online · antwortet sofort",
      cta: "Bestätigung ansehen",
      inputPlaceholder: "Nachricht eingeben...",
      script: [
        { role: "ai", text: "Hallo! Ich bin Aria, Ihre Dentalassistentin. Was führt Sie heute zu uns?" },
        { role: "user", text: "Mein vorderer Zahn ist seit einer Woche empfindlich." },
        { role: "ai", text: "Verstanden. Tut es beim kalten Wasser weh oder nur beim Kauen?" },
        { role: "user", text: "Vor allem bei kalten Getränken." },
        { role: "ai", text: "Das klingt nach Zahnschmelz-Empfindlichkeit. Dr. Chen hat morgen um 10:00 Uhr und Freitag um 14:30 Uhr freie Termine. Soll ich einen buchen?" },
        { role: "user", text: "Morgen um 10 Uhr passt." },
        { role: "ai", text: "Perfekt — Termin bestätigt. Ich sende eine Stunde vorher eine WhatsApp-Erinnerung. ✨", cta: true },
      ],
    },
    booking: {
      kicker: "In 60 Sekunden buchen",
      title: "Reservieren Sie Ihren Termin.",
      description: "Wählen Sie eine passende Zeit. Wir senden sofort eine WhatsApp-Bestätigung.",
      serviceLabel: "Leistung",
      availableTimes: "Verfügbare Zeiten",
      namePlaceholder: "Vollständiger Name",
      whatsappPlaceholder: "WhatsApp-Nummer",
      confirm: "Termin bestätigen",
      confirmed: "Bestätigt — bis bald!",
      disclaimer: "Mit der Buchung stimmen Sie WhatsApp-Erinnerungen zu. Kein Spam.",
      services: {
        whitening: "Whitening",
        implants: "Implantate",
        invisalign: "Invisalign",
        cleaning: "Reinigung",
        emergency: "Notfall",
      },
    },
    workflow: {
      kicker: "Automations-Workflow",
      title: "Von Hallo bis Termin in 5 Schritten.",
      description: "Eine nahtlose, automatisierte Journey — ohne Reibung und ohne Verzögerung.",
      steps: [
        { title: "Besucher", desc: "Landet auf Ihrer Website" },
        { title: "KI-Chat", desc: "Aria erkennt den Bedarf" },
        { title: "WhatsApp", desc: "Gespräch geht weiter" },
        { title: "Termin", desc: "Sofort gebucht" },
        { title: "Bestätigung", desc: "Erinnerung gesendet" },
      ],
    },
    testimonials: {
      kicker: "Patientenstimmen",
      title: "Leiser Luxus. Starke Ergebnisse.",
      items: [
        { name: "Olivia Bennett", role: "Patientin · NYC", text: "Vom KI-Chat bis zum goldveredelten Empfang wirkt jedes Detail premium. Meine Veneers sind makellos." },
        { name: "Marcus Reed", role: "Patient · LA", text: "Ich habe direkt meine ganze Familie neu eingebucht. Aria kümmerte sich um Termine, Erinnerungen und sogar Versicherungsfragen." },
        { name: "Anya Sharma", role: "Patientin · Miami", text: "Das Invisalign-Tracking über WhatsApp ist genial. Ich habe keinen einzigen Schritt verpasst." },
        { name: "Daniel Cho", role: "Patient · Chicago", text: "Notfall um 23 Uhr — die KI hat mir einen 7-Uhr-Slot gebucht. Sie hat meinen Frontzahn und meinen nächsten Pitch gerettet." },
      ],
    },
    faq: {
      kicker: "FAQ",
      title: "Fragen, beantwortet.",
      items: [
        { q: "Ist der KI-Assistent sicher für meine Gesundheitsdaten?", a: "Ja. Aria ist HIPAA-konform und Ende-zu-Ende verschlüsselt. Ihre Daten trainieren niemals öffentliche Modelle." },
        { q: "Akzeptieren Sie Versicherungen?", a: "Wir akzeptieren die meisten großen US-Versicherungen und bieten transparente Finanzierungsoptionen." },
        { q: "Wie schnell bekomme ich einen Termin?", a: "Die meisten Patienten buchen innerhalb von 60 Sekunden. Notfall-Slots werden täglich freigehalten." },
        { q: "Was, wenn ich mit einem Menschen sprechen möchte?", a: "Aria leitet innerhalb von 30 Sekunden an unser Team weiter – an 7 Tagen die Woche." },
        { q: "Wo befinden Sie sich?", a: "Unsere Hauptklinik befindet sich in Manhattan, NYC – virtuelle Beratungen sind landesweit verfügbar." },
      ],
    },
    footer: {
      ctaTitle: "Bereit für Ihr bestes Lächeln?",
      ctaDescription: "Buchen Sie in 60 Sekunden mit Aria, Ihrer KI-Dentalassistentin.",
      book: "Termin buchen",
      tagline: "Luxus-Zahnmedizin, intelligent umgesetzt.",
      contact: "Kontakt",
      hours: "Öffnungszeiten",
      services: "Leistungen",
      hoursWeekdays: "Mo–Fr · 8–20 Uhr",
      hoursSaturday: "Sa · 9–17 Uhr",
      hoursSunday: "So · KI-Assistent 24/7",
      servicesList: ["Zahnaufhellung", "Zahnimplantate", "Invisalign", "Notfallversorgung"],
      rights: "Alle Rechte vorbehalten.",
      compliance: "HIPAA-konform · ADA-zertifiziert · AACD-Mitglied",
    },
    floating: {
      aiTitle: "Aria · KI-Assistentin",
      aiStatus: "Antwortet in der Regel sofort",
      aiGreeting: "Hallo! Ich kann Fragen beantworten oder Ihren Besuch buchen. Wobei kann ich helfen?",
      inputPlaceholder: "Nachricht eingeben...",
    },
  },
};

type I18nContextValue = {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: Translation;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<LanguageCode>(defaultLanguage);

  useEffect(() => {
    const stored = window.localStorage.getItem("lumiere-language") as LanguageCode | null;
    if (stored && stored in translations) {
      setLanguage(stored);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("lumiere-language", language);
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: translations[language],
    }),
    [language],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
}
