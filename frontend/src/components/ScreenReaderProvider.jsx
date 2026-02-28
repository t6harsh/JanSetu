import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const ScreenReaderContext = createContext();

export function useScreenReader() {
    return useContext(ScreenReaderContext);
}

export default function ScreenReaderProvider({ children }) {
    const { i18n } = useTranslation();
    const [enabled, setEnabled] = useState(false);
    const [speaking, setSpeaking] = useState(false);
    const [highlightedEl, setHighlightedEl] = useState(null);
    const [voices, setVoices] = useState([]);
    const synthRef = useRef(null);
    // Use a ref for current language so speak() always sees the latest value
    const langRef = useRef(i18n.language);

    // Keep langRef in sync
    useEffect(() => {
        langRef.current = i18n.language;
    }, [i18n.language]);

    // Get the SpeechSynthesis instance and load voices
    useEffect(() => {
        synthRef.current = window.speechSynthesis;

        const loadVoices = () => {
            const available = synthRef.current.getVoices();
            if (available.length > 0) {
                setVoices(available);
            }
        };

        loadVoices();
        speechSynthesis.addEventListener('voiceschanged', loadVoices);

        return () => {
            speechSynthesis.removeEventListener('voiceschanged', loadVoices);
            if (synthRef.current) synthRef.current.cancel();
        };
    }, []);

    // Choose the best voice for a given language code
    const pickVoice = useCallback((lang) => {
        if (voices.length === 0) return null;

        if (lang === 'hi') {
            return (
                voices.find(v => v.lang === 'hi-IN') ||
                voices.find(v => v.lang.startsWith('hi')) ||
                voices.find(v => v.name.toLowerCase().includes('hindi')) ||
                voices.find(v => v.name.toLowerCase().includes('google') && v.lang.startsWith('hi')) ||
                null
            );
        }

        return (
            voices.find(v => v.lang === 'en-IN') ||
            voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('google')) ||
            voices.find(v => v.lang.startsWith('en')) ||
            null
        );
    }, [voices]);

    // Core speak function — always reads langRef.current for the LIVE language
    const speak = useCallback((text) => {
        if (!synthRef.current || !text || !enabled) return;

        // Chrome bug fix: resume if paused
        if (synthRef.current.paused) synthRef.current.resume();
        synthRef.current.cancel();

        setTimeout(() => {
            const currentLang = langRef.current; // always fresh
            const isHindi = currentLang === 'hi';

            const utterance = new SpeechSynthesisUtterance(text.trim());
            utterance.lang = isHindi ? 'hi-IN' : 'en-IN';

            const voice = pickVoice(isHindi ? 'hi' : 'en');
            if (voice) utterance.voice = voice;

            utterance.rate = 0.92;
            utterance.pitch = 1;
            utterance.volume = 1;

            utterance.onstart = () => setSpeaking(true);
            utterance.onerror = (e) => {
                if (e.error !== 'interrupted') console.warn('TTS error:', e.error);
                setSpeaking(false);
            };

            // Chrome workaround: keep-alive to prevent 15s cutoff
            const keepAlive = setInterval(() => {
                if (!synthRef.current.speaking) { clearInterval(keepAlive); return; }
                synthRef.current.pause();
                synthRef.current.resume();
            }, 10000);

            utterance.onend = () => {
                clearInterval(keepAlive);
                setSpeaking(false);
            };

            synthRef.current.speak(utterance);
        }, 50);
    }, [enabled, pickVoice]);

    const stop = useCallback(() => {
        if (synthRef.current) { synthRef.current.cancel(); setSpeaking(false); }
    }, []);

    const readPage = useCallback(() => {
        const mainEl = document.getElementById('main-content');
        if (!mainEl) return;
        speak(mainEl.innerText);
    }, [speak]);

    const toggle = useCallback(() => {
        setEnabled(prev => {
            const next = !prev;
            if (!next && synthRef.current) { synthRef.current.cancel(); setSpeaking(false); }
            return next;
        });
    }, []);

    // Hover-to-read
    useEffect(() => {
        if (!enabled) { setHighlightedEl(null); return; }

        let lastTarget = null;

        const handleMouseOver = (e) => {
            const target = e.target.closest(
                'button, a, h1, h2, h3, h4, label, p, span, th, td, ' +
                '.bento-card, .lang-card, .panel__title, .auth-btn, ' +
                '.success-screen__title, .admin-stat-card__label, ' +
                '.welcome-hero__greeting, .welcome-hero__subtitle, ' +
                '.admin-stat-card, .uidai-nav-item'
            );
            if (!target || target === lastTarget) return;
            if (target.closest('.sr-control-bar')) return;

            lastTarget = target;
            setHighlightedEl(target);
            const text = target.innerText || target.textContent || target.getAttribute('aria-label');
            if (text && text.trim().length > 0 && text.trim().length < 500) {
                speak(text);
            }
        };

        const handleMouseOut = (e) => {
            const related = e.relatedTarget;
            if (lastTarget && !lastTarget.contains(related)) {
                lastTarget = null;
                setHighlightedEl(null);
            }
        };

        document.addEventListener('mouseover', handleMouseOver, { passive: true });
        document.addEventListener('mouseout', handleMouseOut, { passive: true });
        return () => {
            document.removeEventListener('mouseover', handleMouseOver);
            document.removeEventListener('mouseout', handleMouseOut);
        };
    }, [enabled, speak]);

    // Visual highlight
    useEffect(() => {
        if (!enabled || !highlightedEl) return;
        highlightedEl.classList.add('sr-highlight');
        return () => { highlightedEl.classList.remove('sr-highlight'); };
    }, [highlightedEl, enabled]);

    // Announce when toggled on — uses current language
    useEffect(() => {
        if (!synthRef.current || !enabled) return;

        const timeout = setTimeout(() => {
            const isHindi = langRef.current === 'hi';
            const msg = isHindi
                ? 'स्क्रीन रीडर चालू है। किसी भी तत्व पर माउस ले जाएं उसे पढ़ने के लिए।'
                : 'Screen reader is on. Hover over any element to hear it read aloud.';
            const utterance = new SpeechSynthesisUtterance(msg);
            utterance.lang = isHindi ? 'hi-IN' : 'en-IN';
            const voice = pickVoice(isHindi ? 'hi' : 'en');
            if (voice) utterance.voice = voice;
            utterance.rate = 0.92;
            utterance.volume = 1;
            utterance.onstart = () => setSpeaking(true);
            utterance.onend = () => setSpeaking(false);
            synthRef.current.speak(utterance);
        }, 300);

        return () => clearTimeout(timeout);
    }, [enabled]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <ScreenReaderContext.Provider value={{ enabled, speaking, toggle, speak, stop, readPage }}>
            {children}
        </ScreenReaderContext.Provider>
    );
}
