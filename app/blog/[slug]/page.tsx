import { cookies, headers } from 'next/headers'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getLocaleFromHeader, getDictionary, type Locale } from '@/lib/i18n/dictionaries'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
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
    .select(`id, slug, image_url, category, published_at, author_name,
      translations:blog_posts_translations(title, excerpt, content, meta_title, meta_description, locale)`)
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single()

  if (!post) notFound()

  const t = (post.translations || []).find((tr: any) => tr.locale === locale) || post.translations?.[0]

  return (
    <>
      <Navbar dict={dict.nav} />
      <main className="pt-24">
        <div className="bg-[var(--color-secondary)] py-16">
          <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/blog" className="inline-flex items-center gap-2 text-[var(--color-primary)] text-sm mb-6 hover:opacity-80 transition-opacity">
              <ArrowLeft className="w-4 h-4" /> {locale === 'es' ? 'Volver al Blog' : 'Back to Blog'}
            </Link>
            {post.category && (
              <span className="inline-block px-3 py-1 bg-[var(--color-primary)]/20 text-[var(--color-primary)] text-xs font-semibold rounded-full mb-4">
                {post.category}
              </span>
            )}
            <h1 className="text-3xl lg:text-5xl font-bold text-white mb-6 max-w-4xl">{t?.title}</h1>
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
          {post.image_url && (
            <div className="relative aspect-video rounded-2xl overflow-hidden mb-12">
              <Image src={post.image_url} alt={t?.title || ''} fill className="object-cover" />
            </div>
          )}
          <div
            className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-[var(--color-secondary)] prose-p:text-[var(--color-muted-foreground)] prose-a:text-[var(--color-accent)]"
            dangerouslySetInnerHTML={{ __html: t?.content || '' }}
          />
        </div>
      </main>
      <Footer dict={dict.footer} navDict={dict.nav} />
    </>
  )
}
