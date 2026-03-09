import { Check, X, AlertTriangle } from 'lucide-react';
import { AnalysisResult } from '../types';

interface MetadataProps {
  analysis: AnalysisResult;
}

export default function Metadata({ analysis }: MetadataProps) {
  const { metadata, keyword } = analysis;

  const titleLength = metadata.title.length;
  const descLength = metadata.description.length;

  const isTitleOptimal = titleLength >= 30 && titleLength <= 60;
  const isDescOptimal = descLength >= 50 && descLength <= 160;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-6">Meta Title</h2>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
          <p className="text-gray-900">{metadata.title || 'No meta title found'}</p>
        </div>

        <div className="flex items-start space-x-3 mb-4">
          {isTitleOptimal ? (
            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <p className={`font-medium ${isTitleOptimal ? 'text-green-900' : 'text-amber-900'}`}>
              {isTitleOptimal ? 'Looking Good!' : 'Needs Attention'}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {keyword.inTitle ? 'Keyword appears in title' : 'Keyword does not appear in title'}
            </p>
            <p className="text-sm text-gray-600">
              Title is {titleLength} characters (optimal: 30-60 characters)
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-6">Meta Description</h2>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
          <p className="text-gray-900">{metadata.description || 'No meta description found'}</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            {keyword.inDescription ? (
              <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className={`font-medium ${keyword.inDescription ? 'text-green-900' : 'text-red-900'}`}>
                Keyword
              </p>
              <p className="text-sm text-gray-600">
                {keyword.inDescription
                  ? 'Keyword appears in the meta description'
                  : 'Keyword does not appear in the meta description'}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            {isDescOptimal ? (
              <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className={`font-medium ${isDescOptimal ? 'text-green-900' : 'text-amber-900'}`}>
                Meta Description
              </p>
              <p className="text-sm text-gray-600">
                Your meta description is {descLength} characters (optimal: 50-160 characters)
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-6">All Meta Data</h2>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 font-mono text-sm space-y-2">
          <div>
            <span className="text-gray-600">title:</span>{' '}
            <span className="text-gray-900">{metadata.title}</span>
          </div>
          <div>
            <span className="text-gray-600">description:</span>{' '}
            <span className="text-gray-900">{metadata.description}</span>
          </div>
          {metadata.canonical && (
            <div>
              <span className="text-gray-600">canonical:</span>{' '}
              <span className="text-gray-900">{metadata.canonical}</span>
            </div>
          )}
          {Object.entries(metadata.allMetaTags).map(([key, value]) => (
            <div key={key}>
              <span className="text-gray-600">{key}:</span>{' '}
              <span className="text-gray-900">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {analysis.images.total > 0 && (
        <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-6">Images</h2>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">{analysis.images.total}</p>
              <p className="text-sm text-gray-600 mt-1">Total Images</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-3xl font-bold text-green-600">{analysis.images.withAlt}</p>
              <p className="text-sm text-gray-600 mt-1">With Alt Text</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-3xl font-bold text-red-600">{analysis.images.withoutAlt}</p>
              <p className="text-sm text-gray-600 mt-1">Missing Alt Text</p>
            </div>
          </div>

          {analysis.images.withoutAlt > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-900">Missing Alt Text</p>
                  <p className="text-sm text-amber-700 mt-1">
                    {analysis.images.withoutAlt} image{analysis.images.withoutAlt > 1 ? 's are' : ' is'} missing alt
                    text. Alt text is important for accessibility and SEO.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {analysis.links.total > 0 && (
        <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-6">Links</h2>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">{analysis.links.total}</p>
              <p className="text-sm text-gray-600 mt-1">Total Links</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-3xl font-bold text-green-600">{analysis.links.internal}</p>
              <p className="text-sm text-gray-600 mt-1">Internal Links</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-3xl font-bold text-purple-600">{analysis.links.external}</p>
              <p className="text-sm text-gray-600 mt-1">External Links</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
