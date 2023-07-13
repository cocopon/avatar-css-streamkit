import {AvatarParams} from './avatar';
import {createAvatarCss} from './avatar-css';

function injectStyleElement(win: Window): HTMLStyleElement {
	const elem = win.document.querySelector(
		'style[data-preview]',
	) as HTMLStyleElement;
	if (elem) {
		return elem;
	}

	const newElem = win.document.createElement('style');
	newElem.dataset.preview = '';
	win.document.head.appendChild(newElem);
	return newElem;
}

export function updatePreview(
	elem: HTMLIFrameElement,
	params: Omit<AvatarParams, 'discordUserId'>,
): void {
	const win = elem.contentWindow as Window;
	const styleElem = injectStyleElement(win);
	styleElem.textContent =
		'.tp-dfwv {display: block !important;} ' +
		createAvatarCss({
			...params,
			discordUserId: 'ukon',
		});
}

export function clearPreview(elem: HTMLIFrameElement): void {
	const win = elem.contentWindow as Window;
	const styleElem = injectStyleElement(win);
	styleElem.textContent = '';
}
