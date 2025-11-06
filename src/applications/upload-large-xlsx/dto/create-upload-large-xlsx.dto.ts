import { z } from "zod";

export const CreateUploadLargeXlsxSchema = z.object({
	name: z.string().min(1, "Name is required"),
	gender: z.enum(["Male", "Female", "Other"], {
		errorMap: () => ({ message: "Gender must be Male, Female, or Other" })
	}),
	bioId: z.string().min(1, "Bio ID is required")
});

export type CreateUploadLargeXlsxDto = z.infer<typeof CreateUploadLargeXlsxSchema>;