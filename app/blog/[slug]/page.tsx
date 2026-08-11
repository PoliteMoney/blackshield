import { cookies, headers } from 'next/headers'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getLocaleFromHeader, getDictionary, type Locale } from '@/lib/i18n/dictionaries'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { SourceBadge } from '@/components/blog/source-badge'
import { PostReactions } from '@/components/blog/post-reactions'
import { PostMediaGallery } from '@/components/blog/post-media-gallery'
import { formatDate } from '@/lib/utils'
import { Calendar, ArrowLeft, User } from 'lucide-react'

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const cookieStore = cookies()
  const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value as Locale | undefined
  const locale: Locale = cookieLocale || getLocaleFromHeader(headers().get('accept-language'))
  const dict = await getDictionary(locale)

  const supabase = createClient()
  const { data: post } = await supabase
    .from('blog_posts')
    .select(`id, slug, image_url, category, published_at, author_name, source_platform, source_url, media,
      translations:blog_posts_translations(title, excerpt, content, meta_title, meta_description, locale), post_reactions(count)`)
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single()

  if (!post) notFound()

  const t = (post.translations || []).find((tr: any) => tr.locale === locale) || post.translations?.[0]

  return (
    <>
      <Navbar dict={dict.nav} />
      <main className="pt-24">
        <div className="bg-[var(--color-navy-deep)] pt-16 pb-16 md:pt-20">
          <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/blog" className="inline-flex items-center gap-2 text-[var(--color-primary)] text-xs font-semibold tracking-widest uppercase mb-8 hover:opacity-75 transition-opacity">
              <ArrowLeft className="w-3.5 h-3.5" /> {locale === 'es' ? 'Volver al Blog' : 'Back to Blog'}
            </Link>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {post.category && (
                <span className="inline-block text-[10px] font-semibold tracking-[0.25em] uppercase text-[var(--color-primary)]">
                  {post.category}
                </span>
              )}
              {post.source_url ? (
                <a href={post.source_url} target="_blank" rel="noopener noreferrer">
                  <SourceBadge platform={post.source_platform} className="bg-white/5 hover:bg-white/10 transition-colors" />
                </a>
              ) : (
                <SourceBadge platform={post.source_platform} className="bg-white/5" />
              )}
            </div>
            <h1
              className="text-4xl lg:text-6xl font-light tracking-tight text-white mb-6 max-w-4xl"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {t?.title}
            </h1>
            <div className="h-px w-16 bg-[var(--color-primary)] opacity-60 mb-6" />
            <div className="flex items-center gap-6 text-white/50 text-sm">
              {post.author_name && (
                <span className="flex items-center gap-2"><User className="w-4 h-4" />{post.author_name}</span>
              )}
              {post.published_at && (
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {formatDate(post.published_at, locale === 'es' ? 'es-MX' : 'en-US')}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-4xl">
          {post.media?.length > 0 ? (
            <PostMediaGallery media={post.media} title={t?.title || ''} />
          ) : post.image_url && (
            <div className="relative aspect-video rounded-lg overflow-hidden mb-12">
              <Image src={post.image_url} alt={t?.title || ''} fill className="object-cover" />
            </div>
          )}
          <div
            className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-[var(--color-secondary)] prose-p:text-[var(--color-muted-foreground)] prose-a:text-[var(--color-accent)]"
            dangerouslySetInnerHTML={{ __html: t?.content || '' }}
          />

          <div className="mt-12 pt-8 border-t border-[var(--color-border)]">
            <PostReactions postId={post.id} initialCount={post.post_reactions?.[0]?.count ?? 0} />
          </div>
        </div>
      </main>
      <Footer dict={dict.footer} navDict={dict.nav} />
    </>
  )
}
