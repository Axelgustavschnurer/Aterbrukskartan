import { oldDataFormat } from "@/pages/api/createOldJSON";

// TODO: Comment this file

export function downloadCsv(csv: string, filename: string) {
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function createCsv(data: oldDataFormat[]) {
  // const csvHeaders = [
  //   "id",
  //   "name",
  //   "organisation",
  //   "year",
  //   "coordinates",
  //   "address",
  //   "postal code",
  //   "city",
  //   "category_swedish",
  //   "category_english",
  //   "utbildningsprogram",
  //   "description_swedish",
  //   "description_english",
  //   "description_swedish_short",
  //   "description_english_short",
  //   "open data",
  //   "energy stories",
  //   "reports",
  //   "videos",
  //   "pdfcase",
  // ]

  const csvHeaders = Object.keys(data[0]);

  let csv: string = csvHeaders.join("|") + "\n";

  data.forEach((item) => {
    csv += csvHeaders.map((header) => item[header as keyof oldDataFormat]?.replaceAll("\n", "\\n")).join("|") + "\n";
  });

  return csv;
}