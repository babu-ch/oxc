import { describe, expect, it } from "vitest";
import { join } from "node:path";
import { runAndSnapshot } from "../utils";

const fixturesDir = join(import.meta.dirname, "fixtures");

describe("vite_config", () => {
  it("basic: reads fmt field from vite.config.ts", async () => {
    const cwd = join(fixturesDir, "basic");
    const snapshot = await runAndSnapshot(cwd, [["--check", "test.ts"]]);
    expect(snapshot).toMatchSnapshot();
  });

  it("error: explicit --config vite.config.ts without fmt field", async () => {
    const cwd = join(fixturesDir, "no_fmt_field");
    const snapshot = await runAndSnapshot(cwd, [
      ["--check", "--config", "vite.config.ts", "test.ts"],
    ]);
    expect(snapshot).toMatchSnapshot();
  });

  it("error: explicit --config vite.config.ts that fails to load", async () => {
    const cwd = join(fixturesDir, "error_load_failure", "child");
    const snapshot = await runAndSnapshot(cwd, [
      ["--check", "--config", "vite.config.ts", "test.ts"],
    ]);
    expect(snapshot).toMatchSnapshot();
  });

  it("error: auto-discovered vite.config.ts that fails to load", async () => {
    const cwd = join(fixturesDir, "error_load_failure", "child");
    const snapshot = await runAndSnapshot(cwd, [["--check", "test.ts"]]);
    expect(snapshot).toMatchSnapshot();
  });

  it("skip: auto-discovered vite.config.ts that fails to load uses defaults", async () => {
    // vite.config.ts imports 'vite' which is not installed → import fails
    // Should skip and use defaults (not error)
    const cwd = join(fixturesDir, "error_load_skip_defaults");
    const snapshot = await runAndSnapshot(cwd, [["--check", "test.ts"]]);
    // test.ts is already formatted with defaults (semi: true), so should pass
    expect(snapshot).toContain("exit code: 0");
    expect(snapshot).toContain("All matched files use the correct format.");
    expect(snapshot).not.toContain("Failed to load configuration file");
  });

  it("skip: auto-discovered vite.config.ts that fails to load falls back to parent config", async () => {
    // child/vite.config.ts fails to load → skip
    // parent/.oxfmtrc.json has semi: false → child/test.ts (const a = 1;) should mismatch
    const cwd = join(fixturesDir, "error_load_failure", "child");
    const snapshot = await runAndSnapshot(cwd, [["--check", "test.ts"]]);
    // Should find the parent's .oxfmtrc.json (semi: false) and flag mismatch
    expect(snapshot).toContain("exit code: 1");
    expect(snapshot).toContain("Format issues found");
    expect(snapshot).not.toContain("Failed to load configuration file");
  });

  it("skip: auto-discovered vite.config.ts without fmt field uses defaults", async () => {
    const cwd = join(fixturesDir, "no_fmt_field");
    const snapshot = await runAndSnapshot(cwd, [["--check", "test.ts"]]);
    expect(snapshot).toMatchSnapshot();
  });

  it("skip: parent config is found when vite.config.ts without fmt is skipped", async () => {
    // child/ has vite.config.ts without .fmt → skipped
    // parent has .oxfmtrc.json with semi: false
    // So `const a = 1;` (with semicolon) should be flagged as mismatch
    const cwd = join(fixturesDir, "skip_finds_parent", "child");
    const snapshot = await runAndSnapshot(cwd, [["--check", "test.ts"]]);
    expect(snapshot).toMatchSnapshot();
  });

  it("skip: auto-discovered vite.config.ts with function export uses defaults", async () => {
    const cwd = join(fixturesDir, "skip_fn_export");
    const snapshot = await runAndSnapshot(cwd, [["--check", "test.ts"]]);
    expect(snapshot).toMatchSnapshot();
  });

  it("priority: oxfmt.config.ts takes precedence over vite.config.ts", async () => {
    // `oxfmt.config.ts` has `semi: false`, `vite.config.ts` has `semi: true`
    // oxfmt.config.ts should win, so `const a = 1;` (with semicolon) should be flagged
    const cwd = join(fixturesDir, "priority");
    const snapshot = await runAndSnapshot(cwd, [["--check", "test.ts"]]);
    expect(snapshot).toMatchSnapshot();
  });
});
