import { getPageData } from "utils/api"
import { NextApiRequest, NextApiResponse } from "next"

const preview = async (req: NextApiRequest, res: NextApiResponse) => {
  // Check the secret and next parameters
  // This secret should only be known to this API route and the CMS
  if (req.query.secret !== (process.env.PREVIEW_SECRET || "secret-token")) {
    return res.status(401).json({ message: "Invalid token" })
  }

  // Fetch the headless CMS to check if the provided `slug` exists
  const pageData = await getPageData(req.query.slug, true)

  // If the slug doesn't exist prevent preview mode from being enabled
  if (!pageData) {
    return res.status(401).json({ message: "Invalid slug" })
  }

  // Enable Preview Mode by setting the cookies
  res.setPreviewData({})

  // Redirect to the path from the fetched post
  // We don't redirect to req.query.slug as that might lead to open redirect vulnerabilities
  // deepcode ignore OR: Code cant be reached if preview secret is not valid
  res.writeHead(307, { Location: `/${pageData.slug.replace("__", "/")}` })
  res.end()
}

export default preview

// You can view Preview pages with URLs like this:
// http://localhost:3000/api/preview?secret=<preview-secret>&slug=<slug>
// where <preview-secret> is the secret token defined in your .env config
// and where <slug> is the slug you entered in Strapi for your page
