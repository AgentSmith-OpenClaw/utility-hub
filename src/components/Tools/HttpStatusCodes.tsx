import React, { useState, useMemo } from 'react';
import { ToolCard } from './ToolShell';

interface StatusCode { code: number; name: string; desc: string; category: string; }

const STATUS_CODES: StatusCode[] = [
  { code: 100, name: 'Continue', desc: 'Server received the request headers and the client should proceed to send the request body.', category: '1xx Informational' },
  { code: 101, name: 'Switching Protocols', desc: 'Server is switching protocols as requested by the client (e.g., upgrading to WebSocket).', category: '1xx Informational' },
  { code: 102, name: 'Processing', desc: 'WebDAV: server has received and is processing the request, but no response is available yet.', category: '1xx Informational' },
  { code: 200, name: 'OK', desc: 'Standard success response. The body contains the requested resource or the result.', category: '2xx Success' },
  { code: 201, name: 'Created', desc: 'Resource successfully created. The Location header typically points to the new resource.', category: '2xx Success' },
  { code: 202, name: 'Accepted', desc: 'Request accepted for processing but processing is not complete (async operations).', category: '2xx Success' },
  { code: 204, name: 'No Content', desc: 'Request succeeded but response body is empty. Common for DELETE and PUT operations.', category: '2xx Success' },
  { code: 206, name: 'Partial Content', desc: 'Partial resource delivered in response to a Range header — used for resumable downloads.', category: '2xx Success' },
  { code: 301, name: 'Moved Permanently', desc: 'Resource has permanently moved to the URL in the Location header. Search engines update their index.', category: '3xx Redirection' },
  { code: 302, name: 'Found', desc: 'Resource temporarily at a different URL. Client should continue using the original URL.', category: '3xx Redirection' },
  { code: 303, name: 'See Other', desc: 'Response found at a different URI using GET. Used after POST/PUT to redirect to a result page.', category: '3xx Redirection' },
  { code: 304, name: 'Not Modified', desc: 'Cached version is still valid. No body is sent — reduces bandwidth.', category: '3xx Redirection' },
  { code: 307, name: 'Temporary Redirect', desc: 'Same as 302 but guarantees the method (POST, PUT) is preserved. Location is the new URL.', category: '3xx Redirection' },
  { code: 308, name: 'Permanent Redirect', desc: 'Same as 301 but preserves the HTTP method. Preferred over 301 for non-GET redirects.', category: '3xx Redirection' },
  { code: 400, name: 'Bad Request', desc: 'Server cannot process due to malformed request syntax, invalid parameters, or deceptive routing.', category: '4xx Client Errors' },
  { code: 401, name: 'Unauthorized', desc: 'Authentication is required and has failed or not been provided. Send credentials with Authorization header.', category: '4xx Client Errors' },
  { code: 403, name: 'Forbidden', desc: 'Client is authenticated but does not have permission to access the resource.', category: '4xx Client Errors' },
  { code: 404, name: 'Not Found', desc: 'Server cannot find the requested resource. Most common HTTP error on the web.', category: '4xx Client Errors' },
  { code: 405, name: 'Method Not Allowed', desc: 'HTTP method (GET, POST, PUT, etc.) is not allowed for the requested resource.', category: '4xx Client Errors' },
  { code: 408, name: 'Request Timeout', desc: 'Server timed out waiting for the request. Client may resubmit the request.', category: '4xx Client Errors' },
  { code: 409, name: 'Conflict', desc: 'Request conflicts with the current state of the server (e.g., duplicate resource, version mismatch).', category: '4xx Client Errors' },
  { code: 410, name: 'Gone', desc: 'Resource no longer available and will not return. Use 410 instead of 404 to tell crawlers to deindex.', category: '4xx Client Errors' },
  { code: 411, name: 'Length Required', desc: 'Server requires the Content-Length header which was not provided.', category: '4xx Client Errors' },
  { code: 413, name: 'Content Too Large', desc: 'Request body exceeds the server\'s limit. Common in file upload endpoints.', category: '4xx Client Errors' },
  { code: 414, name: 'URI Too Long', desc: 'The URI provided is too long for the server to process.', category: '4xx Client Errors' },
  { code: 415, name: 'Unsupported Media Type', desc: 'Request entity format is not supported by the server for the given method.', category: '4xx Client Errors' },
  { code: 416, name: 'Range Not Satisfiable', desc: 'Client asked for a range that can\'t be served. Check the Content-Range header.', category: '4xx Client Errors' },
  { code: 422, name: 'Unprocessable Content', desc: 'Request was well-formed but contains semantic errors (often used by REST APIs for validation failures).', category: '4xx Client Errors' },
  { code: 429, name: 'Too Many Requests', desc: 'Client has sent too many requests in a given amount of time (rate limiting).', category: '4xx Client Errors' },
  { code: 451, name: 'Unavailable For Legal Reasons', desc: 'Resource unavailable due to legal restrictions (e.g., GDPR, DMCA). Named after Fahrenheit 451.', category: '4xx Client Errors' },
  { code: 500, name: 'Internal Server Error', desc: 'Generic server error. The server encountered an unexpected condition that prevented it from fulfilling the request.', category: '5xx Server Errors' },
  { code: 501, name: 'Not Implemented', desc: 'Server does not recognize the request method or lacks the ability to fulfil it.', category: '5xx Server Errors' },
  { code: 502, name: 'Bad Gateway', desc: 'Server acting as a gateway received an invalid response from an upstream server.', category: '5xx Server Errors' },
  { code: 503, name: 'Service Unavailable', desc: 'Server is temporarily unable to handle requests — due to overload or maintenance. Retry-After header may be provided.', category: '5xx Server Errors' },
  { code: 504, name: 'Gateway Timeout', desc: 'Server acting as a proxy timed out waiting for an upstream server.', category: '5xx Server Errors' },
  { code: 505, name: 'HTTP Version Not Supported', desc: 'Server does not support the HTTP protocol version used in the request.', category: '5xx Server Errors' },
  { code: 507, name: 'Insufficient Storage', desc: 'WebDAV: server cannot store the representation needed to complete the request.', category: '5xx Server Errors' },
  { code: 508, name: 'Loop Detected', desc: 'WebDAV: server detected an infinite loop while processing the request.', category: '5xx Server Errors' },
];

