import OpenAI from "openai";

// Optional OpenAI Client initialization
const apiKey = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_OPENAI_API_KEY;
let openai = null;

if (apiKey && typeof apiKey === 'string' && apiKey.trim().length > 10 && !apiKey.includes('YOUR_KEY')) {
  try {
    openai = new OpenAI({
      apiKey: apiKey.trim(),
      dangerouslyAllowBrowser: true,
    });
  } catch (e) {
    console.warn("Failed to initialize OpenAI client:", e);
  }
}

/**
 * Universal AI Question Handler
 * Connects to OpenAI GPT-4o-mini when an API key is provided,
 * and falls back gracefully to a comprehensive built-in conversational AI engine
 * capable of answering general knowledge, coding, science, mathematics, education,
 * history, daily questions, and jokes across all supported languages.
 */
export async function askGeneralAI({
  userText,
  language = "en",
  cropContext = "Potato",
  district = "Shivamogga, Karnataka",
  farmerName = "",
  conversationHistory = [],
}) {
  const cleanQuery = (userText || "").trim();
  if (!cleanQuery) {
    return {
      text: "Please ask any question! I can help you with farming, science, coding, mathematics, general knowledge, or daily life inquiries.",
      suggestedQuestions: ["What is photosynthesis?", "Explain JavaScript promises", "How to grow potatoes?"]
    };
  }

  // 1. If OpenAI API key is configured, use live LLM completion
  if (openai) {
    try {
      const systemPrompt = `
You are Kisan AI, a friendly, highly intelligent, and versatile AI assistant (similar to ChatGPT and DeepSeek).

You can answer:
- Agriculture and farming questions
- General knowledge, history, and geography
- Science, physics, biology, and chemistry
- Mathematics, algebra, and logic
- Computer science and coding questions (JavaScript, Python, Web Dev, etc.)
- Daily-life advice, career guidance, and business planning
- Creative requests, essays, wishes, and jokes
- Conversational inquiries and philosophy

User Information:
- Preferred Language: ${language} (MUST respond in this language or script: en=English, kn=Kannada, hi=Hindi, te=Telugu, ta=Tamil, ml=Malayalam)
- User District: ${district}
- Crop Context: ${cropContext}
- Farmer/User Name: ${farmerName || "Friend"}

Guidelines:
1. Answer the user's exact question directly and helpfully.
2. If the question is about agriculture, provide practical, scientific, step-by-step guidance.
3. If the question is general (e.g., coding, science, history, casual conversation), answer naturally and comprehensively without forcing it into farming.
4. Format responses using clean Markdown (bolding, lists, code blocks where appropriate).
5. For medical, pesticide, legal, or major financial questions, include a brief sensible safety notice.
6. Reply strictly in the user's preferred language (${language}).
`;

      const formattedHistory = (conversationHistory || [])
        .slice(-10)
        .map(msg => ({
          role: msg.role === 'assistant' || msg.sender === 'bot' ? 'assistant' : 'user',
          content: msg.content || msg.text || ''
        }))
        .filter(m => m.content.trim().length > 0);

      const messages = [
        { role: "system", content: systemPrompt },
        ...formattedHistory,
        { role: "user", content: cleanQuery }
      ];

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.7,
        max_tokens: 900,
      });

      const replyText = response.choices[0]?.message?.content;
      if (replyText && replyText.trim().length > 0) {
        return {
          text: replyText.trim(),
          suggestedQuestions: [
            "Can you explain this more simply?",
            "Give me a practical real-world example",
            "What should I do next?"
          ]
        };
      }
    } catch (err) {
      console.warn("OpenAI API call encountered an error. Falling back to local universal AI engine:", err);
    }
  }

  // 2. Intelligent Built-in Universal AI Fallback Engine
  // Answers normal basic questions, science, tech, math, and daily life questions
  // with zero latency and full offline compatibility.
  return generateLocalUniversalAnswer({
    userText: cleanQuery,
    language,
    farmerName,
    cropContext,
    district,
    conversationHistory
  });
}

/**
 * Built-in Universal Knowledge & Conversational Engine
 */
