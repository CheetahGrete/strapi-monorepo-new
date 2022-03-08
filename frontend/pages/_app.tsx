import App from "next/app"
import type { AppProps, AppContext } from "next/app"
import Head from "next/head"

import ErrorPage from "next/error"
import { useRouter } from "next/router"
import { DefaultSeo } from "next-seo"
import { getStrapiMedia } from "utils/media"
import { getGlobalData } from "utils/api"
import "@/styles/index.css"

import toast, { Toaster } from "react-hot-toast"
import { QueryClient, QueryClientProvider } from "react-query"
import { ReactQueryDevtools } from "react-query/devtools"

const MyApp = ({ Component, pageProps }: AppProps) => {
  const queryClient = new QueryClient()

  const router = useRouter()

  if (router.asPath === "/[[...slug]]") {
    return null
  }

  // Extract the data we need
  const { global } = pageProps
  if (global == null) {
    return <ErrorPage statusCode={404} />
  }

  const { metadata } = global

  const shareImages: IMedia = metadata.shareImage
  return (
    <>
      {/* Favicon */}
      <Head>
        <link rel="shortcut icon" href={getStrapiMedia(global.favicon.url)} />
        <link rel="prefetch" href="/fonts/inter-var-latin.woff2" />
      </Head>
      {/* Global site metadata */}
      <DefaultSeo
        description={metadata.metaDescription}
        openGraph={{
          url: getStrapiMedia(shareImages.url),

          /* images: Object.values(shareImages).map((image) => {
            return {
              url: getStrapiMedia(image.url),
              width: image.width,
              height: image.height,
            }
          }), */
        }}
        twitter={{
          cardType: metadata.twitterCardType,
          handle: metadata.twitterUsername,
        }}
      />
      {/* Display the content */}

      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
        <ReactQueryDevtools initialIsOpen={false} />

        <Toaster />
      </QueryClientProvider>
    </>
  )
}

// getInitialProps disables automatic static optimization for pages that don't
// have getStaticProps. So [[...slug]] pages still get SSG.
// Hopefully we can replace this with getStaticProps once this issue is fixed:
// https://github.com/vercel/next.js/discussions/10949
MyApp.getInitialProps = async (appContext: AppContext) => {
  // Calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext)
  const globalLocale = await getGlobalData(appContext.router.locale)

  return {
    ...appProps,
    pageProps: {
      global: globalLocale,
    },
  }
}

export default MyApp
