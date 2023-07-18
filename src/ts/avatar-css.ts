import {AvatarParams} from './avatar.js';

function toCssUrl(str: string): string {
	return `url(${str})`;
}

export function createAvatarCss(params: AvatarParams) {
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
