module.exports = {
    apps: [{
        name: "omni-knowledge-server",
        script: "./dist/index.js",
        env: {
            NODE_ENV: "production",
        },
        env_production: {
            NODE_ENV: "production",
        }
    }]
}
