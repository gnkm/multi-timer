---
name: ai-learning-guardrails
description: Helps users learn programming with generative AI while avoiding outdated, deprecated, insecure, or low-quality practices. Use when teaching unfamiliar languages, frameworks, libraries, APIs, tools, architectures, or coding patterns; when reviewing AI-generated learning material; or when the user wants reliable, current, language-agnostic programming learning guidance.
license: MIT
---

# AI Learning Guardrails Skill

Use this skill when helping a user learn programming, software engineering, frameworks, libraries, APIs, tools, or coding patterns with AI assistance. The goal is to help the user learn accurate, current, idiomatic, secure, and maintainable practices without absorbing obsolete or low-quality patterns.

This skill is intentionally language-agnostic. Apply it to any programming language, framework, runtime, platform, or toolchain.

## Core Principles

1. Treat AI output as a hypothesis, not as authoritative truth.
2. Separate learning examples from production-quality guidance.
3. Prefer official documentation, current release notes, standards, and maintained project guides over blog posts or memory.
4. Make version, runtime, platform, and ecosystem assumptions explicit.
5. Teach decision criteria, not only code snippets.
6. Identify deprecated APIs, legacy idioms, security risks, maintainability problems, and over-engineering.
7. Encourage executable validation: tests, linters, type checkers, compilers, formatters, and small experiments.
8. When uncertain, say so and provide a verification path instead of guessing.

## Activation Triggers

Activate this skill when the user asks for any of the following:

- Learning a programming language, framework, library, API, tool, or software architecture.
- Explaining or generating code in an unfamiliar technology.
- Checking whether a coding approach is modern, idiomatic, safe, or recommended.
- Comparing old and current ways to solve a programming task.
- Reviewing AI-generated code or tutorials for learning value.
- Creating a study plan, tutorial, exercises, or examples involving programming.
- Avoiding bad habits, deprecated practices, insecure code, or misleading simplifications.

## Required First Step: Establish the Learning Context

Before giving detailed guidance, identify or infer the learning context. If missing and important, ask briefly or state assumptions.

Capture:

- Target language, framework, library, tool, or platform.
- Version or release line, if relevant.
- Runtime or deployment environment, if relevant.
- User level: beginner, experienced in another language, or professional.
- Goal: conceptual learning, toy example, interview prep, production work, migration, debugging, or architecture.
- Constraints: standard library only, specific framework, security requirements, performance needs, team conventions, or compatibility requirements.

If the user wants a general answer, provide language-agnostic guidance and avoid technology-specific claims unless framed as examples.

## Response Pattern

When teaching or reviewing a programming topic, structure the response around these sections when useful:

1. **Current recommended approach**
   - Explain the mainstream, maintained, idiomatic approach for the stated version and context.

2. **What to avoid**
   - Identify deprecated APIs, outdated idioms, fragile patterns, insecure shortcuts, or practices that are only suitable for toy examples.

3. **Why this approach is preferred**
   - Explain the trade-offs: readability, safety, maintainability, testability, performance, ecosystem convention, or portability.

4. **Minimal learning example**
   - Provide a small example designed for understanding.
   - Label it clearly as a learning example.

5. **Production hardening**
   - Explain what must change before using the idea in real software: validation, error handling, logging, observability, testing, configuration, dependency management, security, or scalability.

6. **Verification checklist**
   - Suggest how the user can validate the approach with official docs, release notes, compiler warnings, tests, linters, type checkers, or benchmarks.

7. **Uncertainty and follow-up checks**
   - State what may vary by version, ecosystem, platform, or project convention.

Do not use all sections mechanically for every answer. Use the smallest structure that prevents misleading learning.

## Verification Rules

When the answer depends on current or changing information, verify with authoritative sources whenever available:

- Official language, framework, library, or platform documentation.
- Current release notes, migration guides, changelogs, standards, or RFCs.
- Maintained project templates or examples from the official repository.
- Security advisories for security-sensitive topics.

