import * as core from '@actions/core';

export type Logger = {
  isDebug: typeof isDebug;
  debug: typeof debug;
  info: typeof info;
  notice: typeof notice;
  warning: typeof warning;
  error: typeof error;
};

/* istanbul ignore next */
export function isDebug(): boolean {
  return core.isDebug();
}

/* istanbul ignore next */
export function debug(message: string): void {
  core.debug(message);
}

/* istanbul ignore next */
export function info(message: string): void {
  core.info(message);
}

/* istanbul ignore next */
export function notice(
  message: string,
  properties?: core.AnnotationProperties,
): void {
  core.notice(message, properties);
}

/* istanbul ignore next */
export function warning(
  message: string,
  properties?: core.AnnotationProperties,
): void {
  core.warning(message, properties);
}

/* istanbul ignore next */
export function error(
  message: string,
  properties?: core.AnnotationProperties,
): void {
  core.error(message, properties);
}
