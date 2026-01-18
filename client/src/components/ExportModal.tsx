/**
 * =============================================================================
 * Export Modal Component
 * =============================================================================
 *
 * A beautiful, premium-styled modal for exporting data to various formats.
 * Features custom-styled dropdowns and a polished UI.
 */

import { useState } from "react";
import { exportData, ExportFormat } from "../utils/exportUtils";

interface ExportColumn {
  key: string;
  label: string;
}

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: Record<string, unknown>[];
  columns: ExportColumn[];
  defaultFilename: string;
}

const FORMAT_OPTIONS: { value: ExportFormat; label: string; icon: JSX.Element; description: string }[] = [
  {
    value: "csv",
    label: "CSV",
    description: "Comma-separated values, compatible with most spreadsheet apps",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    value: "excel",
    label: "Excel",
    description: "Microsoft Excel format with styled headers",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM8.5 18L7 16.5l1.5-1.5L7 13.5 8.5 12l1.5 1.5L11.5 12l1.5 1.5-1.5 1.5 1.5 1.5-1.5 1.5-1.5-1.5L8.5 18z"/>
      </svg>
    ),
  },
  {
    value: "tab",
    label: "Tab-Delimited",
    description: "Tab-separated values, great for pasting into tables",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
  },
  {
    value: "json",
    label: "JSON",
    description: "JavaScript Object Notation, ideal for developers",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
];

export function ExportModal({
  isOpen,
  onClose,
  title,
  data,
  columns,
  defaultFilename,
}: ExportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat | null>(null);
  const [filename, setFilename] = useState(defaultFilename);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    if (!selectedFormat) return;

    setIsExporting(true);
    try {
      // Small delay to show animation
      await new Promise((resolve) => setTimeout(resolve, 300));
      exportData({
        filename,
        format: selectedFormat,
        data,
        columns,
      });
      setExportSuccess(true);
      setTimeout(() => {
        setExportSuccess(false);
        onClose();
        setSelectedFormat(null);
      }, 1500);
    } finally {
      setIsExporting(false);
    }
  };

  const handleClose = () => {
    onClose();
    setSelectedFormat(null);
    setExportSuccess(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 dark:bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg bg-white dark:bg-midnight-900 border border-black/10 dark:border-white/20 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="px-6 py-4 border-b border-black/10 dark:border-white/10 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-midnight-800/50 dark:to-midnight-900/50">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-electric-blue-500/10 text-electric-blue-600 dark:text-electric-blue-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Export {title}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {data.length} record{data.length !== 1 ? "s" : ""} ready to export
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Success State */}
          {exportSuccess ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neon-green-500/20 text-neon-green-500 mb-4 animate-pulse">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Export Complete!
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                Your file has been downloaded.
              </p>
            </div>
          ) : (
            <>
              {/* Filename Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Filename
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-midnight-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:border-electric-blue-500 focus:ring-2 focus:ring-electric-blue-500/20 transition-all"
                    placeholder="Enter filename"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                    .{selectedFormat || "???"}
                  </span>
                </div>
              </div>

              {/* Format Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  Export Format
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {FORMAT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedFormat(option.value)}
                      className={`relative p-4 rounded-xl border-2 text-left transition-all group ${
                        selectedFormat === option.value
                          ? "border-electric-blue-500 bg-electric-blue-500/10 dark:bg-electric-blue-500/20"
                          : "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-midnight-800 hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-100 dark:hover:bg-midnight-700"
                      }`}
                    >
                      {/* Selected indicator */}
                      {selectedFormat === option.value && (
                        <div className="absolute top-2 right-2">
                          <div className="w-5 h-5 rounded-full bg-electric-blue-500 flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                      )}

                      <div className={`mb-2 ${
                        selectedFormat === option.value
                          ? "text-electric-blue-600 dark:text-electric-blue-400"
                          : "text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300"
                      }`}>
                        {option.icon}
                      </div>
                      <div className={`font-bold text-sm ${
                        selectedFormat === option.value
                          ? "text-electric-blue-600 dark:text-electric-blue-400"
                          : "text-slate-900 dark:text-white"
                      }`}>
                        {option.label}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {option.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Data Preview */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Preview
                  </label>
                  <span className="text-xs text-slate-400">
                    Showing first 3 rows
                  </span>
                </div>
                <div className="bg-slate-50 dark:bg-midnight-800 rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-slate-100 dark:bg-midnight-900">
                        <tr>
                          {columns.slice(0, 4).map((col) => (
                            <th
                              key={col.key}
                              className="px-3 py-2 text-left font-medium text-slate-600 dark:text-slate-400 truncate max-w-[100px]"
                            >
                              {col.label}
                            </th>
                          ))}
                          {columns.length > 4 && (
                            <th className="px-3 py-2 text-left font-medium text-slate-400">
                              +{columns.length - 4} more
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                        {data.slice(0, 3).map((row, i) => (
                          <tr key={i}>
                            {columns.slice(0, 4).map((col) => (
                              <td
                                key={col.key}
                                className="px-3 py-2 text-slate-700 dark:text-slate-300 truncate max-w-[100px]"
                              >
                                {String(row[col.key] ?? "—")}
                              </td>
                            ))}
                            {columns.length > 4 && (
                              <td className="px-3 py-2 text-slate-400">...</td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!exportSuccess && (
          <div className="px-6 py-4 border-t border-black/10 dark:border-white/10 bg-slate-50 dark:bg-midnight-800/50 flex justify-end gap-3">
            <button
              onClick={handleClose}
              className="px-5 py-2.5 rounded-xl font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={!selectedFormat || !filename || isExporting}
              className="px-6 py-2.5 rounded-xl font-bold bg-electric-blue-600 text-white shadow-lg shadow-electric-blue-600/25 hover:bg-electric-blue-500 hover:shadow-electric-blue-600/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-electric-blue-600/25 transition-all flex items-center gap-2"
            >
              {isExporting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Exporting...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export Data
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
