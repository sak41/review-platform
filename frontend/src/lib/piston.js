

/**
 *  @param {string} language - programming language
 * @param {string} code - source code to execute
 *   @returns {Promise<{success:boolean , output?:string, error?:string}>}
 */
// Proxied through backend to avoid CORS issues
// Backend uses Judge0 CE API (free code execution service)

const API_URL = import.meta.env.VITE_API_URL;

export async function executeCode(language, code) {
  try {
    const response = await fetch(`${API_URL}/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ language, code }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return {
        success: false,
        error: errorData?.error || `HTTP error! status: ${response.status}`,
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      error: `Failed to execute code: ${error.message}`,
    };
  }
}
