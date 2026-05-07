import type { BlogArticle } from '../types';
import { toMetaList, toRecord } from '../types';

import { urlEncodingExplained } from './url-encoding-explained';
import { jsonEssentials } from './json-essentials';
import { regexCheatsheet } from './regex-cheatsheet';
import { base64AndDataUrls } from './base64-and-data-urls';
import { hashingVsEncryption } from './hashing-vs-encryption';
import { colorTheoryForDevelopers } from './color-theory-for-developers';
import { uuidV4VsV7 } from './uuid-v4-vs-v7';
import { namingConventionsGuide } from './naming-conventions-guide';
import { timestampConversionGuide } from './timestamp-conversion-guide';
import { loremIpsumHistoryAndUses } from './lorem-ipsum-history-and-uses';
import { wordCountReadingTime } from './word-count-reading-time';
import { httpStatusCodesReference } from './http-status-codes-reference';
import { markdownVsHtml } from './markdown-vs-html';
import { jwtTokensExplained } from './jwt-tokens-explained';
import { restVsGraphqlVsGrpc } from './rest-vs-graphql-vs-grpc';
import { corsErrorsExplained } from './cors-errors-explained';
import { unicodeAndEncodingExplained } from './unicode-and-encoding-explained';
import { xmlVsJsonVsYaml } from './xml-vs-json-vs-yaml';
import { websocketVsHttp } from './websocket-vs-http';
import { httpCookiesAndSessions } from './http-cookies-and-sessions';
import { semanticVersioningExplained } from './semantic-versioning-explained';
import { httpHeadersDeepDive } from './http-headers-deep-dive';
import { cachingStrategiesAndHeaders } from './caching-strategies-and-headers';

export const articles: BlogArticle[] = [
  urlEncodingExplained,
  jsonEssentials,
  regexCheatsheet,
  base64AndDataUrls,
  hashingVsEncryption,
  colorTheoryForDevelopers,
  uuidV4VsV7,
  namingConventionsGuide,
  timestampConversionGuide,
  loremIpsumHistoryAndUses,
  wordCountReadingTime,
  httpStatusCodesReference,
  markdownVsHtml,
  jwtTokensExplained,
  restVsGraphqlVsGrpc,
  corsErrorsExplained,
  unicodeAndEncodingExplained,
  xmlVsJsonVsYaml,
  websocketVsHttp,
  httpCookiesAndSessions,
  semanticVersioningExplained,
  httpHeadersDeepDive,
  cachingStrategiesAndHeaders,
];

export const articleMap = toRecord(articles);
export const articleList = toMetaList(articles);
