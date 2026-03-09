import { TrendingUp, BookOpen, Hash, List } from 'lucide-react';

interface ContentGapProps {
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
}

export default function ContentGap({ targetPage, competitorAverage, gaps }: ContentGapProps) {
  const wordCountDiff = competitorAverage.wordCount - targetPage.wordCount;
  const wordCountPercentage = targetPage.wordCount > 0
    ? ((targetPage.wordCount / competitorAverage.wordCount) * 100).toFixed(0)
    : 0;

  return (
    <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Content Gap Analysis</h2>
          <p className="text-sm text-gray-600 mt-1">Compare with top-ranking pages</p>
        </div>
        <TrendingUp className="w-6 h-6 text-gray-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Your Page</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Word Count</span>
              <span className="font-semibold text-gray-900">{targetPage.wordCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">H1 Headings</span>
              <span className="font-semibold text-gray-900">{targetPage.headings.h1}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">H2 Headings</span>
              <span className="font-semibold text-gray-900">{targetPage.headings.h2}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">H3 Headings</span>
              <span className="font-semibold text-gray-900">{targetPage.headings.h3}</span>
            </div>
          </div>
        </div>

        <div className="border border-green-200 rounded-lg p-6 bg-green-50">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-gray-900">Top Competitors Average</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Word Count</span>
              <span className="font-semibold text-green-900">{competitorAverage.wordCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">H1 Headings</span>
              <span className="font-semibold text-green-900">{competitorAverage.headings.h1}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">H2 Headings</span>
              <span className="font-semibold text-green-900">{competitorAverage.headings.h2}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">H3 Headings</span>
              <span className="font-semibold text-green-900">{competitorAverage.headings.h3}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
          <Hash className="w-5 h-5 mr-2 text-gray-600" />
          Word Count Comparison
        </h3>
        <div className="relative">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Your page is at {wordCountPercentage}% of competitor average</span>
            <span className={`font-medium ${wordCountDiff > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {wordCountDiff > 0 ? `${wordCountDiff} words behind` : `${Math.abs(wordCountDiff)} words ahead`}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full ${
                Number(wordCountPercentage) >= 100 ? 'bg-green-500' :
                Number(wordCountPercentage) >= 70 ? 'bg-amber-500' :
                'bg-red-500'
              }`}
              style={{ width: `${Math.min(Number(wordCountPercentage), 100)}%` }}
            />
          </div>
        </div>
      </div>

      {competitorAverage.commonKeywords.length > 0 && (
        <div className="mb-8">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <List className="w-5 h-5 mr-2 text-gray-600" />
            LSI Keywords Found in Top Pages
          </h3>
          <div className="flex flex-wrap gap-2">
            {competitorAverage.commonKeywords.map((keyword, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
              >
                {keyword}
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-3">
            Consider incorporating these related keywords naturally into your content to improve topical relevance.
          </p>
        </div>
      )}

      {gaps.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Key Gaps to Address</h3>
          <div className="space-y-3">
            {gaps.map((gap, index) => (
              <div
                key={index}
                className="border border-amber-200 rounded-lg p-4 bg-amber-50"
              >
                <div className="flex items-start space-x-3">
                  <TrendingUp className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-amber-900 mb-1">{gap.issue}</p>
                    <p className="text-sm text-amber-800 mb-2">{gap.recommendation}</p>
                    <span className="inline-block text-xs bg-white px-2 py-1 rounded border border-amber-300 text-amber-700">
                      {gap.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          <strong>Note:</strong> This analysis is based on estimated patterns from top-ranking pages. Focus on creating comprehensive, high-quality content that serves user intent rather than just matching competitor metrics.
        </p>
      </div>
    </div>
  );
}
