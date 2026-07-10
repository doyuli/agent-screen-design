// @ts-check

import { readFileSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import pico from 'picocolors'

const msgPath = path.resolve('.git/COMMIT_EDITMSG')
const msg = readFileSync(msgPath, 'utf-8').trim()

// eslint-disable-next-line regexp/no-unused-capturing-group
const COMMIT_RE = /^(revert: )?(feat|fix|docs|dx|style|refactor|perf|test|workflow|build|ci|chore|types|wip|release)(\(.+\))?: .{1,50}/

if (!COMMIT_RE.test(msg)) {
  console.log()
  console.error(
    `  ${pico.bgRed(pico.white(' ERROR '))} ${pico.red(`Invalid commit message format.`)}\n\n`
    + `  ${pico.dim('Help us keep a meaningful git history by following')}\n\n`

    + `  ${pico.yellow('Standard Format:')}\n`
    + `  ${pico.green('<type>[optional scope]: <description>')}\n\n`

    + `  ${pico.cyan('Common Types:')}\n`
    + `  ${pico.green('  feat')}     ${pico.dim('A new feature')}\n`
    + `  ${pico.green('  fix')}      ${pico.dim('A bug fix')}\n`
    + `  ${pico.green('  docs')}     ${pico.dim('Documentation only changes')}\n`
    + `  ${pico.green('  style')}    ${pico.dim('Changes that do not affect the meaning of the code')}\n`
    + `  ${pico.green('  refactor')} ${pico.dim('Code change that neither fixes a bug nor adds a feature')}\n`
    + `  ${pico.green('  perf')}     ${pico.dim('A code change that improves performance')}\n`
    + `  ${pico.green('  test')}     ${pico.dim('Adding missing tests or correcting existing tests')}\n`
    + `  ${pico.green('  build')}    ${pico.dim('Changes that affect the build system or external dependencies')}\n`
    + `  ${pico.green('  ci')}       ${pico.dim('Changes to CI configuration files and scripts')}\n`
    + `  ${pico.green('  chore')}    ${pico.dim('Other changes that don\'t modify src or test files')}\n`
    + `  ${pico.green('  revert')}   ${pico.dim('Reverts a previous commit')}\n\n`

    + `  ${pico.cyan('Correct Examples:')}\n`
    + `  ${pico.white('  feat(ui): add secondary button style')}\n`
    + `  ${pico.white('  fix(auth): resolve token expiration issue')}\n\n`,
  )
  process.exit(1)
}
