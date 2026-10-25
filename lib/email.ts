import { prisma } from "@/lib/prisma";

export interface OrderEmailPayload {
  orderNumber: string;
  customerName: string;
  customerEmail?: string | null;
  customerPhone: string;
  product: string;
  quantity: number;
  deliveryAddress: string;
  city: string;
  status: string;
  invoiceNumber?: string | null;
  invoiceAmount?: number | null;
  courierName?: string | null;
  trackingNumber?: string | null;
  shippingDetails?: string | null;
}

export async function sendOrderStatusEmail(order: OrderEmailPayload) {
  try {
    // 1. Get Forwarding destination
    const setting = await prisma.setting.findUnique({
      where: { key: "forward_orders_email" },
    });
    const forwardTo = setting?.value || "rishav79031@gmail.com";
    const recipient = order.customerEmail || forwardTo;

    // 2. Generate email subject & content based on Shopify standard status
    let subject = `Organic Gold Garlic: Order #${order.orderNumber} Status - ${order.status}`;
    let messageBody = "";

    switch (order.status) {
      case "Order Received":
        subject = `[Order Received] #${order.orderNumber} - Organic Gold Garlic`;
        messageBody = `
          <p>Dear ${order.customerName},</p>
          <p>Thank you for placing an order with <strong>Organic Gold Garlic</strong>! We have received your order details.</p>
          <p><strong>Item:</strong> ${order.product} (Qty: ${order.quantity})</p>
          <p><strong>Delivery Address:</strong> ${order.deliveryAddress}, ${order.city}</p>
          <p><em>Note: Final price and tax breakdown will be confirmed in your official invoice shortly.</em></p>
        `;
        break;

      case "Order Accepted":
        subject = `[Order Accepted] #${order.orderNumber} - Being Prepared`;
        messageBody = `
          <p>Dear ${order.customerName},</p>
          <p>Great news! Your order <strong>#${order.orderNumber}</strong> has been accepted by our dispatch team in Araria, Bihar.</p>
          <p>We are currently calculating exact shipping logistics and generating your official invoice.</p>
        `;
        break;

      case "Invoice Generated":
        subject = `[Invoice Generated] #${order.invoiceNumber || order.orderNumber} - ₹${order.invoiceAmount ?? "Confirmed"}`;
        messageBody = `
          <p>Dear ${order.customerName},</p>
          <p>The official invoice for your order <strong>#${order.orderNumber}</strong> has been generated.</p>
          <div style="background: #fdf8eb; border: 1px solid #d4af37; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p style="margin: 0 0 8px;"><strong>Invoice Number:</strong> ${order.invoiceNumber || "INV-" + order.orderNumber}</p>
            <p style="margin: 0 0 8px;"><strong>Item:</strong> ${order.product} &times; ${order.quantity}</p>
            <p style="margin: 0 0 8px;"><strong>Total Invoice Amount:</strong> ₹${order.invoiceAmount ?? 0}</p>
            <p style="margin: 0;"><strong>Payment Terms:</strong> Pay on Delivery / UPI upon dispatch</p>
          </div>
        `;
        break;

      case "Payment Received":
        subject = `[Payment Received] Order #${order.orderNumber}`;
        messageBody = `
          <p>Dear ${order.customerName},</p>
          <p>We have confirmed payment receipt of <strong>₹${order.invoiceAmount ?? 0}</strong> for Order #${order.orderNumber}.</p>
          <p>Your pack is moving to hygienic sealing and packaging.</p>
        `;
        break;

      case "Order Processed":
        subject = `[Order Completed] #${order.orderNumber} - Fully Processed & Closed`;
        messageBody = `
          <p>Dear ${order.customerName},</p>
          <p>Your order <strong>#${order.orderNumber}</strong> has been fully processed, delivered, and successfully completed.</p>
          <p>Thank you for choosing Organic Gold Garlic! If you need another fresh farm pack or bulk order refill, message us anytime on WhatsApp: +91 74885 03664.</p>
        `;
        break;

      case "Shipped":
        subject = `[Shipped] Order #${order.orderNumber} is on the way!`;
        messageBody = `
          <p>Dear ${order.customerName},</p>
          <p>Your package has been dispatched from our peeling facility!</p>
          <div style="background: #eef8f1; border: 1px solid #25d366; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p style="margin: 0 0 8px;"><strong>Courier Partner:</strong> ${order.courierName || "Express Logistics"}</p>
            <p style="margin: 0 0 8px;"><strong>Tracking / AWB Number:</strong> ${order.trackingNumber || "Assigned on transit"}</p>
            <p style="margin: 0;"><strong>Shipping Note:</strong> ${order.shippingDetails || "Refrigerated / express delivery"}</p>
          </div>
        `;
        break;

      case "Delivered":
        subject = `[Delivered] Order #${order.orderNumber} - Delivered`;
        messageBody = `
          <p>Dear ${order.customerName},</p>
          <p>Your package has been successfully delivered. We hope you enjoy the farm-fresh purity of Organic Gold Garlic!</p>
          <p>Need a refill? Message us anytime on WhatsApp: +91 74885 03664.</p>
        `;
        break;

      default:
        messageBody = `<p>Order #${order.orderNumber} status updated to: <strong>${order.status}</strong>.</p>`;
    }

    const fullHtml = `
      <div style="font-family: sans-serif; color: #222; max-width: 600px; margin: 0 auto; border: 1px solid #e5e5e5; border-radius: 12px; overflow: hidden;">
        <div style="background: #08130b; padding: 24px; text-align: center; color: #fff;">
          <h2 style="margin: 0; color: #d4af37; font-size: 20px; letter-spacing: 2px; text-transform: uppercase;">Organic Gold Garlic</h2>
          <p style="margin: 4px 0 0; font-size: 11px; color: #f7e7a9; letter-spacing: 3px; text-transform: uppercase;">Pure &bull; Fresh &bull; Healthy</p>
        </div>
        <div style="padding: 24px; font-size: 14px; line-height: 1.6;">
          ${messageBody}
        </div>
        <div style="background: #f9f9f9; padding: 16px; font-size: 11px; color: #888; text-align: center; border-top: 1px solid #eee;">
          Shivpuri Ward No. 09, Araria, Bihar – 854311 &bull; Phone / WhatsApp: +91 74885 03664
        </div>
      </div>
    `;

    console.log(`====================================================`);
    console.log(`[AUTOMATED ORDER EMAIL SENT]`);
    console.log(`To: ${recipient} (Cc: ${forwardTo})`);
    console.log(`Subject: ${subject}`);
    console.log(`Status: ${order.status}`);
    if (order.invoiceNumber) console.log(`Invoice: ${order.invoiceNumber} | ₹${order.invoiceAmount}`);
    if (order.trackingNumber) console.log(`Courier: ${order.courierName} | Tracking: ${order.trackingNumber}`);
    console.log(`====================================================`);

    return { success: true };
  } catch (err) {
    console.error("sendOrderStatusEmail error:", err);
    return { success: false, error: err };
  }
}
