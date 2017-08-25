<template>
    <div class="col-7 padding-bottom-10 user-select">
        <div class="v-status v-status--success" v-if="justCreated">
            频道 #{{ $route.params.name }} 创建成功！
        </div>

        <div class="left-sidebar-box">
            <div class="side-tabs">
                <router-link :to="{ name: 'moderator-panel-reported-submissions' }" active-class="is-active">
					被举报的文章
				</router-link>

                <router-link :to="{ name: 'moderator-panel-reported-comments' }" active-class="is-active">
					被举报的回复
				</router-link>

                <router-link :to="{ name: 'moderator-panel-ban-users' }" active-class="is-active">
					禁止的用户
				</router-link>

                <router-link :to="{ name: 'moderator-panel-block-domains' }" active-class="is-active">
					禁止的域名
				</router-link>

                <router-link :to="{ name: 'moderator-panel-rules' }" active-class="is-active"
                v-if="isAdministrator && false">
					规则
				</router-link>

                <router-link :to="{ name: 'moderator-panel-manage-moderators' }" active-class="is-active"
                v-if="isAdministrator">
					频道管理员
				</router-link>

                <router-link :to="{ name: 'category-settings' }" active-class="is-active"
                v-if="isAdministrator">
					设置
				</router-link>
            </div>

            <div class="content">
                <keep-alive>
                    <router-view></router-view>
                </keep-alive>
            </div>
        </div>
    </div>
</template>

<script>

    export default {

        data: function () {
            return {
                Store
            }
        },

        props: {
            //
        },

        computed: {
            /**
			 * Has the user just created this category?
			 *
			 * @return Boolean
			 */
			justCreated() {
			     return this.$route.query.created == 1
			},

            isAdministrator () {
        		return Store.administratorAt.indexOf(Store.category.id) != -1
        	},
        },

        created () {
            //
        },

        mounted () {
            //
        },

        methods: {
            //
        },

        beforeRouteEnter(to, from, next){
            if (Store.category.name == to.params.name) {
                // loaded
                if (Store.moderatingAt.indexOf(Store.category.id) != -1) {
                    next()
                }
            } else {
                // not loaded but let's continue (the server-side is still protecting us!)
                next()
            }
        },
    };
</script>
