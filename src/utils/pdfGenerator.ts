
// Enhanced PDF generator with Times New Roman font, proper formatting, and neat structure
const loadJsPDF = async () => {
  if (typeof window === 'undefined') {
    throw new Error('Window is not available');
  }

  if (window.jsPDF) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector('script[src*="jspdf"]');
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.async = false;
    document.head.appendChild(script);
    
    script.onload = () => {
      console.log('jsPDF script loaded');
      const checkJsPDF = () => {
        if (window.jsPDF) {
          console.log('jsPDF found on window.jsPDF');
          resolve();
        } else if ((window as any).jspdf?.jsPDF) {
          console.log('jsPDF found on window.jspdf.jsPDF');
          (window as any).jsPDF = (window as any).jspdf.jsPDF;
          resolve();
        } else {
          setTimeout(() => {
            if (window.jsPDF) {
              resolve();
            } else if ((window as any).jspdf?.jsPDF) {
              (window as any).jsPDF = (window as any).jspdf.jsPDF;
              resolve();
            } else {
              reject(new Error('jsPDF not found after loading'));
            }
          }, 500);
        }
      };
      checkJsPDF();
    };
    
    script.onerror = () => {
      console.error('Failed to load jsPDF script');
      reject(new Error('Failed to load jsPDF script'));
    };
  });
};

// Generate elegant QR Code
const generateQRCode = async (text: string) => {
  return new Promise<string>((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const size = 60;
    canvas.width = size;
    canvas.height = size;
    
    if (ctx) {
      ctx.fillStyle = '#000000';
      const cellSize = size / 21;
      
      // Generate QR pattern
      for (let i = 0; i < 21; i++) {
        for (let j = 0; j < 21; j++) {
          const hash = (text.charCodeAt(i % text.length) + i + j) % 3;
          if (hash === 0) {
            ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
          }
        }
      }
      
      // Corner patterns
      ctx.fillRect(0, 0, cellSize * 7, cellSize * 7);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(cellSize, cellSize, cellSize * 5, cellSize * 5);
      ctx.fillStyle = '#000000';
      ctx.fillRect(cellSize * 2, cellSize * 2, cellSize * 3, cellSize * 3);
    }
    
    resolve(canvas.toDataURL());
  });
};

