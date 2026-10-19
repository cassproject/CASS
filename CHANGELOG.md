## Release v1.7.13

* (SECURITY) `GET /api/kill` now requires the value of `KILL` as a key, sent in the `X-Kill-Key` header or as `?key=`; other requests get 403. BREAKING for anyone calling `/api/kill`: set `KILL` to a long random secret and send it. A flag-like value such as `true` logs a warning at startup.
* Added `NO_PUBLIC`: when `true`, requests that would create, change or delete data without a signature sheet (anonymous or signed-out users) are refused with 401. Reads and account creation are unaffected.
* CTDL-ASN exports keep CTDL properties whose values are URLs, such as `ceterms:recognizedForIndustry` (cass-editor#1426).
* Docker: `/app/etc` is writable by group 0, so the images run under arbitrary non-root UIDs (e.g. OpenShift). The distroless image now runs as uid 1000 instead of root. A permission error writing `etc/` now says which directory must be writable and how (cass-editor#1429).
* Docker: the editor image builds the editor on `node:26-alpine` instead of the full `node:26` image, removing most build-stage CVEs (cass-editor#1430).
* The startup migration of the `permanent` index may run for up to 10 hours (`PERMANENT_MIGRATION_TIMEOUT` now defaults to 36000 seconds).
* Documented every environment variable in `CONFIGURATION.md` and `ENVIRONMENT.md`.
* Updated editor: end-to-end test suite and the bugs it found, CSV imports ignore empty rows (cass-editor#1428), Recognized For Industry property (cass-editor#1426), dependency security updates (cass-editor#1430).
* Updated libraries.

## Release v1.7.12

* Profile computation serves the previous profile while it recomputes, and coalesces repeated invalidations, instead of stalling requests.
* xAPI adapter: coordinates with the profile cache and keeps each LRS's read position. Per-LRS position files are named by SHA-256. Lookups are cached, saves are batched, and debug logging was added.

## Release v1.7.11

* Updated libraries.

## Release v1.7.10

* Ephemeral data cleanup works on Elasticsearch 9.5+ (deletes by id without needing `_id` fielddata).
* Index names that are URLs are always sent to Elasticsearch as single path segments.
* The startup migration of the `permanent` index no longer hangs on small Elasticsearch heaps: it reindexes in batches (`PERMANENT_MIGRATION_BATCH`) and gives up after `PERMANENT_MIGRATION_TIMEOUT`.
* Image builds use `docker buildx bake`.

## Release v1.7.9

* The `permanent` index is migrated to an explicit `baseId` field, which history queries use.
* Elasticsearch 9.5.3.

## Release v1.7.8

* HTTP/2 responses send all valid headers.
* Adapters are more resilient, and exports no longer modify the objects they export.
* (SECURITY) The CaSS API can no longer reach Elasticsearch indices other than its own, including `ephemeral`.
* cassproject 5.0.20, nodemailer 10, jsonpath-plus 11, mocha 12, Elasticsearch 9.4.6.
* Updated libraries.

## Release v1.7.7

* xAPI adapter reports LRS responses that are not JSON instead of crashing.

## Release v1.7.6

* Fixed FormData uploads with undici 8.x, and removed the undici compatibility shim.
* Elasticsearch 9.4.5.

## Release v1.7.5

* Elasticsearch 9.x, with a reworked Docker build.
* Profile computation is more stable, HTTP fetches are more compatible, and the profile cache key uses stable parameters.
* Ephemeral documents are stored dehydrated to stay within Elasticsearch's field limits.
* Updated editor.
* Updated libraries.

## Release v1.7.4

* Updated editor.

## Release v1.7.3

* MCP: SDK v2, with adapter tests.
* OIDC: authorization code flow and confidential clients (`CASS_OIDC_CLIENT_SECRET`).
* When a person has duplicate records, the latest one is used.
* Authentication configuration is logged at startup, and the rate limiters were refined.
* Fixed the profile coprocessor losing results when merging assertions.
* Repeated log messages are deduplicated regardless of timestamp.
* `GET /api/ping` reports `VERSION` when it is set.
* CTDL-ASN exports give `ceasn:publisher` as an array for progression models and concept schemes.
* Updated editor.

## Release v1.7.2

* Updated libraries.

## Release v1.7.1

* Version 1.7 (continues from 1.6.34).
* xAPI assertions: the agent is resolved through a hierarchy, and every party in it owns the assertion.
* Docker environment for editor development (`npm run dev:editor`).
* ARM builds included in CI analysis.
* Updated editor.

## Release v1.6.34

* Fixed Docker ARM64 builds (missing `/usr/local/lib64`).

## Release v1.6.33

* Ephemeral data cleanup is throttled.
* Multi-architecture Docker images.

## Release v1.6.32

* OAuth2 JWT bearer authentication, and improved session management.
* Authentication middleware split into separate modules.
* (SECURITY) Strengthened administrative controls and API authentication.
* The server exits cleanly on SIGTERM.
* MCP: adapter endpoints can opt out of MCP (`x-mcp-ignore`), and tool definitions and descriptions use more of the OpenAPI metadata.
* xAPI: stringified data streams are parsed, and competencies aligned directly to an xAPI object are found.
* The audit logger keeps full error data; `CassDecryptError` is logged at a lower severity.
* ARM64 builds.
* Updated libraries.

## Release v1.6.31

* MCP adapter uses Streamable HTTP, with improved OAuth discovery.
* OpenAPI documentation for the xAPI statement endpoint.

## Release v1.6.30

* Fixed a ReferenceError on `GET /api/ping`.
* Fixed multipart file uploads crashing.
* Expired ephemeral entries are cleared only before a read, at most once per cleanup interval (#497).

## Release v1.6.29

* Distroless image on Debian 13.
* undici 8.x, with a FormData compatibility shim.
* Improved audit logging, and streamlined OIDC session management.
* Updated libraries.

## Release v1.6.28

* Configurable OIDC session management (`CASS_SESSION_MAX_AGE`, `CASS_SESSION_VALIDATION_INTERVAL`).
* Added system design, software requirements and database design documents (`DESIGN.md`, `REQUIREMENTS.md`, `DATABASE.md`), and updated the project documentation.
* Release images are built for amd64 only.
* Updated libraries.

## Release v1.6.27

* Express 5.
* Elasticsearch 9.4.2.
* The MCP adapter has a default loopback URL.
* Refined Docker builds for testing and the distroless image.
* Updated libraries.

## Release v1.6.26

* Updated libraries.

## Release v1.6.25

* xAPI integration improvements.
* Updated libraries.

## Release v1.6.24

* Release process: removed the npm audit minimum.

## Release v1.6.23

* Model Context Protocol (MCP) adapter (`/api/mcp`): OAuth2/OIDC authentication and discovery, signature sheets forwarded through MCP sessions, and administrative endpoints filtered out.
* Rate limiting for authentication and IP-restricted routes (`CASS_RATE_LIMIT`).
* Multi-architecture Docker builds.
* Encrypted SkyId payloads are given IDs.
* Updated libraries.

## Release v1.6.22

* `GET /api/ping` includes the server version.
* A native HTTP/2 compatibility shim replaces `spdy-fixes`; HTTPS is tested in the Docker builds.
* Narrowed the search path for the Swagger API documentation.

## Release v1.6.21

* Updated libraries.

## Release v1.6.20

* Faster profile computation, with person lookup caching.

## Release v1.6.19

* Re-release of 1.6.18.

## Release v1.6.18

* Release configuration: standalone Dockerfile paths.

## Release v1.6.17

* Profile computation moved into an adapter, with person lookup caching and integration tests.
* Updated libraries.

## Release v1.6.16

* Profile computation can no longer recurse infinitely, and can skip related outside frameworks (`PROFILE_AVOID_OUTSIDE_FRAMEWORKS`).
* The release process runs local tests and CVE scans.
* Updated libraries.

## Release v1.6.15

* CI: improved builds, test coverage and security scanning.

## Release v1.6.14

* Automated release process (GitHub Actions), with tests in the Docker builds and image vulnerability scanning.
* (SECURITY) minimatch 3.1.5.

# Change Log

## 1.6.13
* Added FETCH_ALLOW_LIST to identify valid targets to fetch, if set.
* Updated libraries
* Security updates.

## 1.6.12
* Added distroless Docker image (`docker-compose-distroless.yml`) — minimal attack surface with no shell or package manager.
* Added comprehensive OpenAPI documentation to all API endpoints — interactive API docs available at `/api/swagger/`.
* OpenAPI specification is now validated at server startup — the server exits if the spec is invalid.
* Added `ENVIRONMENT.md` documenting all 80+ environment variables.
* Added `CONFIGURATION.md` (configuration guide), `DEPLOYMENT.md` (local, Docker Hub, and Kubernetes deployment), and `FILE.md` (project structure).
* (SECURITY) Updated `qs` dependency from 6.14.1 to 6.14.2.
* Updated libraries.

## 1.6.11
* Updated libraries.
* Hybrid alpine OpenSSL using FIPS compliant base with FIPS validated FIPS module.
* Added profile openapi spec.
* ENVIRONMENT BREAKING CHANGE - The container builds for CaSS now run as user 1000, and all downstream Dockerfiles must ensure user 1000 can perform all relevant operations (binding network ports, modifying files, etc.)

## 1.6.10
* Updated libraries.
* (SECURITY) Added path traversal attack detection.

## 1.6.9
* Updated libraries.
* Updated editor.
* Profile calculator: Added disabled version of condition detection scheme for xAPI statements
* xAPI Adapter: Can now override xAPI adapter connect configurations using environment variables.
* xAPI Adapter: Improved pagination and now use fetch API for xAPI fetching.
* xAPI Adapter: Can now parse xAPI based group performance and turn those into assertions.
* xAPI Adapter: Added more robust xAPI statement parsing and log messages.
* xAPI Adapter: Tied to reactive profile recalculation elements to ensure profiles are recalculated when xAPI statements about a person are received.
* xAPI Adapter: Optimized default coprocessor's default assertion fetch methods.
* xAPI Adapter: Reactive profile cache invalidation no longer immediately restarts profile calculation.

## 1.6.8
* Updated libraries.
* Updated editor.
* Added implies relation as a functional relationship to explicitly allow assertions to transfer to another competency.

## 1.6.7
* Compatibility with Elasticsearch 9.x
* Updated libraries.
* Updated editor.

## 1.6.6
* Added Alpine Node w/FIPS.
* Updated libraries.
* Updated editor.

## 1.6.5 v2
* Switched back to ENTRYPOINT.

## 1.6.5
* Updated libraries
* Updated to Node 24 to better support security releases and performance.
* Updated to Elastic 9.x
* Fixed bug with multiget / multiput
* Fixed bug with incoming assertions
* Improved performance of cullFast
* Fixed issue with not being able to receive files in custom services. (binary encoding)

## 1.6.4
* Updated libraries.
* Updated editor.

## 1.6.3
* Added multidelete!!!!
* Refactored src/main/skyRepo.js into multiple files. Overriding it should still work OK.
* Unit test driven fixes

## 1.6.2 (revoked)
* Updated libraries.
* Updated editor.
* Added TLS Requirements
* Added Ollama adapter (POC)
* Updated OpenSSL to 3.1.2

## 1.6.1
* Updated ceasn importer.
* Added bulk ephemeral cache retrieval.
* Updates based on sonar and fortify findings.
* Assertion processing now searches based on competency ids.
* Updated profile caching to 30 days.
* Updated profile calculation to 1gb.
* Fixed issue associated with 409 errors when reading data causing writes to take a long time.
* Moved adapter/*/* to cartridge/adapter/* to allow for more control over removal of adapters.
* Added skyrepo cull methods that remove history to reclaim disk space.
* Added adopting group identities for SSO groups

## 1.6.0
* Updated editor.
* Added event based processing (reactive processing) with rxjs. Added events for (see src/main/server/shims/event.js).
* Added ephemeral storage and periodic deletion of ephemeral records where the TTL has expired. (see src/main/server/shims/ephemeral.js)
* This will require some updates to server.js if you are overriding it, or it will break some things.
* When in SSO mode or have a PROFILE_PPK defined, visitors will trigger profiles to be calculated for everyone else based on that visitor's viewport. These records expire every 24 hours.

## 1.5.73
* Remove usage of @list in ceasn schema
* Updated libraries.
* Updated editor.

## 1.5.72
* Updated ceasn adapter.

## 1.5.71
* Updated libraries.
* Updated editor.

## 1.5.70
* Added additional logging
* WIP Code coverage and scans

## 1.5.68
* Multiget now works in chunks. Fixed bug with async decryption
* Made large encrypted batch operations, deletion of orphan search results and made retrieval of lost/fragmented data more robust.

## 1.5.67
* Remove non-indexable data from index.
* Multithreaded cryptography.
* xAPI Caching and other server fixes.
* Added direct positive assertion coprocessor.
* Improved AWS adapter. Added region control.
* CEASN Export changes.
* Updated libraries.
* Updated editor.

## 1.5.66
* Updated libraries.
* Updated editor.

## 1.5.65
* AWS Bucket connector to interface with Provider Nodes.
* CEASN Export
* Fixed issue with using/reusing signature sheets in multiget.
* Updated editor.
* Updated libraries.

## 1.5.64
* Updated editor.
* Updated libraries.

## 1.5.63
* Updated editor.
* Updated libraries.
* Updated ctdlasn import.
* Increased number of possible fields in configurations and competencies upon startup.

## 1.5.61
* Updated editor.
* Updated libraries.
* Fixed bug where precache was modifying the input array.

## 1.5.60
* Updated editor.
* Updated libraries.
* Fixed some issues associated with L2 cache.

## 1.5.58
* Updated editor.
* Updated libraries
* Client side caching now persists across refreshes, and improvements to bandwidth/speed when `EcRepository.cachingL2` is enabled and hitting cached data.

## 1.5.57
* Updated editor.
* Updated libraries.
* Can now multiget versioned entities.

## 1.5.56
* Merged PRs #307, #316 for P1 compatibility.
* OpenAPI swagger.json now validates.
* Updated libraries.
* Updated editor.

## 1.5.55
* Search results now retry search if enough results were not permissioned to the searcher.
* Updated libraries.
* Updated editor.

## 1.5.51
* Updated libraries.
* Updated editor.
* Multiget fallback now limits to 100 at a time to not overload Elasticsearch

## 1.5.50
* Updated libraries.

## 1.5.44
* Updated editor to fix some security findings.
* Updated CaSS to fix some security findings.

## 1.5.43
* Updated libraries to address CVEs.
* Updated editor.
* Updates to CEASN conversions.

## 1.5.42
* Updated libraries to address CVEs.

## 1.5.41
* CEASN conversion issues fixed.
* Added SKYREPO_DEBUG to diagnose database issues.
* Disabled HTTP2 use in library (still supported in server).

## 1.5.40
* Removed axios. 

## 1.5.38
* Updated casslibrary
* Updated editor
* Added CRL_LISTS environment variable for certificate revocation. Reads revoked certs from /src/main/server/crl
* Updated profile generation to use identity of requestor.
* Library updates.
* Security updates.

## 1.5.37
* Added hash header, sameorigin header, nosniff, mime sniff header (security)
* CTDL export updates. 

## 1.5.35
* FIPS compatibility.
* FIPS is enabled by default in all container builds, built with OpenSSL 3.0.8.
* Switched Elastic to single-node to avoid some configuration annoyances on various platforms.
* REJECT_SHA1 environment variable introduced (off by default), rejects requests made by cass-npm library < 1.5.35
* Turned logging headers off by default.
* LOG_HEADERS environment variable introduced (off by default), enables logging headers.

## 1.5.33
* Multiput now 692% faster (when tested with O*NET Technology Skills, 17,000 items). (194 sec to 28 sec).
* Updates to P1 SSO methods.
* Updates to ceasn and json imports.

## 1.5.32
* Updated Editor
* Updated Dependencies

## 1.5.31
* Updated Editor
* Updated Dependencies
* Made xAPI adapter more tolerant of SSO parameters.
* xAPI adapter now generates Persons based on authority.
* HTTP Put now attaches body to datastreams.
* Some fixes with profile generation errors.

## 1.5.30
* Updated Editor
* Updated Library
* Platform One SSO Integration
* CTDL Progression Model Export Updates
* Reduced CaSS Standalone memory usage to 2gb
* Updated elastic field limit to 10000
* Added docker-compose template.

## 1.5.29
* Updated Editor
* Updated Library
* Updated VM2 (Security)

## 1.5.27
* Updated Editor
* Updated Library
* Now informs clients about which cross origin requests should include credentials.

## 1.5.26
* Updated editor

## 1.5.25
* Updated with 1.5.25 cassproject npm and 1.5.25 editor.
* Now reports max HTTP POST size in /ping
* Fixes to CTDL-ASN

## 1.5.24
* Security updates, changed node base image to Node 19 bulleye.

## 1.5.23
* Started swagger at /api/swagger/
* Updated editor
* Updated libraries
* PM2 is now a production dependency, instead of a dev dependency
* Migration code now correctly uses authentication headers when connecting to Elastic.

## 1.5.22
* Security Updates
* Updated editor
* Updated library

## 1.5.21
* Security Updates.

## 1.5.20
* Added object history queries.
* Updated editor

## 1.5.19
* Updated editor
* Updated library
* Fixed bug in non-loopback proxy support.

## 1.5.18
* Updated editor, admin mode now works. Admin mode only possible via cartridge or putting admin key in cass-editor.

## 1.5.17
* Editor in 1.5.16 wasn't functioning. Fixed in 1.5.17.
* Updated cassproject library to 1.5.17

## 1.5.16
* Updated editor
* Updated cassproject library to 1.5.16
* Updated Docker elasticsearch image to 8.4.3
* Improved websocket performance, especially with many clients.

## 1.5.15
* Updated editor
* Updated cassproject library to 1.5.15
* Updated Docker elasticsearch image to 8.x.x -- Should not cause issues but be wary.
* Updated Docker Node version to 18 -- Should not cause issues but be wary.
* Security related library updates - jose 2.0.5 pinned to -> 2.0.6
* Delete operations now work with Elastic Cloud and authenticated requests.
* FIPS compatible version pinned to Node 18.3

## 1.5.14
* Updated editor
* Fixed elastic headers issue (only affects permissioned Elastic)

## 1.5.13
* Uncaught exceptions now cause a system exit and pm2 to restart
* Fixed order of CEASN export
* Signature sheet identities are now logged
* Environment variable DISABLED_EDITOR now turns off the cass-editor
* Updated editor
* Updated library

## 1.5.10
* Beginning support for Elasticsearch 8 and Elastic Cloud
* Support for Azure Container based deployment (via docker-compose)
* Compatibility with FIPS (needs FIPS enabled environment)
* Now reports last login time/date.
* Logs destination IP of remote systems.
* Introduced logging system. (will turn to JSON log messages soon)
* Introduced MOTD via MOTD_TITLE and MOTD_MESSAGE environment variables.
* Can now disable various logging messages via environment variables: LOG_FILTERED_CATEGORIES, LOG_FILTERED_SEVERITIES and LOG_FILTERED_MESSAGES.
* Can now disable various adapters via environment variable: DISABLED_ADAPTERS=xapi,asn,ceasn,case,jsonld,badge,profile are the inital list.
* Can now restrict the number of concurrent connections via MAX_CONNECTIONS environment variable.
* Can now cryptographically ensure log messages have not been tampered with via a rolling checksum that is signed by the server.
* Can now send warning emails when resources are low, via configuring SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and SMTP_RECIPIENTS.
* If emails are enabled, sends emails upon system crash or uncaught exceptions.
* Added Classification and Markings terms that are not encrypted when objects are secured.
* Now provides a message when you log out.

## 1.5.9
* Updates to login in editor.
* Updates to library.

## 1.5.8
* Updates to editor and CaSS library
* Updated HTTP/2 Negotiation
* Updated some Websocket negotiation

## 1.5.6
* Fixed HTTP/2 Negotiation
* Updates to editor and CaSS library
* Docker deployment limited to 4gb of memory instead of 50% of memory.

## 1.5.5
* HTTP/2 support

## 1.5.4
* Update editor and CaSS library
* Improvements to cartridges
* Added Dockerfile with node base
* Sanctioned replay
* Fix a bug with concept scheme type in CTDL-ASN export

## 1.5.3
* Update editor and CaSS library.
* Fix some bugs with CTDL-ASN JSON-LD exports
* Fix path for cartridges
* Set UTF-8 character encoding in response for JSON get requests

## 1.5.2
* Update editor.
* Update CaSS library.

## 1.5.0
* Updated elasticsearch standalone memory consumption.
* Incremented to 1.5

## 0.5.10
* Updated editor.
* Fixed some bugs with data migration.
* Added banner with environment variables: CASS_BANNER_MESSAGE, CASS_BANNER_TEXT_COLOR, CASS_BANNER_BACKGROUND_COLOR
* Updated elasticsearch version.

## 0.5.9
* Better support for Google and Microsoft SSO.
* Updated editor.

## 0.5.7
* Support domain name changes, database exchanges, and multi-tenancy in a more performant fashion.
* Fixed bugs around re-importing deleted data and versioning.
* Profile calculation is accelerated.
* xAPI polling bug fixes.
* Updated editor.
