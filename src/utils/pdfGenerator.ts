// Enhanced PDF generator with robust jsPDF loader, real QR, pagination, and neat structure.
// Uses built-in "times" font. To render the ₹ glyph, embed a Unicode TTF or keep the default "Rs.".

declare global {
  interface Window {
    jsPDF?: any;
    jspdf?: { jsPDF?: any };
    QRCode?: any;
  }
}

let _loadJsPDFPromise: Promise<void> | null = null;
const loadJsPDF = (): Promise<void> => {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return Promise.reject(new Error("Window/document is not available"));
  }
  // Already present
  if (window.jsPDF || window.jspdf?.jsPDF) {
    if (!window.jsPDF && window.jspdf?.jsPDF) window.jsPDF = window.jspdf.jsPDF;
    return Promise.resolve();
  }
  // In-flight
  if (_loadJsPDFPromise) return _loadJsPDFPromise;

  _loadJsPDFPromise = new Promise<void>((resolve, reject) => {
    let script = document.querySelector<HTMLScriptElement>('script[data-jspdf-cdn]');
    if (!script) {
      script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
      script.async = true;
      script.defer = true;
      script.setAttribute("data-jspdf-cdn", "1");
      script.onload = () => {
        if (window.jspdf?.jsPDF) window.jsPDF = window.jspdf.jsPDF;
        if (window.jsPDF) resolve();
        else reject(new Error("jsPDF not found after loading"));
      };
      script.onerror = () => reject(new Error("Failed to load jsPDF script"));
      document.head.appendChild(script);
    } else {
      script.addEventListener("load", () => {
        if (window.jspdf?.jsPDF && !window.jsPDF) window.jsPDF = window.jspdf.jsPDF;
        resolve();
      }, { once: true });
      script.addEventListener("error", () => reject(new Error("Failed to load jsPDF script")), { once: true });
    }
  });
  return _loadJsPDFPromise;
};

// --- Optional QR library (qrcodejs) loader from CDN; falls back gracefully ---
let _loadQRCodePromise: Promise<void> | null = null;
const loadQRCodeLib = (): Promise<void> => {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.QRCode) return Promise.resolve();
  if (_loadQRCodePromise) return _loadQRCodePromise;

  _loadQRCodePromise = new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load QRCode library"));
    document.head.appendChild(s);
  });
  return _loadQRCodePromise;
};

// Real QR generator -> Data URL (uses qrcodejs if available; otherwise returns null)
const generateQRCodeDataURL = async (text: string, size = 60): Promise<string | null> => {
  try {
    await loadQRCodeLib();
    if (!window.QRCode) return null;

    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.left = "-10000px";
    document.body.appendChild(container);

    // qrcodejs renders <img> or <canvas> inside container
    // @ts-ignore
    new window.QRCode(container, { text, width: size, height: size });
    await new Promise(r => setTimeout(r, 50)); // allow render

    const img = container.querySelector("img") as HTMLImageElement | null;
    const canvas = container.querySelector("canvas") as HTMLCanvasElement | null;
    const dataUrl = img?.src ?? canvas?.toDataURL("image/png") ?? null;
    container.remove();
    return dataUrl;
  } catch {
    return null;
  }
};

// ---- Types & helpers ----
export interface ReservationData {
  id?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  purpose?: string;
  arrival_date?: string; // ISO or human
  arrival_time?: string; // "HH:mm"
  table_number?: string | number;
  num_people?: number | string;
}

export interface OrderItem {
  name?: string;
  price?: number;
  offer_price?: number;
  selectedQuantity?: number;
}

const USE_UNICODE_RUPEE = false; // set true only if you embed a Unicode TTF
const money = (n: number) => (USE_UNICODE_RUPEE ? `₹${n.toFixed(2)}` : `Rs. ${n.toFixed(2)}`);

const safe = (v: any, fallback = "N/A") => {
  if (v === null || v === undefined) return fallback;
  const s = String(v).trim();
  return s.length ? s : fallback;
};

