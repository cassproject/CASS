const chai = require('chai');
const assert = chai.assert;

// Pure unit tests for the Elasticsearch URL builder. No server or Elasticsearch needed.
// Indices whose names start with '@' belong to other applications sharing the cluster
// and must never be part of the index expression CaSS sends to Elasticsearch.
describe('skyRepo/searchUtil.js', function () {
    let searchUtil;
    let injectedEndpoint = false;
    const ep = () => global.elasticEndpoint;

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
        it('appends the -@* exclusion to any index expression', () => {
            assert.strictEqual(searchUtil.excludeForeignIndices('*'), '*,-@*');
            assert.strictEqual(searchUtil.excludeForeignIndices('@foreign'), '@foreign,-@*');
        });
        it('allIndices covers every index except @-prefixed ones', () => {
            assert.strictEqual(searchUtil.allIndices(), '*,-@*');
        });
    });

    describe('searchUrl', () => {
        it('default index set excludes permanent and @-prefixed indices', () => {
            assert.strictEqual(searchUtil.searchUrl(null, null), ep() + '/*,-permanent,-@*/_search');
            assert.strictEqual(searchUtil.searchUrl(undefined, undefined), ep() + '/*,-permanent,-@*/_search');
            assert.strictEqual(searchUtil.searchUrl('', null), ep() + '/*,-permanent,-@*/_search');
            assert.strictEqual(searchUtil.searchUrl('/', null), ep() + '/*,-permanent,-@*/_search');
        });

        it('an index_hint that mentions permanent falls back to the default index set', () => {
            assert.strictEqual(searchUtil.searchUrl(null, 'permanent'), ep() + '/*,-permanent,-@*/_search');
            assert.strictEqual(searchUtil.searchUrl(null, '@foreign,permanent'), ep() + '/*,-permanent,-@*/_search');
        });

        it('a legitimate index_hint is still honoured, with @-prefixed indices excluded', () => {
            assert.strictEqual(searchUtil.searchUrl(null, '*assertion'), ep() + '/*assertion,-@*/_search');
            assert.strictEqual(searchUtil.searchUrl(null, 'schema.cassproject.org.0.4.competency'), ep() + '/schema.cassproject.org.0.4.competency,-@*/_search');
        });

        it('an index_hint naming an @-prefixed index directly is neutralised', () => {
            assert.strictEqual(searchUtil.searchUrl(null, '@foreign'), ep() + '/@foreign,-@*/_search');
        });

        it('wildcard index_hints that would match @-prefixed indices are neutralised', () => {
            assert.strictEqual(searchUtil.searchUrl(null, '*'), ep() + '/*,-@*/_search');
            assert.strictEqual(searchUtil.searchUrl(null, '@*'), ep() + '/@*,-@*/_search');
            assert.strictEqual(searchUtil.searchUrl(null, '*foreign*'), ep() + '/*foreign*,-@*/_search');
        });

        it('an index named through the URL remainder is neutralised too', () => {
            const url = searchUtil.searchUrl('@Foreign', null);
            assert.isTrue(url.endsWith('@foreign,-@*/_search'), 'remainder must be lowercased and carry the exclusion: ' + url);
            assert.isTrue(searchUtil.searchUrl('@foreign/', null).endsWith('@foreign,-@*/_search'), 'trailing slash must not defeat the exclusion');
            assert.isTrue(searchUtil.searchUrl('@foreign', '@foreign').endsWith('@foreign,-@*/_search'), 'remainder takes precedence over index_hint and is still excluded');
        });

        it('every produced index expression ends with the -@* exclusion', () => {
            const cases = [
                [null, null], [null, 'permanent'], [null, '*'], [null, '@*'], [null, '@foreign'],
                [null, '*assertion'], ['@foreign', null], ['@foreign/', '*'], ['competency', null],
            ];
            for (const [remainder, hint] of cases) {
                const url = searchUtil.searchUrl(remainder, hint);
                const indexExpression = url.substring(ep().length, url.length - '/_search'.length);
                assert.isTrue(indexExpression.endsWith(',-@*'), `remainder=${remainder} hint=${hint} produced ${url}`);
            }
        });
    });
});
