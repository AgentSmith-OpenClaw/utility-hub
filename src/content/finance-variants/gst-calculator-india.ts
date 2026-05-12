import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'gst-calculator-india',
  calculatorId: 'sales-tax-vat-gst',

  seo: {
    title: 'GST Calculator India — Add or Remove GST in Seconds | Toolisk',
    metaDescription:
      'Free GST calculator for India. Add or remove GST at 5%, 12%, 18%, or 28% on any amount. Get the exact CGST, SGST, IGST split and final billed amount instantly.',
    keywords:
      'gst calculator india, gst calculator, gst calculation, add gst remove gst, gst inclusive exclusive calculator, cgst sgst igst calculator, 18 percent gst calculator',
    ogTitle: 'GST Calculator India — Add or Remove GST in Seconds',
    ogDescription:
      'Add or remove GST at 5%, 12%, 18%, or 28%. Get CGST, SGST, IGST split instantly.',
  },

  hero: {
    icon: '🇮🇳',
    h1: 'GST Calculator India',
    tagline:
      'Compute GST at any standard slab — add it to a base price or extract it from an inclusive amount. CGST, SGST, and IGST splits included automatically.',
    gradient: 'from-orange-600 via-amber-600 to-emerald-600',
    breadcrumbLabel: 'GST Calculator India',
  },

  content: {
    aboutDescription:
      'A GST calculator built around the four Indian GST slabs (5%, 12%, 18%, 28%) and the dual-tax structure (CGST + SGST for intra-state, IGST for inter-state). Add GST to a net amount, remove GST from an inclusive amount, or compute the tax split for any transaction in seconds.',
    features: [
      '🇮🇳 All four Indian GST slabs (5%, 12%, 18%, 28%)',
      '➕ Add GST to a base price',
      '➖ Extract GST from an inclusive amount',
      '🔀 CGST + SGST (intra-state) and IGST (inter-state) split',
      '📊 Full invoice breakdown',
      '💾 PDF / Excel export',
    ],
    steps: [
      { title: 'Pick the GST slab', desc: '5% for essentials, 12% for processed food and certain services, 18% for most B2B services and consumer goods, 28% for luxury and sin items.' },
      { title: 'Choose direction', desc: '"Add GST" — start from net price, get gross. "Remove GST" — start from gross price (e.g., MRP), extract the tax.' },
      { title: 'Set intra-state or inter-state', desc: 'Intra-state splits into CGST + SGST (equal halves). Inter-state is IGST (full slab in one line).' },
      { title: 'Enter amount', desc: 'The net or gross figure, depending on direction chosen.' },
      { title: 'Read & export', desc: 'See base, tax, total, and the CGST/SGST or IGST split. Download for invoice records or input vouchers.' },
    ],
    faqs: [
      {
        q: 'What are the GST slabs in India?',
        a: 'Five main slabs — 0% (exempt), 5%, 12%, 18%, and 28%. Plus a "cess" on certain luxury and sin goods on top of 28%. Most consumer services and goods fall in the 18% slab. Essentials like unbranded food grains, books, and most healthcare are at 0%. Luxury cars, tobacco, and aerated drinks sit at 28% + cess. The slab structure occasionally shifts at GST Council meetings — always verify the current rate on the GST portal for big-ticket items.',
      },
      {
        q: 'What is the difference between CGST, SGST, and IGST?',
        a: 'For transactions within the same state, GST is split into CGST (Central) and SGST (State) — equal halves of the slab rate. So on an 18% intra-state invoice: 9% CGST + 9% SGST. For inter-state transactions, the full rate goes to IGST (Integrated GST), collected by the Centre and later shared with the destination state. The amount of tax is identical either way; only the bookkeeping differs.',
      },
      {
        q: 'How do I extract GST from an inclusive amount?',
        a: 'If a price is "inclusive of 18% GST," the GST portion is amount × 18 / 118, and the base is amount × 100 / 118. Example: a ₹11,800 inclusive invoice has ₹1,800 GST and ₹10,000 base. For other slabs, replace 18 with 5, 12, or 28 in the same formula. The calculator does this instantly — just pick "remove GST" and enter the inclusive amount.',
      },
      {
        q: 'When should I charge GST?',
        a: 'If your business is GST-registered (mandatory above ₹40 lakh turnover for goods, ₹20 lakh for services, lower in some states), you must charge GST on every taxable supply. Exempt goods/services or zero-rated exports may not require charging, but registration and filing are still required. If you are below the threshold, GST registration is optional — but voluntary registration lets you claim input tax credit, which can be valuable for B2B businesses.',
      },
      {
        q: 'Is GST different for goods and services?',
        a: 'The slab structure is the same, but the slab a specific item falls into is defined by its HSN (Harmonized System Nomenclature) code for goods and SAC (Service Accounting Code) for services. Two products that look similar can fall in different slabs based on their classification. For invoicing, always verify the HSN/SAC and corresponding rate from the official rate notification — getting it wrong creates compliance issues at GST audit.',
      },
    ],
    longform: [
      { type: 'h2', text: 'The four moves every business should know' },
      {
        type: 'p',
        text: 'GST math comes up dozens of times a week for any business owner, freelancer, or accountant. Four core operations cover 95% of real-world cases:',
      },
      {
        type: 'ol',
        items: [
          'Add GST to a quote: net × (1 + slab) = total invoice amount.',
          'Extract GST from an MRP / inclusive price: total × slab / (100 + slab) = tax portion.',
          'Split into CGST + SGST: tax ÷ 2 each, for intra-state invoices.',
          'Reverse-charge for unregistered suppliers: buyer pays GST on the supplier\'s behalf and claims it as input credit.',
        ],
      },
      { type: 'h3', text: 'A worked example — 18% GST on a ₹50,000 service' },
      {
        type: 'ul',
        items: [
          'Base service price: ₹50,000',
          'GST (18%): ₹9,000',
          'Total invoice: ₹59,000',
          'Intra-state split: CGST ₹4,500 + SGST ₹4,500',
          'Inter-state: IGST ₹9,000',
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        text: 'On the buyer\'s side, this ₹9,000 GST is reclaimable as input tax credit (ITC) if they are GST-registered and the supplier has filed their GSTR-1 / GSTR-3B correctly. ITC mismatches are the #1 cause of GST audit notices.',
      },
      { type: 'h2', text: 'Common GST mistakes to avoid' },
      {
        type: 'ul',
        items: [
          'Using "18% of total" instead of "18 / 118 of total" to extract GST from inclusive amounts — overstates the tax by ~3%.',
          'Charging IGST on intra-state transactions (should be CGST + SGST) or vice versa — buyers cannot reclaim mismatched tax.',
          'Forgetting the cess on 28%-slab luxury items — leads to short-payment penalties.',
          'Not raising a GST invoice for B2B sales above the threshold — buyers lose ITC and you lose the customer.',
        ],
      },
    ],
  },

  schema: {
    softwareName: 'GST Calculator India',
    softwareFeatures:
      'Indian GST slabs (5/12/18/28%), Add and remove GST, CGST/SGST/IGST split, Inclusive and exclusive calculation, Invoice breakdown, PDF & Excel export',
  },

  relatedTools: [
    { name: 'Sales Tax / VAT / GST Calculator', href: '/finance/sales-tax-vat-gst-calculator', icon: '🧾' },
    { name: 'Income Tax Calculator', href: '/finance/income-tax-calculator', icon: '🇮🇳' },
    { name: 'Tip Calculator', href: '/finance/tip-calculator', icon: '🍽️' },
  ],
};

export default variant;
