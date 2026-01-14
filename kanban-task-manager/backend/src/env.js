import { z } from "zod/v4";
import dotenvFlow from "dotenv-flow";

dotenvFlow.config();

const envSchema = z.object({
	NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
	PORT: z.coerce.number().default(3000),
	MONGO_DB_URI_DEV: z.string().optional(),
	MONGO_DB_URI_PROD: z.string().optional(),
	MONGO_DB_URI_TEST: z.string().optional(),
	FEATURE_SEND_EMAIL: z.string().optional(),
});

try {
	// eslint-disable-next-line node/no-process-env
	envSchema.parse(process.env);
} catch (error) {
	if (error instanceof z.ZodError) {
		console.error(
			"Missing environment variables:",
			error.issues.flatMap((issue) => issue.path),
		);
	} else {
		console.error(error);
	}
	process.exit(1);
}

// eslint-disable-next-line node/no-process-env
export const env = envSchema.parse(process.env);

export const mongoURI =
	env.NODE_ENV === "production"
		? env.MONGO_DB_URI_PROD
		: env.NODE_ENV === "development"
			? env.MONGO_DB_URI_DEV
			: env.MONGO_DB_URI_TEST;

export const FEATURE_SEND_EMAIL = env.FEATURE_SEND_EMAIL === "true";