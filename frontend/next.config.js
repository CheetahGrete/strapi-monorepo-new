const withPlugins = require("next-compose-plugins")
const { StatsWriterPlugin } = require("webpack-stats-plugin")
const { RelativeCiAgentWebpackPlugin } = require("@relative-ci/agent")
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
})

const nextConfig = {
  i18n: {
    locales: ["de"],
    defaultLocale: "de",
  },
  images: {
    deviceSizes: [320, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [4, 8, 16, 32, 48, 64, 96, 128, 256, 384],
    domains: [
      "localhost",
      "s3-images-strapibeammeup.s3.eu-central-1.amazonaws.com",
      "images.unsplash.com",
      "s3-images-idealcoachingfargate.s3.eu-central-1.amazonaws.com",
    ],
  },
  async redirects() {
    return [
      {
        source: "/cms",
        destination: "/",
        permanent: true,
      },
      {
        source: "/cookie-consent",
        destination: "/",
        permanent: true,
      },
      {
        source: "/webanalyse",
        destination: "/",
        permanent: true,
      },
      {
        source: "/seo-analyse-seo-beratung",
        destination: "/",
        permanent: true,
      },
      {
        source: "/ads.txt",
        destination: "/",
        permanent: true,
      },
      {
        source: "/apple-app-site-association",
        destination: "/kontakt",
        permanent: true,
      },
      {
        source: "/.well-known/apple-app-site-association",
        destination: "/",
        permanent: true,
      },
      {
        source: "/ueber-mich",
        destination: "/",
        permanent: true,
      },
      {
        source: "/firstspirit-spezialistin",
        destination: "/",
        permanent: true,
      },
      {
        source: "/de/philosophie/herzlichwillkommen.html",
        destination: "/",
        permanent: true,
      },
      {
        source: "/webanalyse-die-wirkt",
        destination: "/",
        permanent: true,
      },
      {
        source: "/static/Isabell-Mader-8280fb855241d09f06ad83c24798b29b.jpg",
        destination: "/",
        permanent: true,
      },
      {
        source: "/webanalyse-die-wirkt",
        destination: "/",
        permanent: true,
      },
      {
        source: "/seo-analyse",
        destination: "/",
        permanent: true,
      },
      {
        source: "/wp-content/uploads/Laptop-mit-Statistiken-768x509.jpg",
        destination: "/",
        permanent: true,
      },
      {
        source: "/wp-content/uploads/Logo_mader_150.png",
        destination: "/",
        permanent: true,
      },
      {
        source: "/index.php/single-post",
        destination: "/",
        permanent: true,
      },
      {
        source: "/webanalyse-mit-google-analytics-seo-adwords",
        destination: "/",
        permanent: true,
      },
      {
        source: "/index.php/ct-menu-item-13",
        destination: "/",
        permanent: true,
      },
      {
        source: "/datenschutzerklaerung",
        destination: "/",
        permanent: true,
      },
      {
        source: "/icons/icon-72x72.png",
        destination: "/",
        permanent: true,
      },
      {
        source: "/uebermich",
        destination: "/",
        permanent: true,
      },
      {
        source: "/index.php",
        destination: "/",
        permanent: true,
      },
      {
        source: "/webanalyse-tools",
        destination: "/",
        permanent: true,
      },
      {
        source: "/haftungsausschluss",
        destination: "/",
        permanent: true,
      },
      {
        source: "/seo-analyse-kostenlos",
        destination: "/",
        permanent: true,
      },
      {
        source: "/firstspirit",
        destination: "/",
        permanent: true,
      },
      {
        source: "/author/isabell",
        destination: "/",
        permanent: true,
      },
      {
        source: "/de/anfrage.html",
        destination: "/kontakt",
        permanent: true,
      },
      {
        source: "/website-anfrage",
        destination: "/kontakt",
        permanent: true,
      },

      {
        source: "/landingpage-ebook",
        destination: "https://online-marketing.company/landingpage-ebook",
        permanent: true,
      },
      {
        source: "/technik",
        destination: "/schnelle-webseite",
        permanent: true,
      },
      {
        source: "/google.com",
        destination: "/",
        permanent: true,
      },
    ]
  },
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.plugins.push(
        new RelativeCiAgentWebpackPlugin({
          stats: { excludeAssets: [/stats.json/] },
        })
      ),
        Object.assign(config.resolve.alias, {
          react: "preact/compat",
          "react-dom/test-utils": "preact/test-utils",
          "react-dom": "preact/compat",
        })
    }
    config.plugins.push(
      new StatsWriterPlugin({
        filename: "stats.json",
        stats: {
          context: "./", // optional, will improve readability of the paths
          assets: true,
          entrypoints: true,
          chunks: true,
          modules: true,
        },
      })
    )
    return config
  },
}

module.exports = withPlugins(
  [
    [withBundleAnalyzer],

    // your other plugins here
  ],
  nextConfig
)
