export interface InvoicePrintOrder {
  id: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  deliveryAddress: string;
  city: string;
  product: string;
  quantity: number;
  totalAmount: number;
  invoiceNumber?: string | null;
  invoiceAmount?: number | null;
  invoiceDate?: string | null;
  courierName?: string | null;
  trackingNumber?: string | null;
  createdAt: string | Date;
}

export interface InvoicePrintSettings {
  company_legal_name?: string;
  gst_number?: string;
  fssai_license?: string;
  pan_number?: string;
  bank_name?: string;
  bank_account_no?: string;
  bank_ifsc?: string;
  upi_id?: string;
  invoice_terms?: string;
}

export function triggerPrintInvoice(
  order: InvoicePrintOrder,
  settings: InvoicePrintSettings
) {
  const invoiceNum = order.invoiceNumber || `INV-${order.orderNumber}`;
  const invoiceDate = order.invoiceDate
    ? new Date(order.invoiceDate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

  const totalAmount = Number(order.invoiceAmount ?? order.totalAmount ?? 0);
  const formattedAmount = totalAmount.toLocaleString("en-IN");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Tax Invoice #${invoiceNum} - ${order.customerName}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 10mm 12mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      font-size: 12px;
      line-height: 1.4;
      color: #1f2937;
      background: #ffffff;
      padding: 16px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .invoice-container {
      max-width: 800px;
      margin: 0 auto;
      background: #ffffff;
    }
    @media print {
      body {
        padding: 0;
      }
      .no-print {
        display: none !important;
      }
    }
    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #d4af37;
      padding-bottom: 14px;
      margin-bottom: 14px;
    }
    .company-title {
      font-size: 20px;
      font-weight: 800;
      color: #064e3b;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      font-family: Georgia, serif;
    }
    .tagline {
      font-size: 11px;
      color: #4b5563;
      margin-top: 2px;
      font-weight: 500;
    }
    .address-line {
      font-size: 10px;
      color: #6b7280;
      margin-top: 3px;
    }
    .pill {
      display: inline-block;
      background: #f3f4f6;
      border: 1px solid #e5e7eb;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 10px;
      font-family: monospace;
      margin-right: 6px;
      margin-top: 6px;
    }
    .tax-badge {
      display: inline-block;
      background: #064e3b;
      color: #d4af37;
      font-weight: 800;
      font-size: 10px;
      padding: 3px 8px;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 4px;
    }
    .meta-box {
      text-align: right;
    }
    .inv-number {
      font-size: 13px;
      font-weight: 800;
      color: #111827;
      font-family: monospace;
    }
    .inv-date {
      font-size: 10px;
      color: #6b7280;
      margin-top: 2px;
    }
    .grid-2 {
      display: flex;
      justify-content: space-between;
      gap: 20px;
      border-bottom: 1px solid #f3f4f6;
      padding-bottom: 14px;
      margin-bottom: 14px;
    }
    .grid-col {
      flex: 1;
    }
    .sec-label {
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      font-weight: 700;
      color: #9ca3af;
      margin-bottom: 4px;
    }
    .customer-name {
      font-size: 13px;
      font-weight: 700;
      color: #111827;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 14px;
    }
    th {
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #6b7280;
      border-bottom: 1px solid #d1d5db;
      padding: 8px 4px;
      text-align: left;
    }
    td {
      padding: 10px 4px;
      border-bottom: 1px solid #f3f4f6;
    }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .bank-box {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 14px;
      display: flex;
      gap: 16px;
    }
    .sign-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      border-top: 1px solid #e5e7eb;
      padding-top: 14px;
      margin-top: 8px;
      font-size: 10px;
      color: #6b7280;
    }
    .sign-line {
      width: 150px;
      border-bottom: 1px solid #9ca3af;
      margin-bottom: 4px;
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <div class="header-row">
      <div>
        <div class="company-title">${settings.company_legal_name || "ORGANIC GOLD GARLIC"}</div>
        <div class="tagline">Premium Hygienic Peeled Garlic Processing & Wholesale Supply</div>
        <div class="address-line">Shivpuri Ward No. 09, Araria, Bihar – 854311 • Phone: +91 74885 03664</div>
        <div style="margin-top: 6px;">
          ${settings.gst_number ? `<span class="pill">GSTIN: ${settings.gst_number}</span>` : ""}
          ${settings.fssai_license ? `<span class="pill">FSSAI Lic: ${settings.fssai_license}</span>` : ""}
          ${settings.pan_number ? `<span class="pill">PAN: ${settings.pan_number}</span>` : ""}
        </div>
      </div>
      <div class="meta-box">
        <span class="tax-badge">TAX INVOICE</span>
        <div class="inv-number">${invoiceNum}</div>
        <div class="inv-date">Date: ${invoiceDate}</div>
        <div class="inv-date">Ref: #${order.orderNumber}</div>
      </div>
    </div>

    <div class="grid-2">
      <div class="grid-col">
        <div class="sec-label">Billed To (Customer)</div>
        <div class="customer-name">${order.customerName}</div>
        <div style="color: #4b5563; margin-top: 2px;">Ph: ${order.customerPhone}</div>
        ${order.customerEmail ? `<div style="color: #4b5563;">${order.customerEmail}</div>` : ""}
      </div>
      <div class="grid-col">
        <div class="sec-label">Delivery Destination</div>
        <div style="color: #374151;">${order.deliveryAddress}</div>
        <div style="color: #374151; font-weight: 500;">${order.city}, Bihar</div>
        ${order.courierName ? `<div style="color: #4338ca; font-weight: 600; margin-top: 3px;">🚚 Dispatch: ${order.courierName} (${order.trackingNumber || "Assigned"})</div>` : ""}
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Description & Grade</th>
          <th class="text-center">HSN</th>
          <th class="text-center">Quantity</th>
          <th class="text-right">Amount (₹)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong style="color: #111827; font-size: 13px;">${order.product}</strong>
            <div style="font-size: 10px; color: #6b7280; margin-top: 2px;">
              100% Pure Peeled Garlic Cloves • Vacuum-Sealed • No Preservatives
            </div>
          </td>
          <td class="text-center" style="font-family: monospace; font-size: 10px; color: #6b7280;">07032000</td>
          <td class="text-center" style="font-weight: 700; color: #374151; font-size: 12px;">${order.quantity}</td>
          <td class="text-right" style="font-weight: 700; color: #111827; font-size: 13px;">₹${formattedAmount}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr style="border-top: 2px solid #d1d5db;">
          <td colspan="3" style="text-align: right; font-weight: 700; font-size: 12px; padding-top: 10px;">
            Total Invoice Value (INR):
          </td>
          <td class="text-right" style="font-size: 15px; font-weight: 800; color: #064e3b; padding-top: 10px;">
            ₹${formattedAmount}
          </td>
        </tr>
      </tfoot>
    </table>

    <div class="bank-box">
      <div style="flex: 1;">
        <div class="sec-label">Bank Transfer & Settlement Details</div>
        <div style="color: #4b5563; font-size: 10px; line-height: 1.5;">
          <strong>Bank:</strong> ${settings.bank_name || "State Bank of India (Araria)"}<br>
          <strong>A/C:</strong> ${settings.bank_account_no || "Registered Commercial Account"}<br>
          <strong>IFSC:</strong> ${settings.bank_ifsc || "SBIN0001234"} • <strong>UPI:</strong> ${settings.upi_id || "7488503664@upi"}
        </div>
      </div>
      <div style="flex: 1;">
        <div class="sec-label">Terms & Commercial Conditions</div>
        <div style="color: #6b7280; font-style: italic; font-size: 10px; line-height: 1.4;">
          ${settings.invoice_terms || "Payment terms: Pay on Delivery or UPI upon dispatch. 100% natural agricultural produce."}
        </div>
      </div>
    </div>

    <div class="sign-row">
      <div>
        <div style="font-weight: 600; color: #374151;">Thank you for ordering with Organic Gold Garlic!</div>
        <div>Registered peeling facility in Shivpuri Ward 09, Araria, Bihar.</div>
      </div>
      <div style="text-align: center;">
        <div class="sign-line"></div>
        <div style="font-size: 9px; font-weight: 700; text-transform: uppercase; color: #4b5563;">
          For ${settings.company_legal_name || "Organic Gold Garlic"}
        </div>
        <div style="font-size: 8px; color: #9ca3af;">Authorized Signatory</div>
      </div>
    </div>
  </div>
</body>
</html>`;

  // Hidden print iframe for instant background printing
  try {
    let iframe = document.getElementById("invoice-print-frame") as HTMLIFrameElement;
    if (!iframe) {
      iframe = document.createElement("iframe");
      iframe.id = "invoice-print-frame";
      iframe.style.position = "fixed";
      iframe.style.right = "0";
      iframe.style.bottom = "0";
      iframe.style.width = "0";
      iframe.style.height = "0";
      iframe.style.border = "none";
      iframe.style.opacity = "0";
      document.body.appendChild(iframe);
    }

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(html);
      doc.close();

      setTimeout(() => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch (e) {
          console.warn("Iframe print blocked, falling back to window.open", e);
          const win = window.open(`/admin/invoice/${order.id}?autoPrint=true`, "_blank");
          if (!win) {
            window.location.href = `/admin/invoice/${order.id}?autoPrint=true`;
          }
        }
      }, 300);
      return;
    }
  } catch (err) {
    console.warn("Hidden iframe initialization error:", err);
  }

  // Fallback to standalone invoice route in new tab
  window.open(`/admin/invoice/${order.id}?autoPrint=true`, "_blank");
}
