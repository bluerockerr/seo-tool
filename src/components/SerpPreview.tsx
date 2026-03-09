import { ExternalLink } from 'lucide-react';

interface SerpPreviewProps {
  title: string;
  description: string;
  url: string;
}

export default function SerpPreview({ title, description, url }: SerpPreviewProps) {
  const titleLength = title.length;
  const descLength = description.length;

  const displayUrl = url.replace(/^https?:\/\//, '').replace(/\/$/, '');

  const getTitleColor = (length: number) => {
    if (length >= 30 && length <= 60) return 'text-green-600';
    if (length > 60) return 'text-red-600';
    return 'text-amber-600';
  };

  const getDescColor = (length: number) => {
    if (length >= 50 && length <= 160) return 'text-green-600';
    if (length > 160) return 'text-red-600';
    return 'text-amber-600';
  };

  const truncateTitle = (text: string) => {
    if (text.length <= 60) return text;
    return text.substring(0, 57) + '...';
  };

  const truncateDescription = (text: string) => {
    if (text.length <= 160) return text;
    return text.substring(0, 157) + '...';
  };

  return (
    <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">SERP Preview</h2>
        <ExternalLink className="w-5 h-5 text-gray-400" />
      </div>

      <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6">
        <div className="mb-1">
          <p className="text-sm text-gray-600 mb-1">{displayUrl}</p>
        </div>
        <h3 className="text-xl text-blue-600 hover:underline cursor-pointer mb-2 leading-tight">
          {truncateTitle(title) || 'No title found'}
        </h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          {truncateDescription(description) || 'No description found'}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Title Tag</label>
            <span className={`text-sm font-medium ${getTitleColor(titleLength)}`}>
              {titleLength} / 60 characters
            </span>
          </div>
          <div className="relative w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                titleLength >= 30 && titleLength <= 60
                  ? 'bg-green-500'
                  : titleLength > 60
                  ? 'bg-red-500'
                  : 'bg-amber-500'
              }`}
              style={{ width: `${Math.min((titleLength / 60) * 100, 100)}%` }}
            />
          </div>
          {titleLength < 30 && (
            <p className="text-xs text-amber-600 mt-1">Title is too short. Aim for 30-60 characters.</p>
          )}
          {titleLength > 60 && (
            <p className="text-xs text-red-600 mt-1">Title is too long and will be truncated in search results.</p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Meta Description</label>
            <span className={`text-sm font-medium ${getDescColor(descLength)}`}>
              {descLength} / 160 characters
            </span>
          </div>
          <div className="relative w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                descLength >= 50 && descLength <= 160
                  ? 'bg-green-500'
                  : descLength > 160
                  ? 'bg-red-500'
                  : 'bg-amber-500'
              }`}
              style={{ width: `${Math.min((descLength / 160) * 100, 100)}%` }}
            />
          </div>
          {descLength < 50 && (
            <p className="text-xs text-amber-600 mt-1">Description is too short. Aim for 50-160 characters.</p>
          )}
          {descLength > 160 && (
            <p className="text-xs text-red-600 mt-1">Description is too long and will be truncated in search results.</p>
          )}
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          <strong>Tip:</strong> Make sure your title and description are compelling and include your target keyword naturally. They are the first thing users see in search results.
        </p>
      </div>
    </div>
  );
}
