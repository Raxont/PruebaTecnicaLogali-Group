import { redirect } from 'next/navigation'

// * Página raíz: redirige inmediatamente al dashboard.
// ? Mantener simple para evitar rutas innecesarias en el root.
export default function Home() {
  redirect('/dashboard')
}