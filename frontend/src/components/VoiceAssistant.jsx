import { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import { Mic, MicOff, X } from 'lucide-react';

// ── Language code → speech BCP-47 tag ────────────────────────────────────────
const LANG_TO_SPEECH = {
    en: 'en-IN', hi: 'hi-IN', mr: 'mr-IN', ta: 'ta-IN', te: 'te-IN',
    bn: 'bn-IN', gu: 'gu-IN', ml: 'ml-IN', pa: 'pa-IN',
    or: 'or-IN', as: 'as-IN', ur: 'ur-PK',
};

// ── TTS: always works, language-aware ────────────────────────────────────────
function ttsSpeak(text, langCode = 'en') {
    if (!window.speechSynthesis || !text) return;
    window.speechSynthesis.cancel();
    const bcp = LANG_TO_SPEECH[langCode] || 'en-IN';
    setTimeout(() => {
        const utter = new SpeechSynthesisUtterance(text.trim());
        utter.lang = bcp;
        utter.rate = 0.9;
        utter.pitch = 1;
        utter.volume = 1;
        const voices = window.speechSynthesis.getVoices();
        const voice =
            voices.find(v => v.lang === bcp) ||
            voices.find(v => v.lang.startsWith(bcp.split('-')[0]) && v.name.toLowerCase().includes('google')) ||
            voices.find(v => v.lang.startsWith(bcp.split('-')[0])) ||
            voices.find(v => v.lang.startsWith('en')) || null;
        if (voice) utter.voice = voice;
        window.speechSynthesis.speak(utter);
    }, 80);
}

// ── Word → digit ─────────────────────────────────────────────────────────────
const WORD_TO_DIGIT = {
    zero: '0', oh: '0', one: '1', two: '2', to: '2', too: '2',
    three: '3', four: '4', 'for': '4', five: '5', six: '6',
    seven: '7', eight: '8', ate: '8', nine: '9',
    // Hindi words
    'shunya': '0', 'ek': '1', 'do': '2', 'teen': '3', 'char': '4',
    'paanch': '5', 'chhe': '6', 'saat': '7', 'aath': '8', 'nau': '9',
};

function extractAllDigits(text) {
    let s = text.toLowerCase();
    Object.entries(WORD_TO_DIGIT).forEach(([w, d]) => {
        s = s.replace(new RegExp(`\\b${w}\\b`, 'g'), d);
    });
    const matches = s.match(/\d+/g);
    return matches ? matches.join('') : null;
}

// ── Fill any visible input via custom event (works with React readOnly inputs) ─
function fillVisibleInput(digits) {
    // 1. Try #consumer-id via custom event first (QuickBillPayment listens for this)
    const consumerEl = document.getElementById('consumer-id');
    if (consumerEl) {
        consumerEl.dispatchEvent(new CustomEvent('va-fill', { detail: { digits }, bubbles: true }));
        return true;
    }
    
    // 2. Try #aadhaar-input via custom event (AuthScreen Aadhaar field)
    const aadhaarEl = document.getElementById('aadhaar-input');
    if (aadhaarEl) {
        aadhaarEl.dispatchEvent(new CustomEvent('va-fill', { detail: { digits }, bubbles: true }));
        return true;
    }
    
    // 3. Try focused non-readOnly element
    const focused = document.activeElement;
    if (focused && (focused.tagName === 'INPUT' || focused.tagName === 'TEXTAREA') && !focused.readOnly) {
        const desc = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value');
        if (desc?.set) {
            desc.set.call(focused, (focused.value || '') + digits);
            focused.dispatchEvent(new Event('input', { bubbles: true }));
            focused.dispatchEvent(new Event('change', { bubbles: true }));
        }
        return true;
    }
    
    // 4. Try any visible input with readOnly (for auth fields)
    const anyReadOnlyInput = document.querySelector('input:not([type="hidden"])[readOnly]');
    if (anyReadOnlyInput) {
        anyReadOnlyInput.dispatchEvent(new CustomEvent('va-fill', { detail: { digits }, bubbles: true }));
        return true;
    }
    
    // 5. Any visible writable input
    const anyInput = document.querySelector('input:not([type="hidden"]):not([readOnly])');
    if (anyInput) {
        anyInput.focus();
        anyInput.dispatchEvent(new CustomEvent('va-fill', { detail: { digits }, bubbles: true }));
        return true;
    }
    return false;
}

// ── Find and click a button by spoken phrase ──────────────────────────────────
const BUTTON_KEYWORD_MAP = [
    { keys: ['fetch', 'search', 'get bill', 'fetch bill', 'submit'], words: ['fetch', 'search', 'get'] },
    { keys: ['pay', 'pay now', 'confirm', 'confirm payment', 'make payment'], words: ['pay', 'confirm'] },
    { keys: ['back', 'wapas', 'previous', 'go back'], words: ['back', 'previous', 'wapas'] },
    { keys: ['next', 'continue', 'aage', 'proceed'], words: ['next', 'continue', 'proceed'] },
    { keys: ['print', 'print receipt'], words: ['print'] },
    { keys: ['download', 'download receipt'], words: ['download'] },
    { keys: ['home', 'go home', 'ghar'], words: ['home', 'ghar'] },
    { keys: ['clear', 'erase', 'delete all'], words: ['clear', 'erase'] },
    { keys: ['start', 'begin', 'tap to start'], words: ['start', 'begin'] },
];

let lastClickTime = 0; // module-level click guard

function findAndClickButton(phrase) {
    const now = Date.now();
    if (now - lastClickTime < 1500) return null; // debounce: 1.5s between clicks

    const lower = phrase.toLowerCase().trim();
    if (lower.length < 2) return null;

    const buttons = Array.from(document.querySelectorAll('button:not([disabled]), a.idle-cta-btn, .quick-service-card, .btn'));

    // 1. Exact or starts-with match (High priority)
    for (const btn of buttons) {
        const txt = (btn.innerText || btn.textContent || '').toLowerCase().trim().split('\n')[0];
        if (txt && (lower === txt || lower.startsWith(txt) || txt.startsWith(lower))) {
            lastClickTime = Date.now();
            return btn;
        }
    }

    // 2. Keyword/Alias map matching
    for (const { keys, words } of BUTTON_KEYWORD_MAP) {
        if (keys.some(k => lower.includes(k))) {
            for (const btn of buttons) {
                const txt = (btn.innerText || btn.textContent || '').toLowerCase();
                if (words.some(w => txt.includes(w))) {
                    lastClickTime = Date.now();
                    return btn;
                }
            }
        }
    }

    // 3. Word-level token matching (Flexible)
    const spokenTokens = lower.split(/\s+/);
    for (const btn of buttons) {
        const btnText = (btn.innerText || btn.textContent || '').toLowerCase().trim();
        if (!btnText || btnText.length < 2) continue;
        
        const btnTokens = btnText.split(/\s+/);
        // If all words in button text are mentioned in spoken phrase, or vice versa
        const match = btnTokens.every(t => lower.includes(t)) || spokenTokens.every(t => btnText.includes(t));
        
        if (match) {
            lastClickTime = Date.now();
            return btn;
        }
    }

    return null;
}

// ── Intent extraction ─────────────────────────────────────────────────────────
function extractButtonPhrase(text) {
    const m = text.toLowerCase().match(/(?:press|click|tap|push|hit|select)(?: the| this| on)?\s+(.+)/i);
    return m ? m[1].trim() : null;
}

function extractEnterDigits(text) {
    const lower = text.toLowerCase();
    // "enter/put/type/fill [optional words] [number]"
    const m = lower.match(/(?:enter|put|type|input|fill|write|insert|dal|likho)(?: this| my| the)?(?:\s+\w+){0,3}?\s+([\d\s]+|(?:zero|one|two|three|four|five|six|seven|eight|nine|ek|do|teen|char|paanch|chhe|saat|aath|nau|oh|\s)+)/i);
    if (m) { const d = extractAllDigits(m[1]); if (d) return d; }
    // "consumer id / number [digits]"
    const m2 = lower.match(/(?:consumer|number|no|id|account)\s+([\d\s]+)/i);
    if (m2) return extractAllDigits(m2[1]);
    return null;
}

// ── Multilingual navigation commands ──────────────────────────────────────────
const NAV_COMMANDS = [
    {
        patterns: ['electricity', 'electric', 'light bill', 'bijli', 'bijlee', 'open electricity', 'bijli bill',
            'वीज', 'बिजली', 'विद्युत'],
        target: '/quick-bill-payment?service=electricity',
        response: { en: 'Opening electricity bill payment.', hi: 'बिजली बिल भुगतान खुल रहा है।' },
    },
    {
        patterns: ['water', 'paani', 'water bill', 'jal', 'open water', 'पानी', 'जल'],
        target: '/quick-bill-payment?service=water',
        response: { en: 'Opening water bill payment.', hi: 'पानी बिल खुल रहा है।' },
    },
    {
        patterns: ['gas', 'gas bill', 'lpg', 'rasoi gas', 'गैस'],
        target: '/quick-bill-payment?service=gas',
        response: { en: 'Opening gas bill payment.', hi: 'गैस बिल खुल रहा है।' },
    },
    {
        patterns: ['property', 'property tax', 'sampatti', 'संपत्ति'],
        target: '/quick-bill-payment?service=property',
        response: { en: 'Opening property tax payment.', hi: 'संपत्ति कर खुल रहा है।' },
    },
    {
        patterns: ['grievance', 'complaint', 'shikayat', 'complain', 'शिकायत'],
        target: '/quick-grievance',
        response: { en: 'Opening grievance form.', hi: 'शिकायत फॉर्म खुल रहा है।' },
    },
    {
        patterns: ['aadhaar', 'aadhar', 'login', 'sign in', 'auth', 'authenticate', 'आधार'],
        target: '/auth',
        response: { en: 'Opening login page.', hi: 'लॉगिन पेज खुल रहा है।' },
    },
    {
        patterns: ['dashboard', 'my services', 'डैशबोर्ड'],
        target: '/dashboard',
        response: { en: 'Opening dashboard.', hi: 'डैशबोर्ड खुल रहा है।' },
    },
    {
        patterns: ['language', 'bhasha', 'select language', 'change language', 'भाषा'],
        target: '/language',
        response: { en: 'Going to language selection.', hi: 'भाषा चयन पर जा रहे हैं।' },
    },
    {
        patterns: ['home', 'ghar', 'main menu', 'wapas', 'go home', 'घर', 'वापस'],
        target: '/',
        response: { en: 'Going to home screen.', hi: 'होम स्क्रीन पर जा रहे हैं।' },
    },
    {
        patterns: ['track status', 'status', 'track', 'application status', 'ट्रैक स्टेटस', 'स्टेटस', 'आवेदन स्थिति'],
        target: '/track-status',
        response: { en: 'Opening track status page.', hi: 'ट्रैक स्टेटस पेज खुल रहा है।' },
    },
];

const WELCOME_EN = 'Voice assistant is on. I will keep listening.';
const WELCOME_HI = 'वॉइस असिस्टेंट चालू है। मैं सुनता रहूंगा।';
const HELP_EN = 'Say: open electricity, water, gas, or property bill. Say enter followed by a number to fill a field. Say press followed by a button name like fetch bill or pay now. Say high contrast to toggle accessibility. Say stop to pause me.';
const HELP_HI = 'कहें: बिजली, पानी, गैस, या संपत्ति बिल। नंबर डालने के लिए "डालो" और फिर नंबर कहें। बटन दबाने के लिए "दबाओ" और बटन का नाम कहें।';

const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition || null;

// ── Component ─────────────────────────────────────────────────────────────────
export default function VoiceAssistant() {
    const navigate = useNavigate();
    const { toggleHighContrast, currentLang } = useContext(AppContext);

    const [isActive, setIsActive] = useState(false); // whole session on/off
    const [phase, setPhase] = useState('idle');       // idle | listening | processing | speaking
    const [message, setMessage] = useState('');
    const [bubbleVisible, setBubbleVisible] = useState(false);
    const [supported] = useState(!!SpeechRecognitionAPI);

    const recognitionRef = useRef(null);
    const bubbleTimerRef = useRef(null);
    const latestTranscriptRef = useRef('');
    const processedRef = useRef(false);     // ← prevents double-fire
    const shouldRestartRef = useRef(false); // ← continuous mode flag
    const currentLangRef = useRef(currentLang);
    // Stable refs to latest callbacks — lets recognition useEffect stay mounted forever
    const sayRef = useRef(null);
    const handleTranscriptRef = useRef(null);

    // Keep lang ref in sync
    useEffect(() => { currentLangRef.current = currentLang; }, [currentLang]);

    const getLang = () => currentLangRef.current || 'en';
    const isHindi = () => getLang() === 'hi';
    const speechLang = () => LANG_TO_SPEECH[getLang()] || 'en-IN';

    // ── Speak + auto-restart ─────────────────────────────────────────────────
    const say = useCallback((text, afterMs = 3200, skipRestart = false) => {
        window.speechSynthesis.cancel();
        setMessage(text);
        setBubbleVisible(true);
        ttsSpeak(text, getLang());
        setPhase('speaking');
        clearTimeout(bubbleTimerRef.current);
        bubbleTimerRef.current = setTimeout(() => {
            setBubbleVisible(false);
            setPhase('idle');
            // Auto-restart listening if session is active
            if (!skipRestart && shouldRestartRef.current) {
                setTimeout(() => {
                    if (shouldRestartRef.current && recognitionRef.current) {
                        try { recognitionRef.current.start(); } catch { /* already running */ }
                    }
                }, 400);
            }
        }, afterMs);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    // Always keep ref up-to-date (so recognition effect can call without re-running)
    sayRef.current = say;

    // ── Process transcript (called exactly ONCE per recognition session) ──────
    const handleTranscript = useCallback((text) => {
        if (!text?.trim()) {
            say(isHindi() ? 'कुछ सुनाई नहीं दिया। फिर कहें।' : "I didn't hear anything. Please try again.", 2000);
            return;
        }

        setPhase('processing');
        const lower = text.toLowerCase().trim();

        // 1. PRESS / CLICK / TAP [button]
        const buttonPhrase = extractButtonPhrase(lower);
        if (buttonPhrase) {
            const btn = findAndClickButton(buttonPhrase);
            if (btn) {
                const label = (btn.innerText || btn.textContent || 'button').trim().split('\n')[0];
                say(isHindi() ? `${label} दबा रहे हैं।` : `Pressing ${label}.`, 1800);
                setTimeout(() => btn.click(), 700);
                return;
            }
            say(isHindi() ? 'वह बटन नहीं मिला।' : `Button not found. Try saying the exact button name.`, 2500);
            return;
        }

        // 2. ENTER / PUT / TYPE [digits]
        const enterDigits = extractEnterDigits(lower);
        if (enterDigits) {
            const ok = fillVisibleInput(enterDigits);
            const readback = enterDigits.split('').join(' ');
            if (ok) say(isHindi() ? `${readback} डाला।` : `Entered ${readback}.`, 1800);
            else say(isHindi() ? `${readback} सुना। पहले इनपुट बॉक्स चुनें।` : `Heard ${readback}. Tap an input field first.`, 3000);
            return;
        }

        // 3. HIGH CONTRAST
        if (/high contrast|contrast mode|toggle contrast|accessibility|हाई कंट्रास्ट/.test(lower)) {
            say(isHindi() ? 'हाई कंट्रास्ट बदल रहे हैं।' : 'Toggling high contrast.', 1800);
            setTimeout(() => toggleHighContrast(), 400);
            return;
        }

        // 4. HELP
        if (/\bhelp\b|madad|मदद|commands/.test(lower)) {
            const msg = isHindi() ? HELP_HI : HELP_EN;
            say(msg, 10000);
            return;
        }

        // 5. STOP SESSION
        if (/\bstop\b|cancel|ruko|band karo|quiet|रुको|बंद/.test(lower)) {
            shouldRestartRef.current = false;
            setIsActive(false);
            window.speechSynthesis.cancel();
            setBubbleVisible(false);
            setPhase('idle');
            return;
        }

        // 6. Navigation
        for (const cmd of NAV_COMMANDS) {
            if (cmd.patterns.some(p => lower.includes(p))) {
                const resp = cmd.response[isHindi() ? 'hi' : 'en'] || cmd.response.en;
                say(resp, 2000);
                setTimeout(() => navigate(cmd.target), 1200);
                return;
            }
        }

        // 7. Pure number — fill input
        const digits = extractAllDigits(lower);
        if (digits && digits.length >= 1) {
            const nonDigits = lower.replace(/\b(zero|one|two|three|four|five|six|seven|eight|nine|ek|do|teen|char|paanch|chhe|saat|aath|nau|oh|\d|\s)\b/g, '').trim();
            if (nonDigits.length < 10) {
                const ok = fillVisibleInput(digits);
                const readback = digits.split('').join(' ');
                if (ok) say(isHindi() ? `${readback} डाला।` : `Entered ${readback}.`, 1800);
                else say(isHindi() ? 'पहले इनपुट बॉक्स पर टैप करें।' : 'Tap the input field first.', 2800);
                return;
            }
        }

        // 8. Final Fallback: Is it a button on the current page?
        const btn = findAndClickButton(lower);
        if (btn) {
            const label = (btn.innerText || btn.textContent || 'button').trim().split('\n')[0];
            say(isHindi() ? `${label} दबा रहे हैं।` : `Pressing ${label}.`, 1800);
            setTimeout(() => btn.click(), 700);
            return;
        }

        say(isHindi() ? 'समझ नहीं आया।' : "I didn't understand.", 2500);
    }, [navigate, say, toggleHighContrast]); // eslint-disable-line react-hooks/exhaustive-deps
    // Always keep ref up-to-date
    handleTranscriptRef.current = handleTranscript;

    // ── Build recognition ONCE — never tears down on navigation ─────────────
    useEffect(() => {
        if (!SpeechRecognitionAPI) return;

        const recog = new SpeechRecognitionAPI();
        recog.continuous = false;
        recog.interimResults = true;
        recog.maxAlternatives = 3;

        recog.onstart = () => {
            processedRef.current = false;
            latestTranscriptRef.current = '';
            setPhase('listening');
            setMessage('Listening…');
            setBubbleVisible(true);
        };

        recog.onresult = (e) => {
            let interim = '', final = '';
            for (let i = e.resultIndex; i < e.results.length; i++) {
                const t = e.results[i][0].transcript;
                if (e.results[i].isFinal) final += t;
                else interim += t;
            }
            const heard = final || interim;
            latestTranscriptRef.current = heard;
            setMessage(heard || 'Listening…');
        };

        recog.onend = () => {
            // Call via ref so this closure never goes stale across navigations
            if (processedRef.current) return;
            processedRef.current = true;
            handleTranscriptRef.current?.(latestTranscriptRef.current);
        };

        recog.onerror = (e) => {
            if (e.error === 'no-speech') {
                if (shouldRestartRef.current) {
                    setTimeout(() => {
                        if (shouldRestartRef.current) try { recog.start(); } catch { /* */ }
                    }, 300);
                } else {
                    setPhase('idle');
                    setBubbleVisible(false);
                }
            } else if (e.error !== 'aborted') {
                sayRef.current?.('Microphone error. Check browser permissions.', 2500);
            }
        };

        recognitionRef.current = recog;
        // Cleanup only on true unmount — do NOT reset shouldRestartRef here
        return () => recog.abort();
    }, []); // ← empty deps: built once, lives forever across navigations

    // Update recognition language whenever app language changes
    useEffect(() => {
        if (recognitionRef.current) {
            recognitionRef.current.lang = speechLang();
        }
    }, [currentLang]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Toggle session on/off ────────────────────────────────────────────────
    const toggleSession = useCallback((e) => {
        e.stopPropagation();

        if (isActive) {
            // Turn OFF
            shouldRestartRef.current = false;
            setIsActive(false);
            recognitionRef.current?.abort();
            window.speechSynthesis.cancel();
            setBubbleVisible(false);
            setPhase('idle');
        } else {
            // Turn ON — start continuous session
            shouldRestartRef.current = true;
            setIsActive(true);

            // Set language before starting
            if (recognitionRef.current) {
                recognitionRef.current.lang = speechLang();
            }

            const welcome = isHindi() ? WELCOME_HI : WELCOME_EN;
            say(welcome, 4000);
            // Start listening after welcome finishes
            setTimeout(() => {
                if (shouldRestartRef.current && recognitionRef.current) {
                    try { recognitionRef.current.start(); } catch { /* */ }
                }
            }, 4200);
        }
    }, [isActive, say]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!supported) return null;

    const isListening = phase === 'listening';

    return (
        <>
            {bubbleVisible && (
                <div
                    className={`va-bubble va-bubble--visible`}
                    aria-live="polite"
                    aria-atomic="true"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="va-bubble__icon">
                        {isListening
                            ? <span className="va-waveform"><span /><span /><span /><span /><span /></span>
                            : <span className="va-bot-icon">🤖</span>
                        }
                    </div>
                    <p className="va-bubble__text">{message}</p>
                    <button
                        className="va-bubble__close"
                        onClick={(e) => {
                            e.stopPropagation();
                            shouldRestartRef.current = false;
                            setIsActive(false);
                            setBubbleVisible(false);
                            recognitionRef.current?.abort();
                            window.speechSynthesis.cancel();
                            setPhase('idle');
                        }}
                        aria-label="Close voice assistant"
                    >
                        <X size={14} />
                    </button>
                </div>
            )}

            <button
                className={`va-fab ${isActive ? (isListening ? 'va-fab--listening' : 'va-fab--active') : ''}`}
                onClick={toggleSession}
                aria-label={isActive ? 'Stop voice assistant' : 'Start voice assistant'}
                title={isActive ? 'Voice assistant is on — tap to turn off' : 'Voice Assistant — tap to start'}
            >
                <span className="va-fab__ring" />
                {isActive ? <MicOff size={26} /> : <Mic size={26} />}
                <span className="va-fab__label">{isActive ? 'Active' : 'Voice'}</span>
            </button>
        </>
    );
}
