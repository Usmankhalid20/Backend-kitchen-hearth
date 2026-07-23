const OpenAI = require('openai');

const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY || 'dummy_key_for_testing'
});

exports.generateRecipe = async (prompt) => {
    try {
        const completion = await openai.chat.completions.create({
            model: "openai/gpt-oss-20b:free",
            messages: [
                {
                    role: "system",
                    content: "You are an expert chef. Create a recipe based on the user's prompt. You must reply strictly with a JSON object containing the following keys: 'title' (string), 'description' (string), 'prepTime' (string, e.g., '15 mins'), 'cookTime' (string, e.g., '30 mins'), 'servings' (number), 'ingredients' (array of strings), 'instructions' (array of strings)."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7,
        });

        const responseText = completion.choices[0].message.content;
        
        try {
            // Find the first '{' and the last '}' to extract JSON from markdown/text
            const startIdx = responseText.indexOf('{');
            const endIdx = responseText.lastIndexOf('}');
            
            if (startIdx === -1 || endIdx === -1) {
                throw new Error("No JSON object found in response");
            }
            
            const jsonString = responseText.substring(startIdx, endIdx + 1);
            return JSON.parse(jsonString);
        } catch (e) {
            console.error("Failed to parse JSON from OpenAI:", responseText);
            throw new Error("Failed to parse recipe from AI response");
        }
    } catch (error) {
        console.error("OpenAI API error:", error.message || error);
        throw new Error(`AI Service Error: ${error.message || 'Unknown error'}`);
    }
};
