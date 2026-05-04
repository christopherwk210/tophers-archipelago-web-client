import { useLocalization } from "./localization-util";

export interface SafePromiseSuccess<T> {
  success: true;
  data: T;
}

export interface SafePromiseError {
  success: false;
  data: null;
  error: Error;
  message: string;
}

/** Promise wrapper to remove the need for try/catch blocks */
export async function safeAsync<T>(promise: Promise<T>): Promise<SafePromiseSuccess<T> | SafePromiseError> {
  const { t } = useLocalization();

  try {
    const data = await promise;

    return {
      success: true,
      data
    };
  } catch (e: any) {
    let error: Error = e;
    let message = t('MiscUI.errorUnknownFull');

    if (e && e instanceof Error) message = e.message;

    return {
      success: false,
      data: null,
      error,
      message
    }
  }
}