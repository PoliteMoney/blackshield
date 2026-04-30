import { cookies, headers } from 'next/headers'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { getLocaleFromHeader, getDictionary, type Locale } from '@/lib/i18n/dictionaries'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { formatDate } from '@/lib/utils'
import { Calendar, ArrowRight } from 'lucide-react'

export default async function BlogPage() {
  const cookieStore = cookies()
  const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value as Locale | undefined
  const locale: Locale = cookieLocale || getLocaleFromHeader(headers().get('accept-language'))
  const dict = await getDictionary(locale)

  const supabase = createClient()
  const { data: posts } = await supabase
    .from('blog_posts')
    .select(`id, slug, image_url, category, published_at, author_name,
      translations:blog_posts_translations(title, excerpt, locale)`)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(12)

  const locPosts = (posts || []).map(p => ({
    ...p,
    translations: (p.translations || []).filter((t: any) => t.locale === locale)
  }))

  return (
    <>
      <Navbar dict={dict.nav} />
      <main className="pt-24">
        {/* Header */}
        <div className="bg-[var(--color-secondary)] py-20 text-center">
          <span className="inline-block px-4 py-1.5 bg-[var(--color-primary)]/20 text-[var(--color-primary)] text-sm font-medium rounded-full mb-4">
            {dict.blog.badge}
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">{dict.blog.title}</h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">{dict.blog.subtitle}</p>
        </div>

        <div className="section-padding">
          <div className="container-custom mx-auto">
            {locPosts.length === 0 ? (
              <p className="text-center text-[var(--color-muted-foreground)] py-16">{dict.blog.no_posts}</p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {locPosts.map((post) => {
                  const t = post.translations[0]
                  return (
                    <Link key={post.id} href={`/blog/${post.slug}`}
                      className="group bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                      <div className="aspect-video bg-[var(--color-muted)] relative overflow-hidden">
                        {post.image_url ? (
                          <Image src={post.image_url} alt={t?.title || ''} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-secondary)] to-[#4a4a4a] flex items-center justify-center">
                            <span className="text-[var(--color-primary)] font-heading text-lg font-semibold px-4 text-center">{t?.title}</span>
                          </div>
                        )}
                        {post.category && (
                          <span className="absolute top-4 left-4 px-3 py-1 bg-[var(--color-primary)] text-[var(--color-secondary)] text-xs font-semibold rounded-full">
                            {post.category}
                          </span>
                        )}
                      </div>
                      <div className="p-6">
                        <h2 className="font-bold text-[var(--color-secondary)] text-lg mb-3 group-hover:text-[var(--color-accent)] transition-colors line-clamp-2">
                          {t?.title}
                        </h2>
                        <p className="text-[var(--color-muted-foreground)] text-sm line-clamp-3 mb-4">{t?.excerpt}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-[var(--color-muted-foreground)] text-xs">
                            <Calendar className="w-3.5 h-3.5" />
                            {post.published_at && formatDate(post.published_at, locale === 'es' ? 'es-MX' : 'en-US')}
                          </div>
                          <span className="text-[var(--color-accent)] text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                            {dict.blog.read_more} <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer dict={dict.footer} navDict={dict.nav} />
    </>
  )
}
