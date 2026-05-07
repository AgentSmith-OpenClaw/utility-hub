import Link from 'next/link';
import type { BlogArticle } from '../types';
import { Lead, H2, H3, Callout, KeyTakeaways } from '../components';

export const estatePlanningBasics: BlogArticle = {
  slug: 'estate-planning-basics',
  category: 'Insurance',
  title: 'Estate Planning Basics: The Documents Every Adult Needs (Even Without Wealth)',
  description:
    'Estate planning isn\'t about being rich. It\'s about ensuring your medical decisions are honored, your kids are cared for, and your assets reach the right people without court intervention. Learn the four documents everyone needs.',
  publishedDate: '2026-05-08',
  readTime: '12 min read',
  keywords:
    'estate planning, will, living trust, power of attorney, healthcare directive, probate, beneficiary',
  relatedTools: [
    { name: 'FIRE Calculator', href: '/finance/fire-calculator' },
    { name: 'Compound Interest Calculator', href: '/finance/compound-interest-calculator' },
  ],
  content: (
    <div className="prose prose-lg max-w-none">
      <Lead>
        Estate planning is the personal finance topic with the lowest engagement and the highest stakes. Most
        adults don't have basic documents in place — and the consequences of dying or becoming incapacitated
        without them are paid by the people you love most. The required documents are simpler and cheaper than
        most assume.
      </Lead>

      <H2>What "estate" actually means</H2>
      <p>
        Your estate is everything you own at death: your home, retirement accounts, brokerage accounts, life
        insurance proceeds, personal possessions, and digital assets. Every adult has an estate, regardless of
        net worth.
      </p>
      <p>
        Without proper documents, state law decides who gets what (intestate succession), a court decides who
        cares for minor children, and a court appoints someone to make medical decisions if you're
        incapacitated. None of those defaults are likely what you'd have chosen.
      </p>

      <H2>The four core documents</H2>

      <H3>1. Last Will and Testament</H3>
      <p>
        A will specifies:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>Who inherits assets that don't have a beneficiary designation.</li>
        <li>Who serves as guardian for minor children.</li>
        <li>Who serves as executor of your estate.</li>
        <li>Specific bequests (a particular item to a particular person).</li>
      </ul>
      <p>
        Important caveat: a will only governs assets that don't pass another way. Retirement accounts, life
        insurance, and accounts with named beneficiaries pass directly to those beneficiaries — bypassing the
        will entirely.
      </p>

      <H3>2. Durable Power of Attorney (financial)</H3>
      <p>
        Authorizes someone (your "agent" or "attorney-in-fact") to handle your finances if
        you're incapacitated. Without one, your family must petition the court to be appointed conservator
        — a lengthy, expensive process during a crisis.
      </p>
      <p>
        "Durable" means the authority survives your incapacity (the whole point). A "springing"
        version only activates upon incapacity but can be hard to invoke since it requires medical certification.
        Most attorneys recommend immediately effective + durable.
      </p>

      <H3>3. Healthcare Directive (Living Will + Healthcare Power of Attorney)</H3>
      <p>
        Two related documents often combined:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><strong>Living will:</strong> your written wishes for end-of-life care (resuscitation, ventilator, feeding tubes).</li>
        <li><strong>Healthcare power of attorney:</strong> who makes medical decisions if you can't speak for yourself.</li>
      </ul>
      <p>
        Without these, doctors default to "preserve life" and decision-making falls to the closest
        relative — who may have to litigate against other relatives if there's disagreement.
      </p>

      <H3>4. Beneficiary Designations</H3>
      <p>
        Often forgotten, but the most important "document" you'll ever sign — and you've
        already signed it without realizing. Every retirement account, life insurance policy, transfer-on-death
        bank account, and HSA has a primary and contingent beneficiary on file.
      </p>
      <p>
        These beneficiaries override your will. If your IRA names your ex-spouse from 15 years ago and you
        haven't updated it, your current spouse and children get nothing from that account. This happens
        constantly.
      </p>

      <Callout title="The annual beneficiary review" accent="amber">
        Once a year, log into every retirement account, life insurance policy, and bank account. Verify the
        beneficiaries are who you currently want them to be. This single hour of work does more than 90% of
        what most people's wills accomplish.
      </Callout>

      <H2>The probate problem</H2>
      <p>
        Probate is the court process for validating a will and distributing assets that didn't pass any
        other way. It's public, slow (6–18 months typical), and expensive (3–7% of estate value in legal
        fees in many states).
      </p>
      <p>
        Avoiding probate matters because:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>Heirs wait months for access to funds while bills accumulate.</li>
        <li>Probate is public — anyone can read what you owned and to whom you left it.</li>
        <li>Multi-state probate (real estate in another state) requires a separate probate in that state.</li>
        <li>The court appoints attorneys whose fees come out of the estate.</li>
      </ul>

      <H2>Avoiding probate: the toolkit</H2>

      <H3>Beneficiary designations</H3>
      <p>
        Every retirement account, life insurance, and HSA already has them. Banks and brokerages offer
        Transfer-on-Death (TOD) designations for taxable accounts. These all bypass probate entirely.
      </p>

      <H3>Joint ownership with right of survivorship</H3>
      <p>
        For real estate and bank accounts. The surviving owner takes full ownership without probate. The trade-off:
        full liability shared during life (your co-owner's creditors can attach the asset).
      </p>

      <H3>Revocable Living Trust</H3>
      <p>
        For more complex estates or anyone with real estate to pass: a revocable living trust holds title to
        assets, transfers them at death without court involvement, and offers privacy. Costs $1,500–$5,000 to
        establish; saves significantly more in probate fees and time later.
      </p>
      <p>
        Common trust structures:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><strong>Revocable Living Trust:</strong> the workhorse for most middle-class estates. You can change it anytime during your life.</li>
        <li><strong>Irrevocable Trust:</strong> for asset protection, tax planning, or special-needs beneficiaries. Cannot be undone.</li>
        <li><strong>Spousal Trust (A/B, QTIP):</strong> for high-net-worth couples maximizing federal estate tax exemptions.</li>
      </ul>

      <H2>The federal estate tax (and why most won't pay it)</H2>
      <p>
        The 2026 federal estate tax exemption is approximately $13.99M per person ($27.98M per couple). Estates
        below this owe no federal estate tax. Above it, the rate jumps to 40%.
      </p>
      <p>
        The Tax Cuts and Jobs Act provisions are scheduled to sunset at end of 2025 (already passed). Without
        Congressional action, the exemption may revert to ~$7M per person — affecting many more estates. Watch
        for legislative changes.
      </p>
      <p>
        State estate and inheritance taxes vary widely. New York, Massachusetts, and several others have
        thresholds far below federal. Consult a local estate attorney if your estate exceeds your state's
        threshold.
      </p>

      <H2>Special situations to plan for</H2>

      <H3>Minor children</H3>
      <p>
        Name a guardian in your will. Without one, the court chooses. Discuss with your selected guardian
        first — don't surprise them. Consider naming a separate person to manage their inheritance until
        they're mature (a trustee), distinct from the guardian who raises them.
      </p>

      <H3>Special needs beneficiary</H3>
      <p>
        Direct inheritance can disqualify someone from means-tested benefits (Medicaid, SSI). A Special Needs
        Trust holds inheritance without affecting eligibility. Always use a specialist attorney for these.
      </p>

      <H3>Blended family</H3>
      <p>
        Default state law often disinherits stepchildren. If you want stepchildren or non-biological children to
        inherit, specify in the will or trust explicitly. Consider whether the new spouse or the children should
        inherit if you predecease.
      </p>

      <H3>Digital assets</H3>
      <p>
        Crypto, online accounts, social media, photo libraries. Most state laws now recognize digital asset
        executors, but only if specified. Maintain a list of accounts and where to find them — not the
        passwords directly (security risk), but enough information that your executor can access them via password
        manager or recovery procedures.
      </p>

      <H2>How much it actually costs</H2>
      <p>
        DIY (online services like Trust &amp; Will, LegalZoom, Nolo): $200–$600 for a basic will + power of
        attorney + healthcare directive. Adequate for most simple estates.
      </p>
      <p>
        Attorney-drafted basic estate plan: $1,500–$3,500. Includes living trust, all related documents, real
        estate transfer to trust. Worth it for any estate with real estate, blended family, or assets over
        $500k.
      </p>
      <p>
        Complex estate planning (high net worth, business interests, multi-state, special needs): $5,000–$25,000+.
        These are bespoke for the situation.
      </p>

      <H2>The most common mistakes</H2>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>Doing nothing.</strong> Roughly 60% of US adults have no will. The cost of inaction is borne by your family.</li>
        <li><strong>Outdated beneficiaries.</strong> Ex-spouses, deceased relatives, dissolved trusts — all routinely named on accounts.</li>
        <li><strong>Trust without funding.</strong> Creating a trust then forgetting to retitle assets to the trust's name. The trust does nothing for assets it doesn't own.</li>
        <li><strong>Missing periodic reviews.</strong> Major life events (marriage, divorce, birth, death, move to a new state) all require document updates.</li>
        <li><strong>Storing the only copy in a safe deposit box.</strong> Banks may freeze access at death. Keep multiple copies, including one with your attorney and your designated executor.</li>
      </ul>

      <KeyTakeaways
        items={[
          'Every adult needs four documents: will, durable financial power of attorney, healthcare directive, and current beneficiary designations.',
          'Beneficiary designations override your will. Outdated beneficiaries are the #1 estate-planning mistake.',
          'Revocable living trusts avoid probate, maintain privacy, and save heirs months and 3–7% in fees.',
          'Federal estate tax exemption is $13.99M per person (2026) but may revert to ~$7M without Congressional action.',
          'DIY documents work for simple estates ($200–$600). Attorney-drafted plans are worth the cost above ~$500k or with real estate, kids, or blended families.',
        ]}
      />
    </div>
  ),
};
