declare module "jspdf" {
  export class jsPDF {
    constructor(options?: {
      orientation?: string;
      unit?: string;
      format?: string | number[];
    });
    text(
      text: string,
      x: number,
      y: number,
      options?: { align?: string },
    ): void;
    setFontSize(size: number): void;
    setFont(fontName: string, fontStyle?: string): void;
    save(filename: string): void;
    internal: {
      pageSize: { getWidth(): number; getHeight(): number };
    };
    lastAutoTable?: { finalY: number };
    [key: string]: any;
  }
}

declare module "jspdf-autotable" {
  import type { jsPDF } from "jspdf";
  function autoTable(doc: jsPDF, options: Record<string, any>): void;
  export default autoTable;
}
