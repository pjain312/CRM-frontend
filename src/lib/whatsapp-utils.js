const CLINIC_NAME = "Kinetara";

export function formatPhoneForWhatsApp(phone) {
  if (!phone) return null;

  const digits = String(phone).replace(/\D/g, "");
  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return digits;
  if (digits.length === 11 && digits.startsWith("0")) return `91${digits.slice(1)}`;

  return digits.length >= 10 ? digits : null;
}

export function buildPackageSessionUpdateMessage({
  patientName,
  packageName,
  totalSessions,
  sessionsUsed,
}) {
  const completed = sessionsUsed + 1;
  const remaining = Math.max(totalSessions - completed, 0);

  let message = `Hi ${patientName},\n\nThank you for visiting ${CLINIC_NAME} today.\n\nPackage: ${packageName}\nSessions completed: ${completed}\nSessions remaining: ${remaining}`;

  if (remaining === 0) {
    message += "\n\nYour package sessions are now complete. Please contact us to renew or book further care.";
  } else {
    message += "\n\nWe look forward to see you at your next appointment.";
  }

  return message;
}

export function buildWhatsAppUrl(phone, message) {
  const formattedPhone = formatPhoneForWhatsApp(phone);
  if (!formattedPhone || !message) return null;

  const text = encodeURIComponent(message);
  return `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${text}`;
}

export function openWhatsAppUrl(url) {
  if (!url) return false;
  window.location.assign(url);
  return true;
}

export function getPackageCheckoutWhatsAppPrompt(checkoutDetails) {
  if (!checkoutDetails?.PackageId || !checkoutDetails?.PhoneNumber) {
    return null;
  }

  const message = buildPackageSessionUpdateMessage({
    patientName: checkoutDetails.PatientName || "there",
    packageName: checkoutDetails.PackageName || "your package",
    totalSessions: checkoutDetails.TotalPackageSessions ?? 0,
    sessionsUsed: checkoutDetails.TotalPackageSessionsUsed ?? 0,
  });

  const url = buildWhatsAppUrl(checkoutDetails.PhoneNumber, message);
  if (!url) return null;

  return {
    patientName: checkoutDetails.PatientName,
    phoneNumber: checkoutDetails.PhoneNumber,
    message,
    url,
  };
}
