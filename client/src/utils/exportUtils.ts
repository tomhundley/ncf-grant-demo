/**
 * =============================================================================
 * Export Utilities
 * =============================================================================
 *
 * Utility functions for exporting data to various formats:
 * CSV, Excel (XLSX), Tab-delimited, and JSON
 */

type ExportFormat = 'csv' | 'excel' | 'tab' | 'json';

interface ExportOptions {
  filename: string;
  format: ExportFormat;
  data: Record<string, unknown>[];
  columns?: { key: string; label: string }[];
}

/**
 * Escape a value for CSV format
 */
function escapeCSV(value: unknown): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  // If the value contains a comma, newline, or quote, wrap it in quotes
  if (str.includes(',') || str.includes('\n') || str.includes('"')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Convert data to CSV format
 */
function toCSV(data: Record<string, unknown>[], columns?: { key: string; label: string }[]): string {
  if (data.length === 0) return '';

  const headers = columns?.map(c => c.label) || Object.keys(data[0]);
  const keys = columns?.map(c => c.key) || Object.keys(data[0]);

  const headerRow = headers.map(escapeCSV).join(',');
  const dataRows = data.map(row =>
    keys.map(key => escapeCSV(row[key])).join(',')
  );

  return [headerRow, ...dataRows].join('\n');
}

/**
 * Convert data to Tab-delimited format
 */
function toTabDelimited(data: Record<string, unknown>[], columns?: { key: string; label: string }[]): string {
  if (data.length === 0) return '';

  const headers = columns?.map(c => c.label) || Object.keys(data[0]);
  const keys = columns?.map(c => c.key) || Object.keys(data[0]);

  const headerRow = headers.join('\t');
  const dataRows = data.map(row =>
    keys.map(key => {
      const val = row[key];
      if (val === null || val === undefined) return '';
      return String(val).replace(/\t/g, ' ').replace(/\n/g, ' ');
    }).join('\t')
  );

  return [headerRow, ...dataRows].join('\n');
}

/**
 * Convert data to JSON format
 */
function toJSON(data: Record<string, unknown>[]): string {
  return JSON.stringify(data, null, 2);
}

/**
 * Convert data to Excel XML format (compatible with Excel)
 */
function toExcelXML(data: Record<string, unknown>[], columns?: { key: string; label: string }[]): string {
  if (data.length === 0) return '';

  const headers = columns?.map(c => c.label) || Object.keys(data[0]);
  const keys = columns?.map(c => c.key) || Object.keys(data[0]);

  const escapeXML = (str: string) => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  const headerCells = headers.map(h =>
    `<Cell ss:StyleID="Header"><Data ss:Type="String">${escapeXML(h)}</Data></Cell>`
  ).join('');

  const dataRows = data.map(row => {
    const cells = keys.map(key => {
      const val = row[key];
      if (val === null || val === undefined) {
        return '<Cell><Data ss:Type="String"></Data></Cell>';
      }
      const isNumber = typeof val === 'number' || (typeof val === 'string' && !isNaN(Number(val)) && val.trim() !== '');
      const type = isNumber ? 'Number' : 'String';
      return `<Cell><Data ss:Type="${type}">${escapeXML(String(val))}</Data></Cell>`;
    }).join('');
    return `<Row>${cells}</Row>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Styles>
    <Style ss:ID="Header">
      <Font ss:Bold="1" ss:Color="#FFFFFF"/>
      <Interior ss:Color="#3B82F6" ss:Pattern="Solid"/>
      <Alignment ss:Horizontal="Center"/>
    </Style>
  </Styles>
  <Worksheet ss:Name="Data">
    <Table>
      <Row>${headerCells}</Row>
      ${dataRows}
    </Table>
  </Worksheet>
</Workbook>`;
}

/**
 * Download a file with the given content
 */
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export data to the specified format
 */
export function exportData({ filename, format, data, columns }: ExportOptions): void {
  let content: string;
  let mimeType: string;
  let extension: string;

  switch (format) {
    case 'csv':
      content = toCSV(data, columns);
      mimeType = 'text/csv;charset=utf-8';
      extension = 'csv';
      break;
    case 'excel':
      content = toExcelXML(data, columns);
      mimeType = 'application/vnd.ms-excel';
      extension = 'xls';
      break;
    case 'tab':
      content = toTabDelimited(data, columns);
      mimeType = 'text/tab-separated-values;charset=utf-8';
      extension = 'tsv';
      break;
    case 'json':
      content = toJSON(data);
      mimeType = 'application/json;charset=utf-8';
      extension = 'json';
      break;
    default:
      throw new Error(`Unknown format: ${format}`);
  }

  downloadFile(content, `${filename}.${extension}`, mimeType);
}

export type { ExportFormat, ExportOptions };
