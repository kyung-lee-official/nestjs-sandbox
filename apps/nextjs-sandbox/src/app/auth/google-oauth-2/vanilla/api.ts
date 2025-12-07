/**
 * @fileoverview
 * https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow#obtainingaccesstokens
 */
export function getGoogleOAuth2Url() {
	const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
	const options = {
		client_id: process.env.NEXT_PUBLIC_GOOGLE_OAUTH20_CLIENT_ID as string,
		redirect_uri: process.env
			.NEXT_PUBLIC_GOOGLE_OAUTH20_VANILLA_REDIRECT_URI as string,
		access_type: "offline",
		response_type: "code",
		prompt: "consent",
		scope: [
			"https://www.googleapis.com/auth/userinfo.profile",
			"https://www.googleapis.com/auth/userinfo.email",
		].join(" "),
	};
	// console.log("options: ", options);
	const qs = new URLSearchParams(options);
	// console.log("qs: ", qs);
	// console.log("qs in string: ", qs.toString());
	return `${rootUrl}?${qs.toString()}`;
}
