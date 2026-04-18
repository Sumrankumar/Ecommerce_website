const nodemailer = require("nodemailer");

const gmailUser = process.env.GMAIL_USER || process.env.gmail_user;
const rawGmailAppPassword = process.env.GMAIL_APP_PASSWORD || process.env.gmail_app_password;
const gmailAppPassword = (rawGmailAppPassword || "")
  .split("--")[0]
  .replace(/\s+/g, "")
  .trim();

const hasMailerConfig = () =>
  Boolean(gmailUser && gmailAppPassword);

const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: gmailUser,
      pass: gmailAppPassword,
    },
  });
};

const sendOrderReceiptEmail = async ({ to, userName, order, products = [] }) => {
  if (!hasMailerConfig() || !to) {
    return;
  }

  const transporter = createTransporter();
  const itemsHtml = products
    .map(
      (item) =>
        `<li>${item.name || "Product"} x ${item.quantity} - Rs.${(Number(item.price) || 0) * (Number(item.quantity) || 0)}</li>`
    )
    .join("");

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2>Order Receipt</h2>
      <p>Hello ${userName || "Customer"},</p>
      <p>Thank you for your order. Your order has been placed successfully.</p>
      <p><strong>Order ID:</strong> ${order._id}</p>
      <p><strong>Total:</strong> Rs.${order.totalPrice}</p>
      <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
      <h3>Items</h3>
      <ul>${itemsHtml}</ul>
      <p>We appreciate your purchase.</p>
    </div>
  `;

  await transporter.sendMail({
    from: `ShopSphere <${gmailUser}>`,
    to,
    subject: `Order Receipt - ${order._id}`,
    html,
  });
};

module.exports = {
  sendOrderReceiptEmail,
};
