export const isWindows = true;
// process.platform === 'win32';
export const isMac = true;
// process.platform === 'darwin';
export const isLinux = true;
// process.platform === 'linux';
export const isDevelopment = true;
// process.env.NODE_ENV === 'development';

export const isCreateTray = isWindows || isLinux || isDevelopment;
export const isCreateMpris = isLinux;
