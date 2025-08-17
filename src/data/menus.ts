import type { MainMenuItem, MenuNavigation } from "~/types";

export const menuMain: MainMenuItem[] = [
	{
		id: "主页",
		label: "主页",
		url: "/",
	},
	{
		id: "选车",
		label: "选车",
		url: "/cars",
	},
	{
		id: "关于",
		label: "关于",
		url: "/about-us",
		submenu: [{ id: "客户评价", label: "客户评价", url: "/about-us/testimonials" }],
	},
	{
		id: "服务",
		label: "服务",
		url: "/services",
		submenu: [
			{ id: "汽车维修", label: "汽车维修", url: "/services/repairs" },
			{ id: "汽车保养", label: "汽车保养", url: "/services/maintenance" },
			{ id: "汽车销售", label: "汽车销售", url: "/services/car-sales" },
		],
	},
	{
		id: "资讯",
		label: "资讯",
		url: "/blog",
	},
];

export const menuNavigation: MenuNavigation = {
	prettyName: "导航",
	items: [
       {
			name: "主页",
			url: "/",
		},
		{
			name: "选车",
			url: "/cars",
		},
		{
			name: "关于我们",
			url: "/about-us",
		},
		{
			name: "新闻资讯",
			url: "/blog",
		},
	],
};

export const menuService: MenuNavigation = {
	prettyName: "服务",
	items: [
		{
			name: "销售",
			url: "/services/car-sales",
		},
		{
			name: "维修",
			url: "/services/repairs",
		},
		{
			name: "保养",
			url: "/services/maintenance",
		},
	],
};

export const menuMisc: MenuNavigation = {
	prettyName: "支持",
	items: [
		{
			name: "帮助中心",
			url: "/",
		},
		{
			name: "常见问题",
			url: "/faq",
		},
		{
			name: "联系我们",
			url: "/contact",
		},
	],
};

export const menuLegal: MenuNavigation = {
	prettyName: "政策",
	items: [
		{
			name: "隐私政策",
			url: "/privacy",
		},
		{
			name: "服务条款",
			url: "/terms",
		},
		{
			name: "cookies",
			url: "/cookies",
		},
		{
			name: "用户协议",
			url: "/agreement",
		},
	],
};