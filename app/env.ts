import * as v from "valibot";

const envSchema = v.object({
	REDIS_HOST: v.string(),
	REDIS_PORT: v.pipe(
		v.string(),
		v.transform((val) => Number.parseInt(val, 10)),
		v.number(),
		v.minValue(1),
		v.maxValue(65535),
	),
});

export const env = v.parse(envSchema, process.env);
