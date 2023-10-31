import * as core from '@actions/core'
import * as github from '@actions/github'

async function run() {
  const token = core.getInput('github-token')
  const client = github.getOctokit(token)
  // find the latest release
  const { data: releases } = await client.rest.repos.listReleases({
    owner: github.context.payload.repository!.owner.login,
    repo: github.context.payload.repository!.name,
    per_page: 1,
    page: 1
  })

  // extract the version from the tag
  const version =
    releases.length > 0 ? releases[0].tag_name.replace(/^(v)/, '') : '0.0.0'
  // export the version
  core.exportVariable('GH_REPOSITORY_RELEASE_VERSION', version)
  // if the event is a pull request
  if (github.context.eventName == 'pull_request') {
    const pr_number = github.context.payload.pull_request!.number
    const pr_version = `${version}-pr.${pr_number}`
    // export the version
    core.exportVariable('GH_REPOSITORY_PULL_REQUEST_VERSION', pr_version)
  }
}

run()
