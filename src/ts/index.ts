import {createAvatarCss} from './avatar-css.js';
import {AvatarParams, Size} from './avatar.js';
import {clearPreview, updatePreview} from './preview.js';

function computeImageSize(src: string): Promise<Size> {
	const img = new Image();
	img.src = src;

	return new Promise((resolve, reject) => {
		img.addEventListener('load', () => {
			resolve({
				height: img.height,
				width: img.width,
			});
		});
		img.addEventListener('error', () => {
			reject();
		});
	});
}

async function setUpExample(): Promise<void> {
	const base = 'assets/ukon/base.png';
	const size = await computeImageSize(base);

	const previewElem = document.querySelector(
		'.hero iframe',
	) as HTMLIFrameElement;
	const params: Omit<AvatarParams, 'discordUserId'> = {
		base: base,
		eyesAlt: 'assets/ukon/eyes-2.png',
		eyes: 'assets/ukon/eyes-1.png',
		size: size,
		speaking: 'assets/ukon/speaking.png',
	};

	previewElem.addEventListener('load', () => {
		updatePreview(previewElem, params);
	});
	updatePreview(previewElem, params);
}

function getFields() {
	return {
		base: document.querySelector(
			'input[name="image_base"]',
		) as HTMLInputElement,
		eyes1: document.querySelector(
			'input[name="image_eyes_1"]',
		) as HTMLInputElement,
		eyes2: document.querySelector(
			'input[name="image_eyes_2"]',
		) as HTMLInputElement,
		speaking: document.querySelector(
			'input[name="image_speaking"]',
		) as HTMLInputElement,
		userId: document.querySelector('input[name="user_id"]') as HTMLInputElement,
	};
}

function readForm(): Omit<AvatarParams, 'size'> {
	const fields = getFields();
	return {
		base: fields.base.value,
		discordUserId: fields.userId.value,
		eyes: fields.eyes1.value || null,
		eyesAlt: fields.eyes2.value || null,
		speaking: fields.speaking.value || null,
	};
}

function applyResult(result: AvatarParams | null, placeholder?: string): void {
	const copyButtonElem = document.querySelector(
		'.result_action button',
	) as HTMLButtonElement;
	copyButtonElem.disabled = !result;

	const resultElem = document.querySelector('textarea') as HTMLTextAreaElement;
	resultElem.textContent = result
		? createAvatarCss(result)
		: placeholder ??
		  'アバター用のCSSがここに表示されます。\nすべての必須項目を入力してください。';

	const previewElem = document.querySelector(
		'.result iframe',
	) as HTMLIFrameElement;
	if (result) {
		updatePreview(previewElem, result);
	} else {
		clearPreview(previewElem);
	}
}

async function applyForm(): Promise<void> {
	const formElem = document.querySelector('form');
	const valid = formElem?.checkValidity();
	if (!valid) {
		formElem?.reportValidity();
		applyResult(null);
		return;
	}

	try {
		const fields = readForm();
		const size = await computeImageSize(fields.base);
		applyResult({
			...fields,
			size: size,
		});
	} catch (_err) {
		applyResult(
			null,
			'画像サイズの取得に失敗しました。\n立ち絵の設定を確認してください。',
		);
	}
}

function setUpCopyButton() {
	const buttonElem = document.querySelector(
		'.result_action button',
	) as HTMLButtonElement;
	buttonElem.addEventListener('click', async () => {
		const textareaElem = document.querySelector(
			'textarea',
		) as HTMLTextAreaElement;

		try {
			await navigator.clipboard.writeText(textareaElem.value);
		} catch (_err) {
			// Do nothing
		}
	});
}

{
	setUpExample();
	setUpCopyButton();

	const formElem = document.querySelector('form');
	formElem?.addEventListener('submit', async (ev) => {
		ev.preventDefault();

		await applyForm();
	});
	applyResult(null);
}
