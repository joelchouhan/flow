// dbRepository.js
const mockWorkflows = new Map();

module.exports = {
  getWorkflow: async (id) => mockWorkflows.get(id) || {
    id,
    nodes: [
      { id: 'step1', type: 'formCreate', payload: { name: '{{trigger.userName}}' } }
    ],
    edges: []
  },
  createWorkflow: async (data) => {
    const id = `wf_${Date.now()}`;
    const workflow = { id, ...data };
    mockWorkflows.set(id, workflow);
    return workflow;
  },
  listWorkflows: async () => Array.from(mockWorkflows.values()),
  updateWorkflow: async (id, data) => data,
  deleteWorkflow: async (id) => true,
  updateRunStatus: async (workflowId, status) => console.log(`[DB Log] Workflow ${workflowId} status: ${status}`),
  updateStepLog: async (workflowId, stepId, log) => console.log(`[DB Log] Step ${stepId}:`, log),
  getWorkflowRuns: async (workflowId) => []
};