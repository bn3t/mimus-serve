# Mimus Serve

## Introduction

Minus Serve is basically a clone of Wiremock but with many added features.

From Wiremock it supports:

- Request Matching: url, urlPattern, urlPath, urlPathPattern
- Request Matching: headers
- Request Matching: cookies
- Request Matching: matching attributes on: equality, case insensitive, contains, matches (regex), doesNotMatch, JSON Path, Absence
- Stubbing: status, statusMessage, body, bodyFileName
- Stubbing: Stub priority
- Stubbing: headers
- Simulating faults: Per-stub fixed delays
- Stateful Behaviour: Scenario support
- Stateful Behaviour: Resetting scenarios
- Proxying

Not currently supported:

- Request Matching: Binary equality
- Request Matching: JSON equality
- Request Matching: XML equality
- Request Matching: XPATH
- Request Matching: Multipart/form-data
- Request Matching: Basic Authentication
- Request Matching: Dates and times
- Request Matching: Logical AND and OR
- Stubbing: Global fixed stub delays
- Stubbing: Per-stub random delays

Added features:

- Request Matching: presence
- Templating with JSONata
- Dataset support
- Dataset modification with processing

## Documentation

[See Documentation in this Wiki](https://gitlab.com/bn3t/mimus-serve/-/wikis/home)

## Conventional Commits cheatsheet

### General form

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

- type: can be one of:

  - feat: Section features
  - fix: Section bugfixes
  - chore: hidden
  - docs: hidden
  - style: hidden
  - refactor: hidden
  - perf: hidden
  - test: hidden

To force of a release version run pipeline on master with a variable set as:

- RELEASE_AS=x.x.x
