import { Check, X, AlertTriangle, Code } from 'lucide-react';

interface SchemaCheckerProps {
  schemas: Array<{
    type: string;
    found: boolean;
    valid: boolean;
    data?: any;
  }>;
  recommendations: string[];
}

export default function SchemaChecker({ schemas, recommendations }: SchemaCheckerProps) {
  const foundSchemas = schemas.filter(s => s.found);
  const missingSchemas = schemas.filter(s => !s.found);

  return (
    <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Schema Markup Checker</h2>
        <Code className="w-5 h-5 text-gray-400" />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <p className="text-3xl font-bold text-blue-600">{schemas.length}</p>
          <p className="text-sm text-gray-600 mt-1">Total Checked</p>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <p className="text-3xl font-bold text-green-600">{foundSchemas.length}</p>
          <p className="text-sm text-gray-600 mt-1">Found</p>
        </div>
        <div className="text-center p-4 bg-red-50 rounded-lg">
          <p className="text-3xl font-bold text-red-600">{missingSchemas.length}</p>
          <p className="text-sm text-gray-600 mt-1">Missing</p>
        </div>
      </div>

      {foundSchemas.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Found Schema Types</h3>
          <div className="space-y-2">
            {foundSchemas.map((schema, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-green-900">{schema.type}</p>
                    {schema.valid ? (
                      <p className="text-sm text-green-700">Valid structure</p>
                    ) : (
                      <p className="text-sm text-amber-700">Found but may have issues</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {missingSchemas.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Missing Schema Types</h3>
          <div className="space-y-2">
            {missingSchemas.map((schema, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <X className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-red-900">{schema.type}</p>
                    <p className="text-sm text-red-700">Not found on this page</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-amber-900 mb-2">Recommendations</p>
              <ul className="space-y-1 text-sm text-amber-800">
                {recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          <strong>About Schema Markup:</strong> Structured data helps search engines understand your content better and can enable rich results like ratings, prices, and FAQs in search results.
        </p>
      </div>
    </div>
  );
}
