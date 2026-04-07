import { atom, useAtom } from "jotai";
import { ReactNode } from "react";

interface OverlayState {
	name: string | null;
	content: ReactNode | null;
}

const overlayAtom = atom<OverlayState>({ name: null, content: null });

export function useOverlay() {
	const [overlay, setOverlayState] = useAtom(overlayAtom);
	const openOverlay = (name: string, content: ReactNode) =>
		setOverlayState({ name, content });
	const closeOverlay = () => setOverlayState({ name: null, content: null });
	return { overlay, openOverlay, closeOverlay };
}
