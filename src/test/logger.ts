/* istanbul ignore next */
export function isDebug(): boolean {
  return process.env.DEBUG_MSW === 'true';
}

/* istanbul ignore next */
export function debug(message: string): void {
  if (isDebug()) {
    console.log(`[DEBUG] ${message}`);
  }
}

/* istanbul ignore next */
export function info(message: string): void {
  console.info(`[INFO] ${message}`);
}

/* istanbul ignore next */
export function notice(message: string): void {
  console.log(`[NOTICE] ${message}`);
}

/* istanbul ignore next */
export function warning(message: string): void {
  console.warn(`[WARNING] ${message}`);
}

/* istanbul ignore next */
export function error(message: string): void {
  console.error(`[ERROR] ${message}`);
}
