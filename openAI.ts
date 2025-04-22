//file for chatGPT api calls

const apiKey = "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"

export async function getChatGPTResponse(prompt: string, apiKey: string): Promise<string> {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }]
      })
    });
  
    const data = await response.json();
  
    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content.trim();
    } else {
      throw new Error("No response from ChatGPT");
    }
}