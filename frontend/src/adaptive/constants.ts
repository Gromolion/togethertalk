const mobileMax = "767px";
const tabletMin = "768px";
const tabletIntermediate = "1152px";
const tabletMax = "1271px";
const desktopMin = "1272px";
const extra = "1920px";

export const MEDIA_SCREEN_MOBILE = `screen and (max-width: ${mobileMax})`;
export const MEDIA_SCREEN_TABLET = `screen and (min-width: ${tabletMin}) and (max-width: ${tabletMax})`;
export const MEDIA_SCREEN_DESKTOP = `screen and (min-width: ${desktopMin})`;
export const MEDIA_SCREEN_EXTRA = `screen and (min-width: ${extra})`;

export const MEDIA_SCREEN_MOBILE_AND_TABLET = `screen and (max-width: ${tabletMax})`;
export const MEDIA_SCREEN_TABLET_AND_DESKTOP = `screen and (min-width: ${tabletMin})`;
export const MEDIA_TABLET_INTERMEDIATE = `screen and (max-width: ${tabletIntermediate})`;

export const PADDING_BOTTOM_MENU_OFFSET = 58;
