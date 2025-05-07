# Change Log

## 1.6.1
* Updated ceasn importer.
* Added bulk ephemeral cache retrieval.
* Updates based on sonar and fortify findings.
* Assertion processing now searches based on competency ids.
* Updated profile caching to 30 days.
* Updated profile calculation to 1gb.
* Fixed issue associated with 409 errors when reading data causing writes to take a long time.
* Moved adapter/* to cartridge/* to allow for more control over removal of adapters.
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