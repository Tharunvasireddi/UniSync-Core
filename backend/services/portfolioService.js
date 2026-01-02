export class PortfolioService {
  constructor(llmClient) {
    this.llm = llmClient;
  }

  generateFile = async (resumeContent) => {
    try {
      const prompt = `
You are a Senior Frontend Engineer and Professional UI Designer.

Your task is to convert the provided resume information into a complete, modern, and responsive portfolio website.

TECH STACK (STRICT):
- HTML (semantic, accessible)
- CSS (modern, clean, responsive)
- JavaScript (only when necessary)

OUTPUT RULES (MANDATORY):
1. Output MUST be valid JSON only. No explanations, no markdown, no extra text.
2. The JSON must contain exactly three keys:
   - html
   - css
   - javascript
3. Each value must be a STRING containing the full code.
4. Do NOT embed CSS or JavaScript inside the HTML.
5. Do NOT use external libraries, frameworks, or CDNs.
6. Use semantic HTML tags (header, nav, section, article, footer).
7. Ensure mobile responsiveness using Flexbox or CSS Grid.
8. JavaScript should be minimal and optional (smooth scrolling, theme toggle).
9. All content MUST come strictly from the provided resume.
10. Do NOT invent or hallucinate any data.
11. If a resume section is missing, omit it cleanly.

STRUCTURE GUIDELINES:
- Header: Name, title, summary
- Navigation: Only sections that exist in resume
- Sections: About, Skills, Experience, Projects, Education, Contact (if available)
- Footer: Minimal

RESPONSE JSON FORMAT (STRICT):
{
  "html": "<complete index.html code>",
  "css": "<complete style.css code>",
  "javascript": "<complete script.js code>"
}

Here is the user's resume information:
${resumeContent}

Generate the response in the JSON format only.
`;

      const response = await this.llm.generate(prompt);
      return response;
    } catch (error) {
      console.log("error while generating the protfildf :", error);
    }
  };
}
