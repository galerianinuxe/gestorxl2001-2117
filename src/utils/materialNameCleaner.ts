// Utility function to clean material names by removing trailing "0" characters
export const cleanMaterialName = (materialName: string): string => {
  if (!materialName || typeof materialName !== 'string') {
    return materialName;
  }
  
  // Remove trailing "0" characters from the material name
  // This handles cases where the name gets corrupted with extra zeros
  let cleanedName = materialName.trim();
  
  // Remove trailing zeros that are directly attached to text (e.g., "Alum chap0" -> "Alum chap")
  // But don't remove zeros that are part of meaningful names like "H2O" or numbers like "100"
  // Only remove if the zero is at the very end and preceded by a letter
  if (cleanedName.length > 1 && cleanedName.endsWith('0')) {
    const secondToLast = cleanedName[cleanedName.length - 2];
    // Only remove if the character before '0' is a letter (not a number)
    if (/[a-zA-Z\s]/.test(secondToLast)) {
      cleanedName = cleanedName.slice(0, -1).trim();
    }
  }
  
  return cleanedName;
};

// Function to clean all material names in order items
export const cleanOrderItemNames = (items: any[]): any[] => {
  if (!items || !Array.isArray(items)) {
    return items;
  }
  
  return items.map(item => ({
    ...item,
    materialName: cleanMaterialName(item.materialName)
  }));
};
