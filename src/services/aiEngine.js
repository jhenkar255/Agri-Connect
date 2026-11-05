// Intelligent Conversational AI Engine for Kisan AI
// Operates like ChatGPT / DeepSeek with comprehensive support for farming,
// general knowledge, silly questions, out-of-agriculture inquiries, smallholder fund schemes,
// offline future roadmap, and multilingual responses (English, Hindi, Kannada, Telugu, Malayalam, Tamil, etc.).

import { askGeneralAI } from './aiService.js';

export async function generateAIResponse(userText, options = {}) {
  const {
    language = 'en',
    cropContext = 'Potato',
    district = 'Shivamogga, KA',
    farmerName = '',
    conversationHistory = []
  } = options;
  const query = userText.trim().toLowerCase();
  
  // 1. Detect if user is introducing their name
  let extractedName = farmerName;
  const nameMatch = userText.match(/(?:i am|my name is|myself|im|i'm|ನನ್ನ ಹೆಸರು|मेरा नाम|నా పేరు|என் பெயர்|എന്റെ പേര്)\s+([A-Za-z\u0C80-\u0CFF\u0900-\u097F\u0C00-\u0C7F\u0B80-\u0BFF\u0D00-\u0D7F]+)/i);
  if (nameMatch && nameMatch[1]) {
    extractedName = nameMatch[1].trim();
  }

  // 2. Intent Categorization
  const isGreeting = /^(hi|hello|hey|good morning|good afternoon|good evening|namaskara|namaste|vanakkam|namaskaram|hola)\b/i.test(query) || query === 'hi' || query === 'hello';
  const isNameQuestion = /(what(?:'s| is) your name|who are you|who made you|about you|tell me about yourself|are you ai|are you real|ನಿನ್ನ ಹೆಸರೇನು|ನಿಮ್ಮ ಹೆಸರೇನು|तुम्हारा नाम क्या है|నీ పేరు ఏమిటి|உன் பெயர் என்ன|നിങ്ങളുടെ പേര് എന്താണ്)/i.test(query);
  
  // Crops
  const isPotato = /(potato|potatoes|aloo|alu|ಆಲೂಗಡ್ಡೆ|ಆಲೂ|आलू|బంగాళాదుంప|உருளைக்கிழங்கு|ഉരുളക്കിഴങ്ങ്)/i.test(query);
  const isGroundnut = /(groundnut|peanut|peanuts|groundnuts|kadalekayi|moongfali|ಕಡಲೆಕಾಯಿ|ಶೇಂಗಾ|मूंगफली|వేరుశనಗ|நிலக்கடலை|നിലക്കടല)/i.test(query);
  const isTomato = /(tomato|tomatoes|tamatar|ಟೊಮೆಟೊ|ಟೊಮ್ಯಾಟೊ|टमाटर|టమోటా|தக்காளி|തക്കാളി)/i.test(query);
  const isPaddy = /(paddy|rice|bhatta|chawal|dhan|ಭತ್ತ|ಅಕ್ಕಿ|धान|चावल|వరి|நெல்|നെല്ല്)/i.test(query);
  const isWheat = /(wheat|gehun|godhi|ಗೋಧಿ|गेंहू|గోధుమ|கோதுமை|ഗോതമ്പ്)/i.test(query);
  const isOnion = /(onion|onions|pyaz|eerulli|ಈರುಳ್ಳಿ|प्याज|ఉల్లిపాయ|வெங்காயம்|സവാള)/i.test(query);
  const isChilli = /(chilli|chili|mirchi|menasinakayi|ಮೆಣಸಿನಕಾಯಿ|मिर्च|మిరప|மிளகாய்|മുളക്)/i.test(query);
  const isMango = /(mango|mangoes|aam|mavinakayi|mavu|ಮಾವಿನಹಣ್ಣು|ಮಾವು|आम|మామిడి|மாம்பழம்|മാങ്ങ)/i.test(query);
  const isSugarcane = /(sugarcane|sugar cane|kabbu|ganna|ಕಬ್ಬು|गन्ना|చెరకు|கரும்பு|കരിമ്പ്)/i.test(query);
  const isCotton = /(cotton|kapas|hatti|ಹತ್ತಿ|कपास|పత్తి|பருத்தி|പരുത്തി)/i.test(query);

  // Key User Features
  const isFundSupport = /(fund|grant|support|subsidy|financial help|50000|50 thousand|1\.5 acre|fertiliser|fertilizer|tools|seed kit|free tool|free kit|ಸಹಾಯಧನ|ಅನುದಾನ|ಯೋಜನೆ|अनुदान|सहायता|పథకం)/i.test(query) && 
    /(farmer|land|small|marginal|proof|income|pauper|poor|tool|fertilizer|fund|grant|50000|1\.5|kit)/i.test(query);
  const isOfflineFuture = /(offline|no internet|without internet|network|future|implication|app|download|pwa|sms|ussd|connectivity|zero signal|signal|rural app|ಆಫ್‌ಲೈನ್|ಇಂಟರ್ನೆಟ್ ಇಲ್ಲದೆ|ऑफलाइन|నెట్‌వర్క్ లేకుండా|ஆஃப்லைன்)/i.test(query);

  // Agricultural Practices & Govt Schemes
  const isPmKisan = /(pm kisan|pm-kisan|6000|samman nidhi|installment|kisan samman)/i.test(query);
  const isKcc = /(kcc|kisan credit card|crop loan|bank loan|credit card|ಕಿಸಾನ್ ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್|किसान क्रेडिट कार्ड)/i.test(query);
  const isSolarPump = /(solar pump|kusum|solar subsidy|pm kusum|ಸೌರ ಪಂಪ್|सोलर पंप)/i.test(query);
  const isDripIrrigation = /(drip|irrigation|sprinkler|borewell|water|ಹನಿ ನೀರಾವರಿ|ड्रिप|నీటిపారుదల|சொட்டு நீர்)/i.test(query);
  const isOrganicManure = /(organic|vermicompost|neem cake|jeevamrutha|panchagavya|bio fertilizer|manure|ಸಾವಯವ|ಜೀವಾಮೃತ|ಎರೆಹುಳು ಗೊಬ್ಬರ|जीवामृत|जैविक)/i.test(query);
  const isMandiRates = /(mandi|price|rate|bhav|market|apmc|ಮಂಡಿ ದರ|ಬೆಲೆ|मंडी भाव|ధర|சந்தை விலை)/i.test(query);
  const isSoilTest = /(soil test|soil health|ph level|soil sampling|ಮಣ್ಣು ಪರೀಕ್ಷೆ|मृदा परीक्षण|మట్టి పరీక్ష)/i.test(query);
  const isDairyGoat = /(dairy|cow|milk|goat|sheep|cattle|ಹಸು|ಆಕಳು|ಕುರಿ|ಮೇಕೆ|गाय|भैंस|बकरी)/i.test(query);

  // Silly & Curious Questions
  const isPotatoOnTree = /(potato.*tree|grow.*potato.*tree|tree.*potato|ಆಲೂಗಡ್ಡೆ.*ಮರ|पेड़.*आलू)/i.test(query);
  const isGrowGoldOrMoney = /(grow.*(money|gold)|money.*tree|tree.*gold|money plant.*real money|ಹಣದ ಗಿಡ|ಚಿನ್ನ.*ಬೆಳೆ)/i.test(query);
  const isFishInSoil = /(fish.*soil|fish.*land|soil.*fish|ಮೀನು.*ಮಣ್ಣು|मछली.*मिट्टी)/i.test(query);
  const isPlantsTalk = /(plant.*(talk|speak|sing|music|hear)|ಗಿಡಗಳು.*ಮಾತನಾಡು|पेड़-पौधे.*बात)/i.test(query);
  const isSillyOther = /(can cow fly|can tractor fly|can i marry.*crop|marry a tomato|alien|ghost)/i.test(query);

  // General Knowledge & Out-of-Agriculture Topics (ChatGPT / DeepSeek Universal Intelligence)
  const isCapitalCity = /(capital of|राजधानी|ರಾಜಧಾನಿ|రాజధాని|தலைநகரம்)/i.test(query);
  const isPrimeMinister = /(prime minister|president|modi|ಮುಖ್ಯಮಂತ್ರಿ|ಪ್ರಧಾನಿ|प्रधानमंत्री|मुख्यमंत्री)/i.test(query);
  const isWhySkyBlue = /(why.*sky.*blue|sky.*blue|ಆಕಾಶ ನೀಲಿ|नीला आसमान)/i.test(query);
  const isWhatIsAI = /(what is (ai|artificial intelligence|chatgpt|deepseek)|who is deepseek|who is chatgpt|ಚಾಟ್‌ಜಿಪಿಟಿ|ಡೀಪ್‌ಸೀಕ್|ಎಐ ಎಂದರೇನು)/i.test(query);
  const isHealthFitness = /(health|exercise|sleep|water drink|stay healthy|ಆರೋಗ್ಯ|स्वास्थ्य)/i.test(query);
  const isJoke = /(joke|make me laugh|funny|ಹಾಸ್ಯ|ಚುಟುಕು|चुटकुला|జోక్|நகைச்சுவை)/i.test(query);
  const isMath = /^\s*(\d+(?:\.\d+)?)\s*([\+\-\*\/])\s*(\d+(?:\.\d+)?)\s*\??\s*$/.exec(query);

  // -------------------------------------------------------------
  // 3. EXECUTE MATCHED RESPONSE
  // -------------------------------------------------------------

  // A. MATH CALCULATION (ChatGPT / DeepSeek Calculator Mode)
  if (isMath) {
    const num1 = parseFloat(isMath[1]);
    const op = isMath[2];
    const num2 = parseFloat(isMath[3]);
    let result = 0;
    if (op === '+') result = num1 + num2;
    if (op === '-') result = num1 - num2;
    if (op === '*') result = num1 * num2;
    if (op === '/') result = num2 !== 0 ? (num1 / num2).toFixed(2) : 'Undefined (division by zero)';

    if (language === 'kn') {
      return {
        text: `ಲೆಕ್ಕಾಚಾರದ ಫಲಿತಾಂಶ: **${num1} ${op} ${num2} = ${result}**\n\nನಾನು ಕೃಷಿ ಇಳುವರಿ, ಎಕರೆವಾರು ರಸಗೊಬ್ಬರದ ಪ್ರಮಾಣ, ಬಿತ್ತನೆ ಬೀಜದ ಲೆಕ್ಕಾಚಾರ ಅಥವಾ ಯಾವುದೇ ದೈನಂದಿನ ಗಣಿತದ ಲೆಕ್ಕಗಳನ್ನು ತಕ್ಷಣವೇ ನಿಖರವಾಗಿ ಮಾಡಬಲ್ಲೆ!`,
        suggestedQuestions: ['1 ಎಕರೆ ಆಲೂಗಡ್ಡೆಗೆ ಎಷ್ಟು ಡಿಎಪಿ ಬೇಕು?', 'ಕಡಲೆಕಾಯಿ ಜಿಪ್ಸಂ ಲೆಕ್ಕಾಚಾರ', 'ಸಣ್ಣ ರೈತರ ಧನಸಹಾಯ ಯೋಜನೆ']
      };
    }
    if (language === 'hi') {
      return {
        text: `गणना का परिणाम: **${num1} ${op} ${num2} = ${result}**\n\nमैं प्रति एकड़ खाद की मात्रा, फसल लागत-मुनाफा या कोई भी सामान्य गणितीय हिसाब आसानी से कर सकता हूँ!`,
        suggestedQuestions: ['प्रति एकड़ आलू बीज दर', 'मूंगफली की वैज्ञानिक खेती', 'किसान सहायता फंड के नियम']
      };
    }
    return {
      text: `Calculation Result: **${num1} ${op} ${num2} = ${result}**\n\nJust like ChatGPT or DeepSeek, I can compute farm yields, fertilizer blends per acre, water irrigation requirements, or any daily mathematics!`,
      suggestedQuestions: ['How to grow high-yield potatoes?', 'Tell me about the Farmer Support Fund', 'How will the offline app work without internet?']
    };
  }

  // B. SILLY & PLAYFUL QUESTIONS (Direct, witty, scientifically accurate)
  if (isPotatoOnTree) {
    if (language === 'kn') {
      return {
        text: `😄 **ಆಲೂಗಡ್ಡೆ ಮರದಲ್ಲಿ ಬೆಳೆಯುತ್ತದೆಯೇ? ಇಲ್ಲವೇ ಇಲ್ಲ!**\n\n- ಆಲೂಗಡ್ಡೆ (*Solanum tuberosum*) ಯಾವುದೇ ಮರದಲ್ಲಾಗಲಿ ಅಥವಾ ಗಿಡದ ಮೇಲ್ಭಾಗದಲ್ಲಾಗಲಿ ಬೆಳೆಯುವುದಿಲ್ಲ. ಇದು ನೆಲದ ಅಡಿಯಲ್ಲಿ ಬೆಳೆಯುವ ಮಾರ್ಪಟ್ಟ ಕಾಂಡ (Tuber).\n- ಗಿಡದ ಮೇಲ್ಭಾಗದಲ್ಲಿ ಎಲೆಗಳು ಮಾತ್ರ ಬೆಳೆಯುತ್ತವೆ ಮತ್ತು ಸಣ್ಣ ವಿಷಕಾರಿ ಕಾಯಿಗಳು ಬಿಡುತ್ತವೆ (ಅವುಗಳನ್ನು ತಿನ್ನಬಾರದು).\n- **ಒಂದು ಮೋಜಿನ ವೈಜ್ಞಾನಿಕ ಸಂಗತಿ:** ವಿಜ್ಞಾನಿಗಳು ಟೊಮೆಟೊ ಕಾಂಡವನ್ನು ಆಲೂಗಡ್ಡೆ ಬುಡಕ್ಕೆ ಕಸಿ (Grafting) ಮಾಡಿ **"ಪೊಮ್ಯಾಟೊ (Pomato)"** ಎಂಬ ಗಿಡವನ್ನು ಸೃಷ್ಟಿಸಿದ್ದಾರೆ! ಇದರಲ್ಲಿ ನೆಲದ ಮೇಲೆ ಟೊಮೆಟೊ ಹಣ್ಣುಗಳು, ನೆಲದ ಒಳಗೆ ಆಲೂಗಡ್ಡೆ ಗೆಡ್ಡೆಗಳು ಒಂದೇ ಸಮಯದಲ್ಲಿ ಬೆಳೆಯುತ್ತವೆ!`,
        suggestedQuestions: ['ಆಲೂಗಡ್ಡೆ ಸರಿಯಾಗಿ ಬೆಳೆಯುವುದು ಹೇಗೆ?', 'ಕಡಲೆಕಾಯಿ ಬೆಳೆಯುವ ವಿಧಾನ', 'ಸಣ್ಣ ರೈತರ ಧನಸಹಾಯ ಯೋಜನೆ']
      };
    }
    return {
      text: `😄 **Can potatoes grow on a tree? Absolutely not!**\n\n- Potatoes (*Solanum tuberosum*) never grow on trees. They are **modified underground stem tubers** that swell beneath the soil to store starches.\n- The green plant above ground produces foliage and small green berries which contain toxic *solanine* and should never be eaten.\n- **Fun Scientific Fact:** Botanists created a grafted hybrid called the **"Pomato"** (or *TomTato*). By grafting a tomato vine onto potato rootstock, the single plant produces real cherry tomatoes above ground and real potatoes beneath the soil at the same time!`,
      suggestedQuestions: ['How to grow high-yield potatoes?', 'How to cultivate groundnuts?', 'Tell me about the Farmer Support Fund']
    };
  }

  if (isGrowGoldOrMoney) {
    if (language === 'kn') {
      return {
        text: `💰 **ಜಮೀನಿನಲ್ಲಿ ಚಿನ್ನ ಅಥವಾ ಹಣ ಬೆಳೆಯಬಹುದೇ?**\n\nಅಕ್ಷರಶಃ ರೂಪಾಯಿ ನೋಟುಗಳು ಮರದಲ್ಲಿ ಬೆಳೆಯುವುದಿಲ್ಲ! ಆದರೆ ಒಬ್ಬ ಬುದ್ಧಿವಂತ ರೈತನಿಗೆ ಅವನ ಫಲವತ್ತಾದ ಕಪ್ಪು ಮಣ್ಣು ಮತ್ತು ಅಧಿಕ ಮೌಲ್ಯದ ಬೆಳೆಗಳೇ ನಿಜವಾದ **"ಹಸಿರು ಚಿನ್ನ (Green Gold)"**!\n\n- **ರಕ್ತ ಚಂದನ (Red Sandalwood) & ಶ್ರೀಗಂಧ:** 15-20 ವರ್ಷಗಳಲ್ಲಿ ಕೋಟ್ಯಂತರ ರೂಪಾಯಿ ಮೌಲ್ಯ ನೀಡುವ ನೈಸರ್ಗಿಕ ನಿಧಿ.\n- **ಡ್ರ್ಯಾಗನ್ ಫ್ರೂಟ್ ಮತ್ತು ಆವಕಾಡೊ:** ಎಕರೆಗೆ ವಾರ್ಷಿಕ ₹8 ರಿಂದ ₹12 ಲಕ್ಷ ನಿವ್ವಳ ಲಾಭ ನೀಡುವ ಆಧುನಿಕ ಬೆಳೆಗಳು.\n- ಕಷ್ಟಪಟ್ಟು ಸರಿಯಾದ ತಂತ್ರಜ್ಞಾನದಲ್ಲಿ ಕೃಷಿ ಮಾಡಿದರೆ ನಿಮ್ಮ ಜಮೀನೇ ಬಂಗಾರದ ಗಣಿ!`,
        suggestedQuestions: ['ಅಧಿಕ ಲಾಭ ಕೊಡುವ ಬೆಳೆಗಳು ಯಾವುವು?', 'ಆಲೂಗಡ್ಡೆ ಬೆಳೆಯುವುದು ಹೇಗೆ?', 'ಸಣ್ಣ ರೈತರ ₹50 ಸಾವಿರ ಯೋಜನೆ']
      };
    }
    return {
      text: `💰 **Can you grow actual money or gold on trees?**\n\nWhile paper currency and gold coins don't sprout on branches, precision agriculture produces real **"Green Gold"**!\n\n- **High-Value Timber:** Sandalwood, Red Sandalwood, and Agarwood yield immense wealth over 15–20 years.\n- **Commercial Superfruits:** Dragon Fruit, Hass Avocado, and Medjool Date Palms produce ₹6–₹12 Lakh net profit per acre.\n- Good soil, organic vermicompost, and scientific drip irrigation turn every farm into a wealth engine!`,
      suggestedQuestions: ['How to grow high-yield potatoes?', 'Tell me about the Farmer Support Fund', 'How does the offline app work?']
    };
  }

  if (isFishInSoil) {
    return {
      text: `🐟 **Can fish live in soil?**\n\nFish have gills and cannot survive in dry dirt. However, there is a brilliant agricultural system called **Paddy-cum-Fish Integrated Farming (Aquaponics)**!\n- In flooded paddy fields, trenches are built where fish (like Common Carp, Tilapia, and Murrel) swim among the rice stalks.\n- The fish eat harmful stem-borer larvae and weed seeds, while their organic droppings fertilize the rice naturally, cutting fertilizer costs by 40% and providing double income!`,
      suggestedQuestions: ['How does Paddy-cum-Fish farming work?', 'How to grow groundnuts?', 'Tell me about the Farmer Support Fund']
    };
  }

  if (isPlantsTalk) {
    return {
      text: `🌿 **Do plants communicate or respond to sound?**\n\nYes! Modern botanical science reveals fascinating plant behaviors:\n1. **Underground Mycorrhizal Network ("Wood Wide Web"):** Trees and crops communicate and share nutrients through fungal threads connected to their roots.\n2. **Chemical Distress Signals:** When a caterpillar chews on a tomato leaf, the plant releases Volatile Organic Compounds (VOCs) into the air to warn neighboring plants to produce bitter defense tannins!\n3. **Acoustic Stimulation:** Studies show pleasant sound waves at 115–250 Hz promote stomatal opening and cell protoplasmic streaming.`,
      suggestedQuestions: ['How to grow potatoes?', 'How to grow groundnuts?', 'Farmer Support Fund eligibility']
    };
  }

  if (isSillyOther) {
    return {
      text: `🤖 **A Quick Reality Check from Kisan AI:**\n\nTractors don't fly (yet!), cows don't have wings, and while we all love our crops, you cannot legally marry a tomato! 😄\n\nHowever, technology is advancing rapidly: drones fly over farmlands every day to spray bio-pesticides and map soil moisture! What realistic farming or general question can I solve for you?`,
      suggestedQuestions: ['How to grow potatoes?', 'How to grow groundnuts?', 'Tell me about the Farmer Support Fund']
    };
  }

  // C. OUT-OF-AGRICULTURE GENERAL KNOWLEDGE (ChatGPT / DeepSeek Universal AI Mode)
  if (isWhySkyBlue) {
    if (language === 'kn') {
      return {
        text: `☀️ **ಆಕಾಶ ಏಕೆ ನೀಲಿಯಾಗಿ ಕಾಣುತ್ತದೆ? (Rayleigh Scattering):**\n\n1. ಸೂರ್ಯನಿಂದ ಬರುವ ಬಿಳಿ ಬೆಳಕು ಏಳು ಬಣ್ಣಗಳಿಂದ (VIBGYOR) ಕೂಡಿದೆ.\n2. ಭೂಮಿಯ ವಾತಾವರಣದಲ್ಲಿ ಸಾರಜನಕ (Nitrogen) ಮತ್ತು ಆಮ್ಲಜನಕದ (Oxygen) ಅಣುಗಳಿವೆ.\n3. ನೀಲಿ ಬಣ್ಣದ ಬೆಳಕಿನ ತರಂಗಾಂತರ (Wavelength) ತುಂಬಾ ಕಡಿಮೆಯಿರುವುದರಿಂದ, ಅದು ವಾತಾವರಣದ ಅಣುಗಳಿಗೆ ತಾಗಿ ಎಲ್ಲ ದಿಕ್ಕುಗಳಿಗೂ ಹೆಚ್ಚು ಚದುರುತ್ತದೆ (Scatter ಆಗುತ್ತದೆ).\n4. ಹೀಗಾಗಿ ನಾವು ಮೇಲಕ್ಕೆ ನೋಡಿದಾಗ ಆಕಾಶವು ಕಡು ನೀಲಿಯಾಗಿ ಕಂಗೊಳಿಸುತ್ತದೆ! ಸೂರ್ಯಾಸ್ತದ ವೇಳೆ ಬೆಳಕು ಹೆಚ್ಚು ದೂರ ಕ್ರಮಿಸುವುದರಿಂದ ಕೆಂಪು ಬೆಳಕು ಮಾತ್ರ ನಮ್ಮ ಕಣ್ಣಿಗೆ ತಲುಪುತ್ತದೆ.`,
        suggestedQuestions: ['ಮಳೆ ಹೇಗೆ ಉಂಟಾಗುತ್ತದೆ?', 'ಆಲೂಗಡ್ಡೆ ಬೆಳೆಯುವುದು ಹೇಗೆ?', 'ಕಿಸಾನ್ ಧನಸಹಾಯ ಯೋಜನೆ']
      };
    }
    return {
      text: `☀️ **Why is the sky blue? (Rayleigh Scattering Explained):**\n\n1. Sunlight reaches Earth's atmosphere and is made of all colors of the rainbow (different wavelengths).\n2. Red and yellow light have long wavelengths and pass right through.\n3. Blue light has a much shorter, smaller wavelength. When it strikes the microscopic gas molecules (Nitrogen & Oxygen) in our atmosphere, blue light is scattered in all directions more intensely than other colors.\n4. That is why our eyes perceive a brilliant blue sky on a clear day!`,
      suggestedQuestions: ['How to grow potatoes?', 'How does the offline app work without internet?', 'Farmer Support Fund details']
    };
  }

  if (isCapitalCity) {
    return {
      text: `🏛️ **Important Capital Cities:**\n\n- **India (ರಾಷ್ಟ್ರ ರಾಜಧಾನಿ):** New Delhi\n- **Karnataka:** Bengaluru\n- **Tamil Nadu:** Chennai\n- **Andhra Pradesh / Telangana:** Amaravati / Hyderabad\n- **Kerala:** Thiruvananthapuram\n- **Maharashtra:** Mumbai\n\nIs there any specific state, district, or agricultural administrative headquarters you are inquiring about?`,
      suggestedQuestions: ['How to grow potatoes?', 'How to cultivate groundnuts?', 'Smallholder Farmer Support Fund']
    };
  }

  if (isPrimeMinister) {
    return {
      text: `🇮🇳 **Leadership & Agricultural Governance in India:**\n\n- **Prime Minister of India:** Shri Narendra Modi\n- **Union Minister of Agriculture & Farmers' Welfare:** Shri Shivraj Singh Chouhan\n- Key national institutions governing Indian agriculture include:\n  1. **ICAR (Indian Council of Agricultural Research)** - Agricultural science and seed innovation.\n  2. **KVK (Krishi Vigyan Kendra)** - District-level practical farmer training.\n  3. **NABARD** - Rural refinancing and infrastructure development bank.`,
      suggestedQuestions: ['PM-Kisan 19th installment date', 'Smallholder Farmer Support Fund', 'How to grow potatoes?']
    };
  }

  if (isWhatIsAI) {
    return {
      text: `🤖 **What is AI, ChatGPT, and DeepSeek?**\n\n- **Artificial Intelligence (AI):** Computer software systems programmed to simulate human cognition, reasoning, language understanding, and problem-solving.\n- **ChatGPT (OpenAI) & DeepSeek:** Advanced Large Language Models (LLMs) trained on trillions of words to write code, answer questions, analyze complex data, and converse naturally.\n- **Kisan AI:** A specialized conversational AI built specifically for the **Agri-Connect** ecosystem. It merges the universal conversational power of ChatGPT/DeepSeek with deep agronomic science, local Indian languages, crop disease pathology, and APMC mandi intelligence!`,
      suggestedQuestions: ['How to grow high-yield potatoes?', 'How will the offline app work in rural areas?', 'Smallholder Farmer Support Fund']
    };
  }

  if (isHealthFitness) {
    return {
      text: `💪 **Farmer Health & Vitality Advice:**\n\n1. **Hydration in the Sun:** Drink at least 3.5 to 4 Litres of clean water daily with a pinch of salt and lemon or buttermilk to prevent heat exhaustion.\n2. **Ergonomic Posture:** When weeding or harvesting, avoid bending continuously from the waist; bend at the knees or use ergonomic long-handled weeders.\n3. **Chemical Safety:** Always wear protective rubber gloves, goggles, and an N95 mask when mixing sprays.\n4. **Restorative Sleep:** 7 to 8 hours of uninterrupted sleep restores muscle strength after intense field labor.`,
      suggestedQuestions: ['How to grow potatoes?', 'Farmer Support Fund details', 'Organic bio-fertilizers']
    };
  }

  if (isJoke) {
    if (language === 'kn') {
      return {
        text: `😄 **ಒಂದು ರೈತ ಸ್ನೇಹಿ ಹಾಸ್ಯ ಚುಟುಕು:**\n\nಒಬ್ಬ ರೈತ ಇನ್ನೊಬ್ಬ ರೈತನನ್ನು ಕೇಳಿದ: "ನಿನ್ನ ತೋಟದ ಟೊಮೆಟೊ ಹಣ್ಣುಗಳು ಯಾಕೆ ಇಷ್ಟು ಕೆಂಪಗಾಗಿವೆ?"\nಅದಕ್ಕೆ ಎರಡನೇ ರೈತ ಉತ್ತರಿಸಿದ: "ನಾನು ಪ್ರತಿದಿನ ಬೆಳಿಗ್ಗೆ ಹೋಗಿ ಮಂಡಿ ದರ ಕುಸಿದಿದೆ ಎಂದು ಹೇಳುತ್ತೇನೆ, ಅವು ನಾಚಿ ಕೆಂಪಾಗುತ್ತವೆ!" 😂\n\nನಗುತ್ತಾ ಕೃಷಿ ಮಾಡಿ! ನಿಮಗೆ ಇಂದು ಯಾವ ಬೆಳೆಯ ಬಗ್ಗೆ ಮಾಹಿತಿ ಬೇಕು?`,
        suggestedQuestions: ['ಆಲೂಗಡ್ಡೆ ಬೆಳೆಯುವ ವಿಧಾನ', 'ಕಡಲೆಕಾಯಿ ಇಳುವರಿ ಮಾಹಿತಿ', 'ಸಣ್ಣ ರೈತರ ಧನಸಹಾಯ ಯೋಜನೆ']
      };
    }
    return {
      text: `😄 **A Lighthearted Farming Joke:**\n\nWhy did the scarecrow win an award?\nBecause he was **outstanding in his field**! 🌾🚜\n\nA happy farmer grows the best harvest! What crop or farming topic can I help you with today?`,
      suggestedQuestions: ['How to grow high-yield potatoes?', 'How to cultivate groundnuts?', 'Tell me about the Farmer Support Fund']
    };
  }

  // D. POTATO CULTIVATION GUIDE
  if (isPotato) {
    if (language === 'kn') {
      return {
        text: `🥔 **ಆಲೂಗಡ್ಡೆ (Potato - *Solanum tuberosum*) ಸಮಗ್ರ ಕೃಷಿ ಕೈಪಿಡಿ:**\n\n${extractedName ? `ನಮಸ್ಕಾರ ${extractedName} ಅವರೇ, ` : ''}ಆಲೂಗಡ್ಡೆಯಲ್ಲಿ ಗರಿಷ್ಠ ಇಳುವರಿ ಪಡೆಯಲು ವೈಜ್ಞಾನಿಕ ಕ್ರಮಗಳು:\n\n1. **ಮಣ್ಣು ಮತ್ತು ಹವಾಗುಣ:**\n   - ಮರಳು ಮಿಶ್ರಿತ ಗೋಡು ಮಣ್ಣು ಸೂಕ್ತ (pH 5.2 ರಿಂದ 6.4). ನೀರು ನಿಲ್ಲಬಾರದು.\n   - ತಂಪಾದ ಹವಾಗುಣ (15°C - 22°C) ಗೆಡ್ಡೆ ಬೆಳೆಯಲು ಅತ್ಯುತ್ತಮ.\n\n2. **ಉತ್ತಮ ತಳಿಗಳು:**\n   - ಕುಫ್ರಿ ಜ್ಯೋತಿ (Kufri Jyoti), ಕುಫ್ರಿ ಪುಖ್‌ರಾಜ್ (Kufri Pukhraj), ಕುಫ್ರಿ ಸೂರ್ಯ (ಬಿಸಿಲು ಸಹಿಷ್ಣು).\n\n3. **ಬಿತ್ತನೆ ಬೀಜ ಮತ್ತು ಉಪಚಾರ:**\n   - ಎಕರೆಗೆ 600 ರಿಂದ 800 ಕೆಜಿ ಕಣ್ಣುಳ್ಳ ಬಿತ್ತನೆ ಆಲೂಗಡ್ಡೆ ಬೇಕು.\n   - ಕೊಳೆಯುವಿಕೆ ತಡೆಯಲು ಮ್ಯಾಂಕೋಜೆಬ್ (Mancozeb 2g/L) ಅಥವಾ ಟ್ರೈಕೋಡರ್ಮಾ (Trichoderma 5g/L) ದ್ರಾವಣದಲ್ಲಿ 15 ನಿಮಿಷ ಅದ್ದಿ ಒಣಗಿಸಿ.\n\n4. **ಬಿತ್ತನೆ ಅಂತರ ಮತ್ತು ಸಾಲುಗಳು:**\n   - ಸಾಲಿನಿಂದ ಸಾಲಿಗೆ 60 ಸೆಂ.ಮೀ (2 ಅಡಿ) ಮತ್ತು ಗಿಡದಿಂದ ಗಿಡಕ್ಕೆ 20 ಸೆಂ.ಮೀ ಅಂತರದಲ್ಲಿ ಏರುಸಾಲು (Ridge and Furrow) ಮಾಡಿ 5-7 ಸೆಂ.ಮೀ ಆಳದಲ್ಲಿ ನೆಡಬೇಕು.\n\n5. **ಗೊಬ್ಬರ ಮತ್ತು ಪೋಷಕಾಂಶ:**\n   - ಎಕರೆಗೆ 10 ಟನ್ ಚೆನ್ನಾಗಿ ಕಳಿತ ಕೊಟ್ಟಿಗೆ ಗೊಬ್ಬರ.\n   - ರಾಸಾಯನಿಕ ಗೊಬ್ಬರ (NPK): 60 ಕೆಜಿ ಸಾರಜನಕ, 40 ಕೆಜಿ ರಂಜಕ, 50 ಕೆಜಿ ಪೊಟ್ಯಾಷ್ (ಪೊಟ್ಯಾಷ್ ಗೆಡ್ಡೆ ದಪ್ಪಗಾಗಲು ಅತಿ ಮುಖ್ಯ).\n\n6. **ಬುಡಕ್ಕೆ ಮಣ್ಣು ಏರಿಸುವುದು (Earthing Up):**\n   - ನಾಟಿ ಮಾಡಿದ 30-35 ದಿನಗಳ ನಂತರ ಕಳೆ ಕೀಳಬೇಕು ಮತ್ತು ಸೂರ್ಯನ ಬೆಳಕು ತಾಗಿ ಗೆಡ್ಡೆ ಹಸಿರಾಗುವುದನ್ನು (Solanine ವಿಷ) ತಡೆಯಲು ಬುಡಕ್ಕೆ ಮಣ್ಣು ಏರಿಸಬೇಕು.\n\n7. **ರೋಗ ನಿರ್ವಹಣೆ (ಅಂಗಮಾರಿ ರೋಗ / Blight):**\n   - ಲೇಟ್ ಬ್ಲೈಟ್ ತಡೆಗಟ್ಟಲು ರೆಡೋಮಿಲ್ ಗೋಲ್ಡ್ (Ridomil Gold 2g/L) ಸಿಂಪಡಿಸಿ.\n\n8. **ಕೊಯ್ಲು:**\n   - 80-100 ದಿನಗಳಲ್ಲಿ ಎಲೆಗಳು ಹಳದಿಯಾಗಿ ಒಣಗಿದಾಗ ಕೊಯ್ಲು ಮಾಡಿ 10 ದಿನ ನೆರಳಿನಲ್ಲಿ ಆರಲು ಬಿಡಿ.`,
        safetyWarning: 'ಗೆಡ್ಡೆಗಳು ಹಸಿರು ಬಣ್ಣಕ್ಕೆ ತಿರುಗಿದ್ದರೆ ತಿನ್ನಬೇಡಿ. ಕೊಯ್ಲಿನ 10 ದಿನ ಮುಂಚೆ ನೀರು ಕೊಡುವುದನ್ನು ನಿಲ್ಲಿಸಿ.',
        suggestedQuestions: ['ಆಲೂಗಡ್ಡೆ ಲೇಟ್ ಬ್ಲೈಟ್ ರೋಗಕ್ಕೆ ಮದ್ದು ಏನು?', 'ಕಡಲೆಕಾಯಿ ಬೆಳೆಯುವುದು ಹೇಗೆ?', 'ಕಿಸಾನ್ ಸಹಾಯಧನ ಯೋಜನೆ']
      };
    }
    if (language === 'hi') {
      return {
        text: `🥔 **आलू की वैज्ञानिक एवं उन्नत खेती (Potato Cultivation Guide):**\n\n${extractedName ? `नमस्ते ${extractedName} जी, ` : ''}आलू की बंपर पैदावार के लिए संपूर्ण जानकारी:\n\n1. **मिट्टी व जलवायु:**\n   - जीवांशयुक्त बलुई दोमट मिट्टी (pH 5.5 - 6.5) सबसे उत्तम है।\n   - कंद बनने के लिए रात का तापमान 15°C से 20°C आदर्श रहता है।\n\n2. **उन्नत किस्में:**\n   - कुफरी पुखराज, कुफरी ज्योति, कुफरी बहार, कुफरी सिंदूरी।\n\n3. **बीज दर व बीजोपचार:**\n   - मध्यम आकार (35-45 ग्राम) के कंद प्रति एकड़ 10-12 क्विंटल।\n   - बाविस्टिन (Bavistin 2g/L) या ट्राइकोडर्मा से बीजोपचार करें।\n\n4. **बुवाई व अंतर:**\n   - कतार से कतार 60 सेमी और कंद से कंद 20 सेमी की दूरी पर मेड़ बनाकर बोएं।\n\n5. **खाद व उर्वरक:**\n   - 10 टन सड़ी गोबर खाद, NPK अनुपात 60:40:50 किलोग्राम प्रति एकड़। पोटाश कंदों के वजन और चमक के लिए जरूरी है।\n\n6. **मिट्टी चढ़ाना (Earthing Up):**\n   - बुवाई के 30-35 दिन बाद निराई-गुड़ाई कर पौधों पर मिट्टी चढ़ाएं ताकि कंद धूप से हरे न हों।\n\n7. **झुलसा रोग (Blight) रोकथाम:**\n   - मैंकोज़ेब 75 WP (2.5 ग्राम प्रति लीटर पानी) या रिडोमिल गोल्ड का छिड़काव करें।`,
        safetyWarning: 'खुदाई से 10 दिन पहले सिंचाई रोक दें ताकि आलू का छिलका मजबूत हो जाए।',
        suggestedQuestions: ['आलू में झुलसा रोग की दवा?', 'मूंगफली की वैज्ञानिक खेती कैसे करें?', 'किसान सहायता फंड के नियम']
      };
    }
    // Default English
    return {
      text: `🥔 **Complete Step-by-Step Potato (*Solanum tuberosum*) Cultivation Guide:**\n\n${extractedName ? `Hello ${extractedName}! ` : ''}Here are verified agronomic recommendations for maximum tuber yield:\n\n### 1. Soil & Climate\n- **Soil:** Well-drained sandy loam or silt loam rich in organic matter (pH 5.2 to 6.4). Avoid heavy clay soils that restrict tuber expansion.\n- **Temperature:** Cool nights (15°C–20°C) are critical during the tuber initiation stage (30–60 days after sowing).\n\n### 2. Best High-Yield Varieties in India\n- **Early (70–80 days):** *Kufri Pukhraj*, *Kufri Surya* (heat tolerant).\n- **Medium (90–100 days):** *Kufri Jyoti*, *Kufri Bahar*, *Kufri Chipsona-1* (best for chips/processing).\n\n### 3. Seed Preparation & Treatment\n- **Seed Rate:** 8 to 10 quintals (800–1,000 kg) per acre using healthy, sprouted whole tubers (35–45g each with 2–3 eyes).\n- **Treatment:** Dip tubers in *Mancozeb 75 WP* (2.5g/L) or *Trichoderma viride* (5g/L) for 15 minutes to prevent Black Scurf and Dry Rot.\n\n### 4. Spacing & Sowing Method\n- Plant on **Ridges and Furrows**: **60 cm** between rows and **20 cm** between tubers at 5–7 cm depth.\n\n### 5. Nutrition & Fertilizer Management\n- **Basal:** 10 tons well-decomposed FYM or 2 tons Vermicompost per acre.\n- **NPK Dose:** 60 kg Nitrogen, 40 kg Phosphorus, 50 kg Potassium (Potash is crucial for tuber size and starch synthesis).\n- Top dress remaining half Nitrogen at 30 days.\n\n### 6. Earthing Up (Critical Step)\n- At **30–35 days after planting**, pile soil around the base of plants. This prevents developing tubers from turning green due to sun exposure (*Solanine synthesis*).\n\n### 7. Disease Prevention (Late Blight)\n- Monitor for water-soaked dark leaf lesions. Spray *Metalaxyl + Mancozeb (Ridomil Gold)* @ 2g/L as a preventive measure during cloudy/humid weather.\n\n### 8. Dehaulming & Harvesting\n- 10 days before harvest, cut off top foliage (dehaulming) to harden the potato skins, then dig gently.`,
      safetyWarning: 'Never consume green-skinned potatoes (contains toxic solanine). Stop irrigation 10 days before harvest.',
      suggestedQuestions: ['How to cultivate groundnuts?', 'Tell me about the Smallholder Farmer Support Fund', 'What are the future offline app plans?']
    };
  }

  // E. GROUNDNUT / PEANUT CULTIVATION GUIDE
  if (isGroundnut) {
    if (language === 'kn') {
      return {
        text: `🥜 **ಕಡಲೆಕಾಯಿ / ಶೇಂಗಾ (Groundnut - *Arachis hypogaea*) ಅಧಿಕ ಇಳುವರಿ ಕೃಷಿ ವಿಧಾನ:**\n\n${extractedName ? `ನಮಸ್ಕಾರ ${extractedName} ಅವರೇ, ` : ''}ಕಡಲೆಕಾಯಿಯಲ್ಲಿ ಗರಿಷ್ಠ ಇಳುವರಿ ಪಡೆಯಲು ಈ ಕೆಳಗಿನ ಕ್ರಮಗಳನ್ನು ಅನುಸರಿಸಿ:\n\n1. **ಮಣ್ಣು ಮತ್ತು ಹವಾಗುಣ:**\n   - ಕೆಂಪು ಮರಳು ಗೋಡು ಅಥವಾ ಹಗುರವಾದ ಕಪ್ಪು ಮಣ್ಣು ಸೂಕ್ತ. ಮಣ್ಣಿನಲ್ಲಿ ಸುಣ್ಣ ಮತ್ತು ರಂಜಕದ ಅಂಶವಿರಬೇಕು.\n\n2. **ಉತ್ತಮ ತಳಿಗಳು:**\n   - ಜಿ-೨-೫೨ (G2-52), ಕೆಡಿಜಿ-೧೨೮ (KDG-128), ಟಿಎಂವಿ-೨ (TMV-2), ಐಸಿಜಿವಿ-೯೧೧೧೪ (ಬರ ಸಹಿಷ್ಣು).\n\n3. **ಬೀಜ ಪ್ರಮಾಣ ಮತ್ತು ಉಪಚಾರ (ಅತಿ ಮುಖ್ಯ):**\n   - ಎಕರೆಗೆ 45 ರಿಂದ 50 ಕೆಜಿ ಗುಣಮಟ್ಟದ ಬೀಜದ ಕಾಳುಗಳು ಬೇಕು.\n   - **ರೈಜೋಬಿಯಂ (Rhizobium) ಸಂವರ್ಧನೆ:** 1 ಕೆಜಿ ಬೀಜಕ್ಕೆ 20 ಗ್ರಾಂ ರೈಜೋಬಿಯಂ ಮತ್ತು 4 ಗ್ರಾಂ ಟ್ರೈಕೋಡರ್ಮಾ ಬೆರೆಸಿ ನೆರಳಿನಲ್ಲಿ ಒಣಗಿಸಿ ಬಿತ್ತಬೇಕು. ಇದು ಬೇರುಗಳಲ್ಲಿ ಗಂಟು ಕಟ್ಟಿ ಗಾಳಿಯಲ್ಲಿರುವ ಸಾರಜನಕವನ್ನು ಹೀರಿಕೊಳ್ಳಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.\n\n4. **ಬಿತ್ತನೆ ಅಂತರ:**\n   - ಸಾಲಿನಿಂದ ಸಾಲಿಗೆ 30 ಸೆಂ.ಮೀ (1 ಅಡಿ) ಮತ್ತು ಬೀಜದಿಂದ ಬೀಜಕ್ಕೆ 10 ಸೆಂ.ಮೀ ಅಂತರದಲ್ಲಿ 4-5 ಸೆಂ.ಮೀ ಆಳದಲ್ಲಿ ಬಿತ್ತನೆ ಮಾಡಿ.\n\n5. **ಜಿಪ್ಸಂ (Gypsum) ಬಳಕೆ - ಗಿಳಿ ಕಾಯಿ / ಜಳ್ಳು ತಡೆಗಟ್ಟಲು:**\n   - **ಬಿತ್ತನೆಯ 40-45 ದಿನಗಳಲ್ಲಿ (ಊಟೆ ಇಳಿಯುವ ಹಂತದಲ್ಲಿ / Pegging stage)** ಎಕರೆಗೆ 150 ರಿಂದ 200 ಕೆಜಿ ಜಿಪ್ಸಂ ಅನ್ನು ಗಿಡಗಳ ಬುಡಕ್ಕೆ ಹಾಕಿ ಮಣ್ಣು ಮುಚ್ಚಬೇಕು. ಜಿಪ್ಸಂನಲ್ಲಿರುವ ಕ್ಯಾಲ್ಸಿಯಂ ಮತ್ತು ಗಂಧಕವು ಕಾಯಿಯಲ್ಲಿ ಬೀಜ ಭರ್ತಿಯಾಗಲು ಅತ್ಯಗತ್ಯ.\n\n6. **ಕಳೆ ನಿರ್ವಹಣೆ:**\n   - ಬಿತ್ತಿದ 3 ದಿನಗಳ ಒಳಗೆ ಪೆಂಡಿಮಿಥಾಲಿನ್ (Pendimethalin 30 EC 1.3 ಲೀ/ಎಕರೆ) ಸಿಂಪಡಿಸಿ. ಊಟೆ ಇಳಿಯುವಾಗ (45 ದಿನಗಳ ನಂತರ) ಯಾವುದೇ ಕಾರಣಕ್ಕೂ ಎಡೆಕುಂಟೆ ಓಡಿಸಬಾರದು.\n\n7. **ರೋಗಗಳು (ತಿಕ್ಕಾ ಎಲೆಚುಕ್ಕೆ ರೋಗ):**\n   - ಎಲೆಗಳ ಮೇಲೆ ಕಪ್ಪು ಚುಕ್ಕೆಗಳು ಕಂಡರೆ ಹೆಕ್ಸಾಕೊನಜೋಲ್ (Hexaconazole 2ml/L) ಅಥವಾ ಮ್ಯಾಂಕೋಜೆಬ್ ಸಿಂಪಡಿಸಿ.\n\n8. **ಕೊಯ್ಲು:**\n   - 105-115 ದಿನಗಳಲ್ಲಿ ಎಲೆಗಳು ಹಳದಿಯಾಗಿ ಉದುರಿದಾಗ ಕಾಯಿ ಕಿತ್ತು ಒಣಗಿಸಿ.`,
        safetyWarning: 'ಊಟೆ ಮಣ್ಣಿಗೆ ಇಳಿಯುವ 45ನೇ ದಿನದ ನಂತರ ಎಡೆಕುಂಟೆ ಹೊಡೆಯಬೇಡಿ. ಜಿಪ್ಸಂ ಹಾಕುವುದನ್ನು ಮರೆಯಬೇಡಿ.',
        suggestedQuestions: ['ಕಡಲೆಕಾಯಿ ಜಿಪ್ಸಂ ಹಾಕುವುದು ಹೇಗೆ?', 'ಆಲೂಗಡ್ಡೆ ಬೆಳೆಯುವ ವಿಧಾನ', 'ಸಣ್ಣ ರೈತರ 50 ಸಾವಿರ ಧನಸಹಾಯ ಯೋಜನೆ']
      };
    }
    if (language === 'hi') {
      return {
        text: `🥜 **मूंगफली की वैज्ञानिक खेती एवं अधिक पैदावार के उपाय (Groundnut Guide):**\n\n${extractedName ? `नमस्ते ${extractedName} जी, ` : ''}मूंगफली की सफल खेती की पूरी विधि:\n\n1. **उपयुक्त मिट्टी:**\n   - बलुई दोमट या हल्की लाल मिट्टी जिसमें जल निकासी अच्छी हो (pH 6.0 से 7.5)।\n\n2. **उन्नत किस्में:**\n   - जीजी-20, कड़ा-3, टीएजी-24, टीएमवी-2।\n\n3. **बीज दर व राइजोबियम उपचार:**\n   - प्रति एकड़ 45-50 किग्रा स्वस्थ बीज दाना।\n   - बीज को **राइजोबियम कल्चर (Rhizobium)** 20 ग्राम/किग्रा और ट्राइकोडर्मा 4 ग्राम/किग्रा से उपचारित करें।\n\n4. **बुवाई की दूरी:**\n   - कतार से कतार 30 सेमी और पौधे से पौधा 10 सेमी, गहराई 4-5 सेमी।\n\n5. **जिप्सम का प्रयोग (दाना भरने के लिए सबसे जरूरी):**\n   - बुवाई के **40-45 दिन बाद (खूंटी बनते समय / Pegging Stage)** प्रति एकड़ 150-200 किग्रा जिप्सम पौधों की जड़ों के पास डालें। इससे दाना मोटा और भरा हुआ बनता है और खाली फली (पॉप) नहीं बनती।\n\n6. **खरपतवार व सिंचाई:**\n   - फूल आने और खूंटी बनते समय खेत में नमी आवश्यक है। 45 दिन बाद खुरपी न चलाएं।\n\n7. **टिक्का रोग नियंत्रण:**\n   - मैंकोज़ेब 2.5 ग्राम या कार्बेन्डाजिम 1 ग्राम प्रति लीटर पानी का छिड़काव करें।`,
        safetyWarning: 'खूंटी बनने के बाद गुड़ाई न करें अन्यथा खूंटियां टूट जाएंगी।',
        suggestedQuestions: ['मूंगफली में जिप्सम कब डालें?', 'आलू की खेती कैसे करें?', 'किसान सहायता फंड योजना क्या है?']
      };
    }
    // Default English
    return {
      text: `🥜 **Comprehensive Groundnut (*Arachis hypogaea*) Cultivation & Pod Yield Guide:**\n\n${extractedName ? `Hello ${extractedName}! ` : ''}Here is the complete scientific agronomic protocol for maximum peanut pod yield:\n\n### 1. Soil & Climate\n- **Soil:** Light sandy loam or red loam with good drainage and adequate calcium (pH 6.0 to 7.5). Heavy clays cause severe pod loss during digging.\n- **Climate:** Requires warm season (25°C–32°C) with plenty of sunlight.\n\n### 2. High-Yield Varieties in India\n- *TMV-2*, *Kadiri-6*, *GG-20*, *TAG-24*, *Dharwad Early Runner*, *ICGV-91114* (drought resilient).\n\n### 3. Seed Treatment & Inoculation (Crucial)\n- **Seed Rate:** 45 to 55 kg kernel seeds per acre.\n- **Bio-fertilizer Inoculation:** Treat kernels with **Rhizobium leguminosarum** (20g/kg seed) + **Trichoderma viride** (4g/kg seed). This allows root nodules to fix atmospheric nitrogen and shields against collar rot.\n\n### 4. Sowing Geometry\n- Spacing: **30 cm** between rows and **10 cm** between plants at 4–5 cm depth. Use Broad Bed and Furrow (BBF) method for better drainage.\n\n### 5. Gypsum Application (The Most Critical Yield Factor)\n- Apply **150 to 200 kg Gypsum per acre at 40–45 days after sowing (Pegging stage)** near the root zone.\n- *Why?* Developing pods absorb calcium directly from the surrounding soil, NOT from roots. Gypsum calcium prevents hollow/empty pods ("pops") and strengthens oil content.\n\n### 6. Weed Management Warning\n- Apply *Pendimethalin 30 EC* (1.3 L/acre) within 3 days of sowing.\n- **CRITICAL WARNING:** Do NOT inter-cultivate or hoe after 45 days! Disturbing the soil breaks the penetrating pegs entering the earth.\n\n### 7. Disease Prevention (Tikka Leaf Spot)\n- Spray *Hexaconazole 5% EC* (2 ml/L) or *Chlorothalonil 75 WP* (2g/L) when dark brown necrotic spots appear on foliage.\n\n### 8. Harvesting\n- Harvest at 105–115 days when leaves turn yellowish and inside of the pod shell displays dark brown veins.`,
      safetyWarning: 'Never disturb soil after peg penetration (45+ days). Apply gypsum at 40–45 days for solid pod filling.',
      suggestedQuestions: ['How to grow potatoes from seed tubers?', 'Explain the Smallholder Farmer Support Fund', 'How does the offline app work without internet?']
    };
  }

  // F. SMALLHOLDER FARMER SUPPORT FUND & CRITERIA (<1.5 ACRES, <50,000 INCOME)
  if (isFundSupport) {
    if (language === 'kn') {
      return {
        text: `🌱 **ಅಗ್ರಿ-ಕನೆಕ್ಟ್ ಸಣ್ಣ ರೈತರ ಧನಸಹಾಯ ಮತ್ತು ಸಲಕರಣೆ ಯೋಜನೆ (Smallholder Farmer Support Fund):**\n\n${extractedName ? `ನಮಸ್ಕಾರ ${extractedName} ಅವರೇ, ` : ''}ನಿಮ್ಮ ಪ್ರಶ್ನೆಗೆ ಉತ್ತರಿಸಲು ಸಂತೋಷವಾಗಿದೆ. ಸಣ್ಣ ಮತ್ತು ಅತಿಸಣ್ಣ ರೈತರಿಗೆ ರಸಗೊಬ್ಬರ, ಬೀಜ ಹಾಗೂ ಉಪಕರಣಗಳ ಉಚಿತ ನೆರವು ನೀಡುವ ನಿಯಮಗಳು ಇಲ್ಲಿವೆ:\n\n### 1. ಅರ್ಹತಾ ಮಾನದಂಡಗಳು (Eligibility Criteria):\n- **ಭೂಮಿ ಮಿತಿ:** ಒಟ್ಟು ಸಾಗುವಳಿ ಜಮೀನು **1.5 ಎಕರೆಗಿಂತ ಕಡಿಮೆ** ಇರಬೇಕು.\n- **ವಾರ್ಷಿಕ ಆದಾಯ:** ಕುಟುಂಬದ ವಾರ್ಷಿಕ ಆದಾಯ **₹50,000 ಕ್ಕಿಂತ ಕಡಿಮೆ** ಇರಬೇಕು.\n\n### 2. ರೈತರಿಗೆ ಸಿಗುವ ಉಚಿತ ಸವಲತ್ತುಗಳು (Free Benefits Provided):\n- **ಉಚಿತ ರಸಗೊಬ್ಬರ ಕಿಟ್:** ಎರೆಹುಳು ಗೊಬ್ಬರ (Vermicompost 2 ಕ್ವಿಂಟಾಲ್), ಬೇವಿನ ಹಿಂಡಿ (Neem Cake 50 ಕೆಜಿ), ಜೈವಿಕ ಗೊಬ್ಬರಗಳಾದ ಅಜೋಟೋಬ್ಯಾಕ್ಟರ್ (Azotobacter) ಮತ್ತು ಪಿಎಸ್‌ಬಿ (PSB).\n- **ಉಚಿತ ಕೃಷಿ ಉಪಕರಣಗಳು:** 16 ಲೀಟರ್ ಮ್ಯಾನುಯಲ್/ಬ್ಯಾಟರಿ ಸ್ಪ್ರೇಯರ್ (Knapsack Sprayer), ಕಳೆ ಕೀಳುವ ಸಲಕರಣೆ ಮತ್ತು ಮಣ್ಣು ಪರೀಕ್ಷಾ ಕಿಟ್.\n- **ಪ್ರಮಾಣೀಕೃತ ಬೀಜದ ಕಿಟ್:** ಆಯಾ ಋತುವಿನ ಅಧಿಕ ಇಳುವರಿ ಬಿತ್ತನೆ ಬೀಜಗಳು.\n\n### 3. ಸಲ್ಲಿಸಬೇಕಾದ ಅಧಿಕೃತ ದಾಖಲೆಗಳು (Valid Proofs Required):\n1. **ಆರ್‌ಟಿಸಿ / ಪಹಣಿ ಪತ್ರ (Pahani RTC):** ಜಮೀನು 1.5 ಎಕರೆಗಿಂತ ಕಡಿಮೆ ಇರುವುದನ್ನು ದೃಢೀಕರಿಸುವ ಇತ್ತೀಚಿನ ಪಹಣಿ.\n2. **ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ (Income Certificate):** ಗ್ರಾಮ ಒನ್ ಅಥವಾ ತಹಶೀಲ್ದಾರ್ ಕಚೇರಿಯಿಂದ ನೀಡಲಾದ ₹50,000 ಕ್ಕಿಂತ ಕಡಿಮೆ ಆದಾಯದ ಸರ್ಟಿಫಿಕೇಟ್.\n3. **ಆಧಾರ್ ಕಾರ್ಡ್ ಪ್ರತಿ (Aadhaar Card):** ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಜೋಡಣೆಯಾಗಿರಬೇಕು.\n4. **ಬ್ಯಾಂಕ್ ಪಾಸ್‌ಬುಕ್ ಪ್ರತಿ:** ಐಎಫ್‌ಎಸ್‌ಸಿ (IFSC) ಕೋಡ್ ಮತ್ತು ಖಾತೆ ಸಂಖ್ಯೆ ಸ್ಪಷ್ಟವಾಗಿರಬೇಕು.\n\n### 4. ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ವಿಧಾನ:\n- ನಮ್ಮ ವೆಬ್‌ಸೈಟ್‌ನ ಮೇಲ್ಭಾಗದಲ್ಲಿ ಅಥವಾ ಕೆಳಭಾಗದಲ್ಲಿರುವ **"Small Farmer Support Fund"** ಬಟನ್ ಕ್ಲಿಕ್ ಮಾಡಿ ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಅಥವಾ ನಿಮ್ಮ ಸಮೀಪದ ಗ್ರಾಮ ಪಂಚಾಯತಿ / ಎಫ್‌ಪಿಒ ಕಚೇರಿಯಲ್ಲಿ ಉಚಿತವಾಗಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಬಹುದು!`,
        suggestedQuestions: ['ಧನಸಹಾಯ ಫಾರಂ ಭರ್ತಿ ಮಾಡುವುದು ಹೇಗೆ?', 'ಆಲೂಗಡ್ಡೆ ಬೆಳೆಯುವ ವಿಧಾನ', 'ಇಂಟರ್ನೆಟ್ ಇಲ್ಲದೆ ಆಪ್ ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ?']
      };
    }
    if (language === 'hi') {
      return {
        text: `🌱 **एग्री-कनेक्ट लघु किसान सहायता एवं कृषि यंत्र फंड (Farmer Support Grant):**\n\n${extractedName ? `नमस्ते ${extractedName} जी, ` : ''}छोटे व सीमांत किसानों को खाद, बीज और कृषि यंत्र उपलब्ध कराने की योजना का विवरण:\n\n### 1. पात्रता मानदंड (Eligibility Criteria):\n- **जमीन की सीमा:** कुल कृषि भूमि **1.5 एकड़ से कम** होनी चाहिए।\n- **वार्षिक आय:** परिवार की कुल वार्षिक आय **₹50,000 से कम** होनी चाहिए।\n\n### 2. मिलने वाले लाभ (Free Agricultural Package):\n- **जैविक उर्वरक किट:** 2 क्विंटल वर्मीकम्पोस्ट, 50 किग्रा नीम खली, ट्राइकोडर्मा और बायो-एनपीके कंसोर्टिया।\n- **कृषि उपकरण:** 16 लीटर नैपसैक स्प्रे पंप (Knapsack Sprayer), हस्तचालित निराई गुड़ाई यंत्र।\n- **प्रमाणित बीज:** मौसम के अनुसार उच्च पैदावार वाली फसलों का प्रमाणित बीज।\n\n### 3. आवश्यक दस्तावेज (Valid Proofs):\n1. **खतौनी / जमाबंदी / भू-अभिलेख:** 1.5 एकड़ से कम जोत का वैध प्रमाण।\n2. **आय प्रमाण पत्र (Income Certificate):** तहसीलदार द्वारा जारी ₹50,000 से कम आय का प्रमाण पत्र।\n3. **आधार कार्ड** (बैंक से लिंक)।\n4. **बैंक पासबुक की प्रति**।\n\n### 4. आवेदन प्रक्रिया:\n- पोर्टल पर **"Small Farmer Support Fund"** पर क्लिक कर सीधे ऑनलाइन आवेदन करें।`,
        suggestedQuestions: ['मूंगफली की खेती कैसे करें?', 'आलू उगाने की सही विधि?', 'बिना इंटरनेट ऑफलाइन ऐप कैसे चलेगा?']
      };
    }
    // Default English
    return {
      text: `🌱 **Agri-Connect Smallholder Farmer Support Grant & Fertilizer/Tool Assistance:**\n\n${extractedName ? `Hello ${extractedName}! ` : ''}Here are the verified terms, eligibility criteria, and document requirements for our **Farmer Support Fund Programme**:\n\n### 1. Eligibility Criteria (Strictly Enforced)\n- **Landholding:** Total cultivable land must be **less than 1.5 Acres** (Marginal & Smallholder farmers).\n- **Annual Household Income:** Certified annual income must be **under ₹50,000 per year**.\n\n### 2. Benefits Provided (100% Free of Cost)\n- **Organic & Bio-Fertilizer Package:**\n  - 200 kg Premium Vermicompost\n  - 50 kg Cold-Pressed Neem Cake (soil pest deterrent)\n  - *Azotobacter*, *Rhizobium*, and *PSB (Phosphate Solubilizing Bio-fertilizer)* liquid consortium\n- **Farm Tools & Equipment:**\n  - 16-Litre Dual Manual/Battery Knapsack Sprayer pump\n  - Ergonomic wheel hoe weeder & hand harvesting sickle\n  - Rapid NPK soil testing strip kit\n- **Certified Seed Kit:** High-yield certified seeds (Potato, Groundnut, Pulses, or Millets) for current planting season.\n\n### 3. Valid Proof Documents Required\n1. **Land Ownership Proof:** Recent Pahani / RTC / 7/12 / Patta Passbook verifying land area < 1.5 acres.\n2. **Income Certificate:** Government Revenue Certificate issued by Tahsildar / Revenue Inspector certifying family income < ₹50,000.\n3. **Aadhaar Card:** Copy seeded with NPCI / DBT active status.\n4. **Bank Passbook Copy:** Clear bank account number and IFSC code for direct logistics tracking.\n\n### 4. How to Apply\n- Click the **"Small Farmer Support Fund"** button located in our website header and footer, or visit your nearest Taluk Krishi Vigyan Kendra (KVK) or Farmer Producer Organization (FPO) partner.`,
      suggestedQuestions: ['How to grow potatoes?', 'How to grow groundnuts?', 'How will the offline app work in rural areas?']
    };
  }

  // G. OFFLINE APP & FUTURE ARCHITECTURAL IMPLEMENTATIONS
  if (isOfflineFuture) {
    if (language === 'kn') {
      return {
        text: `📱 **ಭವಿಷ್ಯದ ಆಫ್‌ಲೈನ್ ಮೊಬೈಲ್ ಆ್ಯಪ್ ಯೋಜನೆ (Offline-First Rural Architecture):**\n\n${extractedName ? `ನಮಸ್ಕಾರ ${extractedName} ಅವರೇ, ` : ''}ಗ್ರಾಮೀಣ ಭಾಗಗಳಲ್ಲಿ ಇಂಟರ್ನೆಟ್ ಸಂಪರ್ಕವಿಲ್ಲದ ಜಮೀನುಗಳಲ್ಲಿ ನಮ್ಮ ಆ್ಯಪ್ ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ ಎಂಬ ವಿವರ ಇಲ್ಲಿದೆ:\n\n### 1. ಆಫ್‌ಲೈನ್ ಆ್ಯಪ್ ಏಕೆ ಬೇಕು?\n- ಬಹುತೇಕ ಎಐ ಚಾಟ್‌ಬಾಟ್‌ಗಳ ಮಾಡೆಲ್ ಗಾತ್ರ (3 ರಿಂದ 14 ಜಿಬಿ) ಇರುತ್ತದೆ. ಇದನ್ನು ₹6,000 ದ ಸಾಮಾನ್ಯ ಮೊಬೈಲ್‌ಗಳಲ್ಲಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಿಲ್ಲ. ಆದ್ದರಿಂದ ನಾವು 4-ಹಂತಗಳ ಆಫ್‌ಲೈನ್ ತಂತ್ರಜ್ಞಾನ ರೂಪಿಸಿದ್ದೇವೆ.\n\n### 2. ಹಂತ 2: ಪ್ರೋಗ್ರೆಸ್ಸಿವ್ ವೆಬ್ ಆ್ಯಪ್ (PWA - Installable):\n- ಆಪ್ ಸ್ಟೋರ್ ಇಲ್ಲದೆಯೇ ನೇರವಾಗಿ ಬ್ರೌಸರ್ ಮೂಲಕ ಮೊಬೈಲ್‌ಗೆ ಇನ್‌ಸ್ಟಾಲ್ ಆಗುತ್ತದೆ.\n- ಬೆಳೆ ರೋಗಗಳ ಚಿತ್ರಗಳು, ಮಂಡಿ ಬೆಲೆಯ 30 ದಿನಗಳ ಇತಿಹಾಸ ಮತ್ತು ಯೋಜನೆಗಳ ದಾಖಲೆಗಳು ಮುಂಚಿತವಾಗಿಯೇ ಡೌನ್‌ಲೋಡ್ ಆಗಿ ಆಫ್‌ಲೈನ್‌ನಲ್ಲಿ ಉಳಿಯುತ್ತವೆ.\n- ಇಂಟರ್ನೆಟ್ ಇಲ್ಲದಿದ್ದಾಗಲೂ ಫಾರ್ಮ್ ತುಂಬಿ ಸೇವ್ ಮಾಡಬಹುದು (IndexedDB). ಮೊಬೈಲ್‌ಗೆ ನೆಟ್‌ವರ್ಕ್ ಬಂದ ತಕ್ಷಣ ಡೇಟಾ ಆಟೋಮ್ಯಾಟಿಕ್ ಆಗಿ ಸಿಂಕ್ ಆಗುತ್ತದೆ.\n\n### 3. ಹಂತ 3: ಆಂಡ್ರಾಯ್ಡ್ ಮತ್ತು ಐಒಎಸ್ ಮೊಬೈಲ್ ಆ್ಯಪ್:\n- ಫ್ಲಟರ್ (Flutter) ತಂತ್ರಜ್ಞಾನದ ಆ್ಯಪ್, ಸ್ಥಳೀಯ SQLite ಡೇಟಾಬೇಸ್.\n- **2G SMS / USSD ಸಂದೇಶ ಬ್ಯಾಕಪ್:** ನೆಟ್‌ವರ್ಕ್ ಡೇಟಾ ಶೂನ್ಯವಿದ್ದಾಗ, ಉಚಿತ SMS ಮೂಲಕವೇ (ಉದಾ: SMS "RATES TOMATO" to 56767) ಮಂಡಿ ದರ ಮತ್ತು ಹವಾಮಾನ ಎಚ್ಚರಿಕೆಗಳು ಬಟನ್ ಫೋನ್‌ಗಳಿಗೂ ಸಿಗುತ್ತವೆ.\n\n### 4. ಹಂತ 4: ಗ್ರಾಮೀಣ ಎಡ್ಜ್ ತಂತ್ರಜ್ಞಾನ:\n- ಮೊಬೈಲ್ ಕ್ಯಾಮೆರಾದಿಂದ ಇಂಟರ್ನೆಟ್ ಇಲ್ಲದೆಯೇ ಎಲೆ ರೋಗ ಪತ್ತೆ ಹಚ್ಚುವ ಸಣ್ಣ TFLite ಎಐ ಮಾಡೆಲ್.\n- ಗ್ರಾಮ ಪಂಚಾಯತಿ ಡಿಜಿಟಲ್ ಕಿಯೋಸ್ಕ್ ಮತ್ತು 1800 ಉಚಿತ ಟೋಲ್-ಫ್ರೀ ಧ್ವನಿ ಕರೆ ಸೌಲಭ್ಯ.`,
        suggestedQuestions: ['ಕಿಸಾನ್ ಧನಸಹಾಯ ಯೋಜನೆ ವಿವರ', 'ಆಲೂಗಡ್ಡೆ ಬೆಳೆಯುವುದು ಹೇಗೆ?', 'ಕಡಲೆಕಾಯಿ ಜಿಪ್ಸಂ ಬಳಕೆ']
      };
    }
    return {
      text: `📱 **Future Offline-First Architecture & Network-Resilient Rural App Plan:**\n\n${extractedName ? `Hello ${extractedName}! ` : ''}Here is our full 4-phase technical roadmap for how Agri-Connect will operate with **ZERO Internet connectivity** in remote farmlands:\n\n### Why an Offline-First Architecture is Essential\nA full-scale generative AI model is 3 GB to 14 GB in size—far too heavy to run directly on the entry-level ₹5,000–₹8,000 smartphones prevalent across rural India. Our hybrid phased architecture solves this:\n\n### Phase 1: Web Prototype (Current Live Phase)\n- Comprehensive responsive web app, live dashboards, AI Doctor, 6 Indian languages, and edge cloud hosting.\n\n### Phase 2: Progressive Web App (PWA - In Development)\n- **Installable from Browser:** No Google Play Store account or high data download needed.\n- **Service Worker Cache:** Pre-caches all visual crop disease guides and 30-day APMC market price histories.\n- **IndexedDB Offline Form Queue:** Farmers can input a harvest sale or request equipment while deep in the fields; it queues locally and flushes automatically the moment 4G/Wi-Fi signal returns.\n\n### Phase 3: Android & iOS Mobile Native App\n- Cross-platform Flutter / React Native build.\n- **On-Device SQLite Database:** Stores 10,000+ local mandi records and farmer ledgers encrypted on device.\n- **Downloadable Vernacular Language Audio Packs** for hands-free listening.\n- **2G Cellular SMS & USSD Fallback Gateway:** When mobile data is completely dead, farmers can text (e.g. 'RATES TOMATO SHIVAMOGGA' to '56767') to receive instant APMC modal prices via encoded 160-char SMS on any button phone!\n\n### Phase 4: Advanced Edge AI & Rural Access\n- **On-Device TFLite Leaf Diagnostics:** Quantized mobile neural network running crop disease diagnosis with zero cloud calls.\n- **Toll-Free IVR Interactive Phone Line (1800-180-1551)** for non-smartphone owners.\n- **Gram Panchayat Digital Kiosks** with thermal receipt printers for cooperative trade.`,
      suggestedQuestions: ['Tell me about the Smallholder Farmer Support Fund', 'How to grow potatoes?', 'How to grow groundnuts?']
    };
  }

  // H. GREETINGS & INTRODUCTIONS
  if (isGreeting) {
    if (language === 'kn') {
      return {
        text: `ನಮಸ್ಕಾರ${extractedName ? ` ${extractedName} ಅವರೇ` : ''}! ಶುಭೋದಯ! 🙏\n\nನಾನು **ಕಿಸಾನ್ ಎಐ (Kisan AI)**, ನಿಮ್ಮ 24/7 ಕೃಷಿ ಸಲಹೆಗಾರ. ಚಾಟ್‌ಜಿಪಿಟಿ ಅಥವಾ ಡೀಪ್‌ಸೀಕ್‌ನಂತೆ ನೀವು ಕೃಷಿ ಅಥವಾ ಯಾವುದೇ ಸಾಮಾನ್ಯ ವಿಷಯದ ಕುರಿತು ಪ್ರಶ್ನೆ ಕೇಳಬಹುದು:\n\n- 🥔 **ಆಲೂಗಡ್ಡೆ, ಕಡಲೆಕಾಯಿ, ಭತ್ತ, ಟೊಮೆಟೊ** ಮುಂತಾದ ಬೆಳೆಗಳನ್ನು ಬೆಳೆಯುವ ವಿಧಾನ\n- 🐛 ರೋಗ ಮತ್ತು ಕೀಟ ನಿಯಂತ್ರಣ ಔಷಧಗಳು\n- 💰 ಇಂದಿನ ಲೈವ್ ಎಪಿಎಂಸಿ ಮಂಡಿ ದರಗಳು\n- 📜 ಸಣ್ಣ ರೈತರ ₹50,000 ಆದಾಯದ ಧನಸಹಾಯ & ಸಲಕರಣೆ ಯೋಜನೆ\n- 📱 ಇಂಟರ್ನೆಟ್ ಇಲ್ಲದೆ ಕೆಲಸ ಮಾಡುವ ಭವಿಷ್ಯದ ಆಫ್‌ಲೈನ್ ಆ್ಯಪ್ ವಿವರ\n\nಇಂದು ನಿಮಗೆ ಯಾವ ವಿಷಯದ ಕುರಿತು ಮಾಹಿತಿ ಬೇಕು?`,
        suggestedQuestions: ['ಆಲೂಗಡ್ಡೆ ಬೆಳೆಯುವುದು ಹೇಗೆ?', 'ಕಡಲೆಕಾಯಿ ಬೆಳೆಯುವುದು ಹೇಗೆ?', 'ಸಣ್ಣ ರೈತರ ಧನಸಹಾಯ ಯೋಜನೆ']
      };
    }
    if (language === 'hi') {
      return {
        text: `नमस्ते${extractedName ? ` ${extractedName} जी` : ''}! सुप्रभात! 🙏\n\nमैं आपका **किसान एआई (Kisan AI)** सहायक हूँ। आप मुझसे कृषि या किसी भी अन्य विषय पर कोई भी प्रश्न पूछ सकते हैं:\n\n- 🥔 **आलू, मूंगफली, धान, टमाटर** की उन्नत खेती के तरीके\n- 🐛 कीट व फफूंद नियंत्रण के उपाय\n- 💰 आज के लाइव मंडी भाव और सरकारी योजनाएं\n- 📜 छोटे किसानों के लिए खाद व कृषि यंत्र सहायता फंड\n- 📱 बिना इंटरनेट चलने वाले भविष्य के ऑफलाइन ऐप की जानकारी\n\nबताइए, आज मैं आपकी क्या सहायता कर सकता हूँ?`,
        suggestedQuestions: ['आलू की खेती कैसे करें?', 'मूंगफली की वैज्ञानिक खेती', 'किसान सहायता फंड योजना']
      };
    }
    return {
      text: `Hello${extractedName ? ` ${extractedName}` : ''}! Good morning! 🙏\n\nI am **Kisan AI**, your 24/7 intelligent agricultural and general knowledge copilot. Just like ChatGPT or DeepSeek, I can help you with anything:\n\n- 🥔 **Step-by-step crop guides:** How to grow Potatoes, Groundnuts, Tomatoes, Paddy, Wheat, etc.\n- 🐛 **Pest & Disease remedies:** Organic and bio-fungicide sprays.\n- 💰 **Live APMC Mandi rates** and best selling locations.\n- 📜 **Smallholder Farmer Support Fund:** Free fertilizer, tools, and seed kit for < 1.5 acres & < ₹50,000 income.\n- 📱 **Future Offline App:** How the app will function with zero internet via PWA caching and SMS fallback.\n\nWhat would you like to explore today?`,
      suggestedQuestions: ['How to grow potatoes?', 'How to grow groundnuts?', 'Tell me about the Farmer Support Fund']
    };
  }

  // I. NAME & IDENTITY
  if (isNameQuestion) {
    if (language === 'kn') {
      return {
        text: `ನನ್ನ ಹೆಸರು **ಕಿಸಾನ್ ಎಐ (Kisan AI)**! 🤖🌾\n\nನಾನು ಭಾರತೀಯ ರೈತರಿಗೆ ಮತ್ತು ಸಾರ್ವಜನಿಕರಿಗೆ ಸಹಾಯ ಮಾಡಲು ಅಗ್ರಿ-ಕನೆಕ್ಟ್ (Agri-Connect) ವೇದಿಕೆಯಲ್ಲಿ ನಿರ್ಮಿಸಲಾದ ಅತ್ಯಾಧುನಿಕ ಎಐ ಕೃಷಿ ವೈದ್ಯ. ಚಾಟ್‌ಜಿಪಿಟಿ ಮತ್ತು ಡೀಪ್‌ಸೀಕ್‌ನಂತೆ ನಾನು ಯಾವುದೇ ಪ್ರಶ್ನೆಗೂ (ಕೃಷಿ, ತಂತ್ರಜ್ಞಾನ, ಗಣಿತ, ಹವಾಮಾನ ಅಥವಾ ಸಾಮಾನ್ಯ ಜ್ಞಾನ) ಉತ್ತರಿಸಬಲ್ಲೆ!`,
        suggestedQuestions: ['ಆಲೂಗಡ್ಡೆ ಬೆಳೆಯುವುದು ಹೇಗೆ?', 'ಕಡಲೆಕಾಯಿ ಬೆಳೆಯುವುದು ಹೇಗೆ?', 'ಸಣ್ಣ ರೈತರ ಧನಸಹಾಯ ಯೋಜನೆ']
      };
    }
    if (language === 'hi') {
      return {
        text: `मेरा नाम **किसान एआई (Kisan AI)** है! 🤖🌾\n\nमैं एग्री-कनेक्ट (Agri-Connect) द्वारा विकसित एक आधुनिक एआई सहायक हूँ। चैटजीपीटी और डीपसीक की तरह मैं कृषि, मौसम, मंडी भाव, सरकारी योजनाओं और सामान्य ज्ञान से जुड़े हर सवाल का जवाब दे सकता हूँ!`,
        suggestedQuestions: ['आलू की उन्नत खेती', 'मूंगफली की खेती कैसे करें?', 'किसान सहायता फंड']
      };
    }
    return {
      text: `My name is **Kisan AI**! 🤖🌾\n\nI am an advanced conversational AI agricultural copilot engineered for the Agri-Connect ecosystem. Operating like ChatGPT and DeepSeek, I can answer queries across all domains:\n- Precision agriculture (Potatoes, Groundnuts, Paddy, Vegetables, Soil health)\n- Real-time Mandi market rates & transport calculations\n- Government subsidies (PM-KISAN, Drip irrigation, Solar pumps)\n- Smallholder Farmer Support Fund (< 1.5 acres & < ₹50k income)\n- Offline mobile app implementation roadmap\n- General science, math, technology, and everyday questions in 6+ Indian languages!`,
      suggestedQuestions: ['How to grow potatoes?', 'How to grow groundnuts?', 'Tell me about the Farmer Support Fund']
    };
  }

  // J. OTHER SPECIFIC CROPS (TOMATO, PADDY, WHEAT, ONION, CHILLI, MANGO, SUGARCANE, COTTON)
  if (isTomato) {
    return {
      text: `🍅 **Tomato (*Solanum lycopersicum*) Cultivation Best Practices:**\n\n1. **Spacing:** 60 cm x 45 cm on raised beds with drip irrigation.\n2. **Staking:** Stake indeterminate plants at 25–30 days with bamboo/twine to keep fruit off wet ground.\n3. **Fertigation:** NPK 19:19:19 (5g/L) during vegetative stage, shifting to 13:0:45 (Potassium Nitrate) during fruit swelling.\n4. **Early/Late Blight Prevention:** Spray Copper Oxychloride (2.5g/L) or Neem Oil 10,000 PPM (3ml/L).\n5. **Fruit Borer Control:** Install Helicoverpa pheromone traps (5/acre) and spray *Bacillus thuringiensis* (Bt @ 2g/L).`,
      suggestedQuestions: ['How to grow potatoes?', 'How to grow groundnuts?', 'Farmer Support Fund eligibility']
    };
  }

  if (isPaddy) {
    return {
      text: `🌾 **Paddy / Rice (*Oryza sativa*) High-Yield Protocol:**\n\n1. **Method:** Adopt System of Rice Intensification (SRI) for 30% water saving and 20% higher yield.\n2. **Seed Treatment:** Treat seeds with *Carbendazim* (2g/kg) and *Azospirillum* bio-fertilizer.\n3. **Transplanting:** 14-day-old young single seedlings at 25 cm x 25 cm spacing.\n4. **Water Management:** Alternate Wetting and Drying (AWD) rather than continuous deep flooding.\n5. **Stem Borer Prevention:** Install Yellow Stem Borer pheromone traps (8/acre) or apply *Chlorantraniliprole 0.4% G* (4 kg/acre).`,
      suggestedQuestions: ['How to grow potatoes?', 'How to grow groundnuts?', 'Mandi prices for paddy']
    };
  }

  if (isWheat) {
    return {
      text: `🌾 **Wheat (*Triticum aestivum*) Production Guidelines:**\n\n1. **Sowing Window:** November 10–25 (Optimum). Late sowing after Dec 15 reduces yield by 40 kg/day/ha.\n2. **Seed Rate:** 40 kg per acre using certified seed drill.\n3. **Critical Irrigation Stages:** Crown Root Initiation (CRI at 21 days—never miss this!), Tillering (45 days), Flowering (85 days), and Grain Filling (105 days).\n4. **Weed Control:** Apply *Sulfosulfuron + Metsulfuron* at 30 days after sowing.\n5. **Yellow Rust Protection:** Spray *Propiconazole 25 EC* (1 ml/L) at first symptom of yellow powdery pustules.`,
      suggestedQuestions: ['How to grow potatoes?', 'How to grow groundnuts?', 'Farmer Support Fund']
    };
  }

  if (isOnion) {
    return {
      text: `🧅 **Onion (*Allium cepa*) Cultivation Guide:**\n\n1. **Nursery:** 45-day-old healthy seedlings transplanted at 15 cm x 10 cm on raised beds.\n2. **Sulfur Nutrition:** Apply 20 kg elemental Sulfur per acre for enhanced bulb pungency and storage shelf-life.\n3. **Thrips Control:** Thrips cause silvery leaf patches; spray Neem Oil (3 ml/L) or *Fipronil 5 SC* (1.5 ml/L).\n4. **Purple Blotch:** Spray *Mancozeb* (2.5g/L) with sticker.\n5. **Neck Fall:** Stop watering 15 days before harvest when 50% tops fall over naturally.`,
      suggestedQuestions: ['How to grow potatoes?', 'How to grow groundnuts?', 'Onion mandi rates']
    };
  }

  if (isChilli) {
    return {
      text: `🌶️ **Chilli (*Capsicum annuum*) Pest & Growth Protocol:**\n\n1. **Leaf Curl Virus Protection:** Leaf curl is spread by whiteflies and mites. Erect yellow and blue sticky traps (15 each/acre).\n2. **Bio-Shield:** Spray Neem Seed Kernel Extract (NSKE 5%) or Spinosad 45 SC (0.3 ml/L).\n3. **Flower Drop Prevention:** Spray *Planofix* (alpha-naphthyl acetic acid) @ 0.25 ml/L at flowering.\n4. **Anthracnose / Dieback:** Prune infected twigs and spray *Azoxystrobin + Difenoconazole* (1 ml/L).`,
      suggestedQuestions: ['How to grow potatoes?', 'How to grow groundnuts?', 'Kisan Support Fund']
    };
  }

  if (isMango) {
    return {
      text: `🥭 **Mango (*Mangifera indica*) Orchard Management:**\n\n1. **Mango Hopper & Powdery Mildew:** Spray *Imidacloprid 17.8 SL* (0.3 ml/L) + Wettable Sulfur (2g/L) during panicle emergence.\n2. **Fruit Fly Mitigation:** Hang Methyl Eugenol pheromone traps (6/acre) 45 days prior to harvest.\n3. **Anthracnose Control:** Pre-harvest spray of *Copper Oxychloride* (3g/L).\n4. **Post-Harvest:** Wash in 52°C hot water for 5 minutes to prevent fruit decay during transport.`,
      suggestedQuestions: ['How to grow potatoes?', 'How to grow groundnuts?', 'Surplus mango pulp unit']
    };
  }

  if (isSugarcane) {
    return {
      text: `🎋 **Sugarcane (*Saccharum officinarum*) Management:**\n\n1. **Planting Material:** Use 2-budded or single-eye bud sets treated with Carbendazim (1g/L).\n2. **Trench Spacing:** 4 to 5 feet wide row planting for sunlight penetration and mechanical harvesting.\n3. **Trash Mulching:** Conserve soil moisture and suppress weeds by spreading sugarcane dry trash 10 cm thick.\n4. **Early Shoot Borer:** Release *Trichogramma chilonis* egg parasitoids (20,000/acre).`,
      suggestedQuestions: ['How to grow potatoes?', 'Sugarcane recovery rates', 'Smallholder Farmer Support Fund']
    };
  }

  if (isCotton) {
    return {
      text: `☁️ **Cotton (*Gossypium hirsutum*) Cultivation:**\n\n1. **Spacing:** 90 cm x 60 cm for Bt Cotton hybrids on deep black soils.\n2. **Pink Bollworm Control:** Erect PBW pheromone traps (5/acre) at 45 days; spray *Profenophos 50 EC* (2 ml/L) if rosette flowers exceed 5%.\n3. **Square Drop Prevention:** Foliar spray of 2% DAP or NAA (Planofix 0.25 ml/L) at flower initiation.`,
      suggestedQuestions: ['How to grow groundnuts?', 'Cotton mandi prices', 'Farmer Support Fund']
    };
  }

  // K. SOIL TESTING, DRIP, KCC, SOLAR PUMP, JEEVAMRUTHA
  if (isSoilTest) {
    return {
      text: `🧪 **Scientific Soil Sampling Protocol for Soil Health Card:**\n\n1. **Collection Time:** After harvest before applying manure or fertilizers.\n2. **Sampling Method:** Remove top litter. Dig a 'V' shaped pit 15 cm (6 inches) deep. Cut a 1-inch slice from top to bottom.\n3. **Composite Mix:** Take 10–12 random samples across 1 acre. Mix thoroughly in a clean plastic bucket using the quartering method until 500 grams remain.\n4. **Drying:** Dry strictly in shade (never in direct sun) and pack in a clean cloth bag.\n5. **Parameters Tested:** pH, Electrical Conductivity (EC), Organic Carbon (OC), available Nitrogen, Phosphorus, Potassium, and micronutrients (Zinc, Boron, Iron).`,
      suggestedQuestions: ['Smallholder Farmer Support Fund', 'How to grow potatoes?', 'Organic vermicompost preparation']
    };
  }

  if (isKcc) {
    return {
      text: `💳 **Kisan Credit Card (KCC) Crop Loan Scheme:**\n\n1. **Credit Limit:** Up to ₹3,00,000 without collateral for short-term crop inputs.\n2. **Effective Interest Rate:** Nominal 7%, reduced to **4%** with Government 3% prompt repayment incentive!\n3. **Required Documents:** Land RTC / Pahani records, Aadhaar Card, Pan Card, and no-dues certificate from local banks.\n4. **ATM Enabled:** Comes with a RuPay KCC debit card for easy cash withdrawal at rural ATMs.`,
      suggestedQuestions: ['Smallholder Farmer Support Fund', 'PM-Kisan installment status', 'How to grow groundnuts?']
    };
  }

  if (isSolarPump) {
    return {
      text: `☀️ **PM-KUSUM Agricultural Solar Pump Scheme:**\n\n1. **Subsidy Support:** 60% direct subsidy (30% Central + 30% State), with 30% bank loan and only 10% farmer contribution.\n2. **Pump Capacities:** 3 HP, 5 HP, and 7.5 HP Solar DC/AC Submersible or Surface pumps.\n3. **Benefits:** Zero electricity bills and daytime irrigation without voltage fluctuations.\n4. **Application:** Apply via State Renewable Energy Development Agency (e.g. KREDL in Karnataka).`,
      suggestedQuestions: ['Micro drip irrigation starter kit', 'Farmer Support Fund', 'How to grow potatoes?']
    };
  }

  if (isOrganicManure) {
    return {
      text: `🌿 **Natural Farming & Jeevamrutha Preparation (Subhash Palekar Method):**\n\n- **Ingredients for 1 Acre (200 Litres):**\n  1. 10 kg fresh Desi Cow dung\n  2. 5–10 Litres Desi Cow urine\n  3. 2 kg Organic Jaggery (Gur)\n  4. 2 kg Pulse flour (Besan / Gram flour)\n  5. A handful of virgin living soil from beneath a banyan tree or field bund\n- **Preparation:** Mix in a 200L plastic drum, stir clockwise twice daily with a wooden stick, keep in shade covered with gunny bag for 48 hours.\n- **Application:** Apply with irrigation water or spray 10% filtered liquid. It multiplies soil microbes exponentially!`,
      suggestedQuestions: ['Smallholder Farmer Support Fund', 'How to cultivate groundnuts?', 'Potato late blight cure']
    };
  }

  // -------------------------------------------------------------
  // L. UNIVERSAL DYNAMIC AI FALLBACK (ChatGPT / DeepSeek Style Reasoning)
  // Route all unmatched questions (general knowledge, coding, science, daily life, math)
  // to askGeneralAI (with OpenAI API if configured, or comprehensive local AI reasoning engine)
  // -------------------------------------------------------------
  return await askGeneralAI({
    userText,
    language,
    cropContext,
    district,
    farmerName: extractedName,
    conversationHistory,
  });
}
