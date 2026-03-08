export const WHATSAPP_NUMBER = "5492945589342";
export const WHATSAPP_MESSAGE = "Hola, quisiera saber más información sobre como hacer un pedido personalizado.";

export function getWhatsAppUrl(): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
}
