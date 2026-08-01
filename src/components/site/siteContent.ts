import type { Lang } from "@/lib/i18n";

export interface ServiceInfo {
  id: string;
  icon: string;
  title: string;
  tagline: string;
  desc: string;
  longDesc: string;
  points: string[];
  items: string[];
}

export interface PlanInfo {
  id: string;
  name: string;
  price: string;
  period: string;
  blurb: string;
  popular?: boolean;
  features: string[];
}

export interface SiteText {
  brand: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  waLink: string;
  nav: {
    home: string;
    services: string;
    amc: string;
    about: string;
    contact: string;
    login: string;
    app: string;
  };
  hero: {
    badge: string;
    title: string;
    titleAccent: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    stats: { value: string; label: string }[];
  };
  sectionServices: { heading: string; sub: string };
  services: ServiceInfo[];
  why: {
    heading: string;
    sub: string;
    items: { icon: string; title: string; desc: string }[];
  };
  amcBanner: { heading: string; sub: string; cta: string };
  ctaBand: { heading: string; sub: string; call: string; whatsapp: string };
  footer: {
    aboutText: string;
    quickLinks: string;
    ourServices: string;
    contactUs: string;
    hours: string;
    hoursValue: string;
    rights: string;
    openApp: string;
  };
  servicesPage: {
    heading: string;
    sub: string;
    whatsIncluded: string;
    requestCta: string;
  };
  amcPage: {
    heading: string;
    sub: string;
    popular: string;
    perMonth: string;
    whatIncluded: string;
    includedItems: string[];
    customTitle: string;
    customText: string;
    customCta: string;
  };
  plans: PlanInfo[];
  aboutPage: {
    heading: string;
    sub: string;
    storyHeading: string;
    storyText: string;
    missionHeading: string;
    missionText: string;
    valuesHeading: string;
    valuesSub: string;
    values: { icon: string; title: string; desc: string }[];
    ctaHeading: string;
    ctaText: string;
    ctaBtn: string;
  };
  contactPage: {
    heading: string;
    sub: string;
    cards: { icon: string; title: string; value: string; sub: string }[];
    formHeading: string;
    formSub: string;
    name: string;
    phoneField: string;
    service: string;
    message: string;
    messagePlaceholder: string;
    send: string;
    chooseService: string;
  };
}

