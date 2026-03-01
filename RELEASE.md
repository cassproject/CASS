# CaSS Release Process

Releases for CaSS are fully automated via GitHub Actions to ensure consistency, security, and traceability. The release workflow is split into two parts:

## 1. Triggering a Release (Creating the PR)
To begin a release, you manually trigger the `Draft Release` workflow.

1. Navigate to the **Actions** tab in the CaSS GitHub repository.
2. Select the **Draft Release PR** workflow from the left sidebar.
3. Click the **Run workflow** dropdown on the right.
4. Select the target branch for the release (e.g., `1.5`, `1.6`).
5. Choose the type of version bump (`major`, `minor`, `patch`, or `prerelease`).
6. Click **Run workflow**.

### What happens next?
The GitHub Action will check out the code, run `npm upgrade --save`, and bump the `package.json` version. It will handle creating a new branch and automatically open a **Pull Request** against the major/minor target branch (e.g., `1.6`).

As part of this PR, a secondary job will run **Docker Scout** on the built images. It will assess the `cass`, `cass-alpine`, `cass-distroless`, and `cass-standalone` images for vulnerabilities and post a comment with the CVE report on the PR. 

## 2. Publishing the Release
Once the Pull Request is reviewed (to ensure the dependency updates and CVE scans are acceptable), the release can be finalized.

1. **Merge the PR** into the target branch.
2. Merging the PR triggers the **Publish Release** workflow automatically.

### What happens during publish?
The publish workflow will:
1. Build the Docker images using `docker buildx`.
2. Generate SBOMs (Software Bill of Materials) and SLSA Provenance attestations.
3. Push the images and their attestations to Docker Hub.
4. Create a Git Tag and a GitHub Release containing the changelog.
