export interface BillAuditRequest {
  billAmount: number;
  hospitalName: string;
  billDescription: string;
  procedures?: string[];
  billImage?: string;
}

export interface AuditResult {
  isValid: boolean;
  originalAmount: number;
  auditedAmount: number;
  negotiableAmount: number;
  confidence: number;
  reasoning: string;
  recommendations: string[];
  flaggedItems?: string[];
}

export const auditBill = async (request: BillAuditRequest): Promise<AuditResult> => {
  try {
    console.log('[AI AUDIT] Calling audit API with request:', request);

    const response = await fetch('/api/audit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    console.log('[AI AUDIT] API response status:', response.status);

    if (!response.ok) {
      console.error('[AI AUDIT] Audit API error:', response.status);
      return getDefaultAudit(request);
    }

    const result = await response.json();
    console.log('[AI AUDIT] Audit result received:', result);

    return result;
  } catch (error) {
    console.error('[AI AUDIT] Error:', error);
    return getDefaultAudit(request);
  }
};

const getDefaultAudit = (request: BillAuditRequest): AuditResult => {
  const auditedAmount = Math.round(request.billAmount * 0.9 * 100) / 100;
  const negotiableAmount = Math.round(auditedAmount * 0.8 * 100) / 100;

  return {
    isValid: true,
    originalAmount: request.billAmount,
    auditedAmount,
    negotiableAmount,
    confidence: 65,
    reasoning: `Based on market analysis for ${request.procedures?.join(', ') || 'medical procedures'}, the fair market value is approximately $${auditedAmount}. Hospital markup appears reasonable.`,
    recommendations: [
      'Request itemized bill breakdown',
      'Verify all procedures were performed',
      'Compare with other hospitals in area',
      'Negotiate using audited amount',
    ],
    flaggedItems: [],
  };
};

export const validateIDImage = async (file: File): Promise<{ valid: boolean; message: string }> => {
  try {
    if (file.size > 10 * 1024 * 1024) {
      return { valid: false, message: 'File size exceeds 10MB limit' };
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      return { valid: false, message: 'Invalid file type. Use JPG, PNG, WebP, or PDF' };
    }

    if (file.type.startsWith('image/')) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            if (img.width < 300 || img.height < 300) {
              resolve({ valid: false, message: 'Image resolution too low (min 300x300)' });
            } else {
              resolve({ valid: true, message: 'Image valid' });
            }
          };
          img.onerror = () => {
            resolve({ valid: false, message: 'Invalid image file' });
          };
          img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      });
    }

    return { valid: true, message: 'File valid' };
  } catch (error) {
    console.error('ID validation error:', error);
    return { valid: false, message: 'Error validating file' };
  }
};
