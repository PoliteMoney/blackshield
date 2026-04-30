import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--color-secondary)] flex items-center justify-center text-center p-8">
      <div>
        <div className="text-[var(--color-primary)] text-9xl font-bold mb-4 opacity-20">404</div>
        <h1 className="text-3xl font-bold text-white mb-4">Página no encontrada</h1>
        <p className="text-white/50 mb-8">La página que buscas no existe o fue movida.</p>
        <Link href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-[var(--color-secondary)] font-semibold rounded-xl hover:opacity-90 transition-opacity">
          Regresar al inicio
        </Link>
      </div>
    </div>
  )
}
