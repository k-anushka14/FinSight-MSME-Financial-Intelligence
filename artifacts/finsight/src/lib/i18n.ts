export type Lang = "en" | "hi" | "mr";

export const LANGUAGES: { code: Lang; label: string }[] = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी" },
  { code: "mr", label: "मराठी" },
];

// BCP-47 codes used to pick a speech-synthesis voice for each language.
export const VOICE_LOCALE: Record<Lang, string> = {
  en: "en-IN",
  hi: "hi-IN",
  mr: "mr-IN",
};

const UI_TRANSLATIONS: Record<string, Record<Exclude<Lang, "en">, string>> = {
  "Command centre": { hi: "कमांड सेंटर", mr: "कमांड सेंटर" },
  Understand: { hi: "समझें", mr: "समजून घ्या" },
  Act: { hi: "कार्रवाई", mr: "कृती" },
  Overview: { hi: "अवलोकन", mr: "आढावा" },
  Transactions: { hi: "लेन-देन", mr: "व्यवहार" },
  Revenue: { hi: "राजस्व", mr: "महसूल" },
  Receivables: { hi: "प्राप्य राशि", mr: "येणे रक्कम" },
  Payables: { hi: "देय राशि", mr: "देणे रक्कम" },
  Vendors: { hi: "विक्रेता", mr: "विक्रेते" },
  Analytics: { hi: "विश्लेषण", mr: "विश्लेषण" },
  "Cash forecast": { hi: "नकदी पूर्वानुमान", mr: "रोख अंदाज" },
  "Month on month": { hi: "मासिक तुलना", mr: "महिन्याची तुलना" },
  "Alert centre": { hi: "अलर्ट सेंटर", mr: "सूचना केंद्र" },
  "What-if simulator": { hi: "क्या-अगर सिम्युलेटर", mr: "काय-जर सिम्युलेटर" },
  "Invoice intelligence": { hi: "चालान इंटेलिजेंस", mr: "चलन बुद्धिमत्ता" },
  "Business copilot": { hi: "बिज़नेस कोपायलट", mr: "बिझनेस कोपायलट" },
  Reports: { hi: "रिपोर्ट", mr: "अहवाल" },
  Settings: { hi: "सेटिंग्स", mr: "सेटिंग्ज" },
  Workspace: { hi: "वर्कस्पेस", mr: "वर्कस्पेस" },
  "Search anything...": { hi: "कुछ भी खोजें...", mr: "काहीही शोधा..." },
  "Log out": { hi: "लॉग आउट", mr: "लॉग आउट" },
  "This financial year": { hi: "यह वित्तीय वर्ष", mr: "हे आर्थिक वर्ष" },
  "Last 6 months": { hi: "पिछले 6 महीने", mr: "मागील 6 महिने" },
  "This quarter": { hi: "यह तिमाही", mr: "ही तिमाही" },
  "Export snapshot": { hi: "स्नैपशॉट निर्यात करें", mr: "स्नॅपशॉट निर्यात करा" },
  "Revenue vs expenses": { hi: "राजस्व बनाम खर्च", mr: "महसूल विरुद्ध खर्च" },
  "Financial health": { hi: "वित्तीय स्वास्थ्य", mr: "आर्थिक आरोग्य" },
  "Where expenses went": { hi: "खर्च कहाँ हुआ", mr: "खर्च कुठे झाला" },
  "Cash-flow forecast": { hi: "नकदी प्रवाह पूर्वानुमान", mr: "रोख प्रवाह अंदाज" },
  "Receivables to watch": { hi: "निगरानी योग्य प्राप्य", mr: "लक्ष ठेवण्यासारखी येणी" },
  "Anomaly alerts": { hi: "असामान्यता अलर्ट", mr: "विसंगती सूचना" },
  "Revenue overview": { hi: "राजस्व अवलोकन", mr: "महसूल आढावा" },
  "Revenue performance": { hi: "राजस्व प्रदर्शन", mr: "महसूल कामगिरी" },
  "Expense analytics": { hi: "खर्च विश्लेषण", mr: "खर्च विश्लेषण" },
  "Alerts & recommendations": { hi: "अलर्ट और सुझाव", mr: "सूचना आणि शिफारसी" },
  "Monthly management pack": { hi: "मासिक प्रबंधन पैक", mr: "मासिक व्यवस्थापन पॅक" },
  "Receivables aging": { hi: "प्राप्य राशि एजिंग", mr: "येणी वय विश्लेषण" },
  "Vendor spend review": { hi: "विक्रेता खर्च समीक्षा", mr: "विक्रेता खर्च आढावा" },
  Ask: { hi: "पूछें", mr: "विचारा" },
  "Export PDF": { hi: "PDF निर्यात करें", mr: "PDF निर्यात करा" },
  "Generating PDF...": { hi: "PDF तैयार हो रही है...", mr: "PDF तयार होत आहे..." },
  Downloaded: { hi: "डाउनलोड हो गया", mr: "डाउनलोड झाले" },
  "What is ready to report": { hi: "रिपोर्ट के लिए तैयार", mr: "अहवालासाठी तयार" },
  "Business name": { hi: "व्यवसाय का नाम", mr: "व्यवसायाचे नाव" },
  "Business type / industry": { hi: "व्यवसाय प्रकार / उद्योग", mr: "व्यवसाय प्रकार / उद्योग" },
  Location: { hi: "स्थान", mr: "ठिकाण" },
  Currency: { hi: "मुद्रा", mr: "चलन" },
  "Financial year": { hi: "वित्तीय वर्ष", mr: "आर्थिक वर्ष" },
  "Opening cash balance": { hi: "प्रारंभिक नकद शेष", mr: "प्रारंभिक रोख शिल्लक" },
  "Monthly revenue target": { hi: "मासिक राजस्व लक्ष्य", mr: "मासिक महसूल लक्ष्य" },
  Category: { hi: "श्रेणी", mr: "श्रेणी" },
  "Vendor (optional)": { hi: "विक्रेता (वैकल्पिक)", mr: "विक्रेता (पर्यायी)" },
  Customer: { hi: "ग्राहक", mr: "ग्राहक" },
  "Customer (optional)": { hi: "ग्राहक (वैकल्पिक)", mr: "ग्राहक (पर्यायी)" },
  "Customer name": { hi: "ग्राहक का नाम", mr: "ग्राहकाचे नाव" },
  Email: { hi: "ईमेल", mr: "ईमेल" },
  Phone: { hi: "फ़ोन", mr: "फोन" },
  "Vendor name": { hi: "विक्रेता का नाम", mr: "विक्रेत्याचे नाव" },
  "Payment terms": { hi: "भुगतान शर्तें", mr: "पेमेंट अटी" },
  Invoice: { hi: "चालान", mr: "चलन" },
  Amount: { hi: "राशि", mr: "रक्कम" },
  "Due date": { hi: "नियत तारीख", mr: "देय तारीख" },
  Reference: { hi: "संदर्भ", mr: "संदर्भ" },
  Priority: { hi: "प्राथमिकता", mr: "प्राधान्य" },
  "Budget amount": { hi: "बजट राशि", mr: "अंदाजपत्रक रक्कम" },
  Period: { hi: "अवधि", mr: "कालावधी" },
  "Expense name": { hi: "खर्च का नाम", mr: "खर्चाचे नाव" },
  Frequency: { hi: "आवृत्ति", mr: "वारंवारता" },
  "Invoice number": { hi: "चालान संख्या", mr: "चलन क्रमांक" },
  "Invoice date": { hi: "चालान तारीख", mr: "चलन तारीख" },
  "Your WhatsApp number": { hi: "आपका WhatsApp नंबर", mr: "तुमचा WhatsApp क्रमांक" },
  "A clean ledger of every outgoing rupee, ready to search, filter, and understand.": {
    hi: "हर खर्च का साफ़ लेखा, जिसे खोजकर, फ़िल्टर करके और समझकर देखा जा सकता है।",
    mr: "प्रत्येक खर्चाची स्वच्छ नोंद, शोधण्यासाठी, फिल्टर करण्यासाठी आणि समजून घेण्यासाठी तयार.",
  },
  "Revenue entries are stored with your business and feed every cash and forecast calculation.": {
    hi: "राजस्व प्रविष्टियाँ आपके व्यवसाय के साथ सुरक्षित हैं और हर नकदी व पूर्वानुमान गणना में उपयोग होती हैं।",
    mr: "महसूल नोंदी तुमच्या व्यवसायासोबत जतन केल्या जातात आणि प्रत्येक रोख व अंदाज गणनेत वापरल्या जातात.",
  },
  "Keep your supplier directory connected to the spend that flows through your business.": {
    hi: "अपने आपूर्तिकर्ता निर्देशिका को व्यवसाय के खर्च से जुड़ा रखें।",
    mr: "तुमची पुरवठादार यादी व्यवसायातील खर्चाशी जोडलेली ठेवा.",
  },
  "Understand what is moving your margins before it shows up in the bank balance.": {
    hi: "बैंक बैलेंस में दिखने से पहले समझें कि आपके मार्जिन को क्या प्रभावित कर रहा है।",
    mr: "बँक शिल्लक दिसण्यापूर्वी तुमच्या मार्जिनवर काय परिणाम करत आहे ते समजा.",
  },
  "A practical view of when cash arrives, when it leaves, and the buffer you can rely on.": {
    hi: "नकदी कब आती है, कब जाती है और किस बफर पर भरोसा किया जा सकता है, इसका व्यावहारिक दृश्य।",
    mr: "रोख कधी येतो, कधी जातो आणि कोणत्या राखीव रकमेवर विश्वास ठेवता येतो याचा व्यावहारिक आढावा.",
  },
  "FinSight watches the records you add so your attention stays on the actions that can change the outcome.": {
    hi: "FinSight आपके जोड़े गए रिकॉर्ड पर नज़र रखता है ताकि आपका ध्यान परिणाम बदलने वाली कार्रवाइयों पर रहे।",
    mr: "FinSight तुम्ही जोडलेल्या नोंदी पाहते, जेणेकरून तुमचे लक्ष परिणाम बदलणाऱ्या कृतींवर राहील.",
  },
  "FinSight compares the records you have added and explains what is changing.": {
    hi: "FinSight आपके जोड़े गए रिकॉर्ड की तुलना करके बताता है कि क्या बदल रहा है।",
    mr: "FinSight तुम्ही जोडलेल्या नोंदींची तुलना करून काय बदलत आहे ते समजावते.",
  },
  "Pressure-test the next decision. Adjust a driver and see the impact on cash instantly.": {
    hi: "अगले निर्णय की जाँच करें। किसी कारक को बदलें और नकदी पर तुरंत प्रभाव देखें।",
    mr: "पुढील निर्णयाची चाचणी घ्या. एखादा घटक बदला आणि रोख रकमेवरचा परिणाम लगेच पाहा.",
  },
  "Drop in an invoice and FinSight extracts the fields that matter, ready for your review.": {
    hi: "चालान डालें और FinSight ज़रूरी फ़ील्ड निकालकर समीक्षा के लिए तैयार करता है।",
    mr: "चलन टाका आणि FinSight महत्त्वाची क्षेत्रे काढून तुमच्या आढाव्यासाठी तयार करते.",
  },
  "A focused view of your financial data, with answers grounded in this workspace.": {
    hi: "आपके वित्तीय डेटा का केंद्रित दृश्य, जिसमें उत्तर इसी वर्कस्पेस के आधार पर हैं।",
    mr: "तुमच्या आर्थिक डेटाचा केंद्रित आढावा, ज्यातील उत्तरे या वर्कस्पेसवर आधारित आहेत.",
  },
  "Useful summaries for your review, your accountant, or the next supplier conversation.": {
    hi: "आपकी समीक्षा, अकाउंटेंट या अगली आपूर्तिकर्ता बातचीत के लिए उपयोगी सारांश।",
    mr: "तुमच्या आढाव्यासाठी, अकाउंटंटसाठी किंवा पुढील पुरवठादार चर्चेसाठी उपयुक्त सारांश.",
  },
  "Company details, workspace preferences and the alerts that keep you informed.": {
    hi: "कंपनी विवरण, वर्कस्पेस प्राथमिकताएँ और आपको सूचित रखने वाले अलर्ट।",
    mr: "कंपनी तपशील, वर्कस्पेस प्राधान्ये आणि तुम्हाला माहिती देणाऱ्या सूचना.",
  },
};

