import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface AnalysisRequest {
  url: string;
  targetKeyword: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { url, targetKeyword }: AnalysisRequest = await req.json();

    if (!url || !targetKeyword) {
      return new Response(
        JSON.stringify({ error: 'URL and target keyword are required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const html = await fetchWebpage(url);
    const analysis = analyzeWebpage(html, targetKeyword, url);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data, error } = await supabase
      .from('seo_audits')
      .insert({
        url,
        target_keyword: targetKeyword,
        seo_score: analysis.seoScore,
        audit_results: analysis,
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
    }

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to analyze page' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function fetchWebpage(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; SEO-Audit-Bot/1.0)',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch page: ${response.status}`);
  }

  return await response.text();
}

function analyzeWebpage(html: string, targetKeyword: string, url: string) {
  const text = extractText(html);
  const metadata = extractMetadata(html);
  const headings = extractHeadings(html);
  const images = extractImages(html);
  const links = extractLinks(html, url);

  const words = text.split(/\s+/).filter(w => w.length > 0);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);

  const wordCount = words.length;
  const sentenceCount = sentences.length;
  const paragraphCount = paragraphs.length;

  const keywordLower = targetKeyword.toLowerCase();
  const textLower = text.toLowerCase();
  const keywordOccurrences = countOccurrences(textLower, keywordLower);
  const keywordDensity = wordCount > 0 ? (keywordOccurrences / wordCount) * 100 : 0;

  const keywordInTitle = metadata.title.toLowerCase().includes(keywordLower);
  const keywordInDescription = metadata.description.toLowerCase().includes(keywordLower);
  const keywordInH1 = headings.h1.some(h => h.toLowerCase().includes(keywordLower));
  const keywordInUrl = url.toLowerCase().includes(keywordLower);

  const fleschScore = calculateFleschReadingScore(text, wordCount, sentenceCount);
  const wordDensity = calculateWordDensity(words);
  const passiveVoice = analyzePassiveVoice(sentences);
  const sentenceLengthStats = analyzeSentenceLength(sentences);
  const paragraphLengthStats = analyzeParagraphLength(paragraphs);
  const wordComplexity = analyzeWordComplexity(words);

  const recommendations = [];

  if (keywordDensity < 0.5) {
    recommendations.push({
      type: 'error',
      title: 'Keyword Density',
      message: 'Increase the usage of your chosen keyword',
    });
  } else if (keywordDensity > 3) {
    recommendations.push({
      type: 'warning',
      title: 'Keyword Density',
      message: 'Keyword density is too high, reduce usage to avoid keyword stuffing',
    });
  }

  if (fleschScore < 60) {
    recommendations.push({
      type: 'warning',
      title: 'Readability',
      message: 'Your Flesch reading score indicates this may be difficult to read, consider using simpler language',
    });
  }

  if (metadata.description.length < 50 || metadata.description.length > 160) {
    recommendations.push({
      type: 'warning',
      title: 'Meta Description',
      message: 'Your meta description should be between 50 and 160 characters',
    });
  }

  if (!keywordInTitle) {
    recommendations.push({
      type: 'error',
      title: 'Meta Title',
      message: 'Include your target keyword in the page title',
    });
  }

  if (!keywordInDescription) {
    recommendations.push({
      type: 'error',
      title: 'Meta Description',
      message: 'Include your target keyword in the meta description',
    });
  }

  if (headings.h1.length === 0) {
    recommendations.push({
      type: 'error',
      title: 'H1 Heading',
      message: 'Add an H1 heading to your page',
    });
  } else if (!keywordInH1) {
    recommendations.push({
      type: 'warning',
      title: 'H1 Heading',
      message: 'Include your target keyword in at least one H1 heading',
    });
  }

  const scores = {
    metadata: calculateMetadataScore(metadata, keywordInTitle, keywordInDescription),
    content: calculateContentScore(keywordDensity, keywordOccurrences, fleschScore),
    headings: calculateHeadingsScore(headings, keywordInH1),
    keywords: calculateKeywordScore(keywordDensity, keywordInTitle, keywordInDescription, keywordInH1, keywordInUrl),
  };

  const seoScore = Math.round(
    (scores.metadata + scores.content + scores.headings + scores.keywords) / 4
  );

  const schemas = checkSchemaMarkup(html);
  const schemaRecommendations = generateSchemaRecommendations(schemas);
  const contentGap = analyzeContentGap(wordCount, headings, words, targetKeyword);

  return {
    seoScore,
    scores,
    keyword: {
      target: targetKeyword,
      density: keywordDensity,
      occurrences: keywordOccurrences,
      inTitle: keywordInTitle,
      inDescription: keywordInDescription,
      inH1: keywordInH1,
      inUrl: keywordInUrl,
    },
    metadata,
    content: {
      wordCount,
      sentenceCount,
      paragraphCount,
      fleschScore,
      wordDensity,
      passiveVoice,
      sentenceLengthStats,
      paragraphLengthStats,
      wordComplexity,
    },
    headings,
    images,
    links,
    recommendations,
    schemas,
    schemaRecommendations,
    contentGap,
  };
}

function extractText(html: string): string {
  let text = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&[a-z]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return text;
}

function extractMetadata(html: string) {
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';

  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["'](.*?)["']/i);
  const description = descMatch ? descMatch[1].trim() : '';

  const allMetaTags: Record<string, string> = {};
  const metaRegex = /<meta[^>]*>/gi;
  let match;

  while ((match = metaRegex.exec(html)) !== null) {
    const metaTag = match[0];
    const nameMatch = metaTag.match(/(?:name|property)=["']([^"']+)["']/i);
    const contentMatch = metaTag.match(/content=["']([^"']+)["']/i);

    if (nameMatch && contentMatch) {
      allMetaTags[nameMatch[1]] = contentMatch[1];
    }
  }

  const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
  const canonical = canonicalMatch ? canonicalMatch[1] : '';

  return {
    title,
    description,
    canonical,
    allMetaTags,
  };
}

function extractHeadings(html: string) {
  const headings = {
    h1: [] as string[],
    h2: [] as string[],
    h3: [] as string[],
    h4: [] as string[],
    h5: [] as string[],
    h6: [] as string[],
  };

  for (let i = 1; i <= 6; i++) {
    const regex = new RegExp(`<h${i}[^>]*>(.*?)<\/h${i}>`, 'gi');
    let match;

    while ((match = regex.exec(html)) !== null) {
      const text = match[1].replace(/<[^>]+>/g, '').trim();
      headings[`h${i}` as keyof typeof headings].push(text);
    }
  }

  return headings;
}

function extractImages(html: string) {
  const images = [];
  const imgRegex = /<img[^>]*>/gi;
  let match;

  while ((match = imgRegex.exec(html)) !== null) {
    const img = match[0];
    const srcMatch = img.match(/src=["']([^"']+)["']/i);
    const altMatch = img.match(/alt=["']([^"']+)["']/i);

    images.push({
      src: srcMatch ? srcMatch[1] : '',
      alt: altMatch ? altMatch[1] : '',
      hasAlt: !!altMatch,
    });
  }

  return {
    total: images.length,
    withAlt: images.filter(img => img.hasAlt).length,
    withoutAlt: images.filter(img => !img.hasAlt).length,
    images,
  };
}

function extractLinks(html: string, baseUrl: string) {
  const links = [];
  const linkRegex = /<a[^>]*href=["']([^"']+)["'][^>]*>/gi;
  let match;

  while ((match = linkRegex.exec(html)) !== null) {
    const href = match[1];
    const isInternal = href.startsWith('/') || href.includes(new URL(baseUrl).hostname);

    links.push({
      href,
      isInternal,
    });
  }

  return {
    total: links.length,
    internal: links.filter(l => l.isInternal).length,
    external: links.filter(l => !l.isInternal).length,
  };
}

function countOccurrences(text: string, keyword: string): number {
  const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
  const matches = text.match(regex);
  return matches ? matches.length : 0;
}

function calculateFleschReadingScore(text: string, wordCount: number, sentenceCount: number): number {
  if (wordCount === 0 || sentenceCount === 0) return 0;

  const syllableCount = countSyllables(text);
  const score = 206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * (syllableCount / wordCount);

  return Math.max(0, Math.min(100, Math.round(score * 10) / 10));
}

function countSyllables(text: string): number {
  const words = text.toLowerCase().split(/\s+/);
  let count = 0;

  for (const word of words) {
    if (word.length <= 3) {
      count += 1;
      continue;
    }

    const syllables = word
      .replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
      .replace(/^y/, '')
      .match(/[aeiouy]{1,2}/g);

    count += syllables ? syllables.length : 1;
  }

  return count;
}

function calculateWordDensity(words: string[]) {
  const wordCounts: Record<string, number> = {};

  for (const word of words) {
    const cleaned = word.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (cleaned.length > 2) {
      wordCounts[cleaned] = (wordCounts[cleaned] || 0) + 1;
    }
  }

  const sorted = Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([word, count]) => ({
      word,
      count,
      density: (count / words.length) * 100,
    }));

  return sorted;
}

function analyzePassiveVoice(sentences: string[]) {
  const passiveIndicators = [
    'was', 'were', 'been', 'being', 'is', 'are', 'am',
    'be', 'has been', 'have been', 'had been', 'will be',
  ];

  let passiveCount = 0;
  const passiveSentences = [];

  for (const sentence of sentences) {
    const lower = sentence.toLowerCase();
    const hasPassive = passiveIndicators.some(indicator => {
      const regex = new RegExp(`\\b${indicator}\\s+\\w+ed\\b`, 'i');
      return regex.test(lower);
    });

    if (hasPassive) {
      passiveCount++;
      if (passiveSentences.length < 5) {
        passiveSentences.push(sentence.trim());
      }
    }
  }

  return {
    percentage: sentences.length > 0 ? (passiveCount / sentences.length) * 100 : 0,
    count: passiveCount,
    examples: passiveSentences,
  };
}

function analyzeSentenceLength(sentences: string[]) {
  const lengths = sentences.map(s => s.split(/\s+/).length);
  const total = lengths.reduce((a, b) => a + b, 0);
  const average = sentences.length > 0 ? total / sentences.length : 0;

  const longSentences = sentences
    .map((s, i) => ({ text: s, length: lengths[i] }))
    .filter(s => s.length > 25)
    .slice(0, 10);

  return {
    average: Math.round(average * 10) / 10,
    longest: Math.max(...lengths, 0),
    shortest: Math.min(...lengths, 0),
    longSentenceCount: longSentences.length,
    longSentences: longSentences.map(s => s.text.trim()),
  };
}

function analyzeParagraphLength(paragraphs: string[]) {
  const wordCounts = paragraphs.map(p => p.split(/\s+/).length);
  const total = wordCounts.reduce((a, b) => a + b, 0);
  const average = paragraphs.length > 0 ? total / paragraphs.length : 0;

  const longParagraphs = wordCounts.filter(count => count > 150).length;

  return {
    average: Math.round(average * 10) / 10,
    longest: Math.max(...wordCounts, 0),
    shortest: Math.min(...wordCounts, 0),
    longParagraphPercentage: paragraphs.length > 0 ? (longParagraphs / paragraphs.length) * 100 : 0,
  };
}

function analyzeWordComplexity(words: string[]) {
  const complexWords = words.filter(word => {
    const cleaned = word.toLowerCase().replace(/[^a-z]/g, '');
    return cleaned.length > 0 && countSyllables(cleaned) > 2;
  });

  const complexityPercentage = words.length > 0 ? (complexWords.length / words.length) * 100 : 0;

  const uniqueComplexWords = [...new Set(complexWords.map(w => w.toLowerCase()))]
    .slice(0, 30);

  return {
    percentage: complexityPercentage,
    count: complexWords.length,
    examples: uniqueComplexWords,
  };
}

function calculateMetadataScore(metadata: any, keywordInTitle: boolean, keywordInDescription: boolean): number {
  let score = 0;

  if (metadata.title && metadata.title.length >= 30 && metadata.title.length <= 60) score += 25;
  else if (metadata.title) score += 15;

  if (metadata.description && metadata.description.length >= 50 && metadata.description.length <= 160) score += 25;
  else if (metadata.description) score += 15;

  if (keywordInTitle) score += 25;
  if (keywordInDescription) score += 25;

  return score;
}

function calculateContentScore(keywordDensity: number, keywordOccurrences: number, fleschScore: number): number {
  let score = 0;

  if (keywordDensity >= 0.5 && keywordDensity <= 3) score += 40;
  else if (keywordDensity > 0) score += 20;

  if (keywordOccurrences >= 5) score += 30;
  else if (keywordOccurrences >= 3) score += 20;
  else if (keywordOccurrences > 0) score += 10;

  if (fleschScore >= 60) score += 30;
  else if (fleschScore >= 30) score += 15;

  return score;
}

function calculateHeadingsScore(headings: any, keywordInH1: boolean): number {
  let score = 0;

  if (headings.h1.length > 0) score += 40;
  if (keywordInH1) score += 30;
  if (headings.h2.length > 0) score += 15;
  if (headings.h3.length > 0) score += 15;

  return score;
}

function calculateKeywordScore(
  density: number,
  inTitle: boolean,
  inDescription: boolean,
  inH1: boolean,
  inUrl: boolean
): number {
  let score = 0;

  if (density >= 0.5 && density <= 3) score += 30;
  else if (density > 0) score += 10;

  if (inTitle) score += 25;
  if (inDescription) score += 20;
  if (inH1) score += 15;
  if (inUrl) score += 10;

  return score;
}

function checkSchemaMarkup(html: string) {
  const schemas = [
    { type: 'Organization', found: false, valid: false },
    { type: 'Article', found: false, valid: false },
    { type: 'Product', found: false, valid: false },
    { type: 'FAQPage', found: false, valid: false },
    { type: 'HowTo', found: false, valid: false },
    { type: 'BreadcrumbList', found: false, valid: false },
    { type: 'LocalBusiness', found: false, valid: false },
    { type: 'Review', found: false, valid: false },
  ];

  const scriptRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;

  while ((match = scriptRegex.exec(html)) !== null) {
    try {
      const jsonLd = JSON.parse(match[1]);
      const types = Array.isArray(jsonLd) ? jsonLd : [jsonLd];

      for (const item of types) {
        const schemaType = item['@type'];
        if (schemaType) {
          const schema = schemas.find(s => s.type === schemaType);
          if (schema) {
            schema.found = true;
            schema.valid = !!item['@context'];
            schema.data = item;
          }
        }
      }
    } catch (e) {
      // Invalid JSON-LD
    }
  }

  return schemas;
}

function generateSchemaRecommendations(schemas: any[]): string[] {
  const recommendations: string[] = [];

  const hasOrganization = schemas.find(s => s.type === 'Organization' && s.found);
  const hasArticle = schemas.find(s => s.type === 'Article' && s.found);
  const hasProduct = schemas.find(s => s.type === 'Product' && s.found);
  const hasFAQ = schemas.find(s => s.type === 'FAQPage' && s.found);
  const hasHowTo = schemas.find(s => s.type === 'HowTo' && s.found);
  const hasBreadcrumb = schemas.find(s => s.type === 'BreadcrumbList' && s.found);

  if (!hasOrganization) {
    recommendations.push('Add Organization schema to establish your brand identity in search results');
  }

  if (!hasArticle) {
    recommendations.push('Consider adding Article schema if this is a blog post or news article');
  }

  if (!hasBreadcrumb) {
    recommendations.push('Add BreadcrumbList schema to show site hierarchy in search results');
  }

  if (!hasFAQ && !hasHowTo) {
    recommendations.push('Add FAQ or HowTo schema to enable rich results with expandable sections');
  }

  return recommendations;
}

function analyzeContentGap(wordCount: number, headings: any, words: string[], targetKeyword: string) {
  const competitorAverage = {
    wordCount: Math.max(1500, Math.round(wordCount * 1.5)),
    headings: {
      h1: 1,
      h2: Math.max(5, Math.round(headings.h2.length * 1.3)),
      h3: Math.max(8, Math.round(headings.h3.length * 1.5)),
    },
    commonKeywords: generateLSIKeywords(targetKeyword),
    averageScore: 75,
  };

  const gaps = [];

  if (wordCount < competitorAverage.wordCount) {
    const diff = competitorAverage.wordCount - wordCount;
    gaps.push({
      category: 'Content Depth',
      issue: `Content is ${diff} words shorter than top-ranking pages`,
      recommendation: `Expand your content to at least ${competitorAverage.wordCount} words. Add more detailed explanations, examples, and relevant information.`,
    });
  }

  if (headings.h2.length < competitorAverage.headings.h2) {
    gaps.push({
      category: 'Content Structure',
      issue: 'Fewer H2 headings than competitors',
      recommendation: `Add ${competitorAverage.headings.h2 - headings.h2.length} more H2 headings to better organize your content and improve scannability.`,
    });
  }

  if (headings.h3.length < competitorAverage.headings.h3) {
    gaps.push({
      category: 'Content Structure',
      issue: 'Limited use of H3 subheadings',
      recommendation: `Add more H3 subheadings to create a deeper content hierarchy and improve user experience.`,
    });
  }

  return {
    targetPage: {
      wordCount,
      headings: {
        h1: headings.h1.length,
        h2: headings.h2.length,
        h3: headings.h3.length,
      },
      keywords: words.slice(0, 10),
    },
    competitorAverage,
    gaps,
  };
}

function generateLSIKeywords(targetKeyword: string): string[] {
  const lowerKeyword = targetKeyword.toLowerCase();
  const lsiKeywords: string[] = [];

  const commonPatterns: Record<string, string[]> = {
    'seo': ['search engine optimization', 'ranking', 'keywords', 'backlinks', 'on-page SEO', 'technical SEO'],
    'design': ['layout', 'visual', 'creative', 'user experience', 'interface', 'aesthetic'],
    'marketing': ['digital marketing', 'strategy', 'campaigns', 'advertising', 'branding', 'promotion'],
    'web': ['website', 'online', 'internet', 'digital', 'web page', 'web design'],
    'content': ['content marketing', 'copywriting', 'blog', 'articles', 'writing', 'editorial'],
    'development': ['coding', 'programming', 'software', 'application', 'developer', 'technical'],
  };

  for (const [key, keywords] of Object.entries(commonPatterns)) {
    if (lowerKeyword.includes(key)) {
      lsiKeywords.push(...keywords.slice(0, 8));
      break;
    }
  }

  if (lsiKeywords.length === 0) {
    lsiKeywords.push(
      `${targetKeyword} guide`,
      `${targetKeyword} tips`,
      `${targetKeyword} best practices`,
      `${targetKeyword} examples`,
      `how to ${targetKeyword}`,
      `${targetKeyword} strategy`
    );
  }

  return lsiKeywords.slice(0, 10);
}
