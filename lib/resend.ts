import { Resend } from "resend"

// RESEND_API_KEY осы жерде қолданылады
export const resend = new Resend(process.env.RESEND_API_KEY)
