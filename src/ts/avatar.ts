export interface Size {
	height: number;
	width: number;
}

export interface AvatarParams {
	base: string;
	discordUserId: string;
	size: Size;

	eyes?: string | null;
	eyesAlt?: string | null;
	speaking?: string | null;
}
