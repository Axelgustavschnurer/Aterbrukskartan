import { oldDataFormat } from "@/pages/api/createOldJSON";

/**
 * Downloads a csv file with the given data and filename
 * @param csv The csv data to download (actually accepts any string)
 * @param filename The name of the file to download
 */
export function downloadCsv(csv: string, filename: string) {
  // Create a blob of the data
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);

  // Create a link element, hide it, direct it towards the blob, and then 'click' it programatically
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * Creates a csv string from the given data
 * @param data Array of objects to convert to csv
 * @returns A csv-format string
 */
export function createCsv(data: oldDataFormat[]) {
  const csvHeaders = Object.keys(data[0]);

  let csv: string = csvHeaders.join("|") + "\n";

  data.forEach((item) => {
    csv += csvHeaders.map((header) => item[header as keyof oldDataFormat]?.replaceAll("\n", "\\n")).join("|") + "\n";
  });

  return csv;
}