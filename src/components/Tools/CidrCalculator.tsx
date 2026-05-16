import React, { useState, useMemo } from 'react';
import { ToolCard, CopyButton } from './ToolShell';

const PRESETS = [
  '192.168.1.0/24',
  '10.0.0.0/8',
  '172.16.0.0/12',
  '192.168.0.0/16',
  '10.10.10.0/28',
  '203.0.113.0/29',
];

interface SubnetInfo {
  network:    string;
  broadcast:  string;
  firstHost:  string;
  lastHost:   string;
  totalHosts: number;
  usableHosts:number;
  subnetMask: string;
  wildcardMask:string;
  binaryMask: string;
  prefix:     number;
  networkInt: number;
  children:   { network: string; broadcast: string }[];
}

function ipToInt(ip: string): number {
  const parts = ip.split('.').map(Number);
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
}

function intToIp(n: number): string {
  return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.');
}

function intToBinary(n: number): string {
  const b = (n >>> 0).toString(2).padStart(32, '0');
  return [b.slice(0,8), b.slice(8,16), b.slice(16,24), b.slice(24)].join('.');
}

function parseAndCompute(cidr: string): SubnetInfo | null {
  const m = cidr.trim().match(/^(\d+\.\d+\.\d+\.\d+)\/(\d+)$/);
  if (!m) return null;
  const ip    = m[1];
  const prefix = parseInt(m[2], 10);
  if (prefix < 0 || prefix > 32) return null;
  const parts = ip.split('.').map(Number);
  if (parts.some((p) => p < 0 || p > 255)) return null;

  const maskInt    = prefix === 0 ? 0 : (0xFFFFFFFF << (32 - prefix)) >>> 0;
  const networkInt = (ipToInt(ip) & maskInt) >>> 0;
  const broadInt   = (networkInt | (~maskInt >>> 0)) >>> 0;
  const totalHosts = Math.pow(2, 32 - prefix);
  const usableHosts = prefix >= 31 ? totalHosts : Math.max(0, totalHosts - 2);

  // Split into /prefix+1 children (show first 8 only)
  const children: { network: string; broadcast: string }[] = [];
  if (prefix < 32) {
    const childPrefix = Math.min(prefix + 1, 32);
    const childMask = (0xFFFFFFFF << (32 - childPrefix)) >>> 0;
    const childSize = Math.pow(2, 32 - childPrefix);
    for (let i = 0; i < Math.min(8, Math.pow(2, childPrefix - prefix)); i++) {
      const cn = (networkInt + i * childSize) >>> 0;
      const cb = (cn | (~childMask >>> 0)) >>> 0;
      children.push({ network: `${intToIp(cn)}/${childPrefix}`, broadcast: intToIp(cb) });
    }
  }

  return {
    network:     intToIp(networkInt),
    broadcast:   intToIp(broadInt),
    firstHost:   prefix >= 31 ? intToIp(networkInt) : intToIp((networkInt + 1) >>> 0),
    lastHost:    prefix >= 31 ? intToIp(broadInt) : intToIp((broadInt - 1) >>> 0),
    totalHosts,
    usableHosts,
    subnetMask:  intToIp(maskInt),
    wildcardMask:intToIp(~maskInt >>> 0),
    binaryMask:  intToBinary(maskInt),
    prefix,
    networkInt,
    children,
  };
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 border-b border-slate-100 last:border-0">
      <span className="text-sm text-slate-600 shrink-0">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm text-slate-900 text-right">{value}</span>
        <CopyButton value={value} label="" />
      </div>
    </div>
  );
}

