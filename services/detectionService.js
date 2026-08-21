const axios = require('axios');
const { workflowSchema } = require('../config/constants');



async function detectWorkflowFromPrompt(userPrompt) {
  if (!userPrompt || typeof userPrompt !== 'string') {
    throw new Error('Invalid or missing userPrompt argument.');
  }

  console.log(`[OpenRouter Processing] Generating workflow for: "${userPrompt.substring(0, 50)}..."`);

  const systemPrompt = `You are an expert AI workflow architect for AutomationFlow.
Your task is to analyze the user's natural language request and parse it into a node-based workflow graph.

CRITICAL INSTRUCTIONS:
1. Dynamically analyze the provided prompt.
2. Identify every trigger, transformation/filter/branch condition, and action step requested by the user.
3. Every node MUST have a "type" field set strictly to one of: "trigger", "transform", or "action".
   - Use "trigger" for initial webhooks/events.
   - Use "transform" for logic, OCR extractions, evaluations, and condition checks.
   - Use "action" for emails, payouts, ticket creation, or external dispatches.
4. Assign unique IDs to every node ("node_1", "node_2") and edge ("edge_1", "edge_2").
5. Link nodes logically using "source" and "target" parameters in the edges array.

REQUIRED JSON FORMAT:
{
  "name": "<Short descriptive title>",
  "nodes": [
    {
      "id": "node_1",
      "type": "trigger",
      "label": "<Clear step description>",
      "config": {}
    }
  ],
  "edges": [
    {
      "id": "edge_1",
      "source": "node_1",
      "target": "node_2"
    }
  ]
}`;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Generate a workflow graph for the following scenario: "${userPrompt}"\n\nEnsure the output is ONLY valid JSON.` }
        ],
        temperature: 0.1,
        response_format: { type: 'json_object' }
      },
         {
        headers: {
          'Authorization': `Bearer ${process.env.AI_API_KEY}`,
          'HTTP-Referer': 'https://logicflow07.netlify.app',
          'X-Title': 'AutomationFlow',
          'Content-Type': 'application/json'
        }
      }
    );
        let rawContent = response.data.choices[0].message.content;
    
    // Clean up potential markdown formatting from LLM response
    rawContent = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedWorkflow = JSON.parse(rawContent);

    // DYNAMIC SANITIZATION: Force all non-standard node types to valid enum values
    if (parsedWorkflow && Array.isArray(parsedWorkflow.nodes)) {
      const allowedTypes = ['trigger', 'transform', 'action'];
      
      parsedWorkflow.nodes = parsedWorkflow.nodes.map(node => {
        if (!allowedTypes.includes(node.type)) {
          // Default any condition/filter/decision nodes outputted by LLM to 'transform'
          node.type = 'transform';
        }
        return node;
      });
    }

    // Validate sanitized object against Zod schema
    const validatedWorkflow = workflowSchema.parse(parsedWorkflow);
    return validatedWorkflow;

  } catch (error) {
    console.error('LLM Workflow Detection Error:', error.response?.data || error.message);
    throw new Error(`Failed to generate workflow from prompt: ${error.message}`);
  }
}

module.exports = {
  detectWorkflowFromPrompt,
  detectWorkflow: detectWorkflowFromPrompt
};
