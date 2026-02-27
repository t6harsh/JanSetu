import { useState } from 'react';
import { Delete, CornerDownLeft, Space, ChevronUp } from 'lucide-react';

const numericKeys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['C', '0', '⌫'],
];

const qwertyRows = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['⇧', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '⌫'],
];

const symbolRows = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['@', '#', '₹', '%', '&', '-', '+', '(', ')', '/'],
    ['!', '"', '\'', ':', ';', ',', '?', '.', '⌫'],
];

export default function VirtualKeyboard({ mode = 'numeric', onKeyPress, onBackspace, onClear, visible = true }) {
    const [shifted, setShifted] = useState(false);
    const [symbols, setSymbols] = useState(false);

    if (!visible) return null;

    const handleKey = (key) => {
        if (key === '⌫') {
            onBackspace?.();
        } else if (key === 'C') {
            onClear?.();
        } else if (key === '⇧') {
            setShifted(!shifted);
        } else if (key === 'SYM') {
            setSymbols(!symbols);
            setShifted(false);
        } else if (key === 'SPACE') {
            onKeyPress?.(' ');
        } else {
            const char = shifted ? key.toUpperCase() : key;
            onKeyPress?.(char);
            if (shifted) setShifted(false);
        }
    };

    if (mode === 'numeric') {
        return (
            <div className="vkb vkb--numeric">
                {numericKeys.map((row, ri) => (
                    <div key={ri} className="vkb__row">
                        {row.map((key) => (
                            <button
                                key={key}
                                className={`vkb__key ${key === '⌫' ? 'vkb__key--action' : ''} ${key === 'C' ? 'vkb__key--clear' : ''}`}
                                onClick={() => handleKey(key)}
                                type="button"
                            >
                                {key === '⌫' ? <Delete size={18} /> : key}
                            </button>
                        ))}
                    </div>
                ))}
            </div>
        );
    }

    // QWERTY mode
    const rows = symbols ? symbolRows : qwertyRows;

    return (
        <div className="vkb vkb--qwerty">
            {rows.map((row, ri) => (
                <div key={ri} className="vkb__row">
                    {row.map((key) => {
                        const display = key === '⇧'
                            ? <ChevronUp size={16} />
                            : key === '⌫'
                                ? <Delete size={16} />
                                : (shifted ? key.toUpperCase() : key);

                        return (
                            <button
                                key={key}
                                className={`vkb__key vkb__key--qwerty ${key === '⌫' ? 'vkb__key--action' : ''} ${key === '⇧' ? (shifted ? 'vkb__key--shift-active' : 'vkb__key--shift') : ''}`}
                                onClick={() => handleKey(key)}
                                type="button"
                            >
                                {display}
                            </button>
                        );
                    })}
                </div>
            ))}
            {/* Bottom row: symbols toggle, space, done */}
            <div className="vkb__row">
                <button className="vkb__key vkb__key--qwerty vkb__key--special" onClick={() => handleKey('SYM')} type="button">
                    {symbols ? 'ABC' : '?123'}
                </button>
                <button className="vkb__key vkb__key--qwerty vkb__key--space" onClick={() => handleKey('SPACE')} type="button">
                    <Space size={16} /> space
                </button>
                <button className="vkb__key vkb__key--qwerty vkb__key--special" onClick={() => handleKey('.')} type="button">
                    .
                </button>
                <button className="vkb__key vkb__key--qwerty vkb__key--special" onClick={() => handleKey(',')} type="button">
                    ,
                </button>
            </div>
        </div>
    );
}
