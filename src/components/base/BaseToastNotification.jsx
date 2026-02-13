import React, { useState } from 'react';

const BaseToastNotification = ({
  type = 'info',
  summary,
  detail,
  ...props
}) => {
  const [detailIsExpanded, setDetailIsExpanded] = useState(false);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'ai ai-check';
      case 'warn':
        return 'ai ai-attention';
      case 'error':
        return 'ai ai-error';
      case 'info':
      default:
        return 'ai ai-info-circle';
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warn':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-800';
      case 'warn':
        return 'text-yellow-800';
      case 'error':
        return 'text-red-800';
      case 'info':
      default:
        return 'text-blue-800';
    }
  };

  const toggleExpandDetail = () => {
    setDetailIsExpanded(!detailIsExpanded);
  };

  return (
    <div
      className={`border rounded-lg p-4 ${getBackgroundColor()} ${getTextColor()}`}
      {...props}
    >
      <div className="flex flex-col items-start flex-auto gap-4">
        <div className="flex-1 w-full">
          <div className="flex flex-row gap-4 items-center justify-start w-full">
            <i className={`${getIcon()} text-2xl`} />
            {summary && <div className="font-medium">{summary}</div>}
          </div>

          {detail && (
            <div className="mt-4">
              <button
                onClick={toggleExpandDetail}
                className="text-xs focus:outline-none flex flex-row items-center gap-2 hover:underline"
              >
                <i
                  className={`pi ${
                    detailIsExpanded ? 'pi-chevron-up' : 'pi-chevron-down'
                  }`}
                  style={{ fontSize: '0.8rem' }}
                />
                <span className="underline hover:no-underline">
                  {detailIsExpanded ? 'Hide details' : 'View details'}
                </span>
              </button>

              {detailIsExpanded && (
                <div className="mt-2">
                  <div className="bg-gray-50 p-2 rounded-sm max-h-40 overflow-y-auto">
                    <pre className="whitespace-pre-wrap font-mono text-xs">
                      {detail}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BaseToastNotification;