export default function CidrCalculator() {
  const [cidr, setCidr] = useState('');
  const [splitTo, setSplitTo] = useState('');

  const info = useMemo(() => parseAndCompute(cidr), [cidr]);
  const hasError = cidr.trim() && !info;

  const splitInfo = useMemo(() => {
    if (!info || !splitTo.trim()) return null;
    const n = parseInt(splitTo, 10);
    if (isNaN(n) || n <= info.prefix || n > 32) return null;
    const childMask = (0xFFFFFFFF << (32 - n)) >>> 0;
    const childSize = Math.pow(2, 32 - n);
    const count = Math.pow(2, n - info.prefix);
    const children: { network: string; broadcast: string; firstHost: string; lastHost: string }[] = [];
    for (let i = 0; i < Math.min(16, count); i++) {
      const cn = (info.networkInt + i * childSize) >>> 0;
      const cb = (cn | (~childMask >>> 0)) >>> 0;
      children.push({
        network: `${intToIp(cn)}/${n}`,
        broadcast: intToIp(cb),
        firstHost: intToIp((cn + 1) >>> 0),
        lastHost:  intToIp((cb - 1) >>> 0),
      });
    }
    return { count, children };
  }, [info, splitTo]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Input */}
      <ToolCard title="CIDR block" action={
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <button key={p} onClick={() => setCidr(p)}
              className="inline-flex items-center px-2.5 py-1 text-xs font-mono rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 min-h-[36px]">
              {p}
            </button>
          ))}
        </div>
      }>
        <input
          type="text"
          value={cidr}
          onChange={(e) => setCidr(e.target.value)}
          placeholder="192.168.1.0/24"
          className={`w-full font-mono text-sm px-3 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-emerald-50 min-h-[44px] ${hasError ? 'border-rose-300 focus:border-rose-400' : 'border-slate-200 focus:border-emerald-400'}`}
        />
        {hasError && <p className="mt-1 text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-2 py-1">Invalid CIDR. Use format: 192.168.1.0/24</p>}
      </ToolCard>

      {info && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <ToolCard title="Addresses">
              <InfoRow label="Network address" value={info.network} />
              <InfoRow label="Broadcast address" value={info.broadcast} />
              <InfoRow label="First usable host" value={info.firstHost} />
              <InfoRow label="Last usable host" value={info.lastHost} />
              <InfoRow label="Total hosts" value={info.totalHosts.toLocaleString()} />
              <InfoRow label="Usable hosts" value={info.usableHosts.toLocaleString()} />
            </ToolCard>

            <ToolCard title="Masks">
              <InfoRow label="Subnet mask" value={info.subnetMask} />
              <InfoRow label="Wildcard mask" value={info.wildcardMask} />
              <InfoRow label="CIDR prefix" value={`/${info.prefix}`} />
              <div className="pt-2">
                <p className="text-xs text-slate-500 mb-1 font-semibold">Binary subnet mask</p>
                <p className="font-mono text-xs text-slate-700 bg-slate-50 rounded-lg border border-slate-200 px-3 py-2 break-all">{info.binaryMask}</p>
              </div>
            </ToolCard>
          </div>

          {/* Subnet splitter */}
          <ToolCard title="Split into subnets">
            <div className="flex gap-3 items-center flex-wrap">
              <label className="text-sm text-slate-700 shrink-0">Split into /<span className="font-mono">{info.prefix}</span> → /</label>
              <input
                type="number"
                min={info.prefix + 1}
                max={32}
                value={splitTo}
                onChange={(e) => setSplitTo(e.target.value)}
                placeholder={String(Math.min(info.prefix + 2, 32))}
                className="w-24 font-mono text-sm px-3 py-2 rounded-lg border border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 outline-none min-h-[44px]"
              />
              {splitInfo && <span className="text-xs text-slate-500">{splitInfo.count.toLocaleString()} subnets</span>}
            </div>
            {splitInfo && (
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-xs font-mono">
                  <thead>
                    <tr className="text-slate-500 border-b border-slate-100">
                      <th className="text-left py-1 pr-4">#</th>
                      <th className="text-left py-1 pr-4">Network</th>
                      <th className="text-left py-1 pr-4">First host</th>
                      <th className="text-left py-1 pr-4">Last host</th>
                      <th className="text-left py-1">Broadcast</th>
                    </tr>
                  </thead>
                  <tbody>
                    {splitInfo.children.map((c, i) => (
                      <tr key={i} className="border-b border-slate-50 hover:bg-slate-50">
                        <td className="py-1.5 pr-4 text-slate-400">{i}</td>
                        <td className="py-1.5 pr-4 text-emerald-700">{c.network}</td>
                        <td className="py-1.5 pr-4">{c.firstHost}</td>
                        <td className="py-1.5 pr-4">{c.lastHost}</td>
                        <td className="py-1.5">{c.broadcast}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {splitInfo.count > 16 && <p className="mt-2 text-xs text-slate-400">Showing first 16 of {splitInfo.count.toLocaleString()} subnets.</p>}
              </div>
            )}
          </ToolCard>
        </>
      )}
    </div>
  );
}
