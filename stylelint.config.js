/**
 * Stylelint config.
 *
 * `npm run lint:css` runs with --fix, so any rule enabled here can rewrite the
 * stylesheets. Several standard rules were turned off precisely because their
 * autofix made hand-formatted CSS worse rather than better — those are grouped
 * and explained below.
 */
export default {
  extends: 'stylelint-config-standard',

  rules: {
    // Tailwind's directives are not real CSS at-rules.
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'apply',
          'layer',
          'config',
          'variants',
          'responsive',
          'screen',
        ],
      },
    ],

    // ── Off because --fix actively degraded the source ────────────────────
    // THIS ONE MATTERED: autofix deleted `-webkit-appearance: none` from
    // .slider-native and ::-webkit-slider-thumb. Safari still requires the
    // prefixed property on the slider thumb, so the "cleanup" silently broke
    // the custom range slider there. Leave it off.
    'property-no-vendor-prefix': null,
    // Rewrote rgba(0,0,0,.25) as rgb(0,0,0,.25). Valid CSS Color 4, but older
    // browsers reject four-argument rgb() — a real support regression.
    'color-function-alias-notation': null,
    // Stripped the blank lines that group the design tokens in index.css.
    'custom-property-empty-line-before': null,
    // Rewrote hsl(0 0% 0% / .1) as hsl(0deg 0% 0% / .1) — same output, pure churn.
    'hue-degree-notation': null,
    // Expanded compact one-line @keyframes steps, which read fine as they were.
    'declaration-block-single-line-max-declarations': null,
    // #000000 -> #000. Harmless, but noise in the diff for no gain.
    'color-hex-length': null,

    // ── Off as a matter of house style ────────────────────────────────────
    'declaration-block-no-redundant-longhand-properties': null,
    'no-descending-specificity': null,
    'custom-property-pattern': null,
    'selector-class-pattern': null,
    'keyframes-name-pattern': null,
    'comment-empty-line-before': null,
    'declaration-empty-line-before': null,
    'rule-empty-line-before': null,
    'value-keyword-case': null,
    'alpha-value-notation': null,
    'color-function-notation': null,
  },
};
