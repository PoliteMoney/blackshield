import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--color-navy-deep)] flex items-center justify-center text-center p-8">
      <div>
        <div
          className="text-[var(--color-primary)] text-8xl font-light mb-4 opacity-30"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          404
        </div>
        <h1
          className="text-3xl font-light text-white mb-4"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Página no encontrada
        </h1>
        <p className="text-white/50 mb-8">La página que buscas no existe o fue movida.</p>
        <Link href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-[var(--color-secondary)] font-semibold rounded-lg hover:opacity-90 transition-opacity">
          Regresar al inicio
        </Link>
      </div>
    </div>
  )
}
