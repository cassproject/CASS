const { assert } = require('chai');

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

    // The URL builders, run as if the search engine reported this about itself. The tests below
    // expect what Elasticsearch 8 and later are sent, whichever engine the suite is running against.
    const as = function (info) {
        const real = require('../main/server/skyRepo/searchUtil');
        const pinned = {};
        for (const name of ['isExcludedIndex', 'excludeForeignIndices', 'allIndices', 'searchUrl']) {
            pinned[name] = (...args) => {
                const saved = global.elasticSearchInfo;
                global.elasticSearchInfo = info;
                try {
                    return real[name](...args);
                } finally {
                    global.elasticSearchInfo = saved;
                }
            };
        }
        return pinned;
    };

    before(() => {
        if (global.elasticEndpoint == null) {
            global.elasticEndpoint = 'http://elasticsearch.test:9200';
            injectedEndpoint = true;
        }
        searchUtil = as({ version: { number: '9.5.3' } });
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

    // Elasticsearch before 9, and OpenSearch, only read '-name' as an exclusion after an expression
    // with a wildcard; before one, they look for an index called '-name' and the search fails.
    describe('engines that need a wildcard before an exclusion', () => {
        const openSearch = (number) => ({ version: { distribution: 'opensearch', number: number } });
        const elasticsearch = (number) => ({ version: { number: number } });
        const needing = [['OpenSearch 3', openSearch('3.10.0')], ['OpenSearch 2', openSearch('2.19.1')], ['OpenSearch 1', openSearch('1.3.20')],
            ['Elasticsearch 8', elasticsearch('8.19.4')], ['Elasticsearch 7', elasticsearch('7.17.28')], ['Elasticsearch 6', elasticsearch('6.8.23')],
            ['an engine that reports no version', {}], ['no engine information', undefined]];
        const notNeeding = [['Elasticsearch 9', elasticsearch('9.5.3')], ['Elasticsearch 10', elasticsearch('10.0.0')]];

        for (const [name, info] of needing) {
            it(name + ': an expression without a wildcard is given one that matches nothing', () => {
                const util = as(info);
                assert.strictEqual(util.excludeForeignIndices('competency'), '-*,competency' + EXCLUSION);
                assert.strictEqual(util.excludeForeignIndices('@foreign'), '-*,@foreign' + EXCLUSION);
                assert.strictEqual(util.excludeForeignIndices('a,b'), '-*,a,b' + EXCLUSION);
                assert.strictEqual(util.searchUrl(null, 'schema.cassproject.org.0.4.competency'), ep() + '/-*,schema.cassproject.org.0.4.competency' + EXCLUSION + '/_search');
                assert.strictEqual(util.searchUrl('@Foreign', null), ep() + '/-*,@foreign' + EXCLUSION + '/_search');
                assert.strictEqual(util.searchUrl('ephemeral', null), ep() + '/-*,ephemeral' + EXCLUSION + '/_search');
            });
            it(name + ': an expression with a wildcard is left as it is', () => {
                const util = as(info);
                assert.strictEqual(util.allIndices(), '*' + EXCLUSION);
                assert.strictEqual(util.searchUrl(null, null), DEFAULT());
                assert.strictEqual(util.searchUrl(null, '*assertion'), ep() + '/*assertion' + EXCLUSION + '/_search');
                assert.strictEqual(util.searchUrl(null, '@*'), ep() + '/@*' + EXCLUSION + '/_search');
                assert.strictEqual(util.excludeForeignIndices('a,b*'), 'a,b*' + EXCLUSION);
            });
            it(name + ': every index expression still ends with the exclusions', () => {
                const util = as(info);
                for (const [remainder, hint] of [[null, null], [null, '@foreign'], [null, '*'], ['@foreign', null], ['ephemeral', null], ['competency', null], [null, 'permanent']]) {
                    const url = util.searchUrl(remainder, hint);
                    assert.isTrue(url.endsWith(EXCLUSION + '/_search'), `remainder=${remainder} hint=${hint} produced ${url}`);
                }
            });
        }
        for (const [name, info] of notNeeding) {
            it(name + ': nothing is added', () => {
                const util = as(info);
                assert.strictEqual(util.excludeForeignIndices('competency'), 'competency' + EXCLUSION);
                assert.strictEqual(util.searchUrl(null, '@foreign'), ep() + '/@foreign' + EXCLUSION + '/_search');
                assert.strictEqual(util.searchUrl(null, null), DEFAULT());
            });
        }
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

        it('strips every leading and trailing slash from the remainder, and only those', () => {
            const cases = [
                ['competency', 'competency'], ['/competency', 'competency'], ['competency/', 'competency'],
                ['///competency///', 'competency'], ['/a/b/', 'a/b'], ['a//b', 'a//b'],
                ['/', null], ['////', null], ['', null], [12, '12'],
            ];
            for (const [remainder, index] of cases) {
                const expected = index == null
                    ? DEFAULT()
                    : ep() + '/' + index + EXCLUSION + '/_search';
                assert.strictEqual(searchUtil.searchUrl(remainder, null), expected, `remainder=${JSON.stringify(remainder)}`);
            }
        });

        it('handles a remainder of many slashes in linear time', () => {
            const start = Date.now();
            searchUtil.searchUrl('/'.repeat(50000) + 'x' + '/'.repeat(50000) + 'x', null);
            assert.isBelow(Date.now() - start, 1000);
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
