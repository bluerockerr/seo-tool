import { Check, X, AlertCircle, AlertTriangle } from 'lucide-react';
import { AnalysisResult } from '../types';
import CircleProgress from './CircleProgress';

interface OverviewProps {
  analysis: AnalysisResult;
}

export default function Overview({ analysis }: OverviewProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-amber-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getScoreWidth = (score: number) => `${score}%`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-6">SEO Score</h2>
        <div className="flex justify-center">
          <CircleProgress percentage={analysis.seoScore} />
        </div>
        <div className="mt-8 space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Metadata</span>
              <span className="font-medium">{analysis.scores.metadata}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getScoreColor(analysis.scores.metadata)}`}
                style={{ width: getScoreWidth(analysis.scores.metadata) }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Content</span>
              <span className="font-medium">{analysis.scores.content}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getScoreColor(analysis.scores.content)}`}
                style={{ width: getScoreWidth(analysis.scores.content) }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Headings</span>
              <span className="font-medium">{analysis.scores.headings}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getScoreColor(analysis.scores.headings)}`}
                style={{ width: getScoreWidth(analysis.scores.headings) }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Keywords</span>
              <span className="font-medium">{analysis.scores.keywords}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getScoreColor(analysis.scores.keywords)}`}
                style={{ width: getScoreWidth(analysis.scores.keywords) }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-6">Keyword Performance</h2>
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Given Keyword:</p>
          <p className="text-lg font-medium text-blue-600">{analysis.keyword.target}</p>
        </div>

        <div className="space-y-4 mt-6">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-600">Keyword Density:</span>
              <span
                className={`text-sm font-medium ${
                  analysis.keyword.density >= 0.5 && analysis.keyword.density <= 3
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {analysis.keyword.density.toFixed(2)}%{' '}
                {analysis.keyword.density < 0.5 ? '(Too Low)' : analysis.keyword.density > 3 ? '(Too High)' : ''}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-sm text-gray-700">Keyword in Meta Title</span>
            {analysis.keyword.inTitle ? (
              <Check className="w-5 h-5 text-green-600" />
            ) : (
              <X className="w-5 h-5 text-red-600" />
            )}
          </div>

          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-sm text-gray-700">Keyword in Meta Description</span>
            {analysis.keyword.inDescription ? (
              <Check className="w-5 h-5 text-green-600" />
            ) : (
              <X className="w-5 h-5 text-red-600" />
            )}
          </div>

          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-sm text-gray-700">Keyword in H1 Heading</span>
            {analysis.keyword.inH1 ? (
              <Check className="w-5 h-5 text-green-600" />
            ) : (
              <X className="w-5 h-5 text-red-600" />
            )}
          </div>

          <div className="flex justify-between items-center py-3">
            <span className="text-sm text-gray-700">Keyword Occurrences</span>
            <span className="text-sm font-medium">{analysis.keyword.occurrences}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-6">Recommendations</h2>
        <div className="space-y-4">
          {analysis.recommendations.length === 0 ? (
            <div className="flex items-start space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-green-900">Great job!</p>
                <p className="text-sm text-green-700 mt-1">
                  Your page is well optimized for the target keyword.
                </p>
              </div>
            </div>
          ) : (
            analysis.recommendations.map((rec, index) => (
              <div
                key={index}
                className={`flex items-start space-x-3 p-4 rounded-lg border ${
                  rec.type === 'error'
                    ? 'bg-red-50 border-red-200'
                    : rec.type === 'warning'
                    ? 'bg-amber-50 border-amber-200'
                    : 'bg-blue-50 border-blue-200'
                }`}
              >
                {rec.type === 'error' ? (
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p
                    className={`font-medium ${
                      rec.type === 'error'
                        ? 'text-red-900'
                        : rec.type === 'warning'
                        ? 'text-amber-900'
                        : 'text-blue-900'
                    }`}
                  >
                    {rec.title}
                  </p>
                  <p
                    className={`text-sm mt-1 ${
                      rec.type === 'error'
                        ? 'text-red-700'
                        : rec.type === 'warning'
                        ? 'text-amber-700'
                        : 'text-blue-700'
                    }`}
                  >
                    {rec.message}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
