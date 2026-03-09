import { Download, CheckSquare, AlertCircle, AlertTriangle } from 'lucide-react';
import { AnalysisResult } from '../types';

interface ChecklistItem {
  priority: 'high' | 'medium' | 'low';
  category: string;
  issue: string;
  fix: string;
  impact: string;
}

interface FixThisChecklistProps {
  analysis: AnalysisResult;
}

export default function FixThisChecklist({ analysis }: FixThisChecklistProps) {
  const generateChecklist = (): ChecklistItem[] => {
    const items: ChecklistItem[] = [];

    if (!analysis.keyword.inTitle) {
      items.push({
        priority: 'high',
        category: 'Meta Tags',
        issue: 'Target keyword missing from title tag',
        fix: `Add "${analysis.keyword.target}" to your page title`,
        impact: 'Critical for ranking - title tag is one of the most important on-page SEO factors',
      });
    }

    if (analysis.metadata.title.length > 60) {
      items.push({
        priority: 'high',
        category: 'Meta Tags',
        issue: 'Title tag too long',
        fix: `Shorten title to 30-60 characters (currently ${analysis.metadata.title.length})`,
        impact: 'Title will be truncated in search results, reducing click-through rate',
      });
    }

    if (analysis.metadata.title.length < 30) {
      items.push({
        priority: 'medium',
        category: 'Meta Tags',
        issue: 'Title tag too short',
        fix: `Expand title to 30-60 characters (currently ${analysis.metadata.title.length})`,
        impact: 'Missing opportunity to include relevant keywords and compelling copy',
      });
    }

    if (!analysis.keyword.inDescription) {
      items.push({
        priority: 'high',
        category: 'Meta Tags',
        issue: 'Target keyword missing from meta description',
        fix: `Add "${analysis.keyword.target}" naturally to your meta description`,
        impact: 'Meta description with keyword can improve click-through rates',
      });
    }

    if (analysis.metadata.description.length > 160 || analysis.metadata.description.length < 50) {
      items.push({
        priority: 'medium',
        category: 'Meta Tags',
        issue: 'Meta description length not optimal',
        fix: `Adjust description to 50-160 characters (currently ${analysis.metadata.description.length})`,
        impact: 'Improper length can result in truncation or poor display in search results',
      });
    }

    if (analysis.keyword.density < 0.5) {
      items.push({
        priority: 'high',
        category: 'Content',
        issue: 'Keyword density too low',
        fix: `Increase usage of "${analysis.keyword.target}" in content (currently ${analysis.keyword.density.toFixed(2)}%)`,
        impact: 'Low keyword density signals weak topical relevance to search engines',
      });
    }

    if (analysis.keyword.density > 3) {
      items.push({
        priority: 'high',
        category: 'Content',
        issue: 'Keyword density too high',
        fix: `Reduce usage of "${analysis.keyword.target}" to avoid keyword stuffing (currently ${analysis.keyword.density.toFixed(2)}%)`,
        impact: 'Keyword stuffing can result in search engine penalties',
      });
    }

    if (!analysis.keyword.inH1) {
      items.push({
        priority: 'high',
        category: 'Headings',
        issue: 'Target keyword missing from H1',
        fix: `Include "${analysis.keyword.target}" in at least one H1 heading`,
        impact: 'H1 tags are strong ranking signals for page topic relevance',
      });
    }

    if (analysis.headings.h1.length === 0) {
      items.push({
        priority: 'high',
        category: 'Headings',
        issue: 'No H1 heading found',
        fix: 'Add a descriptive H1 heading to your page',
        impact: 'H1 tags are essential for both SEO and accessibility',
      });
    }

    if (analysis.headings.h1.length > 1) {
      items.push({
        priority: 'medium',
        category: 'Headings',
        issue: 'Multiple H1 headings found',
        fix: `Consolidate to a single H1 heading (currently ${analysis.headings.h1.length})`,
        impact: 'Multiple H1s can dilute page topic focus',
      });
    }

    if (analysis.content.fleschScore < 60) {
      items.push({
        priority: 'medium',
        category: 'Readability',
        issue: 'Content difficult to read',
        fix: `Simplify language and sentence structure (Flesch score: ${analysis.content.fleschScore})`,
        impact: 'Poor readability can increase bounce rate and decrease engagement',
      });
    }

    if (analysis.content.passiveVoice.percentage > 20) {
      items.push({
        priority: 'low',
        category: 'Readability',
        issue: 'High passive voice usage',
        fix: `Convert passive sentences to active voice (currently ${analysis.content.passiveVoice.percentage.toFixed(1)}%)`,
        impact: 'Active voice is more engaging and authoritative',
      });
    }

    if (analysis.images.withoutAlt > 0) {
      items.push({
        priority: 'medium',
        category: 'Accessibility',
        issue: `${analysis.images.withoutAlt} image${analysis.images.withoutAlt > 1 ? 's' : ''} missing alt text`,
        fix: 'Add descriptive alt text to all images',
        impact: 'Alt text is important for accessibility and image SEO',
      });
    }

    if (analysis.content.wordCount < 300) {
      items.push({
        priority: 'high',
        category: 'Content',
        issue: 'Content too short',
        fix: `Expand content to at least 300-500 words (currently ${analysis.content.wordCount})`,
        impact: 'Thin content is unlikely to rank well for competitive keywords',
      });
    }

    items.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    return items;
  };

  const checklist = generateChecklist();
  const highPriority = checklist.filter(item => item.priority === 'high');
  const mediumPriority = checklist.filter(item => item.priority === 'medium');
  const lowPriority = checklist.filter(item => item.priority === 'low');

  const downloadChecklist = () => {
    const content = `SEO FIX-IT CHECKLIST
Generated: ${new Date().toLocaleDateString()}
Page: ${analysis.keyword.target}
Overall SEO Score: ${analysis.seoScore}%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

HIGH PRIORITY FIXES (Fix these first!)
${highPriority.map((item, i) => `
${i + 1}. ${item.issue}
   Category: ${item.category}
   How to fix: ${item.fix}
   Why it matters: ${item.impact}
`).join('\n')}

${mediumPriority.length > 0 ? `MEDIUM PRIORITY FIXES
${mediumPriority.map((item, i) => `
${i + 1}. ${item.issue}
   Category: ${item.category}
   How to fix: ${item.fix}
   Why it matters: ${item.impact}
`).join('\n')}` : ''}

${lowPriority.length > 0 ? `LOW PRIORITY FIXES (Nice to have)
${lowPriority.map((item, i) => `
${i + 1}. ${item.issue}
   Category: ${item.category}
   How to fix: ${item.fix}
   Why it matters: ${item.impact}
`).join('\n')}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Generated by SEO Audit Tool
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seo-checklist-${analysis.keyword.target.replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    const content = checklist.map((item, i) =>
      `${i + 1}. [${item.priority.toUpperCase()}] ${item.issue}\n   Fix: ${item.fix}`
    ).join('\n\n');

    navigator.clipboard.writeText(content);
  };

  const getPriorityIcon = (priority: string) => {
    if (priority === 'high') return <AlertCircle className="w-5 h-5 text-red-600" />;
    if (priority === 'medium') return <AlertTriangle className="w-5 h-5 text-amber-600" />;
    return <CheckSquare className="w-5 h-5 text-blue-600" />;
  };

  const getPriorityColor = (priority: string) => {
    if (priority === 'high') return 'border-red-200 bg-red-50';
    if (priority === 'medium') return 'border-amber-200 bg-amber-50';
    return 'border-blue-200 bg-blue-50';
  };

  const getPriorityBadge = (priority: string) => {
    if (priority === 'high') return 'bg-red-100 text-red-800';
    if (priority === 'medium') return 'bg-amber-100 text-amber-800';
    return 'bg-blue-100 text-blue-800';
  };

  return (
    <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Fix This Checklist</h2>
          <p className="text-sm text-gray-600 mt-1">Prioritized action items to improve your SEO</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={copyToClipboard}
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
          >
            Copy
          </button>
          <button
            onClick={downloadChecklist}
            className="flex items-center space-x-2 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
          <p className="text-3xl font-bold text-red-600">{highPriority.length}</p>
          <p className="text-sm text-gray-600 mt-1">High Priority</p>
        </div>
        <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-3xl font-bold text-amber-600">{mediumPriority.length}</p>
          <p className="text-sm text-gray-600 mt-1">Medium Priority</p>
        </div>
        <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-3xl font-bold text-blue-600">{lowPriority.length}</p>
          <p className="text-sm text-gray-600 mt-1">Low Priority</p>
        </div>
      </div>

      {checklist.length === 0 ? (
        <div className="text-center py-8">
          <CheckSquare className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <p className="text-lg font-semibold text-gray-900">All Clear!</p>
          <p className="text-gray-600 mt-2">No major issues found. Your page is well optimized.</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {checklist.map((item, index) => (
            <div
              key={index}
              className={`border rounded-lg p-4 ${getPriorityColor(item.priority)}`}
            >
              <div className="flex items-start space-x-3">
                {getPriorityIcon(item.priority)}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{item.issue}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityBadge(item.priority)}`}>
                      {item.priority.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Fix:</strong> {item.fix}
                  </p>
                  <p className="text-xs text-gray-600">
                    <strong>Impact:</strong> {item.impact}
                  </p>
                  <span className="inline-block mt-2 text-xs bg-white px-2 py-1 rounded border border-gray-300 text-gray-600">
                    {item.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
