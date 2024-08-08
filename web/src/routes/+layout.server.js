import { loadFlash, flashCookieOptions } from 'sveltekit-flash-message/server';

flashCookieOptions.sameSite = 'lax';
flashCookieOptions.secure = false;

export const load = loadFlash(async (event) => {
  // ...load function...
});