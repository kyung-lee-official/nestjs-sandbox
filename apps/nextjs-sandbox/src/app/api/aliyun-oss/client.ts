const OSS = require("ali-oss");

export let ossClient: any = null;

export const getOSSClient = async () => {
	if (!ossClient) {
		ossClient = await new OSS({
			accessKeyId: process.env.ALIYUN_OSS_ACCESS_KEY_ID,
			accessKeySecret: process.env.ALIYUN_OSS_ACCESS_SECRET,
			region: process.env.ALIYUN_OSS_REGION,
			authorizationV4: true,
			bucket: process.env.ALIYUN_OSS_BUCKET,
			endpoint: `https://${process.env.ALIYUN_OSS_REGION}.aliyuncs.com`,
		});
	}
	return ossClient;
};