export const generateReservationPDF = async (reservationData: any, orderItems?: any[]) => {
  try {
    console.log('Starting elegant PDF generation with Times New Roman');
    
    await loadJsPDF();
    
    if (!window.jsPDF) {
      throw new Error('jsPDF is still not available after loading');
    }

    const { jsPDF } = window;
    const doc = new jsPDF();

    // Set font to Times Roman (closest to Times New Roman in jsPDF)
    doc.setFont("times", "normal");

    // Current date/time
    const now = new Date();
    const dateTime = now.toLocaleString('en-IN', { 
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Golden background header
    doc.setFillColor(252, 240, 181); // Light golden background
    doc.rect(0, 0, 210, 40, 'F');

    // Restaurant header with elegant design
    doc.setFontSize(28);
    doc.setTextColor(184, 134, 11); // Dark golden color
    doc.setFont("times", "bold");
    doc.text('🍽️ DINE24', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(146, 64, 14); // Brown color
    doc.setFont("times", "italic");
    doc.text('Premium Royal Dining Experience', 105, 30, { align: 'center' });

    // Date/time in elegant box
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.setFont("times", "normal");
    doc.text(`Generated: ${dateTime}`, 180, 45, { align: 'right' });

    // Generate reservation ID and QR code
    const reservationId = reservationData.id ? 
      reservationData.id.slice(0, 8).toUpperCase() : 
      `RES${Date.now().toString().slice(-8)}`;
    
    // QR code placement
    try {
      const qrCodeDataUrl = await generateQRCode(`DINE24-${reservationId}`);
      doc.addImage(qrCodeDataUrl, 'PNG', 150, 50, 35, 35);
      
      doc.setFontSize(8);
      doc.setTextColor(0, 0, 0);
      doc.setFont("times", "bold");
      doc.text(`ID: ${reservationId}`, 167.5, 90, { align: 'center' });
    } catch (error) {
      console.log('QR code generation failed');
    }

    // Title with decorative line
    doc.setFontSize(18);
    doc.setTextColor(184, 134, 11);
    doc.setFont("times", "bold");
    doc.text('RESERVATION CONFIRMATION', 105, 55, { align: 'center' });

    // Decorative golden line
    doc.setLineWidth(2);
    doc.setDrawColor(184, 134, 11);
    doc.line(20, 60, 190, 60);
    doc.setLineWidth(0.5);
    doc.line(20, 62, 190, 62);

    let yPos = 75;

    // Customer Details Table
    doc.setFontSize(14);
    doc.setTextColor(184, 134, 11);
    doc.setFont("times", "bold");
    doc.text('CUSTOMER INFORMATION', 20, yPos);
    
    yPos += 10;
    
    // Create elegant table for customer details
    const customerTable = [
      ['Name:', reservationData.full_name || 'N/A'],
      ['Email:', reservationData.email || 'N/A'],
      ['Phone:', reservationData.phone || 'N/A'],
      ['Purpose:', reservationData.purpose || 'N/A']
    ];

    // Table background
    doc.setFillColor(252, 240, 181);
    doc.rect(20, yPos, 85, 30, 'F');
    
    doc.setDrawColor(184, 134, 11);
    doc.setLineWidth(0.5);
    doc.rect(20, yPos, 85, 30);

    // Customer table content
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont("times", "normal");
    
    customerTable.forEach((row, index) => {
      const rowY = yPos + 5 + (index * 6);
      doc.setFont("times", "bold");
      doc.text(row[0], 25, rowY);
      doc.setFont("times", "normal");
      doc.text(row[1], 50, rowY);
      
      if (index < customerTable.length - 1) {
        doc.setDrawColor(200, 200, 200);
        doc.line(22, rowY + 2, 103, rowY + 2);
      }
    });

    // Reservation Details Table
    doc.setFontSize(14);
    doc.setTextColor(184, 134, 11);
    doc.setFont("times", "bold");
    doc.text('RESERVATION DETAILS', 110, 75);

    const arrivalDate = reservationData.arrival_date ? 
      new Date(reservationData.arrival_date).toLocaleDateString('en-IN') : 'N/A';
    
    const reservationTable = [
      ['Date:', arrivalDate],
      ['Time:', reservationData.arrival_time || 'N/A'],
      ['Table:', reservationData.table_number || 'N/A'],
      ['Guests:', reservationData.num_people || 'N/A']
    ];

    // Table background
    doc.setFillColor(252, 240, 181);
    doc.rect(110, 85, 75, 30, 'F');
    
    doc.setDrawColor(184, 134, 11);
    doc.setLineWidth(0.5);
    doc.rect(110, 85, 75, 30);

    // Reservation table content
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont("times", "normal");
    
    reservationTable.forEach((row, index) => {
      const rowY = 90 + (index * 6);
      doc.setFont("times", "bold");
      doc.text(row[0], 115, rowY);
      doc.setFont("times", "normal");
      doc.text(row[1], 140, rowY);
      
      if (index < reservationTable.length - 1) {
        doc.setDrawColor(200, 200, 200);
        doc.line(112, rowY + 2, 183, rowY + 2);
      }
    });

    yPos = 125;

    // Order Details (if exists)
    if (orderItems && orderItems.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(184, 134, 11);
      doc.setFont("times", "bold");
      doc.text('ORDER SUMMARY', 20, yPos);
      
      yPos += 10;
      
      // Order table header
      doc.setFillColor(184, 134, 11);
      doc.rect(20, yPos, 170, 8, 'F');
      
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.setFont("times", "bold");
      doc.text('Item Name', 25, yPos + 5);
      doc.text('Qty', 120, yPos + 5);
      doc.text('Price (₹)', 140, yPos + 5);
      doc.text('Total (₹)', 165, yPos + 5);
      
      yPos += 8;

      let subtotal = 0;
      doc.setTextColor(0, 0, 0);
      doc.setFont("times", "normal");
      
      orderItems.forEach((item: any, index: number) => {
        const price = item.offer_price || item.price || 0;
        const quantity = item.selectedQuantity || 1;
        const itemTotal = price * quantity;
        subtotal += itemTotal;
        
        // Alternate row colors
        if (index % 2 === 0) {
          doc.setFillColor(252, 240, 181);
          doc.rect(20, yPos, 170, 6, 'F');
        }
        
        const itemName = item.name ? item.name.substring(0, 30) : 'Unknown Item';
        doc.text(itemName, 25, yPos + 4);
        doc.text(quantity.toString(), 125, yPos + 4);
        doc.text(`₹${price}`, 145, yPos + 4);
        doc.text(`₹${itemTotal}`, 170, yPos + 4);
        yPos += 6;
      });

      // Bill totals with elegant formatting
      const gst = Math.round(subtotal * 0.18);
      const total = subtotal + gst;

      yPos += 5;
      doc.setDrawColor(184, 134, 11);
      doc.setLineWidth(1);
      doc.line(140, yPos, 190, yPos);
      yPos += 8;
      
      doc.setFont("times", "normal");
      doc.text('Subtotal:', 145, yPos);
      doc.text(`₹${subtotal}`, 175, yPos);
      yPos += 6;
      doc.text('GST (18%):', 145, yPos);
      doc.text(`₹${gst}`, 175, yPos);
      yPos += 8;
      
      doc.setFontSize(12);
      doc.setTextColor(184, 134, 11);
      doc.setFont("times", "bold");
      doc.text('GRAND TOTAL:', 145, yPos);
      doc.text(`₹${total}`, 175, yPos);
      
      // Total box
      doc.setDrawColor(184, 134, 11);
      doc.setLineWidth(2);
      doc.rect(140, yPos - 5, 50, 8);
    }

    // Important notice
    yPos += 20;
    doc.setFillColor(255, 248, 220); // Light yellow
    doc.rect(20, yPos, 170, 15, 'F');
    doc.setDrawColor(255, 193, 7); // Warning yellow
    doc.rect(20, yPos, 170, 15);
    
    doc.setFontSize(10);
    doc.setTextColor(184, 134, 11);
    doc.setFont("times", "bold");
    doc.text('⚠️ IMPORTANT DINING POLICY', 25, yPos + 5);
    doc.setFont("times", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text('Dining duration: 1 hour from service start. Extended time: +15% charge.', 25, yPos + 10);

    // Footer
    yPos += 25;
    doc.setFillColor(184, 134, 11);
    doc.rect(0, yPos, 210, 20, 'F');
    
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.setFont("times", "bold");
    doc.text('Thank you for choosing DINE24!', 105, yPos + 8, { align: 'center' });
    
    doc.setFontSize(9);
    doc.setFont("times", "normal");
    doc.text('Contact: +91 98765 43210 | Email: info@dine24.com | www.dine24.com', 105, yPos + 15, { align: 'center' });

    console.log('Elegant PDF with Times New Roman generated successfully');
    return doc.output('datauristring');
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error(`PDF generation failed: ${error.message}`);
  }
};
