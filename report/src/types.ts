export type Status = 'passed' | 'failed' | 'skipped' | 'flaky';
export type Suite = 'API' | 'UI' | 'VISUAL';
export type ToolName = 'playwright' | 'cypress';

export interface Run {
  status: Status;
  durationMs: number;
  retries: number;
  error?: string;
}

export interface ToolResult extends Run {
  browsers?: Record<string, Run>;
}

export interface Scenario {
  id: string;
  suite: Suite;
  title: string;
  shots?: { playwright?: string; cypress?: string };
  results: { playwright?: ToolResult; cypress?: ToolResult };
}

export interface Summary {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  flaky: number;
  testTimeMs: number;
  wallTimeMs: number;
  browsers: string[];
}

export interface Results {
  generatedAt: string;
  ci: boolean;
  runUrl?: string;
  commit?: string;
  targets: { ui: string; api: string };
  tools: {
    playwright?: { version?: string; summary: Summary };
    cypress?: { version?: string; summary: Summary };
  };
  scenarios: Scenario[];
}
