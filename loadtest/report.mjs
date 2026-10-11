#!/usr/bin/env node
/**
 * Turns a k6 CSV result (k6 run --out csv=results.csv.gz) into the two tables
 * that answer "at how many users does it slow down, and what breaks first":
 *
 *   1. Per stage (hold-020, hold-050, ...): requests/s, p50/p95/p99, errors.
 *   2. Per stage x step: p95 and error rate for each thing a shopper does.
 *   3. Free plan budget: how many visits a day each free allowance covers, and
 *      which runs out first. On free plans that, not speed, is the real limit.
 *
 * Limits match the thresholds in shopper.js: p95 under 500 ms, errors under 1%.
 *
 *   node loadtest/report.mjs results.csv.gz [report.md] [mock-stats.json]
 */
import { createReadStream, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { createGunzip } from 'node:zlib';
import { createInterface } from 'node:readline';

const [file, out, statsFile] = process.argv.slice(2);
if (!file) {
  console.error('usage: node loadtest/report.mjs results.csv.gz [report.md] [mock-stats.json]');
  process.exit(1);
}

const P95_LIMIT_MS = 500;
const ERROR_LIMIT = 0.01;
const STEPS = ['home', 'shop', 'product', 'reviews', 'checkout', 'subscribe', 'assets'];

/* Free plan allowances, as published on 11 Oct 2026. */
const WORKERS_FREE_PER_DAY = 100_000; // whole account, both Workers; static files do not count
const RESEND_FREE_PER_DAY = 100;
const RESEND_FREE_PER_MONTH = 3_000;
/** Measured from Cloudflare analytics, 27 Sep - 11 Oct 2026: about 1,800 a day
    (mostly the site Worker answering 404s to bots), 2,300 on the busiest day. */
const WORKERS_ALREADY_USED_PER_DAY = 2_300;

/* What a paid order costs after checkout, which the test cannot drive itself
   (Square calls the webhook, not the shopper). Estimates - change them if you
   know better. */
const PAID_SHARE_OF_CHECKOUTS = 0.5; // started checkouts that end in payment
const WEBHOOKS_PER_ORDER = 4; // payment.created, payment.updated, order.updated, ...
const EMAILS_PER_ORDER = 2; // order confirmation + the review request days later

let input = createReadStream(file);
if (file.endsWith('.gz')) input = input.pipe(createGunzip());

let cols = null;
let visits = 0;
const billed = { site: 0, backend: 0, free: 0 };
let checkouts = 0;
let signups = 0;
/** stage -> { first, last, all: {durations, failed}, steps: {step -> same} } */
const stages = new Map();
const bucket = () => ({ durations: [], failed: 0, total: 0 });

for await (const line of createInterface({ input })) {
  // k6 quotes no field we read, so a plain split is enough.
  const f = line.split(',');
  if (!cols) {
    cols = Object.fromEntries(f.map((name, i) => [name, i]));
    continue;
  }
  const metric = f[cols.metric_name];
  if (metric === 'iterations') visits++;
  if (metric !== 'http_req_duration' && metric !== 'http_req_failed') continue;
  const extra = new URLSearchParams(f[cols.extra_tags] || '');
  const stage = extra.get('stage');
  const step = extra.get('step');
  if (!stage || !step) continue; // setup() requests
  if (metric === 'http_req_duration') {
    billed[extra.get('billed') || 'free']++;
    if (f[cols.name] === '/api/square/checkout') checkouts++;
    if (f[cols.name] === '/api/subscribe') signups++;
  }

  const ts = Number(f[cols.timestamp]);
  const value = Number(f[cols.metric_value]);
  if (!stages.has(stage)) stages.set(stage, { first: ts, last: ts, all: bucket(), steps: {} });
  const s = stages.get(stage);
  s.first = Math.min(s.first, ts);
  s.last = Math.max(s.last, ts);
  s.steps[step] ??= bucket();
  for (const b of [s.all, s.steps[step]]) {
    if (metric === 'http_req_duration') b.durations.push(value);
    else {
      b.total++;
      b.failed += value;
    }
  }
}

function pct(sorted, p) {
  if (sorted.length === 0) return NaN;
  return sorted[Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1)];
}
const ms = (v) => (Number.isNaN(v) ? '-' : v >= 1000 ? `${(v / 1000).toFixed(2)} s` : `${Math.round(v)} ms`);
const rate = (b) => (b.total ? b.failed / b.total : 0);
const bad = (b, p95) => p95 >= P95_LIMIT_MS || rate(b) >= ERROR_LIMIT;

const lines = [];
const say = (s = '') => lines.push(s);

say('## By stage');
say();
say('| Stage | Requests | Req/s | p50 | p95 | p99 | Max | Errors | Within limits |');
say('|---|---:|---:|---:|---:|---:|---:|---:|---|');
let firstBadStage = null;
for (const [name, s] of stages) {
  const d = s.all.durations.sort((a, b) => a - b);
  const secs = Math.max(1, s.last - s.first + 1);
  const p95 = pct(d, 95);
  const isBad = bad(s.all, p95);
  if (isBad && !firstBadStage && name.startsWith('hold')) firstBadStage = name;
  say(
    `| ${name} | ${d.length} | ${(d.length / secs).toFixed(0)} | ${ms(pct(d, 50))} | ${ms(p95)} | ${ms(pct(d, 99))} | ${ms(d[d.length - 1])} | ${(rate(s.all) * 100).toFixed(2)}% | ${isBad ? 'NO' : 'yes'} |`,
  );
}