export function t(lang: Lang, text: string): string {
  return lang === "en" ? text : UI_TRANSLATIONS[text]?.[lang] ?? text;
}

// Spoken help text for each form field, in each supported language.
// Style used throughout: (1) say what the word/field means in plain
// language, (2) say what to do, (3) give one concrete example with a
// real number or name, so a first-time user never has to guess.
export const FIELD_HELP: Record<string, Record<Lang, string>> = {
  // ============== Business setup form ==============
  businessName: {
    en: "This is the name of your business. Type it here. For example, Shree Packaging Solutions.",
    hi: "यह आपके व्यवसाय का नाम है। इसे यहाँ लिखें। उदाहरण के लिए, श्री पैकेजिंग सॉल्यूशंस।",
    mr: "हे तुमच्या व्यवसायाचं नाव आहे. ते इथे लिहा. उदाहरणार्थ, श्री पॅकेजिंग सोल्यूशन्स.",
  },
  industry: {
    en: "This means what kind of work your business does. Type it here. For example, packaging manufacturing, tailoring, or grocery retail.",
    hi: "इसका मतलब है कि आपका व्यवसाय किस तरह का काम करता है। इसे यहाँ लिखें। उदाहरण के लिए, पैकेजिंग निर्माण, सिलाई, या किराना दुकान।",
    mr: "याचा अर्थ तुमचा व्यवसाय कोणतं काम करतो. ते इथे लिहा. उदाहरणार्थ, पॅकेजिंग उत्पादन, शिवणकाम, किंवा किराणा दुकान.",
  },
  location: {
    en: "This means the city and state where your business is located. Type it here. For example, Pune, Maharashtra.",
    hi: "इसका मतलब है वह शहर और राज्य जहाँ आपका व्यवसाय स्थित है। इसे यहाँ लिखें। उदाहरण के लिए, पुणे, महाराष्ट्र।",
    mr: "याचा अर्थ तुमचा व्यवसाय कोणत्या शहरात आणि राज्यात आहे. ते इथे लिहा. उदाहरणार्थ, पुणे, महाराष्ट्र.",
  },
  currency: {
    en: "This means the money unit you use for your business. Choose one from the list. Most businesses in India choose Indian Rupee.",
    hi: "इसका मतलब है वह मुद्रा इकाई जिसका आप अपने व्यवसाय में उपयोग करते हैं। सूची में से एक चुनें। भारत में ज़्यादातर व्यवसाय भारतीय रुपया चुनते हैं।",
    mr: "याचा अर्थ तुमच्या व्यवसायात वापरलं जाणारं चलन. यादीतून एक निवडा. भारतातील बहुतेक व्यवसाय भारतीय रुपया निवडतात.",
  },
  financialYear: {
    en: "This means the twelve-month period you use for counting your yearly profit and loss. Choose one. Most Indian businesses choose April to March.",
    hi: "इसका मतलब है बारह महीने की वह अवधि जिससे आप अपने सालाना लाभ-हानि की गिनती करते हैं। एक चुनें। ज़्यादातर भारतीय व्यवसाय अप्रैल से मार्च चुनते हैं।",
    mr: "याचा अर्थ बारा महिन्यांचा तो कालावधी ज्यामध्ये तुम्ही तुमचा वार्षिक नफा-तोटा मोजता. एक निवडा. बहुतेक भारतीय व्यवसाय एप्रिल ते मार्च निवडतात.",
  },
  openingCash: {
    en: "This means the cash you have in hand or in your bank account right now, before you add anything else. Type the number. For example, if you have fifty thousand rupees, type 50000.",
    hi: "इसका मतलब है वह नकद राशि जो अभी आपके हाथ में या बैंक खाते में है, कुछ और जोड़ने से पहले। संख्या लिखें। उदाहरण के लिए, अगर आपके पास पचास हज़ार रुपये हैं, तो 50000 लिखें।",
    mr: "याचा अर्थ आत्ता तुमच्याकडे हातात किंवा बँक खात्यात असलेली रोख रक्कम, आणखी काही जोडण्याआधी. संख्या टाका. उदाहरणार्थ, तुमच्याकडे पन्नास हजार रुपये असतील, तर 50000 टाका.",
  },
  monthlyRevenueTarget: {
    en: "This means the amount of money you hope to earn every month. Type the number. For example, if your goal is one lakh rupees a month, type 100000.",
    hi: "इसका मतलब है वह राशि जो आप हर महीने कमाना चाहते हैं। संख्या लिखें। उदाहरण के लिए, अगर आपका लक्ष्य एक लाख रुपये महीना है, तो 100000 लिखें।",
    mr: "याचा अर्थ तुम्हाला दर महिन्याला कमवायची असलेली रक्कम. संख्या टाका. उदाहरणार्थ, तुमचं ध्येय महिन्याला एक लाख रुपये असेल, तर 100000 टाका.",
  },

  // ============== Add Expense form ==============
  entryDescriptionExpense: {
    en: "Write what you spent this money on, in a few words. For example, cardboard sheets, diesel for delivery, or shop rent.",
    hi: "कुछ शब्दों में लिखें कि आपने यह पैसा किस चीज़ पर खर्च किया। उदाहरण के लिए, गत्ते की शीट, डिलीवरी के लिए डीज़ल, या दुकान का किराया।",
    mr: "हे पैसे कशावर खर्च केले ते काही शब्दांत लिहा. उदाहरणार्थ, पुठ्ठ्याच्या शीट्स, डिलिव्हरीसाठी डिझेल, किंवा दुकानाचं भाडं.",
  },
  entryAmountExpense: {
    en: "Type how much money you spent, in rupees, using only numbers. For example, if you spent ten thousand rupees, type 10000.",
    hi: "सिर्फ़ संख्या में लिखें कि आपने कितने रुपये खर्च किए। उदाहरण के लिए, अगर आपने दस हज़ार रुपये खर्च किए, तो 10000 लिखें।",
    mr: "तुम्ही किती रुपये खर्च केले ते फक्त आकड्यांत लिहा. उदाहरणार्थ, तुम्ही दहा हजार रुपये खर्च केले असतील, तर 10000 टाका.",
  },
  entryDateExpense: {
    en: "Choose the date on which you spent this money, using the calendar. For example, today's date, or an earlier date like 25 September 2026.",
    hi: "कैलेंडर से वह तारीख चुनें जिस दिन आपने यह पैसा खर्च किया। उदाहरण के लिए, आज की तारीख, या पहले की कोई तारीख जैसे 25 सितंबर 2026।",
    mr: "कॅलेंडरमधून तुम्ही हे पैसे कधी खर्च केले ती तारीख निवडा. उदाहरणार्थ, आजची तारीख, किंवा आधीची एखादी तारीख जसं की 25 सप्टेंबर 2026.",
  },
  entryCategory: {
    en: "This means what type of expense this is. Choose one from the list. For example, Rent, Transport, Raw material, or Salaries.",
    hi: "इसका मतलब है कि यह किस तरह का खर्च है। सूची में से एक चुनें। उदाहरण के लिए, किराया, परिवहन, कच्चा माल, या वेतन।",
    mr: "याचा अर्थ हा कोणत्या प्रकारचा खर्च आहे. यादीतून एक निवडा. उदाहरणार्थ, भाडं, वाहतूक, कच्चा माल, किंवा पगार.",
  },
  entryVendor: {
    en: "Vendor means the shop or supplier you paid this money to. Type their name here. For example, Shree Polymers. If you don't know or it doesn't matter, you can leave this box empty.",
    hi: "विक्रेता का मतलब है वह दुकान या सप्लायर जिसे आपने यह पैसा दिया। यहाँ उनका नाम लिखें। उदाहरण के लिए, श्री पॉलिमर्स। अगर आपको पता नहीं है या ज़रूरी नहीं है, तो इस बॉक्स को खाली छोड़ सकते हैं।",
    mr: "विक्रेता म्हणजे ते दुकान किंवा पुरवठादार ज्याला तुम्ही हे पैसे दिले. इथे त्यांचं नाव लिहा. उदाहरणार्थ, श्री पॉलिमर्स. तुम्हाला माहीत नसेल किंवा गरज नसेल, तर हा बॉक्स रिकामा ठेवू शकता.",
  },

  // ============== Add Revenue form ==============
  entryDescriptionRevenue: {
    en: "Write what this income was for, in a few words. For example, a customer's order, or a bulk sale of goods.",
    hi: "कुछ शब्दों में लिखें कि यह कमाई किस लिए थी। उदाहरण के लिए, किसी ग्राहक का ऑर्डर, या सामान की थोक बिक्री।",
    mr: "ही कमाई कशासाठी होती ते काही शब्दांत लिहा. उदाहरणार्थ, ग्राहकाची ऑर्डर, किंवा मालाची घाऊक विक्री.",
  },
  entryAmountRevenue: {
    en: "Type how much money you received or earned, in rupees, using only numbers. For example, if you earned twenty-five thousand rupees, type 25000.",
    hi: "सिर्फ़ संख्या में लिखें कि आपको कितने रुपये मिले या आपने कमाए। उदाहरण के लिए, अगर आपने पच्चीस हज़ार रुपये कमाए, तो 25000 लिखें।",
    mr: "तुम्हाला किती रुपये मिळाले किंवा तुम्ही कमावले ते फक्त आकड्यांत लिहा. उदाहरणार्थ, तुम्ही पंचवीस हजार रुपये कमावले असतील, तर 25000 टाका.",
  },
  entryDateRevenue: {
    en: "Choose the date on which you received this money, using the calendar. For example, today's date, or an earlier date like 25 September 2026.",
    hi: "कैलेंडर से वह तारीख चुनें जिस दिन आपको यह पैसा मिला। उदाहरण के लिए, आज की तारीख, या पहले की कोई तारीख जैसे 25 सितंबर 2026।",
    mr: "कॅलेंडरमधून तुम्हाला हे पैसे कधी मिळाले ती तारीख निवडा. उदाहरणार्थ, आजची तारीख, किंवा आधीची एखादी तारीख जसं की 25 सप्टेंबर 2026.",
  },
  entryCustomer: {
    en: "Customer means the person or shop who paid you this money. Type their name here. For example, Patel Traders. If you don't know or it doesn't matter, you can leave this box empty.",
    hi: "ग्राहक का मतलब है वह व्यक्ति या दुकान जिसने आपको यह पैसा दिया। यहाँ उनका नाम लिखें। उदाहरण के लिए, पटेल ट्रेडर्स। अगर आपको पता नहीं है या ज़रूरी नहीं है, तो इस बॉक्स को खाली छोड़ सकते हैं।",
    mr: "ग्राहक म्हणजे ती व्यक्ती किंवा दुकान ज्याने तुम्हाला हे पैसे दिले. इथे त्यांचं नाव लिहा. उदाहरणार्थ, पटेल ट्रेडर्स. तुम्हाला माहीत नसेल किंवा गरज नसेल, तर हा बॉक्स रिकामा ठेवू शकता.",
  },

  // ============== Add Customer form ==============
  customerName: {
    en: "This is the name of the customer who buys from you or owes you money. Type it here. For example, Patel Traders.",
    hi: "यह उस ग्राहक का नाम है जो आपसे सामान खरीदता है या आपका पैसा देना है। इसे यहाँ लिखें। उदाहरण के लिए, पटेल ट्रेडर्स।",
    mr: "हे तुमच्याकडून खरेदी करणाऱ्या किंवा तुम्हाला पैसे देणे असलेल्या ग्राहकाचं नाव आहे. ते इथे लिहा. उदाहरणार्थ, पटेल ट्रेडर्स.",
  },
  customerEmail: {
    en: "This is the customer's email address, if you have one. Type it here. For example, patel@example.com. This is optional, you can leave it empty.",
    hi: "यह ग्राहक का ईमेल पता है, अगर आपके पास है। इसे यहाँ लिखें। उदाहरण के लिए, patel@example.com। यह वैकल्पिक है, आप इसे खाली छोड़ सकते हैं।",
    mr: "हा ग्राहकाचा ईमेल पत्ता आहे, तुमच्याकडे असल्यास. तो इथे लिहा. उदाहरणार्थ, patel@example.com. हे पर्यायी आहे, तुम्ही रिकामं ठेवू शकता.",
  },
  customerPhone: {
    en: "This is the customer's phone number, if you have one. Type it here. For example, 9876543210. This is optional, you can leave it empty.",
    hi: "यह ग्राहक का फोन नंबर है, अगर आपके पास है। इसे यहाँ लिखें। उदाहरण के लिए, 9876543210। यह वैकल्पिक है, आप इसे खाली छोड़ सकते हैं।",
    mr: "हा ग्राहकाचा फोन नंबर आहे, तुमच्याकडे असल्यास. तो इथे लिहा. उदाहरणार्थ, 9876543210. हे पर्यायी आहे, तुम्ही रिकामं ठेवू शकता.",
  },

  // ============== Add Vendor form ==============
  vendorName: {
    en: "Vendor means the shop or supplier you buy things from for your business. Type their name here. For example, Shree Polymers.",
    hi: "विक्रेता का मतलब है वह दुकान या सप्लायर जिससे आप अपने व्यवसाय के लिए सामान खरीदते हैं। यहाँ उनका नाम लिखें। उदाहरण के लिए, श्री पॉलिमर्स।",
    mr: "विक्रेता म्हणजे ते दुकान किंवा पुरवठादार ज्याच्याकडून तुम्ही तुमच्या व्यवसायासाठी सामान खरेदी करता. इथे त्यांचं नाव लिहा. उदाहरणार्थ, श्री पॉलिमर्स.",
  },
  vendorCategory: {
    en: "This means what this vendor mainly supplies you. Choose one from the list. For example, Raw material, or Packaging.",
    hi: "इसका मतलब है कि यह विक्रेता आपको मुख्य रूप से क्या सप्लाई करता है। सूची में से एक चुनें। उदाहरण के लिए, कच्चा माल, या पैकेजिंग।",
    mr: "याचा अर्थ हा विक्रेता तुम्हाला मुख्यतः काय पुरवतो. यादीतून एक निवडा. उदाहरणार्थ, कच्चा माल, किंवा पॅकेजिंग.",
  },
  vendorPaymentTerms: {
    en: "This means how many days you usually take to pay this vendor after they bill you. Type it here. For example, 30 days.",
    hi: "इसका मतलब है कि बिल मिलने के बाद आप आमतौर पर इस विक्रेता को कितने दिनों में भुगतान करते हैं। इसे यहाँ लिखें। उदाहरण के लिए, 30 दिन।",
    mr: "याचा अर्थ बिल मिळाल्यानंतर तुम्ही साधारणपणे या विक्रेत्याला किती दिवसांत पैसे देता. ते इथे लिहा. उदाहरणार्थ, 30 दिवस.",
  },

  // ============== Add Receivable form (money customers owe you) ==============
  receivableCustomer: {
    en: "This is the name of the customer who still owes you this money. Type it here. For example, Patel Traders.",
    hi: "यह उस ग्राहक का नाम है जो अभी भी आपको यह पैसा देना है। इसे यहाँ लिखें। उदाहरण के लिए, पटेल ट्रेडर्स।",
    mr: "हा ग्राहकाचं नाव आहे जो अजून तुम्हाला हे पैसे देणे लागतो. ते इथे लिहा. उदाहरणार्थ, पटेल ट्रेडर्स.",
  },
  receivableInvoice: {
    en: "This is the bill or invoice number for this payment, if you have one. Type it here. For example, INV-1024.",
    hi: "यह इस भुगतान का बिल या इनवॉइस नंबर है, अगर आपके पास है। इसे यहाँ लिखें। उदाहरण के लिए, INV-1024।",
    mr: "हा या पेमेंटचा बिल किंवा इनव्हॉइस नंबर आहे, तुमच्याकडे असल्यास. तो इथे लिहा. उदाहरणार्थ, INV-1024.",
  },
  receivableAmount: {
    en: "Type how much money this customer still owes you, in rupees, using only numbers. For example, if they owe you forty thousand rupees, type 40000.",
    hi: "सिर्फ़ संख्या में लिखें कि यह ग्राहक आपको अभी भी कितने रुपये देना है। उदाहरण के लिए, अगर वे आपको चालीस हज़ार रुपये देना है, तो 40000 लिखें।",
    mr: "हा ग्राहक तुम्हाला अजून किती रुपये देणे लागतो ते फक्त आकड्यांत लिहा. उदाहरणार्थ, तो तुम्हाला चाळीस हजार रुपये देणे लागत असेल, तर 40000 टाका.",
  },
  receivableDueDate: {
    en: "Choose the date by which you expect this customer to pay you, using the calendar. For example, 15 days from today.",
    hi: "कैलेंडर से वह तारीख चुनें जिस तक आपको उम्मीद है कि यह ग्राहक भुगतान करेगा। उदाहरण के लिए, आज से 15 दिन बाद।",
    mr: "कॅलेंडरमधून हा ग्राहक कधीपर्यंत पैसे देईल अशी अपेक्षा आहे ती तारीख निवडा. उदाहरणार्थ, आजपासून 15 दिवसांनी.",
  },

  // ============== Add Payable form (money you owe vendors) ==============
  payableVendor: {
    en: "This is the name of the vendor you still owe this money to. Type it here. For example, Shree Polymers.",
    hi: "यह उस विक्रेता का नाम है जिसे आप अभी भी यह पैसा देना है। इसे यहाँ लिखें। उदाहरण के लिए, श्री पॉलिमर्स।",
    mr: "हा विक्रेत्याचं नाव आहे ज्याला तुम्ही अजून हे पैसे देणे लागता. ते इथे लिहा. उदाहरणार्थ, श्री पॉलिमर्स.",
  },
  payableReference: {
    en: "This is the bill or reference number for this payment, if you have one. Type it here. For example, BILL-2201.",
    hi: "यह इस भुगतान का बिल या संदर्भ नंबर है, अगर आपके पास है। इसे यहाँ लिखें। उदाहरण के लिए, BILL-2201।",
    mr: "हा या पेमेंटचा बिल किंवा संदर्भ क्रमांक आहे, तुमच्याकडे असल्यास. तो इथे लिहा. उदाहरणार्थ, BILL-2201.",
  },
  payableAmount: {
    en: "Type how much money you still owe this vendor, in rupees, using only numbers. For example, if you owe them fifteen thousand rupees, type 15000.",
    hi: "सिर्फ़ संख्या में लिखें कि आप इस विक्रेता को अभी भी कितने रुपये देना है। उदाहरण के लिए, अगर आप उन्हें पंद्रह हज़ार रुपये देना है, तो 15000 लिखें।",
    mr: "तुम्ही या विक्रेत्याला अजून किती रुपये देणे लागता ते फक्त आकड्यांत लिहा. उदाहरणार्थ, तुम्ही त्यांना पंधरा हजार रुपये देणे लागत असाल, तर 15000 टाका.",
  },
  payableDueDate: {
    en: "Choose the date by which you must pay this vendor, using the calendar. For example, 10 days from today.",
    hi: "कैलेंडर से वह तारीख चुनें जिस तक आपको इस विक्रेता को भुगतान करना है। उदाहरण के लिए, आज से 10 दिन बाद।",
    mr: "कॅलेंडरमधून या विक्रेत्याला कधीपर्यंत पैसे द्यायचे आहेत ती तारीख निवडा. उदाहरणार्थ, आजपासून 10 दिवसांनी.",
  },
  payablePriority: {
    en: "This means how urgent this payment is. Choose High if it must be paid very soon, Medium if it can wait a little, or Low if there is no rush.",
    hi: "इसका मतलब है कि यह भुगतान कितना ज़रूरी है। अगर बहुत जल्दी देना है तो High चुनें, थोड़ा इंतज़ार हो सकता है तो Medium, या जल्दी नहीं है तो Low चुनें।",
    mr: "याचा अर्थ हे पेमेंट किती तातडीचं आहे. लवकर द्यायचं असेल तर High, थोडं थांबू शकतं तर Medium, किंवा घाई नसेल तर Low निवडा.",
  },

  // ============== Add Budget form ==============
  budgetCategory: {
    en: "This means which type of expense you want to set a spending limit for. Choose one from the list. For example, Transport.",
    hi: "इसका मतलब है कि आप किस तरह के खर्च के लिए सीमा तय करना चाहते हैं। सूची में से एक चुनें। उदाहरण के लिए, परिवहन।",
    mr: "याचा अर्थ तुम्हाला कोणत्या प्रकारच्या खर्चासाठी मर्यादा ठरवायची आहे. यादीतून एक निवडा. उदाहरणार्थ, वाहतूक.",
  },
  budgetAmount: {
    en: "Type the maximum amount in rupees you want to allow for this category, using only numbers. For example, if your limit is twenty thousand rupees, type 20000.",
    hi: "सिर्फ़ संख्या में लिखें कि आप इस श्रेणी के लिए कितनी अधिकतम राशि अनुमति देना चाहते हैं। उदाहरण के लिए, अगर आपकी सीमा बीस हज़ार रुपये है, तो 20000 लिखें।",
    mr: "या प्रकारासाठी तुम्हाला जास्तीत जास्त किती रुपये परवानगी द्यायची आहे ते फक्त आकड्यांत लिहा. उदाहरणार्थ, तुमची मर्यादा वीस हजार रुपये असेल, तर 20000 टाका.",
  },
  budgetPeriod: {
    en: "This means how often this spending limit resets. Choose Monthly if it applies every month, or Yearly if it applies once a year.",
    hi: "इसका मतलब है कि यह खर्च की सीमा कितनी बार फिर से शुरू होती है। अगर हर महीने लागू होती है तो Monthly चुनें, या साल में एक बार लागू होती है तो Yearly।",
    mr: "याचा अर्थ ही खर्चाची मर्यादा किती वेळा पुन्हा सुरू होते. दर महिन्याला लागू होत असेल तर Monthly, किंवा वर्षातून एकदा लागू होत असेल तर Yearly निवडा.",
  },

  // ============== Add Recurring Expense form ==============
  recurringName: {
    en: "This is the name of an expense that repeats regularly. Type it here. For example, Shop rent, or Internet bill.",
    hi: "यह उस खर्च का नाम है जो नियमित रूप से दोहराता है। इसे यहाँ लिखें। उदाहरण के लिए, दुकान का किराया, या इंटरनेट बिल।",
    mr: "हे नियमितपणे होणाऱ्या खर्चाचं नाव आहे. ते इथे लिहा. उदाहरणार्थ, दुकानाचं भाडं, किंवा इंटरनेट बिल.",
  },
  recurringAmount: {
    en: "Type how much this expense costs each time it repeats, in rupees, using only numbers. For example, if the rent is eight thousand rupees, type 8000.",
    hi: "सिर्फ़ संख्या में लिखें कि हर बार यह खर्च कितने रुपये का होता है। उदाहरण के लिए, अगर किराया आठ हज़ार रुपये है, तो 8000 लिखें।",
    mr: "हा खर्च दर वेळी किती रुपयांचा होतो ते फक्त आकड्यांत लिहा. उदाहरणार्थ, भाडं आठ हजार रुपये असेल, तर 8000 टाका.",
  },
  recurringFrequency: {
    en: "This means how often this expense repeats. Choose Monthly if it happens every month, Weekly if every week, or Quarterly if every three months.",
    hi: "इसका मतलब है कि यह खर्च कितनी बार दोहराता है। हर महीने होता है तो Monthly, हर हफ्ते होता है तो Weekly, या हर तीन महीने में होता है तो Quarterly चुनें।",
    mr: "याचा अर्थ हा खर्च किती वेळा येतो. दर महिन्याला येत असेल तर Monthly, दर आठवड्याला तर Weekly, किंवा दर तीन महिन्यांनी तर Quarterly निवडा.",
  },
  recurringCategory: {
    en: "This means which category this repeating expense belongs to. Choose one from the list. For example, Rent.",
    hi: "इसका मतलब है कि यह बार-बार होने वाला खर्च किस श्रेणी में आता है। सूची में से एक चुनें। उदाहरण के लिए, किराया।",
    mr: "याचा अर्थ हा वारंवार होणारा खर्च कोणत्या प्रकारात मोडतो. यादीतून एक निवडा. उदाहरणार्थ, भाडं.",
  },

  // ============== Invoice intelligence form ==============
  invoiceVendor: {
    en: "This is the name of the customer this invoice is being sent to. Type it here. For example, Patel Traders.",
    hi: "यह उस ग्राहक का नाम है जिसे यह इनवॉइस भेजा जा रहा है। इसे यहाँ लिखें। उदाहरण के लिए, पटेल ट्रेडर्स।",
    mr: "हे इनव्हॉइस ज्याला पाठवलं जात आहे त्या ग्राहकाचं नाव आहे. ते इथे लिहा. उदाहरणार्थ, पटेल ट्रेडर्स.",
  },
  invoiceNumber: {
    en: "This is a unique number you give this invoice, so you can find it later. Type it here. For example, INV-1024.",
    hi: "यह एक अनोखा नंबर है जो आप इस इनवॉइस को देते हैं, ताकि आप इसे बाद में ढूंढ सकें। इसे यहाँ लिखें। उदाहरण के लिए, INV-1024।",
    mr: "हा एक वेगळा क्रमांक आहे जो तुम्ही या इनव्हॉइसला देता, जेणेकरून तुम्ही नंतर तो शोधू शकाल. तो इथे लिहा. उदाहरणार्थ, INV-1024.",
  },
  invoiceDate: {
    en: "Choose the date this invoice is being created, using the calendar. For example, today's date.",
    hi: "कैलेंडर से वह तारीख चुनें जिस दिन यह इनवॉइस बनाया जा रहा है। उदाहरण के लिए, आज की तारीख।",
    mr: "कॅलेंडरमधून हे इनव्हॉइस कोणत्या तारखेला तयार केलं जात आहे ती निवडा. उदाहरणार्थ, आजची तारीख.",
  },
  invoiceDueDate: {
    en: "Choose the date by which the customer should pay this invoice, using the calendar. For example, 30 days from today.",
    hi: "कैलेंडर से वह तारीख चुनें जिस तक ग्राहक को इस इनवॉइस का भुगतान करना है। उदाहरण के लिए, आज से 30 दिन बाद।",
    mr: "कॅलेंडरमधून ग्राहकाने या इनव्हॉइसचे पैसे कधीपर्यंत द्यायचे आहेत ती तारीख निवडा. उदाहरणार्थ, आजपासून 30 दिवसांनी.",
  },
  invoiceCategory: {
    en: "This means which category best describes what this invoice is for. Choose one from the list. For example, Raw materials.",
    hi: "इसका मतलब है कि यह इनवॉइस किस श्रेणी के लिए सबसे उपयुक्त है। सूची में से एक चुनें। उदाहरण के लिए, कच्चा माल।",
    mr: "याचा अर्थ हे इनव्हॉइस कोणत्या प्रकारासाठी सर्वात योग्य आहे. यादीतून एक निवडा. उदाहरणार्थ, कच्चा माल.",
  },
};