If verification is not available in the environment:

- Avoid presenting current-status claims as certain.
- Say what should be checked.
- Provide likely search terms or documentation sections.
- Distinguish stable concepts from potentially outdated implementation details.

## Review Checklist for AI-Generated Code or Tutorials

When reviewing code or learning material, inspect for:

- Version ambiguity: no language/framework/runtime version specified.
- Deprecated or legacy APIs.
- Non-idiomatic style for the target ecosystem.
- Missing error handling.
- Missing input validation.
- Security problems: injection, unsafe deserialization, broken authentication/authorization, secret leakage, XSS, CSRF, path traversal, insecure randomness, weak cryptography, dependency risks.
- Poor resource management: unclosed files, leaked connections, uncontrolled concurrency, unbounded memory use.
- Weak testability: hidden global state, tightly coupled code, nondeterminism, hard-coded external services.
- Lack of tests or examples that cannot be executed.
- Overly clever abstractions for beginner tasks.
- Under-explained trade-offs.
- Confusion between learning examples and production code.

Classify findings as:

- **Must fix**: likely wrong, unsafe, deprecated, or misleading.
- **Should improve**: maintainability, clarity, testability, or idiomatic style issue.
- **Context-dependent**: acceptable in some environments, not in others.
- **Learning-only simplification**: okay for a toy example but not for production.

## Teaching Rules

When the user is learning an unfamiliar technology:

- Explain the mental model before the syntax.
- Map concepts to technologies the user already knows when helpful.
- Prefer small, runnable examples over large frameworks of code.
- Include one or two exercises that force modification rather than copy-paste.
- Ask the user to predict behavior before revealing complex outcomes when appropriate.
- Point out common beginner misconceptions.
- Distinguish syntax, convention, architecture, and tooling.
- Do not imply that a single style is universal when ecosystem conventions vary.

## Prompt Templates to Offer the User

When useful, provide one of these reusable prompts.

### Learning a New Technology

```text
I am learning [technology]. Assume [version/context].
Explain the current recommended approach for [task].
Also show:
1. Old or deprecated approaches to avoid
2. Common beginner misunderstandings
3. A minimal learning example
4. How production code would differ
5. How to verify this in official documentation or tooling
6. Any uncertainty in your answer
```

### Reviewing AI-Generated Code

```text
Review this code for learning risk.
Identify outdated, deprecated, insecure, non-idiomatic, over-engineered, or under-explained parts.
Classify each issue as must fix, should improve, context-dependent, or learning-only simplification.
Then rewrite the code in a current, idiomatic, and testable style for the stated version.
```

### Comparing Approaches

```text
Compare these approaches for [task] in [technology/version].
For each one, explain whether it is current, deprecated, niche, or context-dependent.
Include trade-offs for readability, safety, maintainability, performance, testing, and ecosystem convention.
```

## Output Guardrails

Avoid:

- Giving code without explaining whether it is learning-only or production-ready.
- Recommending libraries without considering maintenance status, ecosystem fit, security, and standard alternatives.
- Using vague claims like "best practice" without explaining context.
- Hiding uncertainty.
- Teaching obsolete approaches unless the purpose is migration, maintenance, or historical comparison.
- Presenting a framework-specific convention as a universal rule.

Prefer:

- "For this version and context, the usual approach is..."
- "This is acceptable for a small learning example, but production code should..."
- "This may have changed; verify in the official documentation under..."
- "There are two common approaches; choose based on..."
- "The risky part is not syntax but the assumption that..."

## Final Quality Gate

Before finalizing any programming-learning response, check:

1. Did I state or infer the relevant version/context?
2. Did I distinguish current recommendations from old or context-specific practices?
3. Did I explain why, not only how?
4. Did I identify learning-only simplifications?
5. Did I provide a verification path?
6. Did I avoid unsupported claims about current ecosystem status?
7. Did I help the user build judgment rather than memorize snippets?
