export const fetchPDF = async (pdfPath: string): Promise<string> => {
  const response = await fetch(pdfPath);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};
