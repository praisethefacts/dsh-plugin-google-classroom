# dsh-google-classroom

Google Classroom tools for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness),
served by the [`google-classroom-mcp`](https://github.com/praisethefacts/google-classroom-mcp)
server. Once installed, the model sees read-only tools such as
`mcp__google-classroom__list_courses` and `mcp__google-classroom__list_due_soon`.

This is a configuration-only DSH bundle: a `package.json` with a
`dsh.bundle.patch` and a `cordis.patch.yml` that inserts one
`@deepseek-ai/dsh-mcp-client` row. It ships no Host or Client code.

## Prerequisites

1. **A Google OAuth client for the Classroom API.** Follow
   [Google Classroom MCP — Setup](https://github.com/praisethefacts/google-classroom-mcp#setup)
   steps 1–3: create an OAuth desktop client, save it as
   `~/.google-classroom-mcp/client_secret.json`, and run the one-time sign-in
   (`uvx --from git+https://github.com/praisethefacts/google-classroom-mcp@v0.1.0 google-classroom-mcp-auth`).
2. **uv** (provides `uvx`). Install from
   [astral.sh/uv](https://docs.astral.sh/uv/getting-started/installation/) or
   `pip install uv`. The bundle uses `uvx` to fetch and run the server on
   demand, so no separate `pip install` is needed.

## Install

In DeepSeek Harness, open **Plugins** in the sidebar and enter one of these
specs, then finish with **Enable now**:

- `github:praisethefacts/dsh-plugin-google-classroom` — straight from GitHub
- an absolute path to this directory, if you cloned it

Or from a terminal:

```sh
dsh plugin --profile <profile> add github:praisethefacts/dsh-plugin-google-classroom
```

Replace `<profile>` with your profile name (for example `web` or `desktop`).

## Verify

Ask the model something like *"What do I have due this week?"* or call
`mcp__google-classroom__list_courses`. The first tool call may be slow while
`uvx` downloads the server and its dependencies; later calls are fast.

If every tool call returns
`No valid Google credentials found...`, the one-time sign-in has not run yet —
see Prerequisites. Google API errors naming scopes mean the OAuth consent
screen was not authorized with the read-only Classroom scopes; delete
`~/.google-classroom-mcp/token.json` and sign in again.

## Configuration

The default row runs:

```sh
uvx --from git+https://github.com/praisethefacts/google-classroom-mcp@v0.1.0 google-classroom-mcp
```

To use a preinstalled or locally cloned server instead, edit
`cordis.patch.yml` before installing and change `command`/`args`:

```yaml
- insert:
    - id: mcp-google-classroom
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: google-classroom
        transport: stdio
        command: google-classroom-mcp
```

DSH scrubs ambient variables whose names look like credentials
(`KEY`, `PASSWORD`, `SECRET`, `TOKEN`) before launching stdio children, so
this bundle relies on the token files under `~/.google-classroom-mcp/`, never
on environment variables.

## Tools

All tools are read-only:

| Tool | Returns |
| --- | --- |
| `list_courses` | Courses you teach or attend |
| `get_course` | One course with description and enrollment code |
| `list_coursework` | Assignments, quizzes, questions and materials, with due dates |
| `list_due_soon` | Upcoming coursework across all active courses |
| `list_announcements` | Recent announcements in a course |
| `list_teachers` / `list_students` | Rosters (name, email) |
| `list_submissions` | Submission state and grades for one assignment |

## Development

```sh
npm install
npm test
```

The tests parse `cordis.patch.yml` and check the bundle declaration without a
running harness.

## License

[MIT](LICENSE)
