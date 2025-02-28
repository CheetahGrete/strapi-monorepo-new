import App from "next/app"
import type { AppProps, AppContext } from "next/app"
import Head from "next/head"
import Script from "next/script"
import ErrorPage from "next/error"
import { useRouter } from "next/router"
import { DefaultSeo } from "next-seo"
import { getStrapiMedia } from "utils/media"
import { getGlobalData } from "utils/api"
import "@/styles/index.css"

import toast, { Toaster } from "react-hot-toast"
import { QueryClient, QueryClientProvider } from "react-query"
import { ReactQueryDevtools } from "react-query/devtools"
import PlausibleProvider, { usePlausible } from "next-plausible"
import { useHasNewDeploy } from "next-deploy-notifications"

export const queryClient = new QueryClient()

const MyApp = ({ Component, pageProps }: AppProps) => {
  const plausible = usePlausible()
  let { hasNewDeploy } = useHasNewDeploy()

  if (hasNewDeploy) {
    toast.loading(
      <>
        <span>Neue Version verfügbar!</span>
        <button
          className="flex w-full items-center justify-center rounded-none rounded-r-lg border border-transparent p-4 text-sm font-medium text-primary-600 hover:text-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
          onClick={() => {
            plausible("loaded-new-version")
            window.location.reload()
          }}
        >
          Neu laden
        </button>
      </>
    ),
      {
        id: "new-version",
      }
  }

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
        <meta
          name="google-site-verification"
          content="U9xbjThB_tHh6i2IvLEb8A8N0FRq7DJYLk5joMER0LE"
        />
      </Head>

      {/* <Script
        id="usercentrics-cmp"
        data-settings-id={process.env.NEXT_PUBLIC_USERCENTRICS_SETTINGS_ID}
        src="https://app.usercentrics.eu/browser-ui/latest/loader.js"
        async
        strategy="beforeInteractive"
      /> */}

      <Script
        id="Cookiebot"
        src="https://consent.cookiebot.com/uc.js"
        data-cbid="9c0562ed-14b3-46ba-9616-8d74e5f3e1f7"
        data-blockingmode="auto"
        strategy="afterInteractive"
        type="text/javascript"
      />

      {/* <Script
        id="Google Tag Manager"
        data-usercentrics="Google Tag Manager"
        type="text/plain"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer', '${process.env.NEXT_PUBLIC_GTM_ID}');
          `,
        }}
      /> */}
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

      <PlausibleProvider domain="beammeup.today">
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
          <ReactQueryDevtools initialIsOpen={false} />

          <Toaster />
        </QueryClientProvider>
      </PlausibleProvider>
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