const en: SiteText = {
  brand: "FixitPoint360",
  tagline: "Complete IT & Home Services",
  phone: "9752990613",
  email: "sanjaykumarpatel613@gmail.com",
  address: "Village Mairtola, PO Bhamraha 1st, Tah Beohari, Dist. Shahdol, MP",
  waLink: "https://wa.me/919752990613",
  nav: {
    home: "Home",
    services: "Services",
    amc: "AMC Plans",
    about: "About Us",
    contact: "Contact",
    login: "Login",
    app: "Open App",
  },
  hero: {
    badge: "Trusted by 100+ families & businesses",
    title: "All Your IT & Home Services,",
    titleAccent: "At One Point",
    subtitle:
      "CCTV, computer, printer repair and household services with transparent pricing, genuine parts and on-time service. Backed by AMC plans that keep your equipment running 24/7.",
    ctaPrimary: "Explore Services",
    ctaSecondary: "View AMC Plans",
    stats: [
      { value: "5+", label: "Years of Experience" },
      { value: "100+", label: "Happy Clients" },
      { value: "24/7", label: "Support Available" },
      { value: "4.9★", label: "Client Rating" },
    ],
  },
  sectionServices: {
    heading: "Our Services",
    sub: "Complete care for your office, shop and home — all under one roof.",
  },
  services: [
    {
      id: "cctv",
      icon: "cctv",
      title: "CCTV Installation & Repair",
      tagline: "Complete security camera setup for home, shop & offices.",
      desc: "Professional CCTV installation with mobile viewing — protect your property 24/7.",
      longDesc:
        "We design and install complete CCTV surveillance for homes, shops, offices and factories — including wiring, DVR/NVR configuration and mobile viewing, so you can watch your property from anywhere. Existing systems are serviced, repaired or upgraded as needed.",
      points: [
        "Site survey & camera installation",
        "DVR/NVR & mobile viewing setup",
        "Repair & maintenance of existing cameras",
      ],
      items: [
        "Home, shop, factory & office CCTV installation",
        "HD / IP / Wi-Fi camera supply & fitting",
        "DVR, NVR and monitor configuration",
        "Mobile / PC remote viewing setup",
        "Camera repair, replacement & relocation",
        "Quarterly preventive maintenance",
      ],
    },
    {
      id: "computer",
      icon: "computer",
      title: "Computer Repair & Maintenance",
      tagline: "Desktop & laptop repair, OS setup and office network support.",
      desc: "Hardware repair, OS installation, data backup and network setup for home and business.",
      longDesc:
        "Complete computer solutions for homes and businesses — repairs, OS installation, data backup and network setup. We also guide you on the right purchase so both your money and time are saved.",
      points: [
        "Hardware repair & upgrades",
        "OS installation & data backup",
        "Office & network setup",
      ],
      items: [
        "Desktop & laptop hardware repair",
        "Windows / OS installation & update",
        "Virus removal & system speed-up",
        "Data backup & recovery",
        "New computer purchase guidance",
        "Office LAN & Wi-Fi setup",
      ],
    },
    {
      id: "printer",
      icon: "printer",
      title: "Printer Repair, Cartridge Refilling & Maintenance",
      tagline: "Printer repair, cartridge refilling and AMC for shops & offices.",
      desc: "Get your printers running again — repairs, genuine cartridge refilling and regular maintenance.",
      longDesc:
        "We keep your printing running without interruption — inkjet and laser printer repairs, cartridge refilling with genuine quality, and printer AMC for offices, schools and shops that rely on daily printing.",
      points: [
        "Printer repair & servicing",
        "Cartridge refilling & toner replacement",
        "Printer AMC for offices & shops",
      ],
      items: [
        "Inkjet & laser printer repair",
        "Cartridge refilling (genuine quality)",
        "Toner & drum replacement",
        "Printhead cleaning & alignment",
        "Network / shared printer setup",
        "Printer AMC & preventive maintenance",
      ],
    },
    {
      id: "household",
      icon: "household",
      title: "Household Services",
      tagline: "Electrical, fittings and small home repair services.",
      desc: "Electrical work, fan & light fitting, wiring and small household repairs done right.",
      longDesc:
        "From fixing a fused switch to complete wiring work, we handle everyday household needs — fans, lights, sockets, plumbing and small repairs — quickly and cleanly.",
      points: [
        "Electrical repairs & fittings",
        "Fan, light, switch & wiring work",
        "Plumbing & small home repairs",
      ],
      items: [
        "Electrical wiring & switchboard work",
        "Fan, light, tube & panel fitting",
        "MCB / fuse / meter-related repair",
        "Small plumbing repairs",
        "TV antenna / dish mounting",
        "Any other small home repair",
      ],
    },
    {
      id: "other",
      icon: "other",
      title: "Other Services",
      tagline: "Networking, data recovery and custom IT support.",
      desc: "Networking, internet setup, data recovery and custom support for growing businesses.",
      longDesc:
        "Beyond routine repairs, we help businesses grow with networking, internet and Wi-Fi setup, data recovery, cloud backup and custom IT support for POS and billing systems.",
      points: [
        "Networking & internet setup",
        "Data recovery & backup",
        "Custom IT support for businesses",
      ],
      items: [
        "Router / internet / Wi-Fi setup",
        "Office networking & wiring",
        "Data recovery from HDD / pen drive",
        "Cloud backup setup",
        "POS & billing software support",
        "Custom IT projects",
      ],
    },
  ],
  why: {
    heading: "Why Choose Us",
    sub: "On-time, transparent and dependable service on every single visit.",
    items: [
      {
        icon: "clock",
        title: "On-time Service",
        desc: "We reach at the promised time, every single visit.",
      },
      {
        icon: "rupee",
        title: "Transparent Pricing",
        desc: "Clear estimates before work starts — no hidden charges.",
      },
      {
        icon: "shield",
        title: "Genuine Parts",
        desc: "We use only quality, genuine spares with warranty.",
      },
      {
        icon: "trending",
        title: "AMC Savings",
        desc: "AMC plans cut repair costs by up to 30%.",
      },
    ],
  },
  amcBanner: {
    heading: "Preventive Maintenance, Zero Surprises",
    sub: "Skip the worry of sudden breakdowns with an AMC plan — save money and get peace of mind.",
    cta: "View AMC Plans",
  },
  ctaBand: {
    heading: "Need a service right now?",
    sub: "Call us or send a message on WhatsApp — we will reach you as soon as possible.",
    call: "Call Now",
    whatsapp: "WhatsApp Us",
  },
  footer: {
    aboutText:
      "Complete care for CCTV, computers, printers and household services under one roof — with trust, quality and on-time service.",
    quickLinks: "Quick Links",
    ourServices: "Our Services",
    contactUs: "Contact Us",
    hours: "Working Hours",
    hoursValue: "Mon–Sat: 9:00 AM – 7:00 PM · Sun: Emergency only",
    rights: "All rights reserved.",
    openApp: "Open App",
  },
  servicesPage: {
    heading: "Our Services",
    sub: "Reliable service for every home, shop or office — all in one place.",
    whatsIncluded: "What we do",
    requestCta: "Request This Service",
  },
  amcPage: {
    heading: "AMC Plans",
    sub: "Preventive maintenance keeps your equipment healthy and cuts sudden breakdowns. Choose a plan that fits your shop, office or home.",
    popular: "Most Popular",
    perMonth: "/month",
    whatIncluded: "Included in every plan",
    includedItems: [
      "Preventive maintenance visits",
      "Priority service for breakdowns",
      "Discounted rates on repairs & parts",
      "No hidden charges",
    ],
    customTitle: "Need a custom plan?",
    customText:
      "Have many devices or special requirements? Tell us your setup and we will build the right plan for you.",
    customCta: "Talk to Us",
  },
  plans: [
    {
      id: "basic",
      name: "Basic",
      price: "₹499",
      period: "/month",
      blurb: "Best for a single printer or computer at home or a small shop.",
      features: [
        "Covers 1 device",
        "Quarterly preventive maintenance",
        "10% discount on repair charges",
        "Priority phone support",
        "Free travel within city",
      ],
    },
    {
      id: "standard",
      name: "Standard",
      price: "₹999",
      period: "/month",
      blurb: "Best for offices and shops with a few computers and printers.",
      popular: true,
      features: [
        "Covers up to 5 devices",
        "Monthly preventive maintenance",
        "20% discount on repair charges",
        "Priority on-site service",
        "Free travel within city",
        "Annual health checkup report",
      ],
    },
    {
      id: "premium",
      name: "Premium",
      price: "₹1,999",
      period: "/month",
      blurb: "Best for growing businesses that need full-time peace of mind.",
      features: [
        "Covers unlimited devices",
        "On-demand on-site support",
        "30% discount on repair charges",
        "Dedicated contact for support",
        "Free travel within city",
        "Comprehensive annual audit",
      ],
    },
  ],
  aboutPage: {
    heading: "About Us",
    sub: "Reliable IT & home services reaching businesses and families in small towns.",
    storyHeading: "Our Story",
    storyText:
      "FixitPoint360 started with a simple idea — businesses and homes in smaller towns deserve the same quality IT service as big cities. What began as a one-man computer repair service has grown into a complete IT & home services team, trusted by shops, schools, hospitals and families across the Shahdol district.",
    missionHeading: "Our Mission",
    missionText:
      "To provide reliable, honest and affordable IT and home services, so every customer can focus on their work while we take care of the machines.",
    valuesHeading: "Our Values",
    valuesSub: "The principles behind every job we do.",
    values: [
      {
        icon: "shield",
        title: "Integrity",
        desc: "Honest advice, fair pricing, no shortcuts.",
      },
      {
        icon: "badge",
        title: "Quality",
        desc: "Genuine parts and workmanship that lasts.",
      },
      {
        icon: "clock",
        title: "Punctuality",
        desc: "We value your time as much as ours.",
      },
      {
        icon: "headset",
        title: "Support",
        desc: "We stay with you after the job is done.",
      },
    ],
    ctaHeading: "Ready to get started?",
    ctaText: "Book a service or ask for an AMC plan today.",
    ctaBtn: "Contact Us",
  },
  contactPage: {
    heading: "Contact Us",
    sub: "Have a question or want to book a service? Call, WhatsApp or email us.",
    cards: [
      {
        icon: "phone",
        title: "Call Us",
        value: "+91 9752990613",
        sub: "Mon–Sat, 9 AM – 7 PM",
      },
      {
        icon: "message",
        title: "WhatsApp",
        value: "+91 9752990613",
        sub: "Quick replies on WhatsApp",
      },
      {
        icon: "mail",
        title: "Email",
        value: "sanjaykumarpatel613@gmail.com",
        sub: "We reply within 24 hours",
      },
      {
        icon: "map",
        title: "Visit Us",
        value: "Beohari, Shahdol",
        sub: "Village Mairtola, PO Bhamraha 1st, MP",
      },
    ],
    formHeading: "Send a Service Request",
    formSub: "Fill the form below — we will confirm your request on WhatsApp.",
    name: "Your Name",
    phoneField: "Phone Number",
    service: "Service Needed",
    message: "Message",
    messagePlaceholder: "Tell us briefly what you need help with...",
    send: "Send Request",
    chooseService: "Select a service",
  },
};