say();
say('## p95 / error rate by step');
say();
say(`| Stage | ${STEPS.join(' | ')} |`);
say(`|---|${STEPS.map(() => '---:').join('|')}|`);
const firstBadStep = new Map();
for (const [name, s] of stages) {
  const cells = STEPS.map((step) => {
    const b = s.steps[step];
    if (!b || b.durations.length === 0) return '-';
    const p95 = pct(b.durations.sort((x, y) => x - y), 95);
    if (bad(b, p95) && !firstBadStep.has(step)) firstBadStep.set(step, name);
    const err = rate(b);
    return `${ms(p95)}${err > 0 ? ` / ${(err * 100).toFixed(1)}%` : ''}${bad(b, p95) ? ' !' : ''}`;
  });
  say(`| ${name} | ${cells.join(' | ')} |`);
}
say();
say(`"!" = p95 at or over ${P95_LIMIT_MS} ms, or errors at or over ${ERROR_LIMIT * 100}%.`);
say();
say('## Verdict');
say();
say(
  firstBadStage
    ? `First steady level outside the limits: **${firstBadStage}**.`
    : 'Every steady level stayed within the limits.',
);
if (firstBadStep.size) {
  say();
  say('First stage at which each step went over:');
  for (const [step, stage] of firstBadStep) say(`- ${step}: ${stage}`);
}

// ── Free plan budget ──────────────────────────────────────────────────────
if (visits > 0) {
  const per = (n) => n / visits;
  const orders = per(checkouts) * PAID_SHARE_OF_CHECKOUTS;
  const workerPerVisit = per(billed.site + billed.backend) + orders * WEBHOOKS_PER_ORDER;
  const emailsPerVisit = per(signups) + orders * EMAILS_PER_ORDER;
  const workerVisits = (WORKERS_FREE_PER_DAY - WORKERS_ALREADY_USED_PER_DAY) / workerPerVisit;
  const resendDayVisits = RESEND_FREE_PER_DAY / emailsPerVisit;
  const resendMonthVisits = RESEND_FREE_PER_MONTH / 30 / emailsPerVisit;
  const n = (v) => Math.round(v).toLocaleString('en-US');
  const d2 = (v) => v.toFixed(2);

  // 3,000 a month is the same 100 a day on average, so one row: whichever is lower.
  const limits = [
    ['Resend emails', `${n(RESEND_FREE_PER_DAY)} a day, ${n(RESEND_FREE_PER_MONTH)} a month`, `${d2(emailsPerVisit)} emails`, Math.min(resendDayVisits, resendMonthVisits)],
    ['Cloudflare Worker requests, per day', `${n(WORKERS_FREE_PER_DAY)} (${n(WORKERS_ALREADY_USED_PER_DAY)} already used)`, `${d2(workerPerVisit)} requests`, workerVisits],
  ].sort((a, b) => a[3] - b[3]);

  say();
  say('## Free plan budget');
  say();
  say(`From ${n(visits)} visits in this run. Per visit: ${d2(per(billed.site))} site Worker requests (review reads), ` +
    `${d2(per(billed.backend))} backend requests (checkout and signup, each with its preflight), ` +
    `${d2(per(billed.free))} static files (free and unlimited), ${d2(per(checkouts))} checkouts started, ${d2(per(signups))} signups.`);
  say();
  say('| Free allowance | Limit | Used per visit | Visits per day it covers |');
  say('|---|---|---:|---:|');
  for (const [name, limit, used, v] of limits) say(`| ${name} | ${limit} | ${used} | **${n(v)}** |`);
  say();
  say(`Runs out first: **${limits[0][0]}**, at about ${n(limits[0][3])} visits a day.`);
  say();
  say(`Assumes ${PAID_SHARE_OF_CHECKOUTS * 100}% of started checkouts are paid, and each paid order adds ` +
    `${WEBHOOKS_PER_ORDER} webhook requests and ${EMAILS_PER_ORDER} emails (constants at the top of report.mjs).`);

  const minutes = Math.max(1, ([...stages.values()].reduce((m, s) => Math.max(m, s.last), 0) -
    [...stages.values()].reduce((m, s) => Math.min(m, s.first), Infinity)) / 60);
  const visitsPerMinute = visits / minutes;
  say();
  say(`This run averaged ${n(visitsPerMinute)} visits a minute. At that pace the day's emails would run out in ` +
    `${n(resendDayVisits / visitsPerMinute)} minutes and the day's Worker requests in ` +
    `${(workerVisits / visitsPerMinute / 60).toFixed(1)} hours.`);
}

const stats = statsFile && existsSync(statsFile) ? JSON.parse(readFileSync(statsFile, 'utf8')) : null;
if (stats) {
  say();
  say('## What the mocked services saw');
  say();
  say(`- Emails sent: ${stats.emailsSent} of a ${stats.resendDailyQuota}-a-day allowance`);
  say(`- Emails refused, daily allowance used up: ${stats.emailsRefusedDailyQuota}` +
    (stats.firstQuotaRefusalAt ? ` (first at ${stats.firstQuotaRefusalAt})` : ''));
  say(`- Emails refused, over 10 a second: ${stats.emailsRefusedRateLimit}`);
  say(`- Square payment links: ${stats.squarePaymentLinks}`);
  say(`- Supabase requests: ${stats.supabaseRequests}`);
}

const text = lines.join('\n');
console.log(text);
if (out) writeFileSync(out, `${text}\n`);
