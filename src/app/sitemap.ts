// app/sitemap.ts

import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://new-zealand-taylor-rule-ocr.vercel.app/',  // Replace with your homepage URL
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://new-zealand-taylor-rule-ocr.vercel.app/methodology',  // Replace with your Methodology page URL
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.8,
    },
  ]
}
