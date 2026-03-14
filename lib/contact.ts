export const WHATSAPP_NUMBER = "5492945589342";
export const WHATSAPP_MESSAGE = "Hola! Quisiera más información para encargar una prenda personalizada. ¿Cómo puedo hacerlo?";

export function getWhatsAppUrl(): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
}
