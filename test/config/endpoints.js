module.exports = {
    host : {
        dev : 'https://dev.otr.mercedes-benz.com.cn/aftersales/',
        qa : 'https://qa.otr.mercedes-benz.com.cn/aftersales/',
	    uat: 'https://uat.otr.mercedes-benz.com.cn/aftersales/',
        pro: 'https://pro.otr.mercedes-benz.com.cn/aftersales/'
    },
    env: process.env.NODE_ENV || 'qa'
}