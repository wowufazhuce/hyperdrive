import type { CollectionEntry } from "astro:content";
import { unitSystem } from "~/data/config";

type UnitSystem = "imperial" | "metric";
const unitSystemTyped: UnitSystem = unitSystem as UnitSystem;

type ShapeToLabels<T extends Record<string, any>> = {
	[K in keyof T]: T[K] extends Record<string, any> ? ShapeToLabels<T[K]> : string | Record<string, string>;
};

export const labels: ShapeToLabels<CollectionEntry<"cars">["data"]> = {
	title: "Title",
	image: "Image",
	imageAlt: "Image Alt",
	gallery: {
		image: "Image",
		alt: "Alt",
	},
	videoTourUrl: "视频URL",
	excerpt: "摘要",
	publishDate: "发布日期" as unknown as ShapeToLabels<Date>,
	general: {
		make: "品牌",
		model: "型号",
		type: "类型",
		price: "价格",
		salePrice: "销售价格",
		bodyType: "身体类型",
		drivetrain: "驱动类型",
		doors: "门数",
		seatingCapacity: "座位数",
		condition: "状态",
		availability: "可用性",
	},
	history: {
		mileage: unitSystemTyped === "imperial" ? "公里数" : "公里数",
		year: "年份",
		previousOwners: "过户次数",
		accidentHistory: "事故历史",
	},
	technical: {
		horsePower: "马力",
		transmission: "驱动类型",
		engineSizeCC: "发动机排量 CC",
		gears: "齿轮数",
		cilinders: "气缸数",
		weight: "重量",
	},
	efficiency: {
		fuelType: "燃油类型",
		fuelEfficiencyMPG: "燃油效率 MPG",
		fuelEfficiencyLPer100KM: "燃油效率 L/100KM",
		emissionsCO2: "排放 CO2",
		emissionsRating: "排放评级",
	},
	options: "选项",
	security: {
		alarm: "车辆报警",
		immobilizer: "发动机防盗系统",
		airbags: "气囊",
		abs: "防抱死制动系统",
		esp: "电子稳定性系统",
		safetyRating: "安全评级",
	},
	exterior: {
		color: "颜色",
		paintType: "漆类型",
		wheelSize: "轮尺寸",
		wheelType: "轮类型",
	},
	interior: {
		materialSeats: "材料座位",
		heatedSeats: "加热座位",
		ventilatedSeats: "通风座位",
	},
	misc: {
		vin: "VIN",
		registrationStatus: "注册状态",
		warranty: "保修",
		dealerNotes: "经销商备注",
		hidden: "隐藏",
		loanWidget: "贷款小工具",
		featured: "精选",
	},
};

export const categoryLabels = {
	general: "一般信息",
	history: "车况",
	technical: "技术信息",
	exterior: "外部",
	interior: "内部",
	options: "选项",
	security: "安全",
	efficiency: "效率",
	misc: "杂项",
};
