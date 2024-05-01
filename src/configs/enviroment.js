import 'dotenv/config'

const dev = {
    app: {
        port: process.env.DEV_APP_PORT || 3000
    },
    db: {
        host : process.env.DEV_DB_HOST || 'localhost',
        port : process.env.DEV_DB_PORT || 27017,
        name : process.env.DEV_DB_NAME || 'Instagram',
        url : process.env.DEV_DB_URL || 'mongodb://localhost:27017/Instagram'
    }
}

// môi trường product tính sau
const pro = {
    app: {
        port: process.env.PRO_APP_PORT || 3000
    },
    db: {
        host : process.env.PRO_DB_HOST || 'localhost',
        port : process.env.PRO_DB_PORT || 27017,
        name : process.env.PRO_DB_NAME || 'Instagram'
    }
}

const environment = {dev, pro}
const env = process.env.NODE_ENV || 'dev'

export default environment[env] 