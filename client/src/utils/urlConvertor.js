export const urlConvertor = (productName) => {
  if (!productName) return '';
  
  // Remove URL fragments/parameters if any exist
  const cleanName = productName.split(/[?#]/)[0];
  
  // Replace special characters and multiple spaces
  return cleanName
    .replace(/[^\w\s-]/g, '')  // Remove special chars
    .trim()                    // Trim whitespace
    .replace(/\s+/g, '_')      // Replace spaces with -
    .replace(/-+/g, '_')       // Replace multiple - with single -
    .toLowerCase();            // Convert to lowercase
};


// const url = urlConvertor(productName);