let voicesCache: SpeechSynthesisVoice[] = [];
// One consolidated, spoken walkthrough per record type. Read aloud in
// order: what this record type means (with an example), then each box
// on the form in the order it appears, each with its own example value.
// Used by the single speaker button in the "Add ..." modal header,
// instead of a separate button on every individual field.
export const FORM_HELP: Record<string, Record<Lang, string>> = {
  expense: {
    en: "Expense means money your business spends, such as rent, salary, or electricity. First, write in short where the money went, for example rent. Then enter how much money you spent, for example 20000. Then choose the date you spent it, for example 8 September 2026. Then choose a category, such as rent or transport. Finally, if you know the vendor, write their name — this is optional.",
    hi: "खर्च का मतलब है वह पैसा जो आपका व्यवसाय खर्च करता है, जैसे किराया, वेतन, या बिजली। पहले, संक्षेप में लिखें कि पैसा कहाँ गया, जैसे किराया। फिर लिखें कि आपने कितने रुपये खर्च किए, जैसे 20000। फिर वह तारीख चुनें जब आपने यह पैसा खर्च किया, जैसे 8 सितंबर 2026। फिर एक श्रेणी चुनें, जैसे किराया या परिवहन। अंत में, अगर आपको विक्रेता पता है, तो उनका नाम लिखें — यह वैकल्पिक है।",
    mr: "खर्च म्हणजे तुमचा व्यवसाय जो पैसा खर्च करतो, जसं की भाडं, पगार, किंवा वीज बिल. आधी, थोडक्यात लिहा पैसे कुठे गेले, जसं की भाडं. मग लिहा तुम्ही किती रुपये खर्च केले, जसं की 20000. मग तुम्ही हे पैसे कधी खर्च केले ती तारीख निवडा, जसं की 8 सप्टेंबर 2026. मग एक प्रकार निवडा, जसं की भाडं किंवा वाहतूक. शेवटी, विक्रेता माहीत असल्यास त्याचं नाव लिहा — हे पर्यायी आहे.",
  },
  revenue: {
    en: "Revenue means money your business earns by selling goods or services. First, write in short what this income was for, for example a customer's order. Then enter how much money you received, for example 25000. Then choose the date you received it, for example 8 September 2026. Finally, if you know the customer, write their name — this is optional.",
    hi: "कमाई का मतलब है वह पैसा जो आपका व्यवसाय सामान या सेवा बेचकर कमाता है। पहले, संक्षेप में लिखें कि यह कमाई किस लिए थी, जैसे किसी ग्राहक का ऑर्डर। फिर लिखें कि आपको कितने रुपये मिले, जैसे 25000। फिर वह तारीख चुनें जब आपको यह पैसा मिला, जैसे 8 सितंबर 2026। अंत में, अगर आपको ग्राहक पता है, तो उनका नाम लिखें — यह वैकल्पिक है।",
    mr: "कमाई म्हणजे तुमचा व्यवसाय सामान किंवा सेवा विकून कमावतो तो पैसा. आधी, थोडक्यात लिहा ही कमाई कशासाठी होती, जसं की ग्राहकाची ऑर्डर. मग लिहा तुम्हाला किती रुपये मिळाले, जसं की 25000. मग तुम्हाला हे पैसे कधी मिळाले ती तारीख निवडा, जसं की 8 सप्टेंबर 2026. शेवटी, ग्राहक माहीत असल्यास त्याचं नाव लिहा — हे पर्यायी आहे.",
  },
  customer: {
    en: "Customer means a person or shop that buys from you or owes you money. First, write the customer's name, for example Patel Traders. Then, if you have it, write their email. Then, if you have it, write their phone number, for example 9876543210. Both of these are optional.",
    hi: "ग्राहक का मतलब है वह व्यक्ति या दुकान जो आपसे खरीदता है या आपका पैसा देना है। पहले, ग्राहक का नाम लिखें, जैसे पटेल ट्रेडर्स। फिर, अगर आपके पास है, तो उनका ईमेल लिखें। फिर, अगर आपके पास है, तो उनका फोन नंबर लिखें, जैसे 9876543210। दोनों वैकल्पिक हैं।",
    mr: "ग्राहक म्हणजे ती व्यक्ती किंवा दुकान जे तुमच्याकडून खरेदी करते किंवा तुम्हाला पैसे देणे लागते. आधी, ग्राहकाचं नाव लिहा, जसं की पटेल ट्रेडर्स. मग, तुमच्याकडे असल्यास, त्यांचा ईमेल लिहा. मग, तुमच्याकडे असल्यास, त्यांचा फोन नंबर लिहा, जसं की 9876543210. दोन्ही पर्यायी आहेत.",
  },
  vendor: {
    en: "Vendor means a shop or supplier you buy things from for your business. First, write the vendor's name, for example Shree Polymers. Then choose what they mainly supply, such as raw material. Then write how many days you usually take to pay them, for example 30 days.",
    hi: "विक्रेता का मतलब है वह दुकान या सप्लायर जिससे आप अपने व्यवसाय के लिए सामान खरीदते हैं। पहले, विक्रेता का नाम लिखें, जैसे श्री पॉलिमर्स। फिर चुनें कि वे मुख्य रूप से क्या सप्लाई करते हैं, जैसे कच्चा माल। फिर लिखें कि आप आमतौर पर उन्हें कितने दिनों में भुगतान करते हैं, जैसे 30 दिन।",
    mr: "विक्रेता म्हणजे ते दुकान किंवा पुरवठादार ज्याच्याकडून तुम्ही तुमच्या व्यवसायासाठी सामान खरेदी करता. आधी, विक्रेत्याचं नाव लिहा, जसं की श्री पॉलिमर्स. मग ते मुख्यतः काय पुरवतात ते निवडा, जसं की कच्चा माल. मग तुम्ही त्यांना साधारणपणे किती दिवसांत पैसे देता ते लिहा, जसं की 30 दिवस.",
  },
  receivable: {
    en: "Receivable means money a customer still owes you. First, write the customer's name, for example Patel Traders. Then, if you have it, write the invoice number. Then enter how much money they owe you, for example 40000. Finally, choose the date by which you expect payment, for example 15 days from today.",
    hi: "प्राप्य राशि का मतलब है वह पैसा जो कोई ग्राहक अभी भी आपको देना है। पहले, ग्राहक का नाम लिखें, जैसे पटेल ट्रेडर्स। फिर, अगर आपके पास है, तो इनवॉइस नंबर लिखें। फिर लिखें कि वे आपको कितने रुपये देना है, जैसे 40000। अंत में, वह तारीख चुनें जिस तक आपको भुगतान की उम्मीद है, जैसे आज से 15 दिन बाद।",
    mr: "येणे बाकी रक्कम म्हणजे एखादा ग्राहक अजून तुम्हाला देणे लागतो तो पैसा. आधी, ग्राहकाचं नाव लिहा, जसं की पटेल ट्रेडर्स. मग, तुमच्याकडे असल्यास, इनव्हॉइस क्रमांक लिहा. मग ते तुम्हाला किती रुपये देणे लागतात ते लिहा, जसं की 40000. शेवटी, पैसे मिळण्याची अपेक्षा असलेली तारीख निवडा, जसं की आजपासून 15 दिवसांनी.",
  },
  payable: {
    en: "Payable means money you still owe to a vendor. First, write the vendor's name, for example Shree Polymers. Then, if you have it, write a bill or reference number. Then enter how much money you owe them, for example 15000. Then choose the date you must pay by. Finally, choose how urgent this payment is — High, Medium, or Low.",
    hi: "देय राशि का मतलब है वह पैसा जो आप अभी भी किसी विक्रेता को देना है। पहले, विक्रेता का नाम लिखें, जैसे श्री पॉलिमर्स। फिर, अगर आपके पास है, तो बिल या संदर्भ नंबर लिखें। फिर लिखें कि आप उन्हें कितने रुपये देना है, जैसे 15000। फिर वह तारीख चुनें जिस तक आपको भुगतान करना है। अंत में, चुनें कि यह भुगतान कितना ज़रूरी है — High, Medium, या Low।",
    mr: "देय रक्कम म्हणजे तुम्ही अजून एखाद्या विक्रेत्याला देणे लागता तो पैसा. आधी, विक्रेत्याचं नाव लिहा, जसं की श्री पॉलिमर्स. मग, तुमच्याकडे असल्यास, बिल किंवा संदर्भ क्रमांक लिहा. मग तुम्ही त्यांना किती रुपये देणे लागता ते लिहा, जसं की 15000. मग तुम्हाला कधीपर्यंत पैसे द्यायचे आहेत ती तारीख निवडा. शेवटी, हे पेमेंट किती तातडीचं आहे ते निवडा — High, Medium, किंवा Low.",
  },
  budget: {
    en: "Budget means a spending limit you set for a category. First, choose the category, for example Transport. Then enter the maximum amount you want to allow, for example 20000. Finally, choose whether this limit is Monthly or Yearly.",
    hi: "बजट का मतलब है किसी श्रेणी के लिए आपके द्वारा तय की गई खर्च की सीमा। पहले, श्रेणी चुनें, जैसे परिवहन। फिर लिखें कि आप अधिकतम कितनी राशि की अनुमति देना चाहते हैं, जैसे 20000। अंत में, चुनें कि यह सीमा Monthly है या Yearly।",
    mr: "बजेट म्हणजे एखाद्या प्रकारासाठी तुम्ही ठरवलेली खर्चाची मर्यादा. आधी, प्रकार निवडा, जसं की वाहतूक. मग तुम्हाला जास्तीत जास्त किती रक्कम परवानगी द्यायची आहे ते लिहा, जसं की 20000. शेवटी, ही मर्यादा Monthly आहे की Yearly ते निवडा.",
  },
  recurring: {
    en: "Recurring expense means a cost that repeats regularly, like rent. First, write the name of the expense, for example Shop rent. Then enter how much it costs each time, for example 8000. Then choose how often it repeats — Monthly, Weekly, or Quarterly. Finally, choose its category, such as Rent.",
    hi: "बार-बार होने वाला खर्च का मतलब है ऐसा खर्च जो नियमित रूप से दोहराता है, जैसे किराया। पहले, खर्च का नाम लिखें, जैसे दुकान का किराया। फिर लिखें कि हर बार यह कितने रुपये का होता है, जैसे 8000। फिर चुनें कि यह कितनी बार दोहराता है — Monthly, Weekly, या Quarterly। अंत में, इसकी श्रेणी चुनें, जैसे किराया।",
    mr: "वारंवार होणारा खर्च म्हणजे भाड्यासारखा नियमितपणे येणारा खर्च. आधी, खर्चाचं नाव लिहा, जसं की दुकानाचं भाडं. मग तो दर वेळी किती रुपयांचा होतो ते लिहा, जसं की 8000. मग तो किती वेळा येतो ते निवडा — Monthly, Weekly, किंवा Quarterly. शेवटी, त्याचा प्रकार निवडा, जसं की भाडं.",
  },
};

