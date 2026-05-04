export interface BulkCodeData {
  campaignName: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  quantity: number;
  prefix: string;
  codeLength: number;
  format: 'alphanumeric' | 'numeric';
  startDate: Date;
  endDate: Date;
  minCart: number;
  usageLimit: number | 'single' | 'unlimited';
}

export interface PromoCode {
  id: string;
  code: string;
  campaignName: string;
  type: 'percentage' | 'fixed';
  value: number;
  startDate: Date;
  endDate: Date;
  minCart: number;
  usageLimit: number; // -1 = illimité
  usageCount: number;
  status: 'active' | 'expired' | 'disabled';
  createdAt: Date;
}

export function generatePromoCode(
  prefix: string,
  length: number,
  format: 'alphanumeric' | 'numeric'
): string {
  const alphanumeric = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Éviter I, O, 0, 1
  const numeric = '0123456789';
  
  const chars = format === 'alphanumeric' ? alphanumeric : numeric;
  let code = prefix;
  
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return code;
}

export function generateBulkPromoCodes(data: BulkCodeData): PromoCode[] {
  const codes: PromoCode[] = [];
  const usedCodes = new Set<string>();
  
  for (let i = 0; i < data.quantity; i++) {
    let code: string;
    let attempts = 0;
    
    // Générer un code unique (max 10 tentatives)
    do {
      code = generatePromoCode(data.prefix, data.codeLength, data.format);
      attempts++;
    } while (usedCodes.has(code) && attempts < 10);
    
    if (attempts >= 10) {
      console.error('Impossible de générer un code unique');
      continue;
    }
    
    usedCodes.add(code);
    
    codes.push({
      id: `code-${i}-${Date.now()}`,
      code,
      campaignName: data.campaignName,
      type: data.discountType,
      value: data.discountValue,
      startDate: data.startDate,
      endDate: data.endDate,
      minCart: data.minCart,
      usageLimit: typeof data.usageLimit === 'string' ? 
        (data.usageLimit === 'single' ? 1 : -1) : 
        data.usageLimit,
      usageCount: 0,
      status: 'active',
      createdAt: new Date(),
    });
  }
  
  return codes;
}
