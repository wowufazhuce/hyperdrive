export const prerender = false;

import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { z } from "zod";

const searchParamsSchema = z.object({
	make: z.string().optional(),
	model: z.string().optional(),
	yearFrom: z
		.string()
		.regex(/^\d{4}$/)
		.optional(),
	yearTo: z
		.string()
		.regex(/^\d{4}$/)
		.optional(),
	price: z.string().optional(),
	mileageFrom: z.string().optional(),
	mileageTo: z.string().optional(),
	fuelType: z.string().optional(),
	bodyType: z.string().optional(),
	transmission: z.string().optional(),
	color: z.string().optional(),
	condition: z.string().optional(),
	sort: z.string().optional(),
	search: z.string().optional(),
});

export const GET: APIRoute = async ({ request }) => {
	const start = performance.now();

	const url = new URL(request.url);

	const afterUrl = performance.now();

	const searchParams = Object.fromEntries(url.searchParams.entries());

	const afterSearchParams = performance.now();

	const result = searchParamsSchema.safeParse(searchParams);

	const afterValidation = performance.now();

	if (!result.success) {
		return new Response(JSON.stringify({ error: "Invalid search parameters" }), {
			status: 400,
			headers: { "content-type": "application/json" },
		});
	}

	const {
		make,
		model,
		yearFrom,
		yearTo,
		price,
		mileageFrom,
		mileageTo,
		fuelType,
		bodyType,
		transmission,
		color,
		condition,
		sort,
		search,
	} = result.data;

	const filters: ((data: any) => boolean)[] = [];

	const afterParsing = performance.now();

	// Make
	if (make && make !== "all") {
		filters.push((data: any) => data.general.make === make);
	}

	const afterMake = performance.now();

	// Model
	if (model && model !== "all") {
		if (make !== "all") {
			filters.push((data: any) => data.general.model === model);
		} else {
			return new Response(JSON.stringify({ error: "Please provide a make" }), {
				status: 400,
				headers: { "content-type": "application/json" },
			});
		}
	}

	const afterModel = performance.now();

	// Year
	if (yearFrom) {
		filters.push((data: any) => data.history.year >= parseInt(yearFrom));
	}

	if (yearTo) {
		filters.push((data: any) => data.history.year <= parseInt(yearTo));
	}

	// Price
	if (price && price !== "all") {
		const [minPrice, maxPrice] = price.split("-").map(Number);

		filters.push((data: any) => {
			const regularPrice = data.general.price;
			const salePrice = data.general.salePrice;

			if (maxPrice) {
				return (
					(regularPrice >= minPrice && regularPrice <= maxPrice) ||
					(salePrice && salePrice >= minPrice && salePrice <= maxPrice)
				);
			} else {
				return regularPrice >= minPrice || (salePrice && salePrice >= minPrice);
			}
		});
	}

	const afterPrice = performance.now();

	// Mileage
	if (mileageFrom) {
		filters.push((data: any) => data.history.mileage >= parseInt(mileageFrom));
	}

	if (mileageTo) {
		filters.push((data: any) => data.history.mileage <= parseInt(mileageTo));
	}

	// Fuel Type
	if (fuelType && fuelType !== "all") {
		filters.push((data: any) => data.efficiency.fuelType === fuelType);
	}

	// Body Type
	if (bodyType && bodyType !== "all") {
		filters.push((data: any) => data.general.bodyType === bodyType);
	}

	// Transmission
	if (transmission && transmission !== "all") {
		filters.push((data: any) => data.technical.transmission === transmission);
	}

	// Color
	if (color && color !== "all") {
		filters.push((data: any) => data.exterior.color === color);
	}

	// Condition
	if (condition && condition !== "all") {
		filters.push((data: any) => data.general.condition === condition);
	}

	const afterFilters = performance.now();

	// Search
	if (search) {
		const searchQueries = search
			.toLowerCase()
			.replace(/[^a-zA-Z0-9\s]/g, "")
			.split(" ");

		filters.push((data: any) => {
			const searchableFields = [
				data.general.make,
				data.general.model,
				data.general.bodyType,
				data.exterior.color,
				data.technical.transmission,
				data.history.year.toString(), // Cast year to string for search
				data.general.condition,
			];

			return searchQueries.every((query) =>
				searchableFields.some((field) => field && field.toLowerCase().includes(query))
			);
		});
	}

	const afterSearch = performance.now();

	const allCars = await getCollection("cars", ({ data }: { data: any }) => {
		return filters.every((filter) => filter(data));
	});

	const afterGetCollection = performance.now();

	// Sort
	if (sort && sort !== "all") {
		const [sortKey, sortOrder] = sort.split("-");
		const order = sortOrder === "asc" ? 1 : -1;

		allCars.sort((a: any, b: any) => {
			let aValue, bValue;

			switch (sortKey) {
				case "price":
					aValue = a.data.general.salePrice ? a.data.general.salePrice : a.data.general.price;
					bValue = b.data.general.salePrice ? b.data.general.salePrice : b.data.general.price;
					break;
				case "mileage":
					aValue = a.data.history.mileage;
					bValue = b.data.history.mileage;
					break;
				case "year":
					aValue = a.data.history.year;
					bValue = b.data.history.year;
					break;
				default:
					aValue = a.data[sortKey];
					bValue = b.data[sortKey];
			}

			if (aValue < bValue) return -1 * order;
			if (aValue > bValue) return 1 * order;
			return 0;
		});
	}

	const afterSort = performance.now();

	if (!allCars || allCars.length === 0) {
		return new Response(JSON.stringify({ error: "No cars found" }), {
			status: 404,
			headers: { "content-type": "application/json" },
		});
	}

	// put all performance measurements in an object and calculate the time taken for each step
	const performanceResults = {
		"Total time": afterSort - start,
		"URL Parsing": afterUrl - start,
		"Search Parameters Parsing": afterSearchParams - afterUrl,
		Validation: afterValidation - afterSearchParams,
		Parsing: afterParsing - afterValidation,
		Make: afterMake - afterParsing,
		Model: afterModel - afterMake,
		Price: afterPrice - afterModel,
		Filters: afterFilters - afterPrice,
		Search: afterSearch - afterFilters,
		"Get Collection": afterGetCollection - afterSearch,
		Sort: afterSort - afterGetCollection,
	};

	return new Response(
		JSON.stringify({
			performance: performanceResults,
			allCars,
		}),
		{
			status: 200,
			headers: { "content-type": "application/json" },
		}
	);
};
