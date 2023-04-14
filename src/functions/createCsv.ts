import { oldDataFormat } from "@/pages/api/createOldJSON";
import { DeepRecycle, DeepStory } from "@/types";
import { MapItem, Recycle, Story } from "@prisma/client"

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
 * Creates a csv string from the given data, with the same format as the old one
 * @param data Array of objects to convert to csv
 * @returns A csv-format string
 */
export function createOldCsv(data: oldDataFormat[]) {
  // Get the headers from the first item in the array
  const csvHeaders = Object.keys(data[0]);

  // Set the first line of the csv to be the headers
  let csv: string = csvHeaders.join(",") + "\n";

  // Adds each item to the csv string
  // Each non-null item is surrounded by quotes, and any quotes in the item are replaced with two quotes. This is to ensure that the csv can be parsed correctly.
  data.forEach((item) => {
    csv += csvHeaders.map((header) => !!item[header as keyof oldDataFormat] ? '"' + item[header as keyof oldDataFormat]?.replaceAll('"', '""') + '"' : null).join(",") + "\n";
  });

  return csv;
}

/**
 * Creates a csv string from the given data. Is not actually completely generic, but handles both Story and Recycle types
 * @param data Array of objects to convert to csv
 * @returns A csv-format string
 */
export function createGenericCsv(data: (Story | Recycle)[]) {
  // Get the headers from the first item in the array
  const csvHeaders = Object.keys(data[0]);

  // Set the first line of the csv to be the headers
  // The mapItem field is removed from the headers as it is a separate object
  let csv: string = csvHeaders.join(",").replace(",mapItem", "") + "\n";

  data.forEach((item) => {
    csv += csvHeaders.map((header) => {
      // If the item is a string, it is surrounded by quotes and any quotes in the item are replaced with two quotes. This is to ensure that the csv can be parsed correctly.
      if (typeof item[header as keyof (Story | Recycle)] === "string") {
        return '"' + String(item[header as keyof (Story | Recycle)])?.replaceAll('"', '""') + '"';
      }
      // If the item is not a string, it is just added to the csv, unless it is an object, in which case it is skipped
      else if (typeof item[header as keyof (Story | Recycle)] === "number") {
        return item[header as keyof (Story | Recycle)];
      }
      else if (typeof item[header as keyof (Story | Recycle)] === "boolean") {
        return item[header as keyof (Story | Recycle)];
      }
      else if (item[header as keyof (Story | Recycle)] === null) {
        return null;
      }
    }).join(",") + "\n";
    // If the csv ends with a comma, it is removed to avoid an empty column at the end of the csv
    if (csv.endsWith(",\n")) csv = csv.slice(0, -2) + "\n";
  });

  return csv;
}

/**
 * Creates a csv string from the mapItem field of the given data.
 * @param data Array of objects to convert to csv
 * @returns A csv-format string
 */
export function createMapItemCsv(data: (DeepRecycle | DeepStory)[]) {
  // Extract the mapItem field from each item in the array
  let mapItems = data.map((item) => {
    return item.mapItem;
  }).sort((a, b) => a.id - b.id);

  // Get the headers from the first mapItem
  const csvHeaders = Object.keys(mapItems[0]);

  let csv: string = csvHeaders.join(",") + "\n";

  mapItems.forEach((item) => {
    csv += csvHeaders.map((header) => {
      // If the item is a string, it is surrounded by quotes and any quotes in the item are replaced with two quotes. This is to ensure that the csv can be parsed correctly.
      if (typeof item[header as keyof MapItem] === "string") {
        return '"' + String(item[header as keyof MapItem])?.replaceAll('"', '""') + '"';
      }
      // If the item is not a string, it is just added to the csv.
      else if (typeof item[header as keyof MapItem] === "number") {
        return item[header as keyof MapItem];
      }
      else if (typeof item[header as keyof MapItem] === "boolean") {
        return item[header as keyof MapItem];
      }
      else if (item[header as keyof MapItem] === null) {
        return null;
      }
    }).join(",") + "\n";
  });

  return csv;
}