import { neon } from "@neondatabase/serverless"

// DATABASE_URL осы жерде қолданылады
const sql = neon(process.env.DATABASE_URL!)

export default sql
