import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import Overview from './components/Overview';
import Content from './components/Content';
import Metadata from './components/Metadata';
import SerpPreview from './components/SerpPreview';
import SchemaChecker from './components/SchemaChecker';
import FixThisChecklist from './components/FixThisChecklist';
import ContentGap from './components/ContentGap';
import { AnalysisResult } from './types';

type TabType =
  | 'overview'
  | 'content'
  | 'metadata'
  | 'serp'
  | 'schema'
  | 'checklist'
  | 'gap';

function App() {
  const [url, setUrl] = useState('');
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const urlParams = new URLSearchParams(window.location.search);
  const isEmbedMode = urlParams.get('embed') === 'true';

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setAnalysis(null);

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-page`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          targetKeyword: keyword,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze page');
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while analyzing the page'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header: Only show when not embedded */}
      {!isEmbedMode && (
        <div className="bg-blue-600 text-white py-6 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-3">
              <Search className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">SEO Page Audit Tool</h1>
                <p className="text-blue-100 text-sm">
                  Analyze your web page SEO performance
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-xl font-semibold mb-6">Analyze your Web Page</h2>
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="url"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Page Url
                </label>
                <input
                  type="url"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/page"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
              <div>
                <label
                  htmlFor="keyword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Target Keyword
                </label>
                <input
                  type="text"
                  id="keyword"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="web design"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    <span>Analyze</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
        </div>

        {analysis && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="border-b border-gray-200 overflow-x-auto">
              <nav className="flex space-x-8 px-8 min-w-max">
                {['overview','serp','content','metadata','schema','checklist','gap'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as TabType)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition whitespace-nowrap ${
                      activeTab === tab
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-8">
              {activeTab === 'overview' && <Overview analysis={analysis} />}
              {activeTab === 'serp' && (
                <SerpPreview
                  title={analysis.metadata.title}
                  description={analysis.metadata.description}
                  url={url}
                />
              )}
              {activeTab === 'content' && <Content analysis={analysis} />}
              {activeTab === 'metadata' && <Metadata analysis={analysis} />}
              {activeTab === 'schema' && (
                <SchemaChecker
                  schemas={analysis.schemas}
                  recommendations={analysis.schemaRecommendations}
                />
              )}
              {activeTab === 'checklist' && <FixThisChecklist analysis={analysis} />}
              {activeTab === 'gap' && (
                <ContentGap
                  targetPage={analysis.contentGap.targetPage}
                  competitorAverage={analysis.contentGap.competitorAverage}
                  gaps={analysis.contentGap.gaps}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer: Only show when not embedded */}
      {!isEmbedMode && (
        <footer className="bg-slate-900 text-white py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex space-x-6 text-sm text-slate-400">
                <a href="#" className="hover:text-white transition">
                  Blog
                </a>
                <a href="#" className="hover:text-white transition">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-white transition">
                  Terms & Conditions
                </a>
              </div>
              <p className="text-sm text-slate-400">
                © {new Date().getFullYear()} SEO Audit Tool. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;