const hi: SiteText = {
  brand: "फिक्सिटपॉइंट360",
  tagline: "संपूर्ण आईटी एवं घरेलू सेवाएँ",
  phone: "9752990613",
  email: "sanjaykumarpatel613@gmail.com",
  address: "ग्राम मैरटोला, पो. भमराहा प्रथम, तह. ब्यौहारी, जिला शहडोल, म.प्र.",
  waLink: "https://wa.me/919752990613",
  nav: {
    home: "होम",
    services: "सेवाएँ",
    amc: "एएमसी योजनाएँ",
    about: "हमारे बारे में",
    contact: "संपर्क",
    login: "लॉगिन",
    app: "ऐप खोलें",
  },
  hero: {
    badge: "100+ परिवारों और व्यवसायों का भरोसा",
    title: "आपकी सभी आईटी एवं घरेलू सेवाएँ,",
    titleAccent: "एक ही स्थान पर",
    subtitle:
      "सीसीटीवी, कंप्यूटर, प्रिंटर मरम्मत और घरेलू सेवाएँ — पारदर्शी मूल्य, असली पार्ट्स और समय पर सेवा के साथ। एएमसी योजनाओं के साथ आपके उपकरण 24/7 चालू रहते हैं।",
    ctaPrimary: "सेवाएँ देखें",
    ctaSecondary: "एएमसी योजनाएँ देखें",
    stats: [
      { value: "5+", label: "वर्षों का अनुभव" },
      { value: "100+", label: "संतुष्ट ग्राहक" },
      { value: "24/7", label: "सेवा उपलब्ध" },
      { value: "4.9★", label: "ग्राहक रेटिंग" },
    ],
  },
  sectionServices: {
    heading: "हमारी सेवाएँ",
    sub: "ऑफिस, दुकान और घर की पूरी देखभाल — एक ही छत के नीचे।",
  },
  services: [
    {
      id: "cctv",
      icon: "cctv",
      title: "सीसीटीवी लगाना व मरम्मत",
      tagline: "घर, दुकान और ऑफिस के लिए पूर्ण सुरक्षा कैमरा सिस्टम।",
      desc: "मोबाइल व्यूइंग के साथ प्रोफेशनल सीसीटीवी इंस्टॉलेशन — अपनी संपत्ति की 24/7 सुरक्षा करें।",
      longDesc:
        "हम घर, दुकान, फैक्ट्री और ऑफिस के लिए पूरा सीसीटीवी निगरानी सिस्टम बनाते हैं — वायरिंग, डीवीआर/एनवीआर कॉन्फ़िगरेशन और मोबाइल व्यूइंग समेत, ताकि आप कहीं से भी अपनी संपत्ति देख सकें। मौजूदा सिस्टम की मरम्मत, अपग्रेड या रखरखाव भी करते हैं।",
      points: [
        "साइट सर्वे व कैमरा इंस्टॉलेशन",
        "डीवीआर/एनवीआर व मोबाइल व्यूइंग सेटअप",
        "पुराने कैमरों की मरम्मत व देखभाल",
      ],
      items: [
        "घर, दुकान, फैक्ट्री व ऑफिस सीसीटीवी इंस्टॉलेशन",
        "एचडी / आईपी / वाई-फाई कैमरा सप्लाई व फिटिंग",
        "डीवीआर, एनवीआर व मॉनिटर कॉन्फ़िगरेशन",
        "मोबाइल / पीसी रिमोट व्यूइंग सेटअप",
        "कैमरा मरम्मत, बदलाव व स्थानांतरण",
        "हर तिमाही मेंटेनेंस",
      ],
    },
    {
      id: "computer",
      icon: "computer",
      title: "कंप्यूटर मरम्मत व रखरखाव",
      tagline: "डेस्कटॉप व लैपटॉप मरम्मत, ओएस सेटअप और ऑफिस नेटवर्क सपोर्ट।",
      desc: "हार्डवेयर मरम्मत, ओएस इंस्टॉलेशन, डेटा बैकअप और घर व व्यवसाय के लिए नेटवर्क सेटअप।",
      longDesc:
        "घर और व्यवसाय दोनों के लिए पूरा कंप्यूटर समाधान — मरम्मत, ओएस इंस्टॉलेशन, डेटा बैकअप और नेटवर्क सेटअप। सही खरीदारी की सलाह भी देते हैं ताकि आपका पैसा और समय दोनों बचे।",
      points: [
        "हार्डवेयर मरम्मत व अपग्रेड",
        "ओएस इंस्टॉलेशन व डेटा बैकअप",
        "ऑफिस व नेटवर्क सेटअप",
      ],
      items: [
        "डेस्कटॉप व लैपटॉप हार्डवेयर मरम्मत",
        "विंडोज़ / ओएस इंस्टॉलेशन व अपडेट",
        "वायरस हटाना व सिस्टम स्पीड बढ़ाना",
        "डेटा बैकअप व रिकवरी",
        "नया कंप्यूटर खरीदने में सलाह",
        "ऑफिस LAN व वाई-फाई सेटअप",
      ],
    },
    {
      id: "printer",
      icon: "printer",
      title: "प्रिंटर मरम्मत, कार्ट्रिज रिफिल व रखरखाव",
      tagline: "प्रिंटर मरम्मत, कार्ट्रिज रिफिलिंग और दुकानों-ऑफिसों के लिए एएमसी।",
      desc: "अपने प्रिंटर फिर से चालू करें — मरम्मत, असली गुणवत्ता वाली कार्ट्रिज रिफिलिंग और नियमित रखरखाव।",
      longDesc:
        "हम आपका प्रिंटिंग काम बिना रुकावट चलाते हैं — इंकजेट व लेज़र प्रिंटर मरम्मत, असली गुणवत्ता की कार्ट्रिज रिफिलिंग, और ऑफिसों, स्कूलों व दुकानों के लिए प्रिंटर एएमसी।",
      points: [
        "प्रिंटर मरम्मत व सर्विसिंग",
        "कार्ट्रिज रिफिलिंग व टोनर बदलना",
        "ऑफिस व दुकानों के लिए प्रिंटर एएमसी",
      ],
      items: [
        "इंकजेट व लेज़र प्रिंटर मरम्मत",
        "कार्ट्रिज रिफिलिंग (असली गुणवत्ता)",
        "टोनर व ड्रम बदलना",
        "प्रिंटहेड सफाई व अलाइनमेंट",
        "नेटवर्क / शेयर्ड प्रिंटर सेटअप",
        "प्रिंटर एएमसी व नियमित देखभाल",
      ],
    },
    {
      id: "household",
      icon: "household",
      title: "घरेलू सेवाएँ",
      tagline: "बिजली, फिटिंग और घर की छोटी-मोटी मरम्मत।",
      desc: "बिजली का काम, पंखा-लाइट फिटिंग, वायरिंग और घर की छोटी मरम्मत — सही तरीके से।",
      longDesc:
        "फ्यूज बदलने से लेकर पूरी वायरिंग तक, हम रोज़ की घरेलू ज़रूरतें — पंखे, लाइट, स्विच, प्लंबिंग और छोटी मरम्मत — जल्दी और साफ-सुथरे तरीके से करते हैं।",
      points: [
        "बिजली की मरम्मत व फिटिंग",
        "पंखा, लाइट, स्विच व वायरिंग",
        "प्लंबिंग व घरेलू मरम्मत",
      ],
      items: [
        "बिजली वायरिंग व स्विचबोर्ड का काम",
        "पंखा, लाइट, ट्यूब व पैनल फिटिंग",
        "एमसीबी / फ्यूज / मीटर की मरम्मत",
        "छोटी प्लंबिंग मरम्मत",
        "टीवी एंटीना / डिश माउंटिंग",
        "कोई भी अन्य घरेलू मरम्मत",
      ],
    },
    {
      id: "other",
      icon: "other",
      title: "अन्य सेवाएँ",
      tagline: "नेटवर्किंग, डेटा रिकवरी और कस्टम आईटी सपोर्ट।",
      desc: "नेटवर्किंग, इंटरनेट सेटअप, डेटा रिकवरी और बढ़ते व्यवसायों के लिए कस्टम सपोर्ट।",
      longDesc:
        "रूटीन मरम्मत के अलावा, हम व्यवसायों को नेटवर्किंग, इंटरनेट व वाई-फाई सेटअप, डेटा रिकवरी, क्लाउड बैकअप और POS व बिलिंग सिस्टम के लिए कस्टम आईटी सपोर्ट देकर आगे बढ़ने में मदद करते हैं।",
      points: [
        "नेटवर्किंग व इंटरनेट सेटअप",
        "डेटा रिकवरी व बैकअप",
        "व्यवसायों के लिए कस्टम आईटी सपोर्ट",
      ],
      items: [
        "राउटर / इंटरनेट / वाई-फाई सेटअप",
        "ऑफिस नेटवर्किंग व वायरिंग",
        "HDD / पेन ड्राइव से डेटा रिकवरी",
        "क्लाउड बैकअप सेटअप",
        "POS व बिलिंग सॉफ्टवेयर सपोर्ट",
        "कस्टम आईटी प्रोजेक्ट",
      ],
    },
  ],
  why: {
    heading: "हमें क्यों चुनें",
    sub: "हर विज़िट पर समय पर, पारदर्शी और भरोसेमंद सेवा।",
    items: [
      {
        icon: "clock",
        title: "समय पर सेवा",
        desc: "हम हर विज़िट पर वादे के समय पर पहुँचते हैं।",
      },
      {
        icon: "rupee",
        title: "पारदर्शी मूल्य",
        desc: "काम शुरू होने से पहले स्पष्ट अनुमान — कोई छिपा शुल्क नहीं।",
      },
      {
        icon: "shield",
        title: "असली पार्ट्स",
        desc: "हम केवल वारंटी के साथ गुणवत्ता वाले असली पार्ट्स लगाते हैं।",
      },
      {
        icon: "trending",
        title: "एएमसी से बचत",
        desc: "एएमसी योजनाएँ मरम्मत लागत में 30% तक बचत कराती हैं।",
      },
    ],
  },
  amcBanner: {
    heading: "प्रीवेंटिव मेंटेनेंस, कोई अप्रत्याशित खर्च नहीं",
    sub: "एएमसी योजना के साथ अचानक ब्रेकडाउन की चिंता छोड़ें — पैसे की बचत और मन की शांति दोनों पाएँ।",
    cta: "एएमसी योजनाएँ देखें",
  },
  ctaBand: {
    heading: "अभी सेवा चाहिए?",
    sub: "फोन करें या व्हाट्सएप पर संदेश भेजें — हम जल्द से जल्द पहुँचेंगे।",
    call: "कॉल करें",
    whatsapp: "व्हाट्सएप करें",
  },
  footer: {
    aboutText:
      "सीसीटीवी, कंप्यूटर, प्रिंटर और घरेलू सेवाओं की एक ही छत के नीचे संपूर्ण देखभाल — विश्वास, गुणवत्ता और समय पर सेवा के साथ।",
    quickLinks: "क्विक लिंक्स",
    ourServices: "हमारी सेवाएँ",
    contactUs: "संपर्क करें",
    hours: "कार्य समय",
    hoursValue: "सोम–शनि: सुबह 9 – शाम 7 · रविवार: आपातकालीन",
    rights: "सर्वाधिकार सुरक्षित।",
    openApp: "ऐप खोलें",
  },
  servicesPage: {
    heading: "हमारी सेवाएँ",
    sub: "हर घर, दुकान या ऑफिस के लिए भरोसेमंद सेवा — सब एक ही जगह।",
    whatsIncluded: "हम क्या करते हैं",
    requestCta: "यह सेवा मंगवाएँ",
  },
  amcPage: {
    heading: "एएमसी योजनाएँ",
    sub: "प्रीवेंटिव मेंटेनेंस आपके उपकरणों को स्वस्थ रखती है और अचानक ब्रेकडाउन घटाती है। अपनी दुकान, ऑफिस या घर के लिए सही योजना चुनें।",
    popular: "सबसे लोकप्रिय",
    perMonth: "/माह",
    whatIncluded: "हर योजना में शामिल",
    includedItems: [
      "प्रीवेंटिव मेंटेनेंस विज़िट",
      "ब्रेकडाउन पर प्राथमिकता सेवा",
      "मरम्मत व पार्ट्स पर छूट",
      "कोई छिपा शुल्क नहीं",
    ],
    customTitle: "कस्टम योजना चाहिए?",
    customText:
      "कई उपकरण या खास ज़रूरतें हैं? अपना सेटअप बताइए — हम आपके लिए सही योजना बनाएँगे।",
    customCta: "हमसे बात करें",
  },
  plans: [
    {
      id: "basic",
      name: "बेसिक",
      price: "₹499",
      period: "/माह",
      blurb: "घर या छोटी दुकान के एक प्रिंटर या कंप्यूटर के लिए सबसे उपयुक्त।",
      features: [
        "1 उपकरण कवर",
        "हर तिमाही प्रीवेंटिव मेंटेनेंस",
        "मरम्मत शुल्क पर 10% छूट",
        "प्राथमिकता फोन सपोर्ट",
        "शहर के भीतर निःशुल्क आवागमन",
      ],
    },
    {
      id: "standard",
      name: "स्टैंडर्ड",
      price: "₹999",
      period: "/माह",
      blurb: "कुछ कंप्यूटर-प्रिंटर वाले ऑफिस और दुकानों के लिए सबसे उपयुक्त।",
      popular: true,
      features: [
        "5 उपकरण तक कवर",
        "मासिक प्रीवेंटिव मेंटेनेंस",
        "मरम्मत शुल्क पर 20% छूट",
        "प्राथमिकता ऑन-साइट सेवा",
        "शहर के भीतर निःशुल्क आवागमन",
        "वार्षिक स्वास्थ्य जाँच रिपोर्ट",
      ],
    },
    {
      id: "premium",
      name: "प्रीमियम",
      price: "₹1,999",
      period: "/माह",
      blurb: "पूरी तरह मन की शांति चाहने वाले बढ़ते व्यवसायों के लिए।",
      features: [
        "असीमित उपकरण कवर",
        "ऑन-डिमांड ऑन-साइट सपोर्ट",
        "मरम्मत शुल्क पर 30% छूट",
        "सपोर्ट के लिए समर्पित संपर्क",
        "शहर के भीतर निःशुल्क आवागमन",
        "संपूर्ण वार्षिक ऑडिट",
      ],
    },
  ],
  aboutPage: {
    heading: "हमारे बारे में",
    sub: "छोटे शहरों के व्यवसायों और परिवारों तक पहुँचने वाली भरोसेमंद आईटी व घरेलू सेवा।",
    storyHeading: "हमारी कहानी",
    storyText:
      "फिक्सिटपॉइंट360 की शुरुआत एक साधारण सोच से हुई — छोटे शहरों के व्यवसायों और घरों को भी बड़े शहरों जैसी गुणवत्ता वाली आईटी सेवा मिलनी चाहिए। एक अकेले कंप्यूटर मरम्मत काम से शुरू होकर आज यह एक पूरी आईटी एवं घरेलू सेवा टीम बन चुकी है, जिस पर शहडोल जिले की दुकानें, स्कूल, अस्पताल और परिवार भरोसा करते हैं।",
    missionHeading: "हमारा उद्देश्य",
    missionText:
      "विश्वसनीय, ईमानदार और किफायती आईटी व घरेलू सेवाएँ देना, ताकि हर ग्राहक अपने काम पर ध्यान दे सके और मशीनों की देखभाल हम करें।",
    valuesHeading: "हमारे मूल्य",
    valuesSub: "हर काम के पीछे हमारे ये सिद्धांत।",
    values: [
      {
        icon: "shield",
        title: "ईमानदारी",
        desc: "सच्ची सलाह, उचित मूल्य, कोई शॉर्टकट नहीं।",
      },
      {
        icon: "badge",
        title: "गुणवत्ता",
        desc: "असली पार्ट्स और टिकाऊ कारीगरी।",
      },
      {
        icon: "clock",
        title: "समय की पाबंदी",
        desc: "हम आपके समय को उतना ही महत्व देते हैं।",
      },
      {
        icon: "headset",
        title: "सहयोग",
        desc: "काम खत्म होने के बाद भी आपके साथ।",
      },
    ],
    ctaHeading: "शुरू करने के लिए तैयार हैं?",
    ctaText: "आज ही सेवा बुक करें या एएमसी योजना के बारे में पूछें।",
    ctaBtn: "संपर्क करें",
  },
  contactPage: {
    heading: "संपर्क करें",
    sub: "कोई सवाल है या सेवा बुक करनी है? कॉल, व्हाट्सएप या ईमेल करें।",
    cards: [
      {
        icon: "phone",
        title: "कॉल करें",
        value: "+91 9752990613",
        sub: "सोम–शनि, सुबह 9 – शाम 7",
      },
      {
        icon: "message",
        title: "व्हाट्सएप",
        value: "+91 9752990613",
        sub: "व्हाट्सएप पर तुरंत जवाब",
      },
      {
        icon: "mail",
        title: "ईमेल",
        value: "sanjaykumarpatel613@gmail.com",
        sub: "24 घंटे के भीतर जवाब",
      },
      {
        icon: "map",
        title: "हमसे मिलें",
        value: "ब्यौहारी, शहडोल",
        sub: "ग्राम मैरटोला, पो. भमराहा प्रथम, म.प्र.",
      },
    ],
    formHeading: "सेवा अनुरोध भेजें",
    formSub: "नीचे फॉर्म भरें — हम आपके अनुरोध की व्हाट्सएप पर पुष्टि करेंगे।",
    name: "आपका नाम",
    phoneField: "फोन नंबर",
    service: "कौन सी सेवा चाहिए",
    message: "संदेश",
    messagePlaceholder: "संक्षेप में बताएं कि किस चीज़ की मदद चाहिए...",
    send: "अनुरोध भेजें",
    chooseService: "सेवा चुनें",
  },
};

export const siteContent: Record<Lang, SiteText> = { en, hi };