export const generateReservationPDF = async (reservationData: ReservationData, orderItems: OrderItem[] = []) => {
  await loadJsPDF();
  if (!window.jsPDF) throw new Error("jsPDF is not available after loading");

  const { jsPDF } = window;
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  // Page & theme
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const LM = 20, RM = 20, TM = 15, BM = 15; // margins
  const gold = { r: 184, g: 134, b: 11 };
  const pale = { r: 252, g: 240, b: 181 };

  let y = TM;

  // Header band
  doc.setFillColor(pale.r, pale.g, pale.b);
  doc.rect(0, 0, pageW, 40, "F");

  doc.setFont("times", "bold");
  doc.setFontSize(28);
  doc.setTextColor(gold.r, gold.g, gold.b);
  // Avoid emoji (not in built-in fonts)
  doc.text("DINE24", pageW / 2, 20, { align: "center" });

  doc.setFont("times", "italic");
  doc.setFontSize(12);
  doc.setTextColor(146, 64, 14);
  doc.text("Premium Royal Dining Experience", pageW / 2, 30, { align: "center" });

  // Datetime (IST)
  const dateTime = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit"
  });
  doc.setFont("times", "normal");
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  doc.text(`Generated: ${dateTime}`, pageW - RM, 45, { align: "right" });

  // Title & rule
  doc.setFont("times", "bold");
  doc.setFontSize(18);
  doc.setTextColor(gold.r, gold.g, gold.b);
  doc.text("RESERVATION CONFIRMATION", pageW / 2, 55, { align: "center" });
  doc.setLineWidth(2);
  doc.setDrawColor(gold.r, gold.g, gold.b);
  doc.line(LM, 60, pageW - RM, 60);
  doc.setLineWidth(0.5);
  doc.line(LM, 62, pageW - RM, 62);

  y = 72;

  // QR code (real, optional)
  const reservationId = (reservationData.id?.slice(0, 8).toUpperCase()) || `RES${Date.now().toString().slice(-8)}`;
  const qr = await generateQRCodeDataURL(`DINE24-${reservationId}`, 70);
  if (qr) {
    doc.addImage(qr, "PNG", pageW - RM - 35, 50, 35, 35);
    doc.setFontSize(8);
    doc.setFont("times", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text(`ID: ${reservationId}`, pageW - RM - 17.5, 90, { align: "center" });
  }

  // Section: Customer info box
  doc.setFontSize(14);
  doc.setTextColor(gold.r, gold.g, gold.b);
  doc.setFont("times", "bold");
  doc.text("CUSTOMER INFORMATION", LM, y);
  y += 8;

  const boxH = 30;
  doc.setFillColor(pale.r, pale.g, pale.b);
  doc.rect(LM, y, 85, boxH, "F");
  doc.setDrawColor(gold.r, gold.g, gold.b);
  doc.setLineWidth(0.5);
  doc.rect(LM, y, 85, boxH);

  doc.setFont("times", "normal");
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);

  const customerRows: [string, string][] = [
    ["Name:", safe(reservationData.full_name)],
    ["Email:", safe(reservationData.email)],
    ["Phone:", safe(reservationData.phone)],
    ["Purpose:", safe(reservationData.purpose)]
  ];
  customerRows.forEach((row, i) => {
    const ry = y + 6 + i * 6;
    doc.setFont("times", "bold");
    doc.text(row[0], LM + 5, ry);
    doc.setFont("times", "normal");
    const wrapped = doc.splitTextToSize(row[1], 85 - 35); // label ~25 + padding
    doc.text(wrapped, LM + 30, ry);
    if (i < customerRows.length - 1) {
      doc.setDrawColor(200, 200, 200);
      doc.line(LM + 2, ry + 2, LM + 85 - 2, ry + 2);
    }
  });

  // Section: Reservation details box
  doc.setFont("times", "bold");
  doc.setFontSize(14);
  doc.setTextColor(gold.r, gold.g, gold.b);
  doc.text("RESERVATION DETAILS", LM + 90, 72);

  const arrivalDate = reservationData.arrival_date
    ? new Date(reservationData.arrival_date).toLocaleDateString("en-IN")
    : "N/A";

  doc.setFillColor(pale.r, pale.g, pale.b);
  doc.rect(LM + 90, 82, 75, 30, "F");
  doc.setDrawColor(gold.r, gold.g, gold.b);
  doc.rect(LM + 90, 82, 75, 30);

  doc.setFont("times", "normal");
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);

  const resRows: [string, string][] = [
    ["Date:", arrivalDate],
    ["Time:", safe(reservationData.arrival_time)],
    ["Table:", safe(reservationData.table_number)],
    ["Guests:", safe(reservationData.num_people)]
  ];
  resRows.forEach((row, i) => {
    const ry = 87 + i * 6;
    doc.setFont("times", "bold");
    doc.text(row[0], LM + 95, ry);
    doc.setFont("times", "normal");
    doc.text(safe(row[1]), LM + 120, ry);
    if (i < resRows.length - 1) {
      doc.setDrawColor(200, 200, 200);
      doc.line(LM + 92, ry + 2, LM + 90 + 75 - 2, ry + 2);
    }
  });

  // Move below both boxes
  y = 125;

  // --- Order summary with pagination ---
  const ensureSpace = (needed: number) => {
    if (y + needed > pageH - BM) {
      doc.addPage();
      y = TM;
      drawHeaderFooter(); // page footer
      // Re-draw table header if we’re inside the table
      drawOrderHeader();
      y += 8;
    }
  };

  const drawHeaderFooter = () => {
    // Footer with page numbers
    const pageNo = doc.getNumberOfPages();
    doc.setFont("times", "normal");
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text(`Page ${pageNo}`, pageW - RM, pageH - 6, { align: "right" });
  };

  const drawOrderHeader = () => {
    doc.setFillColor(gold.r, gold.g, gold.b);
    doc.rect(LM, y, pageW - LM - RM, 8, "F");
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.setFont("times", "bold");
    doc.text("Item Name", LM + 5, y + 5);
    doc.text("Qty", LM + 100, y + 5);
    doc.text("Price", LM + 120, y + 5);
    doc.text("Total", LM + 160, y + 5);
  };

  if (orderItems.length > 0) {
    doc.setFont("times", "bold");
    doc.setFontSize(14);
    doc.setTextColor(gold.r, gold.g, gold.b);
    doc.text("ORDER SUMMARY", LM, y);
    y += 10;

    drawOrderHeader();
    y += 8;

    let subtotal = 0;

    const colX = { name: LM + 5, qty: LM + 100, price: LM + 120, total: LM + 180 };
    const nameMaxWidth = (pageW - LM - RM) - ( (colX.qty - (LM + 5)) + (pageW - (LM + 120)) ); // ~95mm

    orderItems.forEach((item, idx) => {
      const price = Number(item.offer_price ?? item.price ?? 0) || 0;
      const qty = Number(item.selectedQuantity ?? 1) || 1;
      const total = price * qty;
      subtotal += total;

      const name = safe(item.name, "Unknown Item");
      const nameLines = doc.splitTextToSize(name, Math.max(50, nameMaxWidth));
      const rowH = Math.max(6, nameLines.length * 5 + 2);

      ensureSpace(rowH + 2);

      // zebra rows
      if (idx % 2 === 0) {
        doc.setFillColor(pale.r, pale.g, pale.b);
        doc.rect(LM, y, pageW - LM - RM, rowH, "F");
      }

      doc.setFont("times", "normal");
      doc.setTextColor(0, 0, 0);
      doc.text(nameLines, colX.name, y + 4);

      doc.text(String(qty), colX.qty, y + 4);
      doc.text(money(price), colX.price, y + 4);
      doc.text(money(total), colX.total, y + 4, { align: "right" });

      y += rowH;
    });

    // Totals
    ensureSpace(20);
    doc.setDrawColor(gold.r, gold.g, gold.b);
    doc.setLineWidth(1);
    doc.line(LM + 120, y + 1, pageW - RM, y + 1);
    y += 7;

    const gst = +(subtotal * 0.18).toFixed(2);
    const grand = +(subtotal + gst).toFixed(2);

    doc.setFont("times", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text("Subtotal:", LM + 120, y);
    doc.text(money(subtotal), pageW - RM, y, { align: "right" });
    y += 6;

    doc.text("GST (18%):", LM + 120, y);
    doc.text(money(gst), pageW - RM, y, { align: "right" });
    y += 8;

    doc.setFont("times", "bold");
    doc.setFontSize(12);
    doc.setTextColor(gold.r, gold.g, gold.b);
    doc.text("GRAND TOTAL:", LM + 120, y);
    doc.text(money(grand), pageW - RM, y, { align: "right" });

    // Highlight box
    doc.setDrawColor(gold.r, gold.g, gold.b);
    doc.setLineWidth(2);
    doc.rect(LM + 115, y - 5, (pageW - RM) - (LM + 115), 10);
  }

  // Important notice (no emoji to avoid missing glyph)
  y += 20;
  const infoH = 16;
  if (y + infoH > pageH - BM) { doc.addPage(); y = TM; }
  doc.setFillColor(255, 248, 220);
  doc.rect(LM, y, pageW - LM - RM, infoH, "F");
  doc.setDrawColor(255, 193, 7);
  doc.rect(LM, y, pageW - LM - RM, infoH);

  doc.setFont("times", "bold");
  doc.setFontSize(10);
  doc.setTextColor(gold.r, gold.g, gold.b);
  doc.text("IMPORTANT DINING POLICY", LM + 5, y + 5);
  doc.setFont("times", "normal");
  doc.setTextColor(0, 0, 0);
  const policy = "Dining duration: 1 hour from service start. Extended time may incur a 15% charge.";
  doc.text(doc.splitTextToSize(policy, pageW - LM - RM - 10), LM + 5, y + 10);

  // Footer band
  y += infoH + 10;
  if (y + 20 > pageH) { doc.addPage(); y = TM; }
  doc.setFillColor(gold.r, gold.g, gold.b);
  doc.rect(0, pageH - 20, pageW, 20, "F");
  doc.setFont("times", "bold");
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text("Thank you for choosing DINE24!", pageW / 2, pageH - 12, { align: "center" });

  doc.setFont("times", "normal");
  doc.setFontSize(9);
  doc.text("Contact: +91 98765 43210 | Email: info@dine24.com | www.dine24.com", pageW / 2, pageH - 6, { align: "center" });

  // Page footer numbers for the last page too
  const totalPages = doc.getNumberOfPages();
  doc.setPage(totalPages);
  doc.setFont("times", "normal");
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(`Page ${totalPages}`, pageW - RM, pageH - 6, { align: "right" });

  return doc.output("datauristring");
};
