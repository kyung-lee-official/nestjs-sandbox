"use client";

import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { conditionallyDownloadJsonOrBuffer } from "./api";
import { TanStackWrapper } from "./TanStackWrapper";
import { isAxiosError } from "axios";

const StatusDisplay = (props: {
	downloadMutation: UseMutationResult<any, Error, any, unknown>;
}) => {
	const { downloadMutation } = props;
	if (downloadMutation.isPending) {
		return (
			<span className="flex items-center">
				<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
				Processing...
			</span>
		);
	}
	if (downloadMutation.isError) {
		return (
			<div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
				<strong>Error:</strong> Request failed. Check console for
				details.
			</div>
		);
	}
	if (downloadMutation.isSuccess) {
		/* data is arrayBuffer, convert to JSON */
		const jsonContent = JSON.parse(
			new TextDecoder().decode(downloadMutation.data)
		);
		return (
			<div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
				<strong>Success:</strong> Request completed successfully!
				{downloadMutation.data && (
					<pre>{JSON.stringify(jsonContent, null, 2)}</pre>
				)}
			</div>
		);
	}
	return null;
};

const ConditionalDownloadContent = () => {
	const downloadMutation = useMutation({
		mutationFn: async (requestData?: any) => {
			return await conditionallyDownloadJsonOrBuffer();
		},
		onSuccess: (data) => {},
		onError: (error) => {
			/* Check if error is an Axios error */
			if (isAxiosError(error)) {
				switch (error.response?.headers["content-type"]) {
					case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
						/* convert arraybuffer to xlsx and download excel file */
						const blob = new Blob([error.response.data], {
							type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
						});
						const url = window.URL.createObjectURL(blob);
						const link = document.createElement("a");
						link.href = url;
						link.download = "errors.xlsx";
						document.body.appendChild(link);
						link.click();
						document.body.removeChild(link);
						window.URL.revokeObjectURL(url);
						break;
					default:
						/* unknown error */
						console.error("Request failed with error:", error);
						break;
				}
			} else {
				/* unknown error */
				console.error("Request failed with error:", error);
			}
		},
	});

	const handleGetResponse = () => {
		/* Trigger the mutation with empty data */
		downloadMutation.mutate({});
	};

	return (
		<div className="p-3 space-y-2">
			<h1>Conditionally Download JSON or Buffer</h1>
			<p>
				The backend randomly returns JSON or buffer. The frontend
				handles both cases.
			</p>
			<p>
				When using axios, it is crucial to set the <b>`responseType`</b>{" "}
				to <b>"arraybuffer"</b> to correctly handle binary data
				responses. For normal JSON responses, you can then decode the
				arraybuffer back to a string and parse it as JSON. For error
				responses that return files (like Excel), you can create a Blob
				from the arraybuffer and trigger a download in the browser.
			</p>
			<button
				onClick={handleGetResponse}
				disabled={downloadMutation.isPending}
				className={`p-2 rounded text-white ${
					downloadMutation.isPending
						? "bg-gray-400 cursor-not-allowed"
						: "bg-blue-500 hover:bg-blue-600"
				}`}
			>
				{downloadMutation.isPending ? (
					<span className="flex items-center">
						<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
						Processing...
					</span>
				) : (
					"Get Response"
				)}
			</button>

			<div className="mt-4">
				<StatusDisplay downloadMutation={downloadMutation} />
			</div>
		</div>
	);
};

export const Content = () => {
	return (
		<TanStackWrapper>
			<ConditionalDownloadContent />
		</TanStackWrapper>
	);
};