function refreshVoices() {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    voicesCache = window.speechSynthesis.getVoices();
  }
}

if (typeof window !== "undefined" && window.speechSynthesis) {
  refreshVoices();
  // Most browsers load voices asynchronously the first time; this event
  // fires once they're ready.
  window.speechSynthesis.onvoiceschanged = refreshVoices;
}

export function speechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

/**
 * Speaks the given text using the browser's built-in text-to-speech.
 * Falls back gracefully (returns false, speaks nothing) if the browser
 * doesn't support speech synthesis at all. If no voice matching the exact
 * locale is installed (e.g. no Marathi voice on this device), it falls
 * back to any voice starting with the same base language, and finally to
 * the browser's default voice so something is still read aloud.
 */
export function speak(text: string, lang: Lang): boolean {
  if (!speechSupported()) return false;

  window.speechSynthesis.cancel(); // stop anything already playing

  const utterance = new SpeechSynthesisUtterance(text);
  const targetLocale = VOICE_LOCALE[lang];
  const voices = voicesCache.length ? voicesCache : window.speechSynthesis.getVoices();
  const match =
    voices.find((v) => v.lang === targetLocale) ??
    voices.find((v) => v.lang?.toLowerCase().startsWith(lang));

  if (match) utterance.voice = match;
  utterance.lang = targetLocale;
  utterance.rate = 0.72;

  window.speechSynthesis.speak(utterance);
  return true;
}
