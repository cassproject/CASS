module.exports = {
    apps: [
        {
            name: 'CaSS',
            script: './src/main/server.js',
            instances: 1,
            log_file: '/logs/cass.log',
            env: {
            },
            node_args: [
                '--max-old-space-size=512',
                '--force-fips',
            ],
        },
    ],
};
