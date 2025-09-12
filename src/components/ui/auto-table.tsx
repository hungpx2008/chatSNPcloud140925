
"use client";

import { useState, useEffect } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from 'react-markdown';

interface TableData {
  headers: string[];
  rows: string[][];
}

interface AutoTableProps {
  htmlString: string;
}

const parseHTMLTable = (htmlString: string): TableData | null => {
  if (typeof window === 'undefined') {
    return null; // DOMParser is not available on the server
  }
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const table = doc.querySelector('table');

    if (!table) {
      return null;
    }

    const headers: string[] = [];
    const rows: string[][] = [];

    // Extract headers from <thead>
    const thead = table.querySelector('thead');
    if (thead) {
        thead.querySelectorAll('tr th').forEach(th => {
            headers.push(th.textContent || '');
        });
    }

    // If no <thead>, extract from the first row of the table (could be in <tbody> or just <table>)
    if (headers.length === 0) {
        const firstRowCells = table.querySelectorAll('tr:first-child th, tr:first-child td');
        firstRowCells.forEach(cell => {
            headers.push(cell.textContent || '');
        });
    }

    // Extract rows from <tbody>
    const tbody = table.querySelector('tbody');
    if (tbody) {
        const trs = tbody.querySelectorAll('tr');
        trs.forEach((tr, rowIndex) => {
            // Skip the first row if we already took headers from it and there was no <thead>
            if (headers.length > 0 && !thead && rowIndex === 0) {
                return;
            }
            const row: string[] = [];
            tr.querySelectorAll('td').forEach(td => {
                row.push(td.innerHTML || ''); // Use innerHTML to preserve formatting
            });
            if(row.length > 0) {
                rows.push(row);
            }
        });
    }
    
    return { headers, rows };
  } catch (error) {
    console.error("Failed to parse HTML table:", error);
    return null;
  }
};


export function AutoTable({ htmlString }: AutoTableProps) {
  const [tableData, setTableData] = useState<TableData | null>(null);

  useEffect(() => {
    setTableData(parseHTMLTable(htmlString));
  }, [htmlString]);

  if (!tableData || tableData.headers.length === 0 || tableData.rows.length === 0) {
    // If parsing fails or table is empty, render the original string as markdown
     return <ReactMarkdown>{htmlString}</ReactMarkdown>;
  }

  return (
    <div className="my-4 not-prose">
      <ScrollArea className="max-w-full overflow-x-auto rounded-lg border shadow-md">
        <Table className="min-w-full bg-card">
          <TableHeader className="bg-muted/50">
            <TableRow>
              {tableData.headers.map((header, index) => (
                <TableHead key={index} className="px-4 py-3 font-bold text-muted-foreground whitespace-nowrap">
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.rows.map((row, rowIndex) => (
              <TableRow key={rowIndex} className="hover:bg-muted/30 even:bg-muted/10">
                {row.map((cell, cellIndex) => (
                  <TableCell 
                    key={cellIndex} 
                    className="px-4 py-3 align-top prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0"
                    dangerouslySetInnerHTML={{ __html: cell }}
                  />
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
