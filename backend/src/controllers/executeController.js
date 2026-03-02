// Judge0 CE API - free, reliable code execution service
const JUDGE0_API = "https://ce.judge0.com";

// Judge0 language IDs: https://ce.judge0.com/languages
const LANGUAGE_IDS = {
    javascript: 63, // JavaScript (Node.js 12.14.0)
    python: 71,     // Python (3.8.1)
    java: 62,       // Java (OpenJDK 13.0.1)
    cpp: 54,        // C++ (GCC 9.2.0)
};

export async function executeCode(req, res) {
    try {
        const { language, code } = req.body;

        if (!language || !code) {
            return res.status(400).json({
                success: false,
                error: "Language and code are required",
            });
        }

        const languageId = LANGUAGE_IDS[language];

        if (!languageId) {
            return res.status(400).json({
                success: false,
                error: `Unsupported language: ${language}`,
            });
        }

        // Submit code and wait for result in one call
        const response = await fetch(
            `${JUDGE0_API}/submissions?base64_encoded=false&wait=true`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    source_code: code,
                    language_id: languageId,
                }),
            }
        );

        if (!response.ok) {
            return res.status(response.status).json({
                success: false,
                error: `Judge0 API error! status: ${response.status}`,
            });
        }

        const data = await response.json();

        const stdout = data.stdout || "";
        const stderr = data.stderr || "";
        const compileOutput = data.compile_output || "";

        // Compilation error
        if (data.status?.id === 6) {
            return res.json({
                success: false,
                output: compileOutput,
                error: compileOutput,
            });
        }

        // Runtime error
        if (stderr) {
            return res.json({
                success: false,
                output: stdout,
                error: stderr,
            });
        }

        return res.json({
            success: true,
            output: stdout || "No output",
        });
    } catch (error) {
        console.error("Error in executeCode controller:", error.message);
        return res.status(500).json({
            success: false,
            error: `Failed to execute code: ${error.message}`,
        });
    }
}
