import type { ExpectExtends, ExpectTrue } from "@type-challenges/utils";
import type { RuleMeta } from "../src-js/plugins/rule_meta.ts";

// `RuleMeta.replacedBy` must be assignable to ESLint's `readonly string[] | undefined`
// for `eslintCompatPlugin(...)` output to be usable as `import('@eslint/core').Plugin`.
// See: https://github.com/eslint/rewrite/blob/main/packages/core/src/types.ts
type _ReplacedByIsESLintCompatible = ExpectTrue<
  ExpectExtends<readonly string[] | undefined, RuleMeta["replacedBy"]>
>;
