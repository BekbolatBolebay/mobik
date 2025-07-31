import Stripe from "stripe"

// Stripe клиентін инициализациялау
// Бұл тек серверде қолданылуы керек, себебі құпия кілт бар
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16", // Соңғы API нұсқасын пайдаланыңыз
})
