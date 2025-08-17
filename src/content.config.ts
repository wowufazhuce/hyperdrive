import { z, defineCollection } from "astro:content";
import { glob, file } from "astro/loaders";

export const bodyTypes = ["SUV", "轿车", "Hatchback", "跑车", "敞篷", "轿跑"] as const;
export const fuelTypes = ["汽油", "柴油", "混合动力", "电动", "CNG"] as const;
export const conditions = ["新车", "已使用", "已认证"] as const;
export const transmission = ["自动", "手动", "CVT", "双离合"] as const;
export const blogCategories = {
	news: "蓝色",
	reviews: "粉色",
	tips: "紫色",
	events: "绿色",
} as const;
const categoryKeys = Object.keys(blogCategories) as [
	keyof typeof blogCategories,
	...Array<keyof typeof blogCategories>
];

const cars = defineCollection({
	loader: glob({ pattern: ["*.mdx", "!example.mdx"], base: "./src/content/cars" }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			image: image().optional(),
			imageAlt: z.string().optional().default(""),
			gallery: z.array(z.object({ image: image(), alt: z.string() })).optional(),
			videoTourUrl: z.string().url().optional(),
			excerpt: z.string().optional(),
			publishDate: z.coerce.date().default(new Date(2025, 0, 1)),
			general: z.object({
				make: z.string(),
				model: z.coerce.string(),
				type: z.string().optional(),
				price: z.number().positive(),
				salePrice: z.number().positive().optional(),
				bodyType: z.enum(bodyTypes),
				drivetrain: z
					.enum(["前轮驱动", "后轮驱动", "全轮驱动", "四轮驱动"])
					.optional(),
				doors: z.number().int().positive(),
				seatingCapacity: z.number().int().positive(),
				condition: z.enum(conditions).optional(),
				availability: z.enum(["在库", "已预订", "已售", "即将上市"]).default("在库"),
			}),
			history: z.object({
				mileage: z.number().nonnegative(),
				year: z.number().int().min(1886),
				previousOwners: z.number().int().nonnegative().optional(),
				accidentHistory: z.enum(["否", "是 - 轻微损坏", "是 - 严重维修"]).optional(),
			}),
			technical: z.object({
				horsePower: z.number().positive(),
				transmission: z.enum(transmission),
				engineSizeCC: z.number().nonnegative(),
				gears: z.number().int().optional(),
				cilinders: z.number().int().optional(),
				weight: z.number().int().optional(),
			}),
			efficiency: z.object({
				fuelType: z.enum(fuelTypes),
				fuelEfficiencyMPG: z.number().positive().optional(),
				fuelEfficiencyLPer100KM: z.number().positive().optional(),
				emissionsCO2: z.string().optional(),
				emissionsRating: z.string().optional(),
			}),
			options: z.array(z.string()).optional(),
			security: z
				.object({
					alarm: z.boolean().optional(),
					immobilizer: z.boolean().optional(),
					airbags: z.number().int().positive().optional(),
					abs: z.boolean().optional(),
					esp: z.boolean().optional(),
					tireCondition: z.enum(["新", "好", "需要更换"]).optional(),
					safetyRating: z.string().optional(),
				})
				.optional(),
			exterior: z.object({
				color: z.string(),
				paintType: z.enum(["金属", "珍珠", "哑光"]).optional(),
				wheelSize: z.number().positive().optional(),
				wheelType: z.enum(["合金", "钢", "碳纤维"]).optional(),
			}),
			interior: z
				.object({
					materialSeats: z.string().optional(),
					heatedSeats: z.boolean().optional(),
					ventilatedSeats: z.boolean().optional(),
				})
				.optional(),
			misc: z
				.object({
					vin: z.string().optional(),
					registrationStatus: z.enum(["已上户", "未上户", "注册待审核"]).optional(),
					warranty: z.string().optional(),
					dealerNotes: z.string().optional(),
					hidden: z.boolean().optional().default(false),
					loanWidget: z.boolean().optional().default(false),
					featured: z.boolean().optional().default(false),
				})
				.optional(),
		}),
});

const blog = defineCollection({
	loader: glob({ pattern: "**/[^_]*.mdx", base: "./src/content/blog" }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			slug: z.string(),
			image: image(),
			imageAlt: z.string(),
			excerpt: z.string().optional(),
			publishDate: z.coerce.date().default(new Date(2025, 0, 1)),
			category: z.enum(categoryKeys).default("news"),
		}),
});

const team = defineCollection({
	loader: file("src/data/team.json"),
	schema: ({ image }) =>
		z.object({
			name: z.string(),
			role: z.string(),
			email: z.string().email(),
			phone: z.string(),
			image: image(),
		}),
});

const testimonials = defineCollection({
	loader: file("./src/data/testimonials.json"),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			img: image(),
			author: z.string(),
			location: z.string(),
			hidden: z.boolean().default(false),
			starRating: z.number().min(1).max(5),
		}),
});

export const collections = { cars, blog, team, testimonials };