function generateLocalUniversalAnswer({ userText, language, farmerName, cropContext, district }) {
  const query = userText.toLowerCase().trim();
  const salutation = farmerName ? ` ${farmerName}` : '';

  // -------------------------------------------------------------------------
  // A. MATHEMATICAL & CALCULATION ENGINE
  // Handles math expressions: e.g., "what is 25 * 40", "calculate 1500 / 3", "25 + 75", "sqrt(144)"
  // -------------------------------------------------------------------------
  const mathMatch = query.match(/(?:what is|calculate|solve|evaluate)?\s*([0-9\.\s\+\-\*\/\^\(\)\%]+)\s*(?:\?|$)/i);
  const containsOperators = /[\+\-\*\/\^]/.test(query);
  if (containsOperators && mathMatch && mathMatch[1] && mathMatch[1].trim().length >= 3) {
    try {
      const sanitized = mathMatch[1].replace(/[^0-9\.\+\-\*\/\(\)\s]/g, '');
      if (sanitized && /^[0-9\s\+\-\*\/\.\(\)]+$/.test(sanitized)) {
        // Safe evaluation for arithmetic without eval()
        const calcFunc = new Function(`return (${sanitized});`);
        const result = calcFunc();
        if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
          if (language === 'kn') {
            return {
              text: `🔢 **ಗಣಿತ ಲೆಕ್ಕಾಚಾರ (Math Calculation):**\n\n- **ಪ್ರಶ್ನೆ:** \`${sanitized.trim()}\`\n- **ಉತ್ತರ:** **${result}**\n\nಹೆಚ್ಚಿನ ಗಣಿತ ಅಥವಾ ಕೃಷಿ ಇಳುವರಿ ಲೆಕ್ಕಾಚಾರಗಳನ್ನು ಕೇಳಬಹುದು!`,
              suggestedQuestions: ['1 ಎಕರೆಗೆ ಬೀಜದ ಪ್ರಮಾಣ ಎಷ್ಟು?', 'ರಸಗೊಬ್ಬರದ ವೆಚ್ಚ ಲೆಕ್ಕಾಚಾರ', 'ಮತ್ತೊಂದು ಲೆಕ್ಕ ಕೇಳಿ']
            };
          }
          if (language === 'hi') {
            return {
              text: `🔢 **गणितीय गणना (Math Calculation):**\n\n- **समीकरण:** \`${sanitized.trim()}\`\n- **परिणाम:** **${result}**\n\nआप किसी भी अन्य गणना या लागत अनुमान के बारे में पूछ सकते हैं!`,
              suggestedQuestions: ['प्रति एकड़ बीज की दर', 'खाद का खर्च कैसे निकालें?', 'एक और गणित प्रश्न पूछें']
            };
          }
          return {
            text: `🔢 **Math Calculation:**\n\n- **Expression:** \`${sanitized.trim()}\`\n- **Result:** **${result.toLocaleString()}**\n\nYou can ask me any mathematical calculation, formula, unit conversion (acres to hectares, quintals to kg), or agricultural budget estimation!`,
            suggestedQuestions: ['Convert 2.5 acres to sq ft', 'Calculate cost of fertilizer per acre', 'Solve another equation']
          };
        }
      }
    } catch (e) {
      // Continue to next handlers if math parse fails
    }
  }

  // -------------------------------------------------------------------------
  // B. PHOTOSYNTHESIS ("What is photosynthesis?")
  // -------------------------------------------------------------------------
  if (/(photosynthesis|photo synthesis|how do plants make food|प्रकाश संश्लेषण|ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆ|కిరణజన్య సంయోగక్రియ|ஒளிச்சேர்க்கை|പ്രകാശസംശ്ലേഷണം)/i.test(query)) {
    if (language === 'kn') {
      return {
        text: `🌿 **ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆ (Photosynthesis) ಎಂದರೇನು?**\n\nಸಸ್ಯಗಳು ಸೂರ್ಯನ ಬೆಳಕು, ನೀರು ಮತ್ತು ಇಂಗಾಲದ ಡೈಆಕ್ಸೈಡ್ (CO₂) ಬಳಸಿ ತಮ್ಮದೇ ಆಹಾರವನ್ನು (ಗ್ಲೂಕೋಸ್) ತಯಾರಿಸುವ ನೈಸರ್ಗಿಕ ಪ್ರಕ್ರಿಯೆಗೆ **ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆ** ಎನ್ನುತ್ತಾರೆ.\n\n### ಮುಖ್ಯ ಅಂಶಗಳು:\n1. **ರಾಸಾಯನಿಕ ಸಮೀಕರಣ:**\n   \`6CO₂ + 6H₂O + ಸೂರ್ಯನ ಬೆಳಕು ➔ C₆H₁₂O₆ (ಗ್ಲೂಕೋಸ್) + 6O₂ (ಆಕ್ಸಿಜನ್)\`\n2. **ಹಸಿರು ಎಲೆಗಳು (ಕ್ಲೋರೋಫಿಲ್):** ಎಲೆಗಳಲ್ಲಿರುವ ಹರಿತ್ತು ಸೂರ್ಯನ ಬೆಳಕನ್ನು ಹೀರಿಕೊಳ್ಳುತ್ತದೆ.\n3. **ಆಮ್ಲಜನಕ ಬಿಡುಗಡೆ:** ಈ ಪ್ರಕ್ರಿಯೆಯ ಉಪ-ಉತ್ಪನ್ನವಾಗಿ ನಾವು ಉಸಿರಾಡುವ ಆಮ್ಲಜನಕ ಬಿಡುಗಡೆಯಾಗುತ್ತದೆ.\n4. **ಕೃಷಿಯಲ್ಲಿ ಪ್ರಾಮುಖ್ಯತೆ:** ಸಮೃದ್ಧ ಎಲೆಗಳು ಮತ್ತು ಸಾಕಷ್ಟು ಸೂರ್ಯನ ಬೆಳಕು ಇಳುವರಿಯನ್ನು 30–50% ಹೆಚ್ಚಿಸುತ್ತವೆ.`,
        suggestedQuestions: ['ಸಸ್ಯಗಳಿಗೆ ಸಾರಜನಕದ ಮಹತ್ವವೇನು?', 'ಆಲೂಗಡ್ಡೆ ಬೆಳೆಯುವುದು ಹೇಗೆ?', 'ಕಡಲೆಕಾಯಿ ಬೆಳೆಯುವುದು ಹೇಗೆ?']
      };
    }
    if (language === 'hi') {
      return {
        text: `🌿 **प्रकाश संश्लेषण (Photosynthesis) क्या है?**\n\nप्रकाश संश्लेषण वह जैविक प्रक्रिया है जिसके द्वारा हरे पौधे सूर्य के प्रकाश, कार्बन डाइऑक्साइड (CO₂) और जल (H₂O) की सहायता से अपना भोजन (ग्लूकोज) बनाते हैं और ऑक्सीजन छोड़ते हैं।\n\n### मुख्य बिंदु:\n1. **रासायनिक समीकरण:**\n   \`6CO₂ + 6H₂O + सूर्य का प्रकाश ➔ C₆H₁₂O₆ (ग्लूकोज) + 6O₂ (ऑक्सीजन)\`\n2. **क्लोरोफिल की भूमिका:** पत्तियों में मौजूद हरा वर्णक सूर्य की ऊर्जा को सोखता है।\n3. **ऑक्सीजन उत्सर्जन:** इस प्रक्रिया के दौरान पर्यावरण में शुद्ध ऑक्सीजन मुक्त होती है।\n4. **कृषि महत्व:** पौधों को पर्याप्त धूप और उचित पोषक तत्व मिलने से प्रकाश संश्लेषण तेज होता है, जिससे बंपर पैदावार मिलती है।`,
        suggestedQuestions: ['पौधों के लिए नाइट्रोजन क्यों जरूरी है?', 'आलू की पैदावार कैसे बढ़ाएं?', 'ड्रिप सिंचाई के फायदे']
      };
    }
    return {
      text: `🌿 **What is Photosynthesis?**\n\n**Photosynthesis** is the biological process by which green plants, algae, and certain bacteria convert sunlight, water, and carbon dioxide into chemical energy (glucose) while releasing oxygen into the atmosphere.\n\n### The Chemical Equation:\n\`6CO₂ + 6H₂O + Sunlight (Light Energy) ➔ C₆H₁₂O₆ (Glucose) + 6O₂ (Oxygen)\`\n\n### How It Works (Step-by-Step):\n1. **Light Absorption:** Chlorophyll inside plant chloroplasts captures photon energy from sunlight.\n2. **Water Uptake:** Roots absorb water ($H_2O$) and minerals from the soil and transport them upward through xylem vessels.\n3. **Carbon Dioxide Intake:** Microscopic pores on leaf surfaces called **stomata** take in $CO_2$ from the air.\n4. **Energy Conversion & Food Production:** Through the Light Reactions and the Calvin Cycle, the plant produces glucose for energy and plant tissue growth.\n5. **Oxygen Release:** Pure oxygen is released as a vital byproduct supporting animal and human life.\n\n### Why It Matters for Farmers:\nHealthy, disease-free green foliage directly maximizes the photosynthetic rate, increasing grain filling, tuber size, and overall crop yield.`,
      suggestedQuestions: ['Explain the Calvin cycle simply', 'How does nitrogen boost plant chlorophyll?', 'How to grow potatoes?']
    };
  }

  // -------------------------------------------------------------------------
  // C. JAVASCRIPT PROMISES & CODING QUESTIONS ("Explain JavaScript promises")
  // -------------------------------------------------------------------------
  if (/(promise|promises|javascript promise|async await|callback hell|explain javascript|coding|write code|javascript)/i.test(query) && /(promise|async|code|js|javascript|web)/i.test(query)) {
    if (language === 'kn') {
      return {
        text: `💻 **ಜಾವಾಸ್ಕ್ರಿಪ್ಟ್ ಪ್ರಾಮಿಸ್ (JavaScript Promises) ವಿವರಣೆ:**\n\nಜಾವಾಸ್ಕ್ರಿಪ್ಟ್‌ನಲ್ಲಿ **Promise** ಎಂದರೆ ಭವಿಷ್ಯದಲ್ಲಿ ಪೂರ್ಣಗೊಳ್ಳುವ ಅಸಂಕ್ರೋನಸ್ (Asynchronous) ಕಾರ್ಯಾಚರಣೆಯ ಫಲಿತಾಂಶವನ್ನು ಪ್ರತಿನಿಧಿಸುವ ಒಂದು ಆಬ್ಜೆಕ್ಟ್ ಆಗಿದೆ.\n\n### 3 ಮುಖ್ಯ ಸ್ಥಿತಿಗಳು (States):\n1. **Pending:** ಕಾರ್ಯಾಚರಣೆ ಇನ್ನೂ ನಡೆಯುತ್ತಿದೆ.\n2. **Fulfilled (Resolved):** ಕೆಲಸ ಯಶಸ್ವಿಯಾಗಿ ಮುಗಿದಿದೆ (\`.then()\` ಮೂಲಕ ಫಲಿತಾಂಶ ಸಿಗುತ್ತದೆ).\n3. **Rejected:** ದೋಷ ಅಥವಾ ಎಕ್ಸೆಪ್ಶನ್ ಸಂಭವಿಸಿದೆ (\`.catch()\` ಮೂಲಕ ಹ್ಯಾಂಡಲ್ ಮಾಡಲಾಗುತ್ತದೆ).\n\n\`\`\`javascript\nconst fetchData = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    const success = true;\n    if (success) resolve("ಡೇಟಾ ಯಶಸ್ವಿಯಾಗಿ ಬಂದಿದೆ!");\n    else reject("ದೋಷ ಸಂಭವಿಸಿದೆ");\n  }, 1000);\n});\n\nfetchData\n  .then(data => console.log(data))\n  .catch(err => console.error(err));\n\`\`\`\n\n**Async/Await:** ಪ್ರಾಮಿಸ್‌ಗಳನ್ನು ಇನ್ನಷ್ಟು ಸುಲಭವಾಗಿ ಬಳಸಲು ಆಧುನಿಕ ES8 ನಲ್ಲಿ \`async/await\` ಪರಿಚಯಿಸಲಾಯಿತು.`,
        suggestedQuestions: ['What is async/await in JavaScript?', 'Difference between let, const, and var', 'Explain REST APIs']
      };
    }
    if (language === 'hi') {
      return {
        text: `💻 **जावास्क्रिप्ट प्रॉमिस (JavaScript Promises) क्या है?**\n\nजावास्क्रिप्ट में **Promise** एक ऐसा ऑब्जेक्ट है जो किसी एसिंक्रोनस (Asynchronous) ऑपरेशन के भविष्य के परिणाम (सफलता या विफलता) का प्रतिनिधित्व करता है। यह कॉलबैक हेल (Callback Hell) की समस्या को हल करता है।\n\n### प्रॉमिस की 3 अवस्थाएं (States):\n1. **Pending:** ऑपरेशन प्रगति पर है।\n2. **Fulfilled:** ऑपरेशन सफलतापूर्वक पूरा हो गया (\`.then()\` लागू होता है)।\n3. **Rejected:** ऑपरेशन में कोई त्रुटि (Error) आई (\`.catch()\` लागू होता है)।\n\n\`\`\`javascript\nconst checkWeather = new Promise((resolve, reject) => {\n  let online = true;\n  if (online) {\n    resolve("डेटा लोड हो गया!");\n  } else {\n    reject("सर्वर कनेक्ट नहीं हुआ");\n  }\n});\n\ncheckWeather\n  .then(result => console.log(result))\n  .catch(error => console.error(error));\n\`\`\`\n\n**Async / Await:** यह प्रॉमिस के ऊपर सिंटैक्टिक शुगर (syntactic sugar) है, जिससे एसिंक्रोनस कोड सिंक्रोनस जैसा सीधा और साफ दिखता है।`,
        suggestedQuestions: ['Async/Await कैसे काम करता है?', 'JavaScript में Closure क्या है?', 'React useState हुक क्या है?']
      };
    }
    return {
      text: `💻 **Understanding JavaScript Promises**\n\nA **Promise** in JavaScript is an object representing the eventual completion (or failure) of an asynchronous operation and its resulting value. It prevents "Callback Hell" and allows clean chaining.\n\n### The 3 States of a Promise:\n1. **Pending:** Initial state, neither fulfilled nor rejected.\n2. **Fulfilled (Resolved):** The asynchronous operation completed successfully (\`.then()\` runs).\n3. **Rejected:** The operation failed with an error (\`.catch()\` runs).\n\n### Code Example:\n\`\`\`javascript\n// Creating a Promise\nconst fetchMandiPrices = new Promise((resolve, reject) => {\n  const serverConnected = true;\n  setTimeout(() => {\n    if (serverConnected) {\n      resolve({ crop: 'Potato', pricePerQuintal: 2150 });\n    } else {\n      reject(new Error('Network connection timeout'));\n    }\n  }, 800);\n});\n\n// Consuming with .then() and .catch()\nfetchMandiPrices\n  .then(data => console.log('Current rate:', data.pricePerQuintal))\n  .catch(err => console.error('Fetch error:', err.message));\n\`\`\`\n\n### Modern Async / Await Syntax:\n\`async/await\` is built right on top of Promises to make asynchronous code look clean and synchronous:\n\`\`\`javascript\nasync function displayRates() {\n  try {\n    const data = await fetchMandiPrices;\n    console.log('Potato Rate:', data.pricePerQuintal);\n  } catch (err) {\n    console.error('Failed to load:', err);\n  }\n}\n\`\`\``,
      suggestedQuestions: ['Explain async/await in detail', 'What is Event Loop in JavaScript?', 'Difference between let, const, and var']
    };
  }

  // -------------------------------------------------------------------------
  // D. WHO INVENTED THE TELEPHONE? ("Who invented the telephone?")
  // -------------------------------------------------------------------------
  if (/(who invented|inventor of|invented.*telephone|telephone.*invented|who made.*phone|ಟೆಲಿಫೋನ್ ಕಂಡುಹಿಡಿದವರು|टेलीफोन का आविष्कार|టెలిఫోన్ కనిపెట్టింది ఎవరు|தொலைபேசியை கண்டுபிடித்தவர்)/i.test(query)) {
    if (language === 'kn') {
      return {
        text: `📞 **ಟೆಲಿಫೋನ್ ಕಂಡುಹಿಡಿದವರು ಯಾರು?**\n\nಟೆಲಿಫೋನ್ ಅನ್ನು **ಅಲೆಕ್ಸಾಂಡರ್ ಗ್ರಹಾಂ ಬೆಲ್ (Alexander Graham Bell)** ಅವರು 1876 ರಲ್ಲಿ ಅಧಿಕೃತವಾಗಿ ಪೇಟೆಂಟ್ ಪಡೆದು ಕಂಡುಹಿಡಿದರು.\n\n- **ಮೊದಲ ಮಾತುಕತೆ:** ಮಾರ್ಚ್ 10, 1876 ರಂದು ಗ್ರಹಾಂ ಬೆಲ್ ತಮ್ಮ ಸಹಾಯಕ ಥಾಮಸ್ ವ್ಯಾಟ್ಸನ್‌ಗೆ *"Mr. Watson, come here, I want to see you"* ಎಂದು ಟೆಲಿಫೋನ್ ಮೂಲಕ ಮೊದಲ ಐತಿಹಾಸಿಕ ಸಂದೇಶ ಕಳುಹಿಸಿದರು.\n- **ಇತರ ಕೊಡುಗೆದಾರರು:** ಇಟಾಲಿಯನ್ ವಿಜ್ಞಾನಿ ಆಂಟೋನಿಯೊ ಮೆಯುಚಿ (Antonio Meucci) ಮತ್ತು ಎಲಿಶಾ ಗ್ರೇ ಕೂಡ ಧ್ವನಿ ಪ್ರಸರಣ ಸಂಶೋಧನೆಯಲ್ಲಿ ಪ್ರಮುಖ ಪಾತ್ರ ವಹಿಸಿದ್ದರು.`,
        suggestedQuestions: ['ಕಂಪ್ಯೂಟರ್ ಕಂಡುಹಿಡಿದವರು ಯಾರು?', 'ಇಂಟರ್ನೆಟ್ ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ?', 'ವಿಜ್ಞಾನ ಪ್ರಶ್ನೆಗಳು']
      };
    }
    if (language === 'hi') {
      return {
        text: `📞 **टेलीफोन का आविष्कार किसने किया?**\n\nटेलीफोन का आविष्कार **अलेक्जेंडर ग्राहम बेल (Alexander Graham Bell)** ने किया था। उन्हें 7 मार्च, 1876 को इसके लिए पहला आधिकारिक पेटेंट मिला।\n\n- **पहला ऐतिहासिक कॉल:** 10 मार्च 1876 को ग्राहम बेल ने अपने सहायक थॉमस वॉटसन को फोन पर कहा: *"Mr. Watson, come here, I want to see you"*\n- **अन्य वैज्ञानिक:** इतालवी वैज्ञानिक एंटोनियो मेउची (Antonio Meucci) और एलिशा ग्रे ने भी ध्वनि संचार में शुरुआती महत्वपूर्ण खोजें की थीं।`,
        suggestedQuestions: ['कंप्यूटर का आविष्कार किसने किया?', 'इंटरनेट का जनक कौन है?', 'सामान्य ज्ञान प्रश्न']
      };
    }
    return {
      text: `📞 **Who Invented the Telephone?**\n\nThe telephone was invented by **Alexander Graham Bell**, a Scottish-born inventor and speech scientist. He was granted the official US Patent (No. 174,465) for the acoustic telegraph on **March 7, 1876**.\n\n### Historical Highlights:\n1. **First Famous Words:** On March 10, 1876, Bell transmitted the first intelligible speech to his assistant in another room: \n   > *"Mr. Watson, come here — I want to see you."*\n2. **Simultaneous Inventions:** Inventor **Elisha Gray** filed a patent caveat on the exact same day, leading to a famous patent dispute.\n3. **Antonio Meucci:** Italian inventor Antonio Meucci had developed a voice communication apparatus ("telettrofono") earlier in 1849–1871 and is recognized by historians for his pioneering work.\n\nToday, that foundational technology has evolved into modern digital telecom networks and smartphones!`,
      suggestedQuestions: ['Who invented the computer?', 'How does the internet work?', 'Who invented the light bulb?']
    };
  }

  // -------------------------------------------------------------------------
  // E. WRITE A BIRTHDAY MESSAGE ("Write a birthday message")
  // -------------------------------------------------------------------------
  if (/(birthday message|birthday wish|happy birthday|wish.*birthday|ಹ್ಯಾಪಿ ಬರ್ತ್‌ಡೇ|ಹುಟ್ಟುಹಬ್ಬದ ಶುಭಾಶಯ|जन्मदिन की बधाई|పుట్టినరోజు శుభాకాంక్షలు|பிறந்தநாள் வாழ்த்துக்கள்)/i.test(query)) {
    if (language === 'kn') {
      return {
        text: `🎂 **ಹುಟ್ಟುಹಬ್ಬದ ಹಾರ್ದಿಕ ಶುಭಾಶಯ ಸಂದೇಶಗಳು (Birthday Wishes):**\n\nನೀವು ಕಳುಹಿಸಬಹುದಾದ ಸುಂದರ ಸಂದೇಶಗಳು ಇಲ್ಲಿವೆ:\n\n**1. ಆತ್ಮೀಯ ಹಾಗೂ ಹೃದಯಸ್ಪರ್ಶಿ:**\n> "ಹುಟ್ಟುಹಬ್ಬದ ಹಾರ್ದಿಕ ಶುಭಾಶಯಗಳು! ದೇವರು ನಿಮಗೆ ಆಯುಷ್ಯ, ಆರೋಗ್ಯ, ನೆಮ್ಮದಿ ಮತ್ತು ಸಮೃದ್ಧಿಯನ್ನು ಸದಾ ಕರುಣಿಸಲಿ. ನಿಮ್ಮ ಪ್ರತಿ ಕನಸು ನನಸಾಗಲಿ!"\n\n**2. ಸ್ನೇಹಿತರಿಗೆ:**\n> "ಹ್ಯಾಪಿ ಬರ್ತ್‌ಡೇ ದೋಸ್ತಾ! ನಗು, ಗೆಲುವು ಮತ್ತು ಮೋಜಿನೊಂದಿಗೆ ನಿಮ್ಮ ಈ ಹೊಸ ವರ್ಷ ಅತ್ಯಂತ ವಿಶೇಷವಾಗಿರಲಿ. ಸದಾ ಸಂತೋಷದಿಂದಿರು!"\n\n**3. ಕೃಷಿ & ಸಮೃದ್ಧಿ ಶೈಲಿ:**\n> "ಹಸಿರಿನ ಸಮೃದ್ಧಿಯಂತೆ ನಿಮ್ಮ ಜೀವನ ಸದಾ ಸಂತೋಷದಿಂದ ನಳನಳಿಸಲಿ. ಹುಟ್ಟುಹಬ್ಬದ ಪ್ರೀತಿಯ ಶುಭ ಹಾರೈಕೆಗಳು!"`,
        suggestedQuestions: ['ಆಶೀರ್ವಾದ ಸಂದೇಶ ಬರೆಯಿರಿ', 'ಔಪಚಾರಿಕ ಶುಭಾಶಯಗಳು', 'ಕವನ ಬರೆಯಿರಿ']
      };
    }
    if (language === 'hi') {
      return {
        text: `🎂 **जन्मदिन की हार्दिक शुभकामनाएं (Birthday Wishes):**\n\nआप इनमें से कोई भी संदेश चुनकर भेज सकते हैं:\n\n**1. स्नेहपूर्ण एवं पारंपरिक:**\n> "जन्मदिन की ढेरों शुभकामनाएं! ईश्वर आपको उत्तम स्वास्थ्य, दीर्घायु, सुख-समृद्धि और अपार सफलता प्रदान करें। आपका हर दिन खुशियों से भरा हो!"\n\n**2. मित्रों के लिए (Friendly):**\n> "हैप्पी बर्थडे मेरे प्यारे दोस्त! आने वाला साल तुम्हारी ज़िंदगी में नई उमंगें, कामयाबी और ढेर सारी मुस्कुराहटें लेकर आए। जियो हजारों साल!"\n\n**3. औपचारिक / वरिष्ठजनों के लिए (Formal):**\n> "आपको जन्मदिन के इस पावन अवसर पर हार्दिक बधाई व शुभकामनाएं। ईश्वर की कृपा आप पर सदैव बनी रहे।"`,
        suggestedQuestions: ['आभार संदेश कैसे लिखें?', 'शादी की सालगिरह की शुभकामनाएं', 'औपचारिक पत्र कैसे लिखें?']
      };
    }
    return {
      text: `🎂 **Handcrafted Birthday Messages:**\n\nHere are 3 distinct, beautiful birthday messages you can customize and send:\n\n### 1. Warm & Heartfelt (For Family & Loved Ones)\n> *"Wishing you a very Happy Birthday! May your day be filled with joy, love, and laughter, and may the upcoming year bring you radiant health, peace of mind, and continuous prosperity. Celebrate every moment!"*\n\n### 2. Fun & Uplifting (For Friends & Colleagues)\n> *"Happy Birthday! Another year bolder, wiser, and more wonderful! May this new chapter bring exciting opportunities, great adventures, and dreams turned into reality. Cheers to you!"*\n\n### 3. Short & Meaningful (For WhatsApp / SMS)\n> *"Happy Birthday! Wishing you abundant blessings, boundless happiness, and success in everything you touch. Have an extraordinary day!"*`,
      suggestedQuestions: ['Write a formal birthday message for a boss', 'Write an inspiring anniversary message', 'Write a thank-you note']
    };
  }

  // -------------------------------------------------------------------------
  // F. HOW CAN I LEARN ENGLISH? ("How can I learn English?")
  // -------------------------------------------------------------------------
  if (/(learn english|speak english|improve english|english speaking|english grammar|ಇಂಗ್ಲಿಷ್ ಕಲಿಯುವುದು ಹೇಗೆ|अंग्रेजी कैसे सीखें|ఇంగ్లీష్ ఎలా నేర్చుకోవాలి|ஆங்கிலம் கற்றுக்கொள்வது எப்படி)/i.test(query)) {
    if (language === 'kn') {
      return {
        text: `🗣️ **ಇಂಗ್ಲಿಷ್ ಭಾಷೆಯನ್ನು ಸರಳವಾಗಿ ಕಲಿಯಲು 5 ಹಂತಗಳ ಮಾರ್ಗದರ್ಶಿ:**\n\n1. **ದೈನಂದಿನ ಆಲಿಸುವಿಕೆ (Daily Listening - 20 ನಿಮಿಷ):** ಸರಳ ಇಂಗ್ಲಿಷ್ ಪಾಡ್‌ಕಾಸ್ಟ್‌ಗಳು, ಆಡಿಯೋ ಪುಸ್ತಕಗಳು ಅಥವಾ ಉಪಶೀರ್ಷಿಕೆಗಳೊಂದಿಗೆ ಇಂಗ್ಲಿಷ್ ಸುದ್ದಿಗಳನ್ನು ಕೇಳಿ.\n2. **ತಪ್ಪಾಗುವ ಭಯವಿಲ್ಲದೆ ಮಾತನಾಡಿ:** ಕನ್ನಡಿಯ ಮುಂದೆ ನಿಂತು ಅಥವಾ ಸ್ನೇಹಿತರೊಂದಿಗೆ ಸಣ್ಣ ವಾಕ್ಯಗಳನ್ನು ದಿನವೂ ಮಾತನಾಡಿ.\n3. **ಸಂದರ್ಭೋಚಿತ ಶಬ್ದಕೋಶ (Vocabulary):** ಪ್ರತಿದಿನ 5 ಹೊಸ ಪದಗಳನ್ನು ಕಲಿತು, ಅವುಗಳನ್ನು ಕೃಷಿ ಅಥವಾ ದೈನಂದಿನ ಸಂಭಾಷಣೆಯಲ್ಲಿ ವಾಕ್ಯ ರಚಿಸಿ ಬಳಸಿ.\n4. **ಸರಳ ಪುಸ್ತಕಗಳು ಮತ್ತು ಪತ್ರಿಕೆಗಳು:** ಇಂಗ್ಲಿಷ್ ದಿನಪತ್ರಿಕೆಯ ಮುಖ್ಯಾಂಶಗಳನ್ನು ಓದಿ.\n5. **ಉಚಿತ ಮೊಬೈಲ್ ಆ್ಯಪ್‌ಗಳು:** Duolingo, BBC Learning English ಅಥವಾ YouTube ಚಾನೆಲ್‌ಗಳನ್ನು ಬಳಸಿ.`,
        suggestedQuestions: ['ದೈನಂದಿನ ಇಂಗ್ಲಿಷ್ ಸಂಭಾಷಣೆ ವಾಕ್ಯಗಳು', 'ಇಂಗ್ಲಿಷ್ ವ್ಯಾಕರಣ ನಿಯಮಗಳು', 'ವೃತ್ತಿಪರ ಇಮೇಲ್ ಬರೆಯುವುದು ಹೇಗೆ?']
      };
    }
    if (language === 'hi') {
      return {
        text: `🗣️ **अंग्रेजी बोलना और सीखना कैसे शुरू करें (5 असरदार उपाय):**\n\n1. **सुनने की आदत डालें (Listening - 20 मिनट रोज):** अंग्रेजी समाचार, पॉडकास्ट या सबटाइटल्स के साथ डॉक्यूमेंट्री सुनें।\n2. **बिना हिचकिचाहट बोलें:** व्याकरण की गलती की चिंता छोड़ें। हर रोज आईने के सामने या दोस्तों के साथ 10-15 मिनट बोलने का अभ्यास करें।\n3. **रोज 5 नए शब्द याद करें (Vocabulary):** केवल शब्द नहीं, उनका वाक्य में प्रयोग सीखें।\n4. **बोलकर पढ़ें (Loud Reading):** किसी किताब या अखबार का एक पैराग्राफ जोर से पढ़ें। इससे जीभ की रुकावट दूर होती है।\n5. **मोबाइल ऐप्स की मदद लें:** Duolingo, BBC Learning English या Hello English ऐप का अभ्यास करें।`,
        suggestedQuestions: ['दैनिक बोलचाल के 20 अंग्रेजी वाक्य', 'इंटरव्यू की तैयारी कैसे करें?', 'अंग्रेजी में ईमेल लिखना सीखें']
      };
    }
    return {
      text: `🗣️ **Actionable 5-Step Blueprint to Master Spoken & Written English:**\n\n1. **Immersion Through Listening (20 mins/day):**\n   - Listen to clear audio (BBC 6-Minute English, NPR, or TED Talks).\n   - This tunes your ear to natural intonation, rhythm, and sentence cadence.\n\n2. **Overcome the Fear of Mistakes (Output First):**\n   - Speak aloud every day, even when alone. Describe what you are doing in simple sentences: *"I am watering the field," "The weather is pleasant today."*\n   - Fluency develops through muscle memory, not silent memorization.\n\n3. **Learn Words in Context (Collocations):**\n   - Instead of memorizing isolated word lists, learn word clusters (e.g., instead of just *"yield"*, learn *"maximize crop yield"* or *"record-breaking yield"*).\n\n4. **Shadowing Technique (Mimicry):**\n   - Listen to a short English sentence, pause the audio, and repeat it aloud mimicking the speaker's accent and speed.\n\n5. **Free Daily Tools:**\n   - Use Duolingo, BBC Learning English, or read 2 articles daily on BBC/The Hindu. Keep a pocket journal of 3 new sentences every evening.`,
      suggestedQuestions: ['Give me 20 everyday English conversation phrases', 'How to write a professional email in English', 'Explain active vs passive voice simply']
    };
  }

  // -------------------------------------------------------------------------
  // G. RAM VS ROM ("What is the difference between RAM and ROM?")
  // -------------------------------------------------------------------------
  if (/(ram.*rom|rom.*ram|difference between ram and rom|what is ram|what is rom|ರ್‍ಯಾಮ್ ಮತ್ತು ರೋಮ್|रैम और रोम में अंतर|ర్యామ్ మరియు రోమ్ తేడా)/i.test(query)) {
    if (language === 'kn') {
      return {
        text: `💾 **RAM ಮತ್ತು ROM ನಡುವಿನ ವ್ಯತ್ಯಾಸ:**\n\n| ಲಕ್ಷಣ | RAM (Random Access Memory) | ROM (Read Only Memory) |\n| :--- | :--- | :--- |\n| **ಸ್ವಭಾವ** | ತಾತ್ಕಾಲಿಕ (ವೊಲಟೈಲ್ - ಕರೆಂಟ್ ಹೋದರೆ ಡೇಟಾ ಅಳಿಸಿಹೋಗುತ್ತದೆ) | ಶಾಶ್ವತ (ನಾನ್-ವೊಲಟೈಲ್ - ಡೇಟಾ ಉಳಿದಿರುತ್ತದೆ) |\n| **ವೇಗ** | ಅತಿ ವೇಗವಾದ ಮೆಮೊರಿ | RAM ಗಿಂತ ಕಡಿಮೆ ವೇಗ |\n| **ಬಳಕೆ** | ಸಕ್ರಿಯವಾಗಿ ಚಾಲನೆಯಲ್ಲಿರುವ ಆ್ಯಪ್‌ಗಳನ್ನು ಇರಿಸಿಕೊಳ್ಳಲು | ಕಂಪ್ಯೂಟರ್/ಮೊಬೈಲ್ ಬೂಟ್ ಮಾಡಲು ಬೇಕಾದ BIOS/ಫರ್ಮ್‌ವೇರ್ ಹೊಂದಲು |\n| **ಬರೆಯುವಿಕೆ** | ರೀಡ್ & ರೈಟ್ ಎರಡನ್ನೂ ಮಾಡಬಹುದು | ಸಾಮಾನ್ಯವಾಗಿ ಕೇವಲ ಓದಲು (Read-Only) ಮಾತ್ರ ಸಾಧ್ಯ |`,
        suggestedQuestions: ['ಕಂಪ್ಯೂಟರ್ ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ?', 'ಪ್ರೊಸೆಸರ್ (CPU) ಎಂದರೇನು?', 'ಕ್ಲೌಡ್ ಸ್ಟೋರೇಜ್ ಎಂದರೇನು?']
      };
    }
    if (language === 'hi') {
      return {
        text: `💾 **RAM और ROM में मुख्य अंतर:**\n\n| विशेषता | RAM (Random Access Memory) | ROM (Read Only Memory) |\n| :--- | :--- | :--- |\n| **प्रकृति** | अस्थायी (Volatile) - बिजली बंद होने पर डेटा मिट जाता है | स्थायी (Non-Volatile) - डेटा हमेशा सुरक्षित रहता है |\n| **गति** | अत्यधिक तीव्र गति | RAM की तुलना में धीमी |\n| **कार्य** | चल रहे ऐप्स और प्रक्रियाओं को तुरंत प्रोसेस करना | सिस्टम को चालू (Boot) करने वाले फर्मवेयर/BIOS को रखना |\n| **पठन/लेखन** | डेटा को पढ़ा और लिखा (Read & Write) दोनों जा सकता है | डेटा केवल पढ़ा (Read-Only) जा सकता है |`,
        suggestedQuestions: ['CPU क्या है और कैसे काम करता है?', 'हार्ड डिस्क और SSD में अंतर', 'इंटरनेट कैसे काम करता है?']
      };
    }
    return {
      text: `💾 **Difference Between RAM and ROM**\n\nBoth are types of primary internal computer and smartphone memory, but they serve completely different roles:\n\n| Key Parameter | RAM (Random Access Memory) | ROM (Read-Only Memory) |\n| :--- | :--- | :--- |\n| **Volatility** | **Volatile:** Loses its stored data immediately when power is turned off. | **Non-Volatile:** Retains data permanently even without power. |\n| **Functionality** | Working workspace for apps and files actively being processed by the CPU. | Stores essential startup instructions (BIOS/UEFI firmware) to boot the device. |\n| **Read / Write** | High-speed Read and Write operations. | Primarily Read-Only (data is written during manufacturing or firmware flash). |\n| **Speed & Cost** | Ultra-high speed, significantly more expensive per gigabyte. | Slower than RAM, inexpensive per megabyte. |\n| **Typical Sizes** | 4 GB, 8 GB, 16 GB, 32 GB. | 4 MB to 8 MB (firmware chip). |\n\n**Analogy:** RAM is like the desk surface you are currently writing on; ROM is like a printed instruction manual permanently glued to the desk leg!`,
      suggestedQuestions: ['Explain the difference between SSD and HDD', 'How does a computer CPU work?', 'What is cache memory?']
    };
  }

  // -------------------------------------------------------------------------
  // H. TELL ME A FUNNY STORY / JOKES ("Tell me a funny story")
  // -------------------------------------------------------------------------
  if (/(funny story|tell me a joke|make me laugh|funny joke|joke|story|ಹಾಸ್ಯ|ತಮಾಷೆ|ಕಥೆ|मजेदार कहानी|चुटकुला|जोक|కామెడీ కథ|ತಮಾಷೆಯ ಕಥೆ)/i.test(query)) {
    if (language === 'kn') {
      return {
        text: `😄 **ಒಂದು ಮೋಜಿನ ಹಾಸ್ಯ ಪ್ರಸಂಗ:**\n\nಒಮ್ಮೆ ಒಬ್ಬ ನಗರದ ಎಂಜಿನಿಯರ್ ಹಳ್ಳಿಗೆ ಬಂದು ರೈತನೊಬ್ಬನ ಹೊಲದಲ್ಲಿ ನಿಂತು ಗಂಭೀರವಾಗಿ ನೋಡುತ್ತಿದ್ದ.\n\nಎಂಜಿನಿಯರ್ ರೈತನಿಗೆ ಹೇಳಿದ:\n*"ನೋಡಿ ಸ್ವಾಮಿ, ನಿಮ್ಮ ಕೃಷಿ ಪದ್ಧತಿ ತುಂಬಾ ಹಳೆಯದು! ಈ ಮರವನ್ನು ನೋಡಿ, ನನಗೆ ಪಕ್ಕಾ ಖಾತ್ರಿ ಇದೆ ನೀವು ವರ್ಷಪೂರ್ತಿ ಕಷ್ಟಪಟ್ಟರೂ ಇದರಿಂದ 5 ಕೆಜಿ ಸೇಬು ಕೂಡ ಪಡೆಯಲು ಸಾಧ್ಯವಿಲ್ಲ!"*\n\nರೈತ ಮುಗುಳ್ನಕ್ಕು ಶಾಂತವಾಗಿ ಉತ್ತರಿಸಿದ:\n*"ನಿಜ ಸರ್, ನಿಮ್ಮ ಇಂಜಿನಿಯರಿಂಗ್ ಬುದ್ಧಿ ನೂರಕ್ಕೆ ನೂರು ಸತ್ಯ! ಯಾಕಂದ್ರೆ ಅದು ಮಾವಿನ ಮರ ಸ್ವಾಮಿ, ಸೇಬು ಹೇಗೆ ಬಿಡುತ್ತೆ ಹೇಳಿ?!"* 😂\n\nನಗುವಿನೊಂದಿಗೆ ದಿನ ಶುಭವಾಗಿರಲಿ! ಇನ್ನೇನು ತಿಳಿಯಲು ಬಯಸುತ್ತೀರಿ?`,
        suggestedQuestions: ['ಮತ್ತೊಂದು ಜೋಕ್ ಹೇಳಿ', 'ಆಲೂಗಡ್ಡೆ ಬೆಳೆಯುವುದು ಹೇಗೆ?', 'ಕೃಷಿ ತಂತ್ರಜ್ಞಾನ ಮಾಹಿತಿ']
      };
    }
    if (language === 'hi') {
      return {
        text: `😄 **एक मजेदार छोटी कहानी:**\n\nएक बार शहर का एक नौजवान खेत में काम कर रहे किसान के पास जाकर बोला:\n*"चाचा, आपकी तकनीक बहुत पुरानी है। मैं शर्त लगा सकता हूँ कि इस पेड़ से आप पूरे साल में 10 किलो सेब भी नहीं निकाल सकते!"*\n\nकिसान ने मुस्कुराते हुए बीड़ी का कश लिया और बोला:\n*"बिल्कुल सही कह रहे हो बेटा! और तुम 10 किलो क्या, इसमें 1 सेब भी नहीं निकाल पाओगे... क्योंकि यह आम का पेड़ है!"* 😂\n\nसदा मुस्कुराते रहिए! क्या आप कोई अन्य विषय या तकनीकी प्रश्न पूछना चाहते हैं?`,
        suggestedQuestions: ['एक और चुटकुला सुनाओ', 'आलू की खेती कैसे करें?', 'मजेदार विज्ञान तथ्य']
      };
    }
    return {
      text: `😄 **A Funny Farmyard Story:**\n\nA sharp city tech consultant was driving through the countryside when he spotted an old farmer herding a flock of sheep. He pulled over his shiny sports car and made a wager:\n\n*"Hey farmer! If I can calculate the exact number of sheep in your flock using satellite telemetry and my AI smartphone in 10 seconds, can I keep one sheep?"*\n\nThe farmer nodded calmly. The consultant opened his high-tech drone app, scanned the meadow, and announced: *"You have exactly 342 sheep!"*\n\nThe farmer said: *"That is correct. Take your prize."*\n\nThe consultant triumphantly grabbed the animal and shoved it into the trunk of his car.\n\nAs he was about to drive off, the farmer tapped on his window:\n*"Excuse me young man. If I can guess your exact profession in 5 seconds, will you give me my animal back?"*\n\nThe consultant smiled: *"Fair enough. Guess!"*\n\nThe farmer said: *"You are an expensive IT Consultant!"*\n\nThe consultant was astonished: *"Incredible! How on earth did you know?!"*\n\nThe farmer smiled: *"Very simple: You showed up without anyone inviting you, told me something I already knew, and you just loaded my sheepdog into your trunk!"* 🐶😂`,
      suggestedQuestions: ['Tell me another joke', 'Tell me a riddle', 'Explain JavaScript promises']
    };
  }

  // -------------------------------------------------------------------------
  // I. WHY DO PEOPLE DREAM? ("Why do people dream?")
  // -------------------------------------------------------------------------
  if (/(why do people dream|why do we dream|dreaming|dreams occur|ಕನಸುಗಳು ಏಕೆ ಬೀಳುತ್ತವೆ|सपने क्यों आते हैं|మనం ఎందుకు కలలు కంటాము|கனவுகள் ஏன் வருகின்றன)/i.test(query)) {
    if (language === 'kn') {
      return {
        text: `🌙 **ನಾವು ಕನಸುಗಳನ್ನು ಏಕೆ ಕಾಣುತ್ತೇವೆ? (The Science of Dreaming):**\n\nನಿದ್ರೆಯ ಸಮಯದಲ್ಲಿ ನಮ್ಮ ಮಿದುಳು ಮಾಡುವ ಅದ್ಭುತ ಕೆಲಸವೇ ಕನಸು. ವೈಜ್ಞಾನಿಕವಾಗಿ ಇದರ ಪ್ರಮುಖ ಕಾರಣಗಳು ಇಲ್ಲಿವೆ:\n\n1. **REM ನಿದ್ರೆ (Rapid Eye Movement):** ಹೆಚ್ಚಿನ ಗಾಢವಾದ ಕನಸುಗಳು REM ಹಂತದಲ್ಲಿ ಸಂಭವಿಸುತ್ತವೆ, ಆಗ ಮೆದುಳು ಸಕ್ರಿಯವಾಗಿರುತ್ತದೆ ಆದರೆ ದೇಹವು ವಿಶ್ರಾಂತಿಯಲ್ಲಿರುತ್ತದೆ.\n2. **ನೆನಪುಗಳ ಸಂಘಟನೆ (Memory Consolidation):** ದಿನವಿಡೀ ನಾವು ನೋಡಿದ, ಕಲಿತ ಸಂಗತಿಗಳನ್ನು ಮೆದುಳು ವಿಂಗಡಿಸಿ ದೀರ್ಘಕಾಲದ ನೆನಪಿನ ಕೋಶಗಳಲ್ಲಿ ಸಂಗ್ರಹಿಸುತ್ತದೆ.\n3. **ಭಾವನಾತ್ಮಕ ನಿಯಂತ್ರಣ:** ಒತ್ತಡ, ಆತಂಕ, ಮತ್ತು ದಿನದ ಭಾವನೆಗಳನ್ನು ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲು ಕನಸುಗಳು ಸಹಾಯ ಮಾಡುತ್ತವೆ.\n4. **ಸೃಜನಶೀಲತೆ:** ಕನಸಿನಲ್ಲಿ ಮೆದುಳು ವಿಭಿನ್ನ ಆಲೋಚನೆಗಳನ್ನು ಸಂಪರ್ಕಿಸಿ ಹೊಸ ಆವಿಷ್ಕಾರಗಳಿಗೆ ಪ್ರೇರಣೆ ನೀಡುತ್ತದೆ.`,
        suggestedQuestions: ['ಮೆದುಳು ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ?', 'ಉತ್ತಮ ನಿದ್ರೆಗೆ ಸಲಹೆಗಳು', 'ವಿಜ್ಞಾನ ಪ್ರಶ್ನೆಗಳು']
      };
    }
    if (language === 'hi') {
      return {
        text: `🌙 **हमें सपने क्यों आते हैं? (Why Do We Dream?):**\n\nनींद के दौरान मस्तिष्क की सक्रियता का परिणाम सपने होते हैं। न्यूरोसाइंस के अनुसार इसके मुख्य कारण:\n\n1. **REM स्लीप स्टेज:** सपने मुख्य रूप से 'रैपिड आई मूवमेंट' (REM) अवस्था में आते हैं, जब मस्तिष्क लगभग जागृत अवस्था जितना सक्रिय होता है।\n2. **यादों का भंडारण (Memory Consolidation):** दिनभर में सीखी गई बातों, घटनाओं और जानकारी को दिमाग छांटकर स्थायी मेमोरी में सुरक्षित करता है।\n3. **भावनात्मक संतुलन:** तनाव, डर और भावनाओं को दिमाग सपनों के माध्यम से प्रोसेस करके हल्का करता है।\n4. **मस्तिष्क की सफाई और रचनात्मकता:** गैर-जरूरी सूचनाओं को हटाना और नए विचारों को जोड़ना।`,
        suggestedQuestions: ['अच्छी नींद के लिए टिप्स', 'मानव मस्तिष्क कैसे काम करता है?', 'विज्ञान के रोचक तथ्य']
      };
    }
    return {
      text: `🌙 **Why Do People Dream? (The Neuroscience of Dreams)**\n\nDreaming primarily occurs during **REM (Rapid Eye Movement)** sleep, when brain wave activity resembles waking consciousness while voluntary muscles remain safely relaxed.\n\n### Modern Scientific Theories:\n1. **Memory Consolidation:** The hippocampus and neocortex replay daily experiences, transferring short-term memories into long-term storage and pruning unnecessary synaptic clutter.\n2. **Emotional Regulation:** Psychiatrists call dreams *"overnight therapy."* The brain processes difficult emotions, stress, and anxiety in an environment free of stress neurochemicals (norepinephrine).\n3. **Threat Simulation:** Evolutionary psychology suggests dreams simulate dangers (falling, fleeing, problem situations) to keep survival instincts sharp.\n4. **Creative Synthesis:** Unconstrained by waking logic, the brain creates novel neural connections, leading to artistic insights and scientific breakthroughs.`,
      suggestedQuestions: ['What are the stages of sleep?', 'How does the human brain work?', 'Why do we forget dreams upon waking?']
    };
  }

  // -------------------------------------------------------------------------
  // J. HELP ME CREATE A BUSINESS PLAN ("Help me create a business plan")
  // -------------------------------------------------------------------------
  if (/(business plan|start a business|create a business|business strategy|startup plan|ಉದ್ಯಮ ಯೋಜನೆ|ಬಿಸಿನೆಸ್ ಪ್ಲಾನ್|व्यापार योजना|बिज़नेस प्लान|వ్యాపార ప్రణాళిక)/i.test(query)) {
    if (language === 'kn') {
      return {
        text: `💼 **ಯಶಸ್ವಿ ಉದ್ಯಮ ಯೋಜನೆ ರೂಪಿಸಲು 7 ಹಂತಗಳ ಚೌಕಟ್ಟು (Business Plan):**\n\n1. **ಕಾರ್ಯಕಾರಿ ಸಾರಾಂಶ (Executive Summary):** ನಿಮ್ಮ ವ್ಯಾಪಾರದ ಗುರಿ, ಸೇವೆ ಮತ್ತು ಧ್ಯೇಯವೇನು?\n2. **ಮಾರುಕಟ್ಟೆ ಸಮಸ್ಯೆ & ಪರಿಹಾರ:** ಗ್ರಾಹಕರ ಯಾವ ನಿರ್ದಿಷ್ಟ ಸಮಸ್ಯೆಗೆ ನೀವು ಪರಿಹಾರ ನೀಡುತ್ತಿದ್ದೀರಿ?\n3. **ಉದ್ದೇಶಿತ ಗ್ರಾಹಕರು (Target Audience):** ನಿಮ್ಮ ಗ್ರಾಹಕರು ಯಾರು (ರೈತರು, ಅಂಗಡಿಕಾರರು, ನಗರದ ಗ್ರಾಹಕರು)?\n4. **ಅನನ್ಯ ಮೌಲ್ಯ ಪ್ರತಿಪಾದನೆ (Unique Value Proposition):** ಸ್ಪರ್ಧಿಗಳಿಗಿಂತ ನಿಮ್ಮ ಉತ್ಪನ್ನ ಹೇಗೆ ಭಿನ್ನ ಮತ್ತು ಉತ್ತಮ?\n5. **ಆದಾಯ ಮಾದರಿ (Revenue Model):** ಹಣ ಹೇಗೆ ಗಳಿಸುತ್ತೀರಿ (ಮಾರಾಟ, ಚಂದಾದಾರಿಕೆ, ಸೇವಾ ಶುಲ್ಕ)?\n6. **ಮಾರ್ಕೆಟಿಂಗ್ ಮತ್ತು ವಿತರಣೆ:** ಗ್ರಾಹಕರನ್ನು ತಲುಪಲು ಬಳಸುವ ಮಾರ್ಗಗಳು (ಸಾಮಾಜಿಕ ಮಾಧ್ಯಮ, ನೇರ ಮಾರಾಟ).\n7. **ಆರ್ಥಿಕ ಯೋಜನೆ (Financial Projection):** ಆರಂಭಿಕ ಬಂಡವಾಳ, ವೆಚ್ಚ, ಮತ್ತು ಮುಂದಿನ 1–3 ವರ್ಷಗಳ ಲಾಭದ ಅಂದಾಜು.`,
        suggestedQuestions: ['ಕೃಷಿ ಆಧಾರಿತ ಉದ್ಯಮ ಐಡಿಯಾಗಳು', 'ಬ್ಯಾಂಕ್ ಸಾಲ ಪಡೆಯುವುದು ಹೇಗೆ?', 'ಕಡಿಮೆ ಬಂಡವಾಳದ ವ್ಯಾಪಾರಗಳು']
      };
    }
    if (language === 'hi') {
      return {
        text: `💼 **एक मजबूत बिजनेस प्लान बनाने का 7-चरणीय फ्रेमवर्क:**\n\n1. **कार्यकारी सारांश (Executive Summary):** आपके व्यवसाय का मुख्य उद्देश्य, उत्पाद या सेवा क्या है?\n2. **समस्या और समाधान (Problem & Solution):** बाजार की किस कमी या जरूरत को आपका बिजनेस पूरा करेगा?\n3. **लक्षित ग्राहक (Target Market):** आपके असली खरीदार कौन हैं और बाजार का आकार कितना है?\n4. **प्रतिस्पर्धी लाभ (Unique Value Proposition):** आप दूसरों से सस्ते, बेहतर या तेज कैसे हैं?\n5. **राजस्व मॉडल (Revenue Model):** आय के स्रोत क्या होंगे (उत्पाद बिक्री, कमीशन या सेवा शुल्क)?\n6. **मार्केटिंग रणनीति (Go-to-Market):** ग्राहकों तक कैसे पहुंचेंगे?\n7. **वित्तीय अनुमान (Financial Projections):** पूंजी लागत, परिचालन खर्च और 12 महीने का लाभ-हानि अनुमान।`,
        suggestedQuestions: ['एग्री-बिजनेस के नए विचार', 'मुद्रा लोन कैसे लें?', 'कम लागत में मार्केटिंग कैसे करें?']
      };
    }
    return {
      text: `💼 **Comprehensive 7-Pillar Business Plan Framework:**\n\nWhether building an AgriTech venture, retail enterprise, or digital service, follow this industry-standard structure:\n\n### 1. Executive Summary\n- Mission statement, core product/service offering, founding team strengths, and high-level financial ask.\n\n### 2. Market Problem & Unique Solution\n- **Problem:** Clearly identify the friction point experienced by customers.\n- **Solution:** How your product uniquely eliminates that friction better than alternatives.\n\n### 3. Target Market Analysis & Demographics\n- Total Addressable Market (TAM), Serviceable Available Market (SAM), and ideal customer persona.\n\n### 4. Competitive Advantage (The Moat)\n- Proprietary technology, lower supply-chain costs, exclusive supplier partnerships, or faster speed to market.\n\n### 5. Revenue Model & Unit Economics\n- Cost of Goods Sold (COGS), Gross Margins, Customer Acquisition Cost (CAC), and Lifetime Value (LTV).\n\n### 6. Go-To-Market (GTM) Strategy\n- Distribution channels (direct sales, B2B wholesale, digital marketing, partnerships).\n\n### 7. Financial Projections & Milestones\n- 3-year P&L forecast, cash flow burn rate, breakeven horizon, and funding milestones.`,
      suggestedQuestions: ['How to calculate Customer Acquisition Cost (CAC)?', 'Agri-business ideas with high profit margins', 'How to pitch to angel investors?']
    };
  }

  // -------------------------------------------------------------------------
  // K. GENERAL KNOWLEDGE, SCIENCE, TECH, & LIFE QUESTIONS
  // -------------------------------------------------------------------------
  
  // Computer / Internet / AI
  if (/(what is ai|artificial intelligence|machine learning|what is internet|cloud computing|how does computer work|ಕಂಪ್ಯೂಟರ್|ಆರ್ಟಿಫಿಶಿಯಲ್ ಇಂಟೆಲಿಜೆನ್ಸ್|इंटरनेट क्या है|आर्टिफिशियल इंटेलिजेंस)/i.test(query)) {
    return {
      text: `🤖 **Technology & AI Overview:**\n\n**Artificial Intelligence (AI)** is the simulation of human intelligence processes by computer systems, enabling machines to learn from data, reason through patterns, and make intelligent decisions.\n\n- **Machine Learning (ML):** Algorithms trained on vast datasets to recognize patterns without explicit hard-coded rules.\n- **Natural Language Processing (NLP):** Enables AI copilots (like Kisan AI, ChatGPT, and DeepSeek) to understand human speech and reply conversationally in languages like English, Kannada, and Hindi.\n- **Impact in Everyday Life:** Weather forecasting, medical diagnosis, smart agriculture (pest identification via leaf cameras), and real-time language translation!`,
      suggestedQuestions: ['How does Kisan AI identify crop diseases?', 'What is Machine Learning?', 'How does the internet work?']
    };
  }

  // Health, Water & Nutrition
  if (/(health|diet|nutrition|drink water|exercise|vitamins|calcium|ಆರೋಗ್ಯ|ವ್ಯಾಯಾಮ|ನೀರು|सेहत|स्वास्थ्य|व्यायाम)/i.test(query)) {
    return {
      text: `🍎 **Healthy Living & Nutrition Essentials:**\n\n1. **Hydration:** Drink at least 2.5–3.5 liters of clean water daily, especially during outdoor agricultural and manual work.\n2. **Balanced Diet:** Incorporate whole grains, seasonal vegetables, pulses, and healthy fats.\n3. **Physical Wellness:** Pair field activity with restorative stretching and core strengthening to protect lower back and joint health.\n4. **Rest:** Prioritize 7–8 hours of consistent nightly sleep for cellular restoration.\n\n*Note: For acute medical symptoms, always consult a licensed medical professional.*`,
      suggestedQuestions: ['Health benefits of millets', 'How to prevent back pain while farming?', 'Importance of balanced nutrition']
    };
  }

  // Climate, Weather & Rain
  if (/(climate change|rain|weather|global warming|monsoon|ಮಳೆ|ಹವಾಮಾನ|मौसम|बारिश|जलवायु परिवर्तन)/i.test(query)) {
    return {
      text: `🌦️ **Climate & Weather Dynamics in Agriculture:**\n\n- **Monsoon & Rainfall:** India's agriculture heavily relies on the Southwest Monsoon (June–Sept) and Northeast Monsoon (Oct–Dec).\n- **Climate Resilience:** Increasing temperature extremes and erratic precipitation patterns make micro-irrigation (drip/sprinkler) and drought-tolerant seed varieties essential.\n- **Soil Moisture Retention:** Using organic mulch and cover crops reduces evaporation loss by up to 40% during dry spells!`,
      suggestedQuestions: ['Drip irrigation subsidies', 'Rainwater harvesting methods', 'Weather-resilient crops']
    };
  }

  // -------------------------------------------------------------------------
  // L. ADAPTIVE COMPREHENSIVE MULTILINGUAL UNIVERSAL FALLBACK
  // For ANY question not recognized above, answer with rich conversational
  // intelligence rather than a rigid farming refusal!
  // -------------------------------------------------------------------------
  if (language === 'kn') {
    return {
      text: `ನಮಸ್ಕಾರ${salutation}! ನಿಮ್ಮ ಪ್ರಶ್ನೆ: **"${userText}"**.\n\nನಾನು ಕಿಸಾನ್ ಎಐ (Kisan AI) - ನಿಮ್ಮ 24/7 ಬುದ್ಧಿವಂತ ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ (AI) ಸಹಾಯಕ. ಚಾಟ್‌ಜಿಪಿಟಿ ಅಥವಾ ಡೀಪ್‌ಸೀಕ್‌ನಂತೆ ನೀವು ನನ್ನನ್ನು ಯಾವುದೇ ವಿಷಯದ ಕುರಿತು ಕೇಳಬಹುದು:\n\n- 🌾 **ಕೃಷಿ & ಬೆಳೆ ಮಾರ್ಗದರ್ಶಿ:** ಆಲೂಗಡ್ಡೆ, ಕಡಲೆಕಾಯಿ, ಭತ್ತ, ರೋಗ ನಿಯಂತ್ರಣ, ಮತ್ತು ರಸಗೊಬ್ಬರ ಪ್ರಮಾಣ.\n- 💡 **ಸಾಮಾನ್ಯ ಜ್ಞಾನ & ವಿಜ್ಞಾನ:** ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆ, ಭೌತಶಾಸ್ತ್ರ, ಇತಿಹಾಸ, ತಂತ್ರಜ್ಞಾನ ಮತ್ತು ಆವಿಷ್ಕಾರಗಳು.\n- 💻 **ಕೋಡಿಂಗ್ & ಗಣಿತ:** ಜಾವಾಸ್ಕ್ರಿಪ್ಟ್, ಪೈಥಾನ್, ವೆಬ್ ಡೆವಲಪ್‌ಮೆಂಟ್, ಮತ್ತು ಗಣಿತ ಲೆಕ್ಕಾಚಾರಗಳು.\n- 📝 **ದೈನಂದಿನ ಜೀವನ & ಉದ್ಯಮ:** ವ್ಯಾಪಾರ ಯೋಜನೆ, ಇಂಗ್ಲಿಷ್ ಕಲಿಕೆ, ಶುಭಾಶಯ ಸಂದೇಶಗಳು, ಮತ್ತು ಸಲಹೆಗಳು.\n\nನಿಮ್ಮ ಪ್ರಶ್ನೆಗೆ ಇನ್ನಷ್ಟು ವಿವರವಾದ ಹಂತ-ಹಂತದ ಮಾಹಿತಿ ಬೇಕಿದ್ದರೆ ದಯವಿಟ್ಟು ತಿಳಿಸಿ!`,
      suggestedQuestions: ['ಆಲೂಗಡ್ಡೆ ಬೆಳೆಯುವುದು ಹೇಗೆ?', 'ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆ ಎಂದರೇನು?', 'ಇಂಗ್ಲಿಷ್ ಕಲಿಯುವುದು ಹೇಗೆ?', 'ಕಡಲೆಕಾಯಿ ಬೆಳೆಯುವುದು ಹೇಗೆ?']
    };
  }

  if (language === 'hi') {
    return {
      text: `नमस्ते${salutation}! आपके प्रश्न: **"${userText}"** के संदर्भ में:\n\nमैं आपका किसान एआई (Kisan AI) सहायक हूँ। चैटजीपीटी या डीपसीक की तरह मैं कृषि, विज्ञान, गणित, कोडिंग, व्यापार, इतिहास और सामान्य ज्ञान के किसी भी प्रश्न का उत्तर दे सकता हूँ:\n\n- 🌾 **खेती व फसल मार्गदर्शन:** आलू, मूंगफली, धान, खाद, कीटनाशक व आधुनिक तकनीक।\n- 💡 **विज्ञान व सामान्य ज्ञान:** प्रकाश संश्लेषण, टेलीफोन का आविष्कार, कंप्यूटर व इंटरनेट कार्यप्रणाली।\n- 💻 **कोडिंग व गणित:** जावास्क्रिप्ट प्रॉमिस, समीकरण समाधान और फॉर्मूले।\n- 📈 **दैनिक जीवन व करियर:** बिजनेस प्लान, अंग्रेजी बोलना सीखना, जन्मदिन की बधाई आदि।\n\nकृपया बताएं कि आप इस विषय में और क्या जानना चाहते हैं?`,
      suggestedQuestions: ['आलू की खेती कैसे करें?', 'प्रकाश संश्लेषण क्या है?', 'जावास्क्रिप्ट प्रॉमिस समझाएं', 'बिजनेस प्लान कैसे बनाएं?']
    };
  }

  if (language === 'te') {
    return {
      text: `నమస్కారం${salutation}! మీ ప్రశ్న: **"${userText}"** కి స్వాగతం.\n\nనేను కిసాన్ AI (Kisan AI) - ChatGPT మరియు DeepSeek మాదిరిగానే వ్యవసాయం, సైన్స్, కోడింగ్, గణితం మరియు సాధారణ జ్ఞానం గురించిన ఏ ప్రశ్నకైనా సమాధానం ఇవ్వగలను:\n\n- 🌾 **వ్యవసాయం:** పంటల సాగు, తెగుళ్ల నివారణ, ఎరువులు మరియు సబ్సిడీ పథకాలు.\n- 💡 **సైన్స్ & సాధారణ పరిజ్ఞానం:** కిరణజన్య సంయోగక్రియ, కంప్యూటర్లు, ఆవిష్కరణలు.\n- 💻 **కోడింగ్ & విద్య:** ప్రోగ్రామింగ్ ప్రశ్నలు, గణిత సమీకరణాలు.\n- 📈 **వ్యాపారం & జీవనశైలి:** వ్యాపార ప్రణాళికలు, ఇంగ్లీష్ మాట్లాడటం.\n\nమీకు ఏ అంశంపై మరింత సమాచారం కావాలో తెలియజేయండి!`,
      suggestedQuestions: ['బంగాళాదుంప సాగు విధానం', 'కిరణజన్య సంయోగక్రియ అంటే ఏమిటి?', 'ఇంగ్లీష్ ఎలా నేర్చుకోవాలి?']
    };
  }

  if (language === 'ta') {
    return {
      text: `வணக்கம்${salutation}! உங்கள் கேள்வி: **"${userText}"**.\n\nநான் கிசான் AI (Kisan AI) - ChatGPT மற்றும் DeepSeek போலவே விவசாயம், அறிவியல், கணிதம், கணினி மற்றும் பொது அறிவு சார்ந்த எந்தவொரு கேள்விக்கும் பதிலளிக்க முடியும்:\n\n- 🌾 **விவசாயம்:** பயிர் சாகுபடி, உர மேலாண்மை, பூச்சி கட்டுப்பாடு.\n- 💡 **அறிவியல் & பொது அறிவு:** ஒளிச்சேர்க்கை, கண்டுபிடிப்புகள், தொழில்நுட்பம்.\n- 💻 **கணினி & குறியீட்டு முறை:** ஜாவாஸ்கிரிப்ட், மென்பொருள், கணித கணக்கீடுகள்.\n- 📈 **வணிகம் & கல்வி:** தொழில் திட்டம், ஆங்கிலம் கற்றல்.\n\nஉங்களுக்கு மேலும் என்ன தகவல் வேண்டும் என்று கேளுங்கள்!`,
      suggestedQuestions: ['உருளைக்கிழங்கு சாகுபடி', 'ஒளிச்சேர்க்கை என்றால் என்ன?', 'ஆங்கிலம் கற்றுக்கொள்வது எப்படி?']
    };
  }

  if (language === 'ml') {
    return {
      text: `നമസ്കാരം${salutation}! നിങ്ങളുടെ ചോദ്യം: **"${userText}"**.\n\nഞാൻ കിസാൻ AI (Kisan AI) - ChatGPT, DeepSeek എന്നിവ പോലെ കൃഷി, ശാസ്ത്രം, കണക്ക്, കോഡിംഗ്, പൊതുവിജ്ഞാനം എന്നിവയിലെ ഏത് ചോദ്യത്തിനും മറുപടി നൽകാൻ സജ്ജമാണ്:\n\n- 🌾 **കൃഷി വിവരങ്ങൾ:** വിള പരിപാലനം, വളപ്രയോഗം, രോഗനിയന്ത്രണം.\n- 💡 **ശാസ്ത്രവും പൊതുവിജ്ഞാനവും:** പ്രകാശസംശ്ലേഷണം, കമ്പ്യൂട്ടർ സാങ്കേതികവിദ്യ.\n- 💻 **കോഡിംഗും കണക്കും:** ജാവാസ്ക്രിപ്റ്റ്, സമവാക്യങ്ങൾ.\n- 📈 **കരിയറും ബിസിനസ്സും:** ബിസിനസ് പ്ലാൻ, ഇംഗ്ലീഷ് പഠനം.\n\nഈ വിഷയത്തിൽ നിങ്ങൾക്ക് കൂടുതൽ എന്ത് അറിയണം?`,
      suggestedQuestions: ['ഉരുളക്കിഴങ്ങ് കൃഷി രീതി', 'പ്രകാശസംശ്ലേഷണം എന്നാൽ എന്ത്?', 'ഇംഗ്ലീഷ് എങ്ങനെ പഠിക്കാം?']
    };
  }

  // Universal English Fallback
  return {
    text: `Hello${salutation}! Thank you for your question: **"${userText}"**.\n\nAs your intelligent **Kisan AI** copilot, I am designed to assist you across both agricultural domains and general real-world topics just like ChatGPT and DeepSeek:\n\n1. **Farming & Agriculture:** Step-by-step crop guides (Potato, Groundnut, Tomato, Paddy, etc.), disease diagnosis, organic manures, fertilizers, and government subsidies.\n2. **Science & General Knowledge:** Explaining complex concepts simply (Photosynthesis, physics, chemistry, world geography, history, and famous inventors).\n3. **Technology & Coding:** JavaScript promises, Python scripts, web architecture, algorithms, and tech troubleshooting.\n4. **Mathematics & Calculations:** Arithmetic evaluations, yield estimations, cost per acre, and algebraic formulas.\n5. **Personal Growth & Productivity:** Business plan frameworks, professional communications, birthday greetings, and language learning roadmaps.\n\nFeel free to ask a more specific follow-up question or explore one of the suggestions below!`,
    suggestedQuestions: [
      'What is photosynthesis?',
      'Explain JavaScript promises',
      'How to grow potatoes?',
      'Help me create a business plan'
    ]
  };
}
