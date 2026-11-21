import { useEffect, useRef } from 'react';

// Shared dialog behaviour: move focus in when opened, close on Escape,
// and return focus to whatever was focused before when it closes.
export function useDialogFocus(isOpen, initialFocusRef, onClose) {
    const onCloseRef = useRef(onClose);

    useEffect(() => {
        onCloseRef.current = onClose;
    });

    useEffect(() => {
        if (!isOpen) return undefined;
        const previous = document.activeElement;
        const frame = requestAnimationFrame(() => initialFocusRef.current?.focus());
        const onKeyDown = (event) => {
            if (event.key === 'Escape') onCloseRef.current?.();
        };
        document.addEventListener('keydown', onKeyDown);
        return () => {
            cancelAnimationFrame(frame);
            document.removeEventListener('keydown', onKeyDown);
            if (previous instanceof HTMLElement && document.contains(previous)) previous.focus();
        };
    }, [isOpen, initialFocusRef]);
}
