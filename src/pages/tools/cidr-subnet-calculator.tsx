import Head from 'next/head';
import CidrCalculator from '../../components/Tools/CidrCalculator';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const SLUG = '/tools/cidr-subnet-calculator';

const FAQS = [
  { q: 'What does /24 mean in CIDR notation?', a: 'The /24 is the prefix length — it means the first 24 bits of the address are the network portion, leaving 8 bits for host addresses. A /24 network has 256 total addresses (2^8), of which 254 are usable for hosts (network and broadcast addresses are reserved).' },
  { q: 'What are the network and broadcast addresses?', a: 'The network address is the first address in the block (all host bits zero). The broadcast address is the last address (all host bits one). Neither can be assigned to a host. For a /24 block like 192.168.1.0/24, the network is 192.168.1.0 and the broadcast is 192.168.1.255.' },
  { q: 'What is a subnet mask?', a: 'A subnet mask is a 32-bit number with all 1s in the network portion and all 0s in the host portion. For /24 it is 255.255.255.0. Routers use the subnet mask to determine whether a destination IP is on the local subnet or needs to be forwarded.' },
  { q: 'What is a wildcard mask?', a: 'A wildcard mask is the bitwise inverse of the subnet mask. For 255.255.255.0 the wildcard is 0.0.0.255. Wildcard masks are commonly used in Cisco ACLs and OSPF network statements.' },
  { q: 'What are private IP ranges?', a: 'RFC 1918 defines three private ranges: 10.0.0.0/8 (16 million addresses), 172.16.0.0/12 (1 million addresses), and 192.168.0.0/16 (65,536 addresses). These are not routed on the public Internet and are used in private networks and VPNs.' },
];

export default function CidrSubnetCalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'CIDR / Subnet Calculator',
    slug: SLUG,
    description: 'Calculate network address, broadcast, host range, subnet mask, and wildcard from any IPv4 CIDR block. Split into child subnets.',
    featureList: 'Network range, Broadcast address, Host range, Subnet mask, Wildcard mask, Binary mask, Subnet splitter',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>CIDR Subnet Calculator — IPv4 Network Tool | Toolisk</title>
        <meta name="description" content="Calculate IPv4 subnet details from any CIDR block: network address, broadcast, host range, mask, and wildcard. Split into child subnets instantly." />
        <meta name="keywords" content="cidr calculator, subnet calculator, ip subnet, cidr to subnet mask, network address calculator, ipv4 cidr, subnet splitter" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="CIDR / Subnet Calculator | Toolisk" />
        <meta property="og:description" content="Calculate IPv4 subnet range, masks, and host counts from any CIDR block." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell icon="🌐" title="CIDR / Subnet Calculator" tagline="Enter any IPv4 CIDR block and instantly see the network range, host count, subnet mask, and split into child subnets.">
        <CidrCalculator />
      </ToolShell>

      <ToolSEOContent
        description="A free IPv4 subnet calculator for network engineers and developers. Enter any CIDR block (e.g. 192.168.1.0/24) and see the network address, broadcast address, first and last usable hosts, total host count, subnet mask, wildcard mask, and binary representation. The subnet splitter lets you divide the block into smaller child subnets."
        features={[
          '📡 Network address and broadcast range',
          '👥 Usable host count and first/last addresses',
          '🔢 Subnet mask, wildcard mask, and binary mask',
          '✂️ Split into any smaller prefix size',
          '⚡ 6 preset common CIDR blocks',
          '📋 Copy any value with one click',
        ]}
        steps={[
          { title: 'Enter a CIDR block', desc: 'Type an IPv4 CIDR like 192.168.1.0/24, or click one of the preset examples (10.0.0.0/8, 172.16.0.0/12, etc.).' },
          { title: 'Read the subnet details', desc: 'The network address, broadcast address, first and last usable host, and host counts appear immediately.' },
          { title: 'Check the masks', desc: 'View the dotted-decimal subnet mask (255.255.255.0), wildcard mask (0.0.0.255), and binary representation.' },
          { title: 'Split into subnets', desc: 'Enter a larger prefix (e.g. /26) in the splitter to see the child networks within your block.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Understanding CIDR notation</h2>
            <p className="text-slate-600 leading-relaxed">
              CIDR stands for Classless Inter-Domain Routing. Before CIDR (before 1993), IP addresses were divided into
              fixed classes: Class A gave you 16 million hosts, Class B 65,000, and Class C 254 — nothing in between.
              CIDR replaced this with a flexible prefix length (/8 through /32) that lets you allocate exactly the number
              of addresses you need.
            </p>
            <p className="text-slate-600 leading-relaxed">
              A /24 block has 256 total addresses. Subtract 2 (network + broadcast) and you get 254 usable hosts — plenty
              for a small office or a single VPC subnet. For a container cluster that needs hundreds of pods, a /22 (1022
              usable) or /21 (2046 usable) is common. Cloud providers like AWS and Azure use CIDR heavily in their VPC and
              virtual network configuration.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Worked example: 10.10.10.0/28</h3>
            <p className="text-slate-600 leading-relaxed">
              A /28 block has a 28-bit network prefix, leaving 4 bits for hosts. That&apos;s 2⁴ = 16 total addresses.
              Subtract 2 for network (10.10.10.0) and broadcast (10.10.10.15) and you have 14 usable hosts —
              perfect for a small DMZ segment or a point-to-point link with room to spare. The subnet mask is
              255.255.255.240 and the wildcard is 0.0.0.15.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Private ranges to memorise</h3>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li><code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono">10.0.0.0/8</code> — Class A private, ~16.7M addresses</li>
              <li><code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono">172.16.0.0/12</code> — Class B private, ~1M addresses</li>
              <li><code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono">192.168.0.0/16</code> — Class C private, 65,536 addresses</li>
              <li><code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono">100.64.0.0/10</code> — Carrier-grade NAT (CGNAT), RFC 6598</li>
              <li><code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono">169.254.0.0/16</code> — Link-local (APIPA when DHCP fails)</li>
            </ul>
          </section>
        }
        relatedTools={[
          { name: 'Chmod Calculator', href: '/tools/chmod-calculator', icon: '🔐' },
          { name: 'Number Base Converter', href: '/tools/number-base-converter', icon: '🔢' },
          { name: 'Hash Generator', href: '/tools/hash-generator', icon: '🔏' },
        ]}
      />
    </>
  );
}
