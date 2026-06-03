export type SupportedUnit = 'g' | 'kg' | 'mL' | 'L' | 'items';

// Map target units back to their standard storage (base) units
export const UNIT_DIMENSIONS: Record<SupportedUnit, 'weight' | 'volume' | 'count'> = {
  g: 'weight',
  kg: 'weight',
  mL: 'volume',
  L: 'volume',
  items: 'count',
};

export const BASE_UNITS = {
  weight: 'g',
  volume: 'mL',
  count: 'items',
} as const;

// Conversion multiplier to get base unit from target unit
// E.g., 1 kg = 1000 g (base unit)
export function getBaseMultiplier(unit: SupportedUnit): number {
  switch (unit) {
    case 'kg':
      return 1000;
    case 'L':
      return 1000;
    case 'g':
    case 'mL':
    case 'items':
    default:
      return 1;
  }
}

/**
 * Convert user input quantity & unit to standard base quantity stored in DB.
 */
export function convertToBaseQty(qty: number, unit: SupportedUnit): number {
  return qty * getBaseMultiplier(unit);
}

/**
 * Convert stored base quantity from DB to target display unit.
 */
export function convertFromBaseQty(baseQty: number, unit: SupportedUnit): number {
  return baseQty / getBaseMultiplier(unit);
}

/**
 * Convert raw base unit price (INR per g/mL/item) to display price for target unit.
 */
export function getUnitPriceForUnit(pricePerBaseUnit: number, unit: SupportedUnit): number {
  return pricePerBaseUnit * getBaseMultiplier(unit);
}

/**
 * Calculates total price directly using unit price & quantity entered.
 */
export function calculateTotalPrice(qty: number, unit: SupportedUnit, pricePerBaseUnit: number): number {
  const baseQty = convertToBaseQty(qty, unit);
  return baseQty * pricePerBaseUnit;
}