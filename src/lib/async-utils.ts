/** Promise wrapper to remove the need for catching errors */
export async function safeCall<T>(promise: Promise<T>) {
  try {
    const data = await promise;

    return {
      success: true,
      data
    };
  } catch (e: any) {
    let error: Error = e;
    let message = 'An unknown error occurred';

    if (e && e instanceof Error) message = e.message;

    return {
      success: false,
      data: null,
      error,
      message
    }
  }
}