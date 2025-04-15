declare global {
  interface Window {
    xDataCategory: () => any;
    filterProducts?: (filters: { categories: number[] }) => void;
  }
}

export default function xDataCategory() {
  return {
  
  };
}

window.xDataCategory = xDataCategory;