function badgeColor(code: number) {
  if (code < 200) return 'bg-slate-100 text-slate-700';
  if (code < 300) return 'bg-emerald-100 text-emerald-800';
  if (code < 400) return 'bg-blue-100 text-blue-800';
  if (code < 500) return 'bg-amber-100 text-amber-800';
  return 'bg-red-100 text-red-800';
}

export default function HttpStatusCodes() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<StatusCode | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return STATUS_CODES;
    const q = search.toLowerCase();
    return STATUS_CODES.filter(s => String(s.code).includes(q) || s.name.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q) || s.category.toLowerCase().includes(q));
  }, [search]);

  const grouped = useMemo(() => {
    const groups: Record<string, StatusCode[]> = {};
    filtered.forEach(s => { if (!groups[s.category]) groups[s.category] = []; groups[s.category].push(s); });
    return groups;
  }, [filtered]);

  return (
    <div className="space-y-5">
      <ToolCard title="Search Status Codes">
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by code, name, or description… e.g. 404, redirect, auth"
            className="w-full pl-10 pr-4 py-3 text-sm sm:text-base border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400"
            autoFocus
          />
        </div>
        <p className="text-xs text-slate-400 mt-2 font-medium">{filtered.length} of {STATUS_CODES.length} codes</p>
      </ToolCard>

      {selected && (
        <ToolCard title={`${selected.code} ${selected.name}`} action={
          <button onClick={() => setSelected(null)} className="text-xs font-semibold text-slate-500 hover:text-slate-700 px-2 py-1 rounded-md hover:bg-slate-100 transition-colors">Close</button>
        }>
          <span className={`inline-block px-2.5 py-1 text-xs font-bold rounded-full mb-3 ${badgeColor(selected.code)}`}>{selected.category}</span>
          <p className="text-[15px] text-slate-700 leading-relaxed">{selected.desc}</p>
        </ToolCard>
      )}

      <div className="space-y-4">
        {Object.entries(grouped).map(([category, codes]) => (
          <ToolCard key={category} title={category}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {codes.map((s) => (
                <button
                  key={s.code}
                  onClick={() => setSelected(selected?.code === s.code ? null : s)}
                  className={`text-left p-3.5 rounded-xl border transition-all ${selected?.code === s.code ? 'border-emerald-400 bg-emerald-50 shadow-sm' : 'border-slate-100 bg-slate-50 hover:border-slate-300 hover:bg-white hover:shadow-sm'}`}
                >
                  <div className="flex items-start gap-2.5">
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${badgeColor(s.code)} font-mono`}>{s.code}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800">{s.name}</p>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ToolCard>
        ))}
      </div>
    </div>
  );
}
