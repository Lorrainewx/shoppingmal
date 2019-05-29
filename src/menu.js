import Cookies from 'js-cookie';
const USERTYPE =Cookies.get('user_type');

const baseMenu = USERTYPE == 'admin' ? [{
	name: 'config',
	icon: 'gear-b',
	path: '/configadmin',
	title: '设置',
	show: true,		
	children: [{
		name: 'config',
		icon: 'gear-b',
		path: '/config',
		title: '系统设置',
		show: true,		
		component: (resolve) => require(['./views/config/config.vue'], resolve),
		children: []
	},{
		name: 'config-password',
		icon: 'compose',
		path: '/config/password',
		title: '管理员列表',
		show: true,		
		component: (resolve) => require(['./views/config/password.vue'], resolve),
		children: []
	},{
		name: 'config-region',
		icon: 'gear-b',
		path: '/region',
		title: '地区列表',
		show: false,		
		component: (resolve) => require(['./views/config/region.vue'], resolve),
		children: []
	}]
},{
	name: 'manager',
	icon: 'gear-b',
	path: '/manager',
	title: '用户中心',
	show: true,		
	children: [{
		name: 'config-manager-password',
		icon: 'compose',
		path: '/password',
		title: '修改密码',
		show: true,		
		component: (resolve) => require(['./views/manager/password.vue'], resolve),
		children: []
	}]
},{
	name: 'manage-goods',
	icon: 'bag',
	path: '/manage/goods',
	title: '商品',
	component: (resolve) => require(['./views/goods/goods_list.vue'], resolve),
	show: true,		
	children: [{
		name: 'manage-goods-list',
		icon: 'android-list',
		path: '/manage/goodslist',
		title: '商品列表',
		
		show: true,		
		component: (resolve) => require(['./views/goods/goods_list.vue'], resolve),
		children:[]
	},{
		name: 'manage-goods-edit',
		icon: 'android-list',
		path: '/manage/goodsedit/:goods_id',
		title: '商品管理',
		show: false,		
		component: (resolve) => require(['./views/goods/goods_edit.vue'], resolve),
		children:[]
	},{
		name: 'manage-goods-add',
		icon: 'ios-plus',
		path: '/manage/goodsadd',
		title: '商品添加',
		show: false,
		component: (resolve) => require(['./views/goods/goods_add.vue'], resolve),
		children:[]
	},{
		name: 'manage-goods-type',
		icon: 'pricetag',
		path: '/manage/goodstype',
		title: '商品分类',
		
		show: true,
		component: (resolve) => require(['./views/goods/goods_type.vue'], resolve),
		children:[]
	},{
		name: 'manage-goodsattr',
		icon: 'link',
		path: '/manage/goodsattr',
		title: '商品属性',
		show: true,
		component: (resolve) => require(['./views/goods/goods_attr.vue'], resolve),
		children:[]
	},{
		name: 'manage-goodsrate',
		icon: 'android-favorite-outline',
		path: '/manage/goodsrate',
		title: '商品评论',
		show: true,
		component: (resolve) => require(['./views/goods/goods_rate.vue'], resolve),
		children:[]
	},{
		name: 'manage-goodsinquiry',
		icon: 'help-circled',
		path: '/manage/goodsinquiry',
		title: '商品咨询',
		show: true,
		component: (resolve) => require(['./views/goods/goods_inquiry.vue'], resolve),
		children:[]
	}]
},{
	name: 'manage-order',
	icon: 'ios-list',
	path: '/manage/order',
	title: '订单',
	component: (resolve) => require(['./views/order/order_list.vue'], resolve),
	show: true,
	children: [{
		name: 'manage-order-list',
		icon: 'ios-list',
		path: '/manage/orderlist',
		title: '订单列表',
		show: true,
		component: (resolve) => require(['./views/order/order_list.vue'], resolve),
		children: []
	},{
		name: 'manage-order-detail',
		icon: '',
		path: '/manage/orderdetail/:order_id',
		title: '订单查看',
		show: false,
		component: (resolve) => require(['./views/order/order_detail.vue'], resolve),
		children: []
	},{
		name: 'manage-order-send',
		icon: 'ios-list',
		path: '/manage/ordersend',
		title: '发货单列表',
		show: false,
		component: (resolve) => require(['./views/goods/goods_list.vue'], resolve),
		children: []
	},{
		name: 'manage-order-exchange',
		icon: 'ios-list',
		path: '/manage/orderexchange',
		title: '退换货列表',
		show: false,
		component: (resolve) => require(['./views/goods/goods_list.vue'], resolve),
		children: []
	},{
		name: 'manage-order-aftersale',
		icon: 'ios-list',
		path: '/manage/orderaftersale',
		title: '售后服务',
		show: false,
		component: (resolve) => require(['./views/goods/goods_list.vue'], resolve),
		children: []
	}]
},{
		name: 'manage-shipping',
		icon: 'ios-list',
		path: '/manage/shipping',
		title: '物流',
		show: true,
		children: [{
			name: 'manage-shipping-list',
			icon: 'ios-list',
			path: '/manage/shipping',
			title: '配送运费',
			show: true,
			component: (resolve) => require(['./views/shipping/shipping.vue'], resolve),
			children: []
		},{
			name: 'manage-shipping-detail',
			icon: 'ios-list',
			path: '/manage/shippingdetail/:shipping_id',
			title: '详细设置',
			show: false,
			component: (resolve) => require(['./views/shipping/shipping_detail.vue'], resolve),
			children: []			
		}]		
	},{
	name: 'manage-user',
	icon: 'person-add',
	path: '/manage/user',
	title: '会员',
	show: true,	
	children: [{
		name: 'manage-user-list',
		icon: 'plus-circled',
		path: '/manage/userlist',
		title: '会员列表',
		show: false,
		component: (resolve) => require(['./views/user/user_list.vue'], resolve),
		children: []
	},{
		name: 'manage-user-query',
		icon: 'plus-circled',
		path: '/manage/userquery/:user_id',
		title: '会员查看',
		show: false,
		component: (resolve) => require(['./views/user/user_query.vue'], resolve),
		children: []
	},{
		name: 'manage-user-center',
		icon: 'plus-circled',
		path: '/manage/usercenter',
		title: '会员列表',
		show: true,
		component: (resolve) => require(['./views/user/user_wawa.vue'], resolve),
		children: []
	}]
},{
	name: 'manage-background',
	icon: 'ios-folder',
	path: '/manage/background',
	title: '后台管理',
	show: true,		
	children: [{
		name: 'manage-content',
		icon: 'ios-book',
		path: '/manage/content',
		title: '内容管理',
		show: true,		
		children: [],
		component: (resolve) => require(['./views/content/content.vue'], resolve)
	},{
		name: 'manage-content-edit',
		icon: 'ios-book',
		path: '/manage/contentedit/:content_id',
		title: '内容编辑',
		show: false,		
		children: [],
		component: (resolve) => require(['./views/content/content_edit.vue'], resolve)
	},{
		name: 'manage-content-add',
		icon: 'ios-book',
		path: '/manage/contentadd/',
		title: '内容添加',
		show: false,		
		children: [],
		component: (resolve) => require(['./views/content/content_edit.vue'], resolve)
	},{
		name: 'manage-channel',
		icon: 'ios-keypad-outline',
		path: '/manage/channel',
		title: '栏目管理',
		show: true,		
		children: [],
		component: (resolve) => require(['./views/channel/channel_list.vue'], resolve)
	},{
		name: 'manage-link',
		icon: 'link',
		path: '/manage/link',
		title: '链接管理',
		show: true,		
		children: [],
		component: (resolve) => require(['./views/channel/link.vue'], resolve)
	},{
		name: 'manage-link-edit',
		icon: 'edit',
		path: '/manage/linkedit/:link_id',
		title: '类型编辑',
		show: false,		
		children: [],
		component: (resolve) => require(['./views/channel/link_edit.vue'], resolve)
	},{
		name: 'manage-link-add',
		icon: 'edit',
		path: '/manage/linkadd',
		title: '类型添加',
		show: false,		
		children: [],
		component: (resolve) => require(['./views/channel/link_add.vue'], resolve)
	}]
	
},{
	name: 'manage-log',
	icon: 'ios-bookmarks',
	path: '/manage/log',
	title: '日记管理',
	show: true,		
	children: [{
		name: 'manage-log-query',
		icon: 'log-in',
		path: '/manage/logquery',
		title: '日记查看',
		show: true,		
		children: [],
		component: (resolve) => require(['./views/log/log_list.vue'], resolve)
	}] 
}] : USERTYPE == 'answer' ? [{
	name: 'manage-goods',
	icon: 'bag',
	path: '/manage/goods',
	title: '商品',
	component: (resolve) => require(['./views/goods/goods_list.vue'], resolve),
	show: true,		
	children: [{
		name: 'manage-goods-list',
		icon: 'android-list',
		path: '/manage/goodslist',
		title: '商品列表',		
		show: true,		
		component: (resolve) => require(['./views/goods/goods_list.vue'], resolve),
		children:[]
	},{
		name: 'manage-goods-edit',
		icon: 'android-list',
		path: '/manage/goodsedit/:goods_id',
		title: '商品管理',
		show: false,		
		component: (resolve) => require(['./views/goods/goods_edit.vue'], resolve),
		children:[]
	},{
		name: 'manage-goods-add',
		icon: 'ios-plus',
		path: '/manage/goodsadd',
		title: '商品添加',
		show: false,
		component: (resolve) => require(['./views/goods/goods_add.vue'], resolve),
		children:[]
	},{
		name: 'manage-goods-type',
		icon: 'pricetag',
		path: '/manage/goodstype',
		title: '商品分类',
		
		show: true,
		component: (resolve) => require(['./views/goods/goods_type.vue'], resolve),
		children:[]
	},{
		name: 'manage-goodsattr',
		icon: 'link',
		path: '/manage/goodsattr',
		title: '商品属性',
		show: true,
		component: (resolve) => require(['./views/goods/goods_attr.vue'], resolve),
		children:[]
	},{
		name: 'manage-goodsrate',
		icon: 'android-favorite-outline',
		path: '/manage/goodsrate',
		title: '商品评论',
		show: true,
		component: (resolve) => require(['./views/goods/goods_rate.vue'], resolve),
		children:[]
	},{
		name: 'manage-goodsinquiry',
		icon: 'help-circled',
		path: '/manage/goodsinquiry',
		title: '商品咨询',
		show: true,
		component: (resolve) => require(['./views/goods/goods_inquiry.vue'], resolve),
		children:[]
	}]
},{
	name: 'manage-order',
	icon: 'ios-list',
	path: '/manage/order',
	title: '订单',
	component: (resolve) => require(['./views/order/order_list.vue'], resolve),
	show: true,
	children: [{
		name: 'manage-order-list',
		icon: 'ios-list',
		path: '/manage/orderlist',
		title: '订单列表',
		show: true,
		component: (resolve) => require(['./views/order/order_list.vue'], resolve),
		children: []
	},{
		name: 'manage-order-detail',
		icon: '',
		path: '/manage/orderdetail/:order_id',
		title: '订单查看',
		show: false,
		component: (resolve) => require(['./views/order/order_detail.vue'], resolve),
		children: []
	},{
		name: 'manage-order-send',
		icon: 'ios-list',
		path: '/manage/ordersend',
		title: '发货单列表',
		show: false,
		component: (resolve) => require(['./views/goods/goods_list.vue'], resolve),
		children: []
	},{
		name: 'manage-order-exchange',
		icon: 'ios-list',
		path: '/manage/orderexchange',
		title: '退换货列表',
		show: false,
		component: (resolve) => require(['./views/goods/goods_list.vue'], resolve),
		children: []
	},{
		name: 'manage-order-aftersale',
		icon: 'ios-list',
		path: '/manage/orderaftersale',
		title: '售后服务',
		show: false,
		component: (resolve) => require(['./views/goods/goods_list.vue'], resolve),
		children: []
	}]
},{
	name: 'manage-background',
	icon: 'ios-folder',
	path: '/manage/background',
	title: '后台管理',
	show: true,		
	children: [{
		name: 'manage-content',
		icon: 'ios-book',
		path: '/manage/content',
		title: '内容管理',
		show: true,		
		children: [],
		component: (resolve) => require(['./views/content/content.vue'], resolve)
	},{
		name: 'manage-content-edit',
		icon: 'ios-book',
		path: '/manage/contentedit/:content_id',
		title: '内容编辑',
		show: false,		
		children: [],
		component: (resolve) => require(['./views/content/content_edit.vue'], resolve)
	},{
		name: 'manage-content-add',
		icon: 'ios-book',
		path: '/manage/contentadd/',
		title: '内容添加',
		show: false,		
		children: [],
		component: (resolve) => require(['./views/content/content_edit.vue'], resolve)
	},{
		name: 'manage-channel',
		icon: 'ios-keypad-outline',
		path: '/manage/channel',
		title: '栏目管理',
		show: true,		
		children: [],
		component: (resolve) => require(['./views/channel/channel_list.vue'], resolve)
	}]
},{
		name: 'manage-shipping',
		icon: 'ios-list',
		path: '/manage/shipping',
		title: '配送设置',		
		show: true,
		children: [{
			name: 'manage-shipping-list',
			icon: 'ios-list',
			path: '/manage/shipping',
			title: '配送运费',
			show: true,
			component: (resolve) => require(['./views/shipping/shipping.vue'], resolve),
			children: []
		},{
			name: 'manage-shipping-detail',
			icon: 'ios-list',
			path: '/manage/shippingdetail/:shipping_id',
			title: '详细设置',
			show: false,
			component: (resolve) => require(['./views/shipping/shipping_detail.vue'], resolve),
			children: []			
		}]
	},{
	name: 'manager',
	icon: 'gear-b',
	path: '/manager',
	title: '用户中心',
	show: true,		
	children: [{
		name: 'config-manager-password',
		icon: 'compose',
		path: '/password',
		title: '修改密码',
		show: true,		
		component: (resolve) => require(['./views/manager/password.vue'], resolve),
		children: []
	}]
}] : [];


const commonMenu = [{
	name: 'login',
	icon: 'person-stalker',
	path: '/login',
	title: '登陆',
	show: false,
	component: (resolve) => require(['./views/login.vue'], resolve)
},{
	name: 'logout',
	icon: 'person-stalker',
	path: '/login',
	title: '退出',
	show: false,
	component: (resolve) => require(['./views/logout.vue'], resolve)
}]


export default [ baseMenu, commonMenu ]