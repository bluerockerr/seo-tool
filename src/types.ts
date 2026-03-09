export interface AnalysisResult {
  seoScore: number;
  scores: {
    metadata: number;
    content: number;
    headings: number;
    keywords: number;
  };
  keyword: {
    target: string;
    density: number;
    occurrences: number;
    inTitle: boolean;
    inDescription: boolean;
    inH1: boolean;
    inUrl: boolean;
  };
  metadata: {
    title: string;
    description: string;
    canonical: string;
    allMetaTags: Record<string, string>;
  };
  content: {
    wordCount: number;
    sentenceCount: number;
    paragraphCount: number;
    fleschScore: number;
    wordDensity: Array<{
      word: string;
      count: number;
      density: number;
    }>;
    passiveVoice: {
      percentage: number;
      count: number;
      examples: string[];
    };
    sentenceLengthStats: {
      average: number;
      longest: number;
      shortest: number;
      longSentenceCount: number;
      longSentences: string[];
    };
    paragraphLengthStats: {
      average: number;
      longest: number;
      shortest: number;
      longParagraphPercentage: number;
    };
    wordComplexity: {
      percentage: number;
      count: number;
      examples: string[];
    };
  };
  headings: {
    h1: string[];
    h2: string[];
    h3: string[];
    h4: string[];
    h5: string[];
    h6: string[];
  };
  images: {
    total: number;
    withAlt: number;
    withoutAlt: number;
    images: Array<{
      src: string;
      alt: string;
      hasAlt: boolean;
    }>;
  };
  links: {
    total: number;
    internal: number;
    external: number;
  };
  recommendations: Array<{
    type: 'error' | 'warning' | 'success';
    title: string;
    message: string;
  }>;
  schemas: Array<{
    type: string;
    found: boolean;
    valid: boolean;
    data?: any;
  }>;
  schemaRecommendations: string[];
  contentGap: {
    targetPage: {
      wordCount: number;
      headings: {
        h1: number;
        h2: number;
        h3: number;
      };
      keywords: string[];
    };
    competitorAverage: {
      wordCount: number;
      headings: {
        h1: number;
        h2: number;
        h3: number;
      };
      commonKeywords: string[];
      averageScore: number;
    };
    gaps: Array<{
      category: string;
      issue: string;
      recommendation: string;
    }>;
  };
}
