import { cookies, headers } from 'next/headers'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { getLocaleFromHeader, getDictionary, type Locale } from '@/lib/i18n/dictionaries'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Eyebrow } from '@/components/ui/eyebrow'
import { SourceBadge } from '@/components/blog/source-badge'
import { PostReactions } from '@/components/blog/post-reactions'
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
    .select(`id, slug, image_url, category, published_at, author_name, source_platform, source_url,
      translations:blog_posts_translations(title, excerpt, locale), post_reactions(count)`)
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
        <div className="bg-[var(--color-navy-deep)] py-20 text-center">
          <Eyebrow label={dict.blog.badge} align="center" className="mb-5" />
          <h1
            className="text-5xl lg:text-6xl font-light tracking-tight text-white mb-5"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {dict.blog.title}
          </h1>
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
                  const reactionCount = post.post_reactions?.[0]?.count ?? 0
                  return (
                    <Link key={post.id} href={`/blog/${post.slug}`}
                      className="card-flat group bg-white overflow-hidden">
                      <div className="aspect-video bg-[var(--color-muted)] relative overflow-hidden">
                        {post.image_url ? (
                          <Image src={post.image_url} alt={t?.title || ''} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="absolute inset-0 bg-[var(--color-navy-deep)] flex items-center justify-center">
                            <span className="text-[var(--color-primary)] font-heading text-lg font-semibold px-4 text-center">{t?.title}</span>
                          </div>
                        )}
                        {post.category && (
                          <span className="absolute top-4 left-4 px-3 py-1 bg-[var(--color-primary)] text-[var(--color-secondary)] text-xs font-semibold rounded">
                            {post.category}
                          </span>
                        )}
                        {post.source_platform !== 'native' && (
                          <div className="absolute top-4 right-4">
                            <SourceBadge platform={post.source_platform} className="bg-white/90 backdrop-blur-sm" />
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h2 className="font-semibold text-[var(--color-secondary)] text-lg mb-3 group-hover:text-[var(--color-accent)] transition-colors line-clamp-2">
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
                        <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
                          <PostReactions postId={post.id} initialCount={reactionCount} />
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
