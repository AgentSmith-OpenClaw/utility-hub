import type { BlogArticle } from '../types';
import { Lead, H2, H3, Callout, CodeSnippet, KeyTakeaways } from '../components';

export const sqlIndexingFundamentals: BlogArticle = {
  slug: 'sql-indexing-fundamentals',
  category: 'Data',
  title: 'SQL Indexing Fundamentals: When (and What) to Index',
  description:
    "Indexes are the single biggest performance lever in SQL. They're also the most over- and under-applied. Here's a practical framework for deciding what to index and what to leave alone.",
  publishedDate: '2026-05-10',
  readTime: '13 min read',
  keywords:
    'sql index, database indexing, when to add index, composite index, covering index, index strategy, postgres index, mysql index',
  relatedTools: [
    { name: 'SQL Formatter', href: '/tools/sql-formatter' },
    { name: 'JSON Viewer', href: '/tools/json-viewer' },
  ],
  content: (
    <div className="prose prose-lg max-w-none">
      <Lead>
        Indexes turn linear table scans into logarithmic lookups. The cost is extra storage, slower writes, and one
        more thing to maintain. Knowing exactly when that trade-off is worth it is what separates someone who writes
        SQL from someone who runs a database.
      </Lead>

      <H2>What an index actually is</H2>
      <p>
        An index is a separate data structure (almost always a B-tree) that maps indexed values to the row locations
        in the underlying table. When you query <code>WHERE email = &apos;...&apos;</code> on an indexed email column, the database
        walks the B-tree in O(log n) time instead of scanning every row in O(n).
      </p>
      <p>
        For a table with 10 million rows: a B-tree index lookup takes roughly 24 comparisons; a full table scan reads
        all 10M rows. Even on fast SSDs, that&apos;s the difference between 1 millisecond and 5 seconds.
      </p>

      <H2>The four cases you almost always want to index</H2>
      <ol className="list-decimal pl-6 space-y-3 my-4">
        <li>
          <strong>Foreign keys.</strong> Most databases don&apos;t auto-index foreign keys. Without an index, JOIN
          operations and parent-side cascades go quadratic.
        </li>
        <li>
          <strong>Columns in WHERE clauses</strong> on tables with &gt;10K rows where the column has reasonable
          selectivity (returns &lt;5% of rows).
        </li>
        <li>
          <strong>ORDER BY columns</strong> when you don&apos;t want to sort the entire result set in memory.
        </li>
        <li>
          <strong>UNIQUE constraints.</strong> Most databases auto-create an index for these — don&apos;t rely on it,
          confirm.
        </li>
      </ol>

      <H2>Selectivity: the core concept</H2>
      <p>
        Selectivity = (distinct values) / (total rows). High selectivity means a query returns few rows; low selectivity
        means many.
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><strong>Highly selective (good for indexing):</strong> email, user_id, order_number. Indexing pays off.</li>
        <li><strong>Mildly selective:</strong> category_id (10–100 distinct values). Useful in composite indexes.</li>
        <li><strong>Low selectivity (rarely worth indexing alone):</strong> boolean is_active, status enum with 3 values. Index lookup may be slower than table scan because the database has to load both the index and many rows from the table.</li>
      </ul>
      <p>
        Rule of thumb: if a query returns more than 5–10% of the table, the optimizer often skips the index even if you
        have one — full scan with sequential I/O wins.
      </p>

      <Callout title="Read EXPLAIN, then read it again" accent="indigo">
        Run <code>EXPLAIN ANALYZE</code> (PostgreSQL) or <code>EXPLAIN</code> (MySQL) on every important query. Look
        for "Seq Scan" / "Full Table Scan" — that&apos;s where indexes are missing or being ignored. "Index Scan" /
        "ref" means the index is in use.
      </Callout>

      <H2>Composite indexes: order matters</H2>
      <p>
        A composite index on (column_a, column_b) can answer queries on column_a alone OR (column_a AND column_b), but
        NOT column_b alone. Think of it like a phone book sorted by last_name, then first_name — efficient for
        looking up "Smith" or "Smith, John" but useless for "find all the Johns."
      </p>
      <CodeSnippet>
{`CREATE INDEX idx_orders_user_status ON orders (user_id, status);

-- Uses the index efficiently:
SELECT * FROM orders WHERE user_id = 42;
SELECT * FROM orders WHERE user_id = 42 AND status = 'pending';

-- Does NOT use the index (status is the second column):
SELECT * FROM orders WHERE status = 'pending';`}
      </CodeSnippet>
      <p>
        Pick column order by selectivity (most selective first) and by query patterns (most-used columns first).
      </p>

      <H2>Covering indexes</H2>
      <p>
        A covering index includes all the columns a query needs, so the database can answer the query from the index
        alone without touching the underlying table. Massive speedup when the table rows are large.
      </p>
      <CodeSnippet>
{`-- Postgres: include columns in the index
CREATE INDEX idx_orders_user_covered ON orders (user_id) INCLUDE (status, total);

-- This query is now answered entirely from the index:
SELECT user_id, status, total FROM orders WHERE user_id = 42;`}
      </CodeSnippet>

      <H2>Costs that bite</H2>
      <p>
        Every index has costs. They are usually invisible until they&apos;re not.
      </p>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li>
          <strong>Storage:</strong> each index roughly equals the size of the indexed columns × number of rows. A
          big table with five indexes can use 5–10x its base storage.
        </li>
        <li>
          <strong>Write amplification:</strong> every INSERT/UPDATE/DELETE has to update every applicable index. A
          table with 10 indexes has 11 writes per logical write.
        </li>
        <li>
          <strong>Bloat:</strong> in PostgreSQL, deleted rows leave dead tuples in indexes that are reclaimed only by
          VACUUM. Heavy update workloads need maintenance attention.
        </li>
        <li>
          <strong>Plan complexity:</strong> with many indexes, the query planner can pick suboptimal ones. Sometimes
          dropping a "useful-looking" index makes a critical query faster.
        </li>
      </ul>

      <H2>What NOT to index</H2>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>Tables under ~1000 rows.</strong> Full scans are essentially free at that size.</li>
        <li><strong>Columns with very low selectivity</strong> (booleans, 3-value enums) on their own.</li>
        <li><strong>Columns you write to constantly but rarely query by.</strong> Pure overhead.</li>
        <li><strong>Wide string columns</strong> like long URLs or descriptions. Indexing eats storage. If you must index, hash the column and index the hash, or use partial indexes.</li>
      </ul>

      <H2>Special index types worth knowing</H2>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li>
          <strong>Partial index:</strong> indexes only the rows matching a WHERE clause. Useful when most queries
          target a subset (e.g., "WHERE deleted_at IS NULL").
        </li>
        <li>
          <strong>Expression index:</strong> indexes the result of a function call. Lets <code>WHERE LOWER(email) = ?</code> use an index.
        </li>
        <li>
          <strong>GIN / GiST (Postgres):</strong> for full-text search, JSONB columns, arrays.
        </li>
        <li>
          <strong>Hash index:</strong> O(1) lookup but only supports equality. Most use cases prefer B-trees.
        </li>
        <li>
          <strong>BRIN (Postgres):</strong> tiny indexes for huge tables where data is naturally ordered (time-series).
          Trade some lookup speed for massive storage savings.
        </li>
      </ul>

      <H2>The audit process</H2>
      <p>
        Every six months, audit your indexes:
      </p>
      <ol className="list-decimal pl-6 space-y-2 my-4">
        <li>Pull stats on which indexes are being scanned (PostgreSQL: <code>pg_stat_user_indexes</code>).</li>
        <li>Drop indexes with zero scans over the last 30 days. They&apos;re paying write costs for no read benefit.</li>
        <li>Look for foreign keys without indexes — query <code>information_schema</code> to find them.</li>
        <li>Look for redundant indexes: an index on (a) is redundant if you have an index on (a, b).</li>
        <li>Run EXPLAIN on slow-query log entries; add or restructure indexes accordingly.</li>
      </ol>

      <Callout title="Add one at a time, measure each" accent="emerald">
        It&apos;s tempting to "index everything" while you&apos;re tuning. Don&apos;t. Add one index, run your slow
        queries, measure the difference, then decide whether the next one is worth it. Half the indexes you think you
        need turn out to be unused or counterproductive when you measure.
      </Callout>

      <KeyTakeaways
        items={[
          'Always index foreign keys, columns in WHERE clauses on big tables, and ORDER BY columns.',
          'Selectivity matters: low-cardinality columns rarely benefit from a single-column index.',
          'Composite indexes follow leftmost-prefix rules — column order is everything.',
          'Every index taxes writes. Audit unused indexes every 6 months and drop the dead weight.',
          'Use EXPLAIN ANALYZE to confirm the index is actually being used — never assume.',
        ]}
      />
    </div>
  ),
};
