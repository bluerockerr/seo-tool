import { AnalysisResult } from '../types';

interface ContentProps {
  analysis: AnalysisResult;
}

export default function Content({ analysis }: ContentProps) {
  const { content, headings } = analysis;

  const getReadabilityColor = (score: number) => {
    if (score >= 60) return 'text-green-600';
    if (score >= 30) return 'text-amber-600';
    return 'text-red-600';
  };

  const getReadabilityLabel = (score: number) => {
    if (score >= 90) return 'Very Easy';
    if (score >= 80) return 'Easy';
    if (score >= 70) return 'Fairly Easy';
    if (score >= 60) return 'Standard';
    if (score >= 50) return 'Fairly Difficult';
    if (score >= 30) return 'Difficult';
    return 'Very Difficult';
  };

  const getBarColor = (value: number, threshold: { good: number; warning: number }) => {
    if (value <= threshold.good) return 'bg-green-500';
    if (value <= threshold.warning) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getBarWidth = (value: number, max: number) => {
    return `${Math.min((value / max) * 100, 100)}%`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-6">Readability</h2>

        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">Flesch Reading Score:</p>
          <p className={`text-3xl font-bold ${getReadabilityColor(content.fleschScore)}`}>
            {content.fleschScore}
          </p>
          <p className="text-sm text-gray-600 mt-1">{getReadabilityLabel(content.fleschScore)}</p>
          <p className="text-xs text-gray-500 mt-3">
            Your target Flesch score is 60-80 for a standard difficulty
          </p>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Passive Voice</span>
              <span className="font-medium">{content.passiveVoice.percentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${getBarColor(content.passiveVoice.percentage, { good: 10, warning: 20 })}`}
                style={{ width: getBarWidth(content.passiveVoice.percentage, 40) }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Sentence Length</span>
              <span className="font-medium">{content.sentenceLengthStats.average} words</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${getBarColor(content.sentenceLengthStats.average, { good: 20, warning: 25 })}`}
                style={{ width: getBarWidth(content.sentenceLengthStats.average, 40) }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Paragraph Length</span>
              <span className="font-medium">{content.paragraphLengthStats.average} words</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${getBarColor(content.paragraphLengthStats.average, { good: 150, warning: 200 })}`}
                style={{ width: getBarWidth(content.paragraphLengthStats.average, 300) }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Word Complexity</span>
              <span className="font-medium">{content.wordComplexity.percentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${getBarColor(content.wordComplexity.percentage, { good: 15, warning: 25 })}`}
                style={{ width: getBarWidth(content.wordComplexity.percentage, 50) }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Transition Words</span>
              <span className="font-medium">-</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="h-2.5 rounded-full bg-gray-400" style={{ width: '0%' }} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-6">Stats</h2>
        <div className="space-y-4">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Word Count:</span>
            <span className="font-medium">{content.wordCount}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Keyword Occurrences:</span>
            <span className="font-medium">{analysis.keyword.occurrences}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Keyword Density:</span>
            <span className="font-medium">{analysis.keyword.density.toFixed(2)}%</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Images with Alt Text:</span>
            <span className="font-medium">{analysis.images.withAlt}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Links:</span>
            <span className="font-medium">{analysis.links.total}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Sentences:</span>
            <span className="font-medium">{content.sentenceCount}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Paragraphs:</span>
            <span className="font-medium">{content.paragraphCount}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-sm text-gray-600">Transitional Sentences:</span>
            <span className="font-medium">-</span>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="font-semibold mb-3">Headings</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {headings.h1.map((heading, index) => (
              <div key={`h1-${index}`} className="text-sm py-2 px-3 bg-gray-50 rounded border-l-4 border-blue-600">
                <span className="font-medium text-gray-500 mr-2">H1</span>
                {heading}
              </div>
            ))}
            {headings.h2.map((heading, index) => (
              <div key={`h2-${index}`} className="text-sm py-2 px-3 bg-gray-50 rounded border-l-4 border-blue-500">
                <span className="font-medium text-gray-500 mr-2">H2</span>
                {heading}
              </div>
            ))}
            {headings.h3.map((heading, index) => (
              <div key={`h3-${index}`} className="text-sm py-2 px-3 bg-gray-50 rounded border-l-4 border-blue-400">
                <span className="font-medium text-gray-500 mr-2">H3</span>
                {heading}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-6">Word Density</h2>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 pb-2 border-b border-gray-200 font-medium text-sm text-gray-600">
            <span className="w-8">1 Word</span>
            <span className="w-8">2 Word</span>
            <span className="w-8">3 Word</span>
          </div>
          {content.wordDensity.slice(0, 15).map((word, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">{word.word}</span>
                <span className="text-gray-600">
                  {word.count} ({word.density.toFixed(1)}%)
                </span>
              </div>
            </div>
          ))}
        </div>

        {content.passiveVoice.examples.length > 0 && (
          <div className="mt-8 pt-6 border-t">
            <h3 className="font-semibold mb-3">Passive Voice</h3>
            <p className="text-sm text-gray-600 mb-3">
              Passive voice sentence percentage: {content.passiveVoice.percentage.toFixed(1)}%
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-900">
                These sentences are written in a passive voice. It is okay to have some passive voice in your writing, but
                too much can decrease authority and readability.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
