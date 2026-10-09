const chai = require('chai');
const assert = chai.assert;

// Pure unit tests for the Elasticsearch URL builder. No server or Elasticsearch needed.
// Two kinds of index must never be part of the index expression CaSS sends to Elasticsearch:
//  - indices whose names start with '@', which belong to other applications sharing the cluster;
//  - 'ephemeral', the server's own cache index, which holds dehydrated blobs rather than objects.
describe('skyRepo/searchUtil.js', function () {
    let searchUtil;
    let injectedEndpoint = false;
    const ep = () => global.elasticEndpoint;
    const DEFAULT = () => ep() + '/*,-permanent,-ephemeral,-@*/_search';
    const EXCLUSION = ',-ephemeral,-@*';

    before(() => {
        if (global.elasticEndpoint == null) {
            global.elasticEndpoint = 'http://elasticsearch.test:9200';
            injectedEndpoint = true;
        }
        searchUtil = require('../main/server/skyRepo/searchUtil');
    });
    after(() => {
        if (injectedEndpoint) delete global.elasticEndpoint;
    });

    describe('isExcludedIndex', () => {
        it('flags any index name that starts with @', () => {
            assert.isTrue(searchUtil.isExcludedIndex('@foreign'));
            assert.isTrue(searchUtil.isExcludedIndex('@*'));
            assert.isTrue(searchUtil.isExcludedIndex('  @foreign'), 'leading whitespace must not bypass the check');
        });
        it('flags the ephemeral cache index regardless of case', () => {
            assert.isTrue(searchUtil.isExcludedIndex('ephemeral'));
            assert.isTrue(searchUtil.isExcludedIndex('Ephemeral'));
            assert.isTrue(searchUtil.isExcludedIndex(' ephemeral '));
        });
        it('does not flag CaSS indices or empty values', () => {
            assert.isFalse(searchUtil.isExcludedIndex('permanent'));
            assert.isFalse(searchUtil.isExcludedIndex('schema.cassproject.org.0.4.competency'));
            assert.isFalse(searchUtil.isExcludedIndex('*assertion'));
            assert.isFalse(searchUtil.isExcludedIndex(''));
            assert.isFalse(searchUtil.isExcludedIndex(null));
            assert.isFalse(searchUtil.isExcludedIndex(undefined));
        });
    });

    describe('excludeForeignIndices / allIndices', () => {
        it('appends the ephemeral and @ exclusions to any index expression', () => {
            assert.strictEqual(searchUtil.excludeForeignIndices('*'), '*' + EXCLUSION);
            assert.strictEqual(searchUtil.excludeForeignIndices('@foreign'), '@foreign' + EXCLUSION);
        });
        it('allIndices covers every index except ephemeral and @-prefixed ones', () => {
            assert.strictEqual(searchUtil.allIndices(), '*' + EXCLUSION);
        });
    });

    describe('searchUrl', () => {
        it('default index set excludes permanent, ephemeral and @-prefixed indices', () => {
            assert.strictEqual(searchUtil.searchUrl(null, null), DEFAULT());
            assert.strictEqual(searchUtil.searchUrl(undefined, undefined), DEFAULT());
            assert.strictEqual(searchUtil.searchUrl('', null), DEFAULT());
            assert.strictEqual(searchUtil.searchUrl('/', null), DEFAULT());
        });

        it('an index_hint that mentions permanent falls back to the default index set', () => {
            assert.strictEqual(searchUtil.searchUrl(null, 'permanent'), DEFAULT());
            assert.strictEqual(searchUtil.searchUrl(null, '@foreign,permanent'), DEFAULT());
        });

        it('an index_hint that mentions ephemeral falls back to the default index set', () => {
            assert.strictEqual(searchUtil.searchUrl(null, 'ephemeral'), DEFAULT());
            assert.strictEqual(searchUtil.searchUrl(null, 'ephemeral*'), DEFAULT());
            assert.strictEqual(searchUtil.searchUrl(null, '@foreign,ephemeral'), DEFAULT());
        });

        it('a legitimate index_hint is still honoured, with the exclusions appended', () => {
            assert.strictEqual(searchUtil.searchUrl(null, '*assertion'), ep() + '/*assertion' + EXCLUSION + '/_search');
            assert.strictEqual(searchUtil.searchUrl(null, 'schema.cassproject.org.0.4.competency'), ep() + '/schema.cassproject.org.0.4.competency' + EXCLUSION + '/_search');
        });

        it('an index_hint naming an @-prefixed index directly is neutralised', () => {
            assert.strictEqual(searchUtil.searchUrl(null, '@foreign'), ep() + '/@foreign' + EXCLUSION + '/_search');
        });

        it('wildcard index_hints that would match excluded indices are neutralised', () => {
            assert.strictEqual(searchUtil.searchUrl(null, '*'), ep() + '/*' + EXCLUSION + '/_search');
            assert.strictEqual(searchUtil.searchUrl(null, '@*'), ep() + '/@*' + EXCLUSION + '/_search');
            assert.strictEqual(searchUtil.searchUrl(null, '*foreign*'), ep() + '/*foreign*' + EXCLUSION + '/_search');
            assert.strictEqual(searchUtil.searchUrl(null, 'eph*'), ep() + '/eph*' + EXCLUSION + '/_search');
        });

        it('an index named through the URL remainder is neutralised too', () => {
            const foreign = ep() + '/@foreign' + EXCLUSION + '/_search';
            assert.strictEqual(searchUtil.searchUrl('@Foreign', null), foreign, 'remainder must be lowercased and carry the exclusions');
            assert.strictEqual(searchUtil.searchUrl('@foreign/', null), foreign, 'trailing slash must not defeat the exclusions');
            assert.strictEqual(searchUtil.searchUrl('/@foreign', null), foreign, 'a leading slash must not be doubled');
            assert.strictEqual(searchUtil.searchUrl('ephemeral', null), ep() + '/ephemeral' + EXCLUSION + '/_search', 'ephemeral named in the URL is still excluded');
            assert.strictEqual(searchUtil.searchUrl('@foreign', '@foreign'), foreign, 'remainder takes precedence over index_hint and is still excluded');
        });

        it('the index expression is always a path segment, never part of the URL authority', () => {
            // Express 5 wildcard remainders have no leading slash; an '@' fused onto the
            // endpoint would be parsed as userinfo and redirect the request to another host.
            const expected = new URL(ep());
            const cases = [
                [null, null], [null, '@foreign'], [null, '*'],
                ['@foreign', null], ['/@foreign/', null], ['ephemeral', null],
                ['schema.cassproject.org.0.4.Competency', null], ['/schema.cassproject.org.0.4.Competency', null],
            ];
            for (const [remainder, hint] of cases) {
                const url = new URL(searchUtil.searchUrl(remainder, hint));
                const label = `remainder=${remainder} hint=${hint} produced ${url.href}`;
                assert.strictEqual(url.host, expected.host, label);
                assert.strictEqual(url.username, '', label);
                assert.strictEqual(url.password, '', label);
            }
        });

        it('every produced index expression ends with the exclusions', () => {
            const cases = [
                [null, null], [null, 'permanent'], [null, 'ephemeral'], [null, '*'], [null, '@*'], [null, '@foreign'],
                [null, '*assertion'], ['@foreign', null], ['@foreign/', '*'], ['ephemeral', null], ['competency', null],
            ];
            for (const [remainder, hint] of cases) {
                const url = searchUtil.searchUrl(remainder, hint);
                const indexExpression = url.substring(ep().length, url.length - '/_search'.length);
                assert.isTrue(indexExpression.endsWith(EXCLUSION), `remainder=${remainder} hint=${hint} produced ${url}`);
                if (remainder == null) {
                    // A hint can never make ephemeral the target; a remainder of 'ephemeral' is
                    // neutralised by the appended exclusion instead (ephemeral,-ephemeral resolves to nothing).
                    assert.isFalse(indexExpression.replace(/^\//, '').startsWith('ephemeral'), `hint=${hint} targets ephemeral: ${url}`);
                }
            }
        });
    });
});
