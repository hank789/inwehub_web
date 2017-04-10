//import 数据 from ''	这里面可以获取数据
import * as types from './mutation_types'
//提交状态
export default {
	/*底部*/
	showFooter: ({ commit }) => {
		commit(types.SHOW_FOOTER)
	},
	hideFooter: ({ commit }) => {
		commit(types.HIDDE_FOOTER);
	},
	//  头部
	showHeader:({ commit }) => {
			commit(types.SHOW_HEADER);
	},
	hideHeader:({ commit }) => {
		commit(types.HIDDE_HEADER);
	}
	

}