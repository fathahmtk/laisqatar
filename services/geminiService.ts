import { GoogleGenAI } from "@google/genai";
import { Contract, WorkOrder } from "../types";

const GEMINI_API_KEY = process.env.API_KEY || ''; 

// Helper to safely format currency
const formatCurrency = (val: number) => 
  new Intl.NumberFormat('en-QA', { style: 'currency', currency: 'QAR' }).format(val);

export const generateDashboardInsights = async (
  contracts: Contract[],
  workOrders: WorkOrder[]
): Promise<string> => {
  if (!GEMINI_API_KEY) {
    return "AI Insights unavailable: API Key not configured.";
  }

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  
  // Prepare a data summary for the model
  const dataContext = `
    Active Contracts: ${contracts.filter(c => c.status === 'ACTIVE').length}
    Pending Contracts: ${contracts.filter(c => c.status === 'PENDING').length}
    Total Contract Value: ${formatCurrency(contracts.reduce((sum, c) => sum + c.value, 0))}
    
    Open Work Orders: ${workOrders.filter(w => w.status === 'OPEN').length}
    Critical Work Orders: ${workOrders.filter(w => w.priority === 'CRITICAL').length}
    
    Recent Critical Issues:
    ${workOrders.filter(w => w.priority === 'CRITICAL').map(w => `- ${w.title} at ${w.location}`).join('\n')}
  `;

  const prompt = `
    You are an AI Operations Manager for Lais Qatar, a fire safety company.
    Analyze the following operational data and provide a brief, bulleted executive summary (max 3 points) focusing on risks (SLA breaches), revenue opportunities, and resource allocation.
    Tone: Professional, Concise.
    
    Data:
    ${dataContext}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "No insights generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Unable to generate insights at this time.";
  }
};

export const generateTechnicianGuidance = async (workOrder: WorkOrder): Promise<string> => {
    if (!GEMINI_API_KEY) return "AI Guidance unavailable.";

    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    const prompt = `
      Provide a short checklist (max 3 items) for a technician handling a fire safety task.
      Task: ${workOrder.title}
      Type: ${workOrder.priority} priority
      Keep it safety-focused.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text || "No guidance available.";
    } catch (error) {
        return "Guidance system offline.";
    }
}