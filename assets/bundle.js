function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}
typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

function toCssUrl(str) {
    return `url(${str})`;
}
function createAvatarCss(params) {
    const base = toCssUrl(params.base);
    const eyes = params.eyes ? toCssUrl(params.eyes) : base;
    const eyesAlt = params.eyesAlt ? toCssUrl(params.eyesAlt) : 'none';
    const speaking = params.speaking ? toCssUrl(params.speaking) : 'none';
    return `body {
  overflow: hidden;
}
li {
  left: -9999px;
  height: ${params.size.height}px !important;
  position: absolute;
  top: 0;
  width: ${params.size.width}px;
}
li img {
  border-radius: 0% !important;
  border-width: 0 !important;
  height: 100% !important;
  width: 100% !important;
}
li div span {
  display: none;
}

li img[src*="${params.discordUserId}"] {
  content: ${base};
  left: 9999px;
  position: absolute;
}
li img[src*="${params.discordUserId}"] + div {
  animation: blink 10s step-end 0s infinite normal;
  height: 100%;
  left: 9999px;
  position: absolute;
  top: 0;
  width: 100%;
}

@keyframes blink {
  0% { background-image: none; }

  31% { background-image: ${eyes}; }
  33% { background-image: none; }
  35% { background-image: ${eyes}; }
  37% { background-image: none; }

  71% { background-image: ${eyes}; }
  73% { background-image: none; }
  75% { background-image: ${eyes}; }
  77% { background-image: none; }

  90% { background-image: none; }
  92% { background-image: ${eyesAlt}; }
  98% { background-image: ${eyes}; }
}

li img[src*="${params.discordUserId}"][class*="Speaking"] + div::before {
  animation: speak 300ms step-end 0s infinite normal;
  background-image: ${speaking};
  content: '';
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
}

@keyframes speak {
  0% { background-image: ${speaking}; }
  50% { background-image: none; }
  100% { background-image: ${speaking}; }
}`;
}

function injectStyleElement(win) {
    const elem = win.document.querySelector('style[data-preview]');
    if (elem) {
        return elem;
    }
    const newElem = win.document.createElement('style');
    newElem.dataset.preview = '';
    win.document.head.appendChild(newElem);
    return newElem;
}
function updatePreview(elem, params) {
    const win = elem.contentWindow;
    const styleElem = injectStyleElement(win);
    styleElem.textContent =
        '.tp-dfwv {display: block !important;} ' +
            createAvatarCss(Object.assign(Object.assign({}, params), { discordUserId: 'ukon' }));
}
function clearPreview(elem) {
    const win = elem.contentWindow;
    const styleElem = injectStyleElement(win);
    styleElem.textContent = '';
}

function computeImageSize(src) {
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
function setUpExample() {
    return __awaiter(this, void 0, void 0, function* () {
        const base = 'assets/ukon/base.png';
        const size = yield computeImageSize(base);
        const previewElem = document.querySelector('.hero iframe');
        const params = {
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
    });
}
function getFields() {
    return {
        base: document.querySelector('input[name="image_base"]'),
        eyes1: document.querySelector('input[name="image_eyes_1"]'),
        eyes2: document.querySelector('input[name="image_eyes_2"]'),
        speaking: document.querySelector('input[name="image_speaking"]'),
        userId: document.querySelector('input[name="user_id"]'),
    };
}
function readForm() {
    const fields = getFields();
    return {
        base: fields.base.value,
        discordUserId: fields.userId.value,
        eyes: fields.eyes1.value || null,
        eyesAlt: fields.eyes2.value || null,
        speaking: fields.speaking.value || null,
    };
}
function applyResult(result, placeholder) {
    const copyButtonElem = document.querySelector('.result_action button');
    copyButtonElem.disabled = !result;
    const resultElem = document.querySelector('textarea');
    resultElem.textContent = result
        ? createAvatarCss(result)
        : placeholder !== null && placeholder !== void 0 ? placeholder : 'アバター用のCSSがここに表示されます。\nすべての必須項目を入力してください。';
    const previewElem = document.querySelector('.result iframe');
    if (result) {
        updatePreview(previewElem, result);
    }
    else {
        clearPreview(previewElem);
    }
}
function applyForm() {
    return __awaiter(this, void 0, void 0, function* () {
        const formElem = document.querySelector('form');
        const valid = formElem === null || formElem === void 0 ? void 0 : formElem.checkValidity();
        if (!valid) {
            formElem === null || formElem === void 0 ? void 0 : formElem.reportValidity();
            applyResult(null);
            return;
        }
        try {
            const fields = readForm();
            const size = yield computeImageSize(fields.base);
            applyResult(Object.assign(Object.assign({}, fields), { size: size }));
        }
        catch (_err) {
            applyResult(null, '画像サイズの取得に失敗しました。\n立ち絵の設定を確認してください。');
        }
    });
}
function setUpCopyButton() {
    const buttonElem = document.querySelector('.result_action button');
    buttonElem.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
        const textareaElem = document.querySelector('textarea');
        try {
            yield navigator.clipboard.writeText(textareaElem.value);
        }
        catch (_err) {
            // Do nothing
        }
    }));
}
{
    setUpExample();
    setUpCopyButton();
    const inputElems = Array.from(document.querySelectorAll('.form input'));
    inputElems.forEach((elem) => {
        elem.addEventListener('change', () => __awaiter(void 0, void 0, void 0, function* () {
            yield applyForm();
        }));
    });
    applyResult(null);
}
