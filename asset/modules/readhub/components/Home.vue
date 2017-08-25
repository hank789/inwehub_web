<template>
	<div class="home-wrapper"  :class="{'home-wrapper-h5':Store.is_h5}">
		<announcement></announcement>

		<div class="menu-inwehub">
			<div class="left">
				<router-link tag="div" :to="{ path: '/h5' }" class="menu-item" :class="{ 'active': sort == 'hot' }">
					热门
                </router-link>
				<router-link tag="div" :to="{ path: '/h5?sort=new' }" class="menu-item" :class="{ 'active': sort == 'new' }">
					最新
                </router-link>
			</div>
			<div class="right">
				<div class="menu-item ui dropdown top pointing">
					<svg class="icon-inwehub" aria-hidden="true">
						<use xlink:href="#icon-wode1"></use>
					</svg>
					<div class="menu">
						<div @click="goLink('/bookmarks/submissions')" class="item">
							我的收藏
						</div>
						<div @click="goLink('/' + '@' + auth.id)" class="item">
							我的发布
						</div>
					</div>
				</div>
				<div class="menu-item">
					<svg class="icon-inwehub" aria-hidden="true" @click="refresh">
						<use xlink:href="#icon-shuaxin"></use>
					</svg>
				</div>

				<div class="menu-item desktop-only">
					<svg class="icon-inwehub" aria-hidden="true" @click="changeRoute('notifications')">
						<use xlink:href="#icon-xiaoxi1"></use>
					</svg>
					<span class="notification-number" v-show="getUnreadNotifications()" v-text="getUnreadNotifications()"></span>
				</div>

				<router-link tag="div" :to="{ path: '/submit' }" class="menu-item">
					<svg class="icon-inwehub modify" aria-hidden="true">
						<use xlink:href="#icon-xiugai"></use>
					</svg>
				</router-link>
			</div>
		</div>


		<home-submissions></home-submissions>

	</div>
</template>

<script>
	import HomeSubmissions from '../components/HomeSubmissions.vue';
	import Announcement from '../components/Announcement.vue';
	import Helpers from '../mixins/Helpers';
	import LocalStorage from '../mixins/LocalStorage';

    export default {
    	mixins: [Helpers, LocalStorage],

	    components: {
	        HomeSubmissions,
	        Announcement
	    },

        created() {
            this.setPageTitle('Inwehub - 阅读', true);
            this.askNotificationPermission();
        },

		mounted () {
			this.$nextTick(function () {
	        	this.$root.loadSemanticTooltip();
	        	this.$root.loadSemanticDropdown();
			})
		},

        computed: {
        	filter() {
        	    return Store.feedFilter;
        	},

        	/**
    	 	 * the sort of the page
	    	 *
	    	 * @return mixed
	    	 */
	    	sort() {
	    	    if (this.$route.query.sort == 'new')
	    	    	return 'new';

	    	    if (this.$route.query.sort == 'rising')
	    	    	return 'rising';

	    	    return 'hot';
	    	},
        },

        methods: {
    	    goLink(url) {
    	        setTimeout(() => {
                    this.$router.push(url);
				}, 100);
			},
            getUnreadNotifications(){
                this.$eventHub.$emit('getUnreadNotifications')
			},
            changeRoute: function(newRoute) {
                this.$eventHub.$emit('new-route', newRoute)
            },
        	/**
        	 * changes the filter for home feed
        	 *
        	 * @return void
        	 */
        	changeFilter(filter) {
        		if (Store.feedFilter == filter) return;

        	    Store.feedFilter = filter;

        	    this.putLS('feed-filter', filter);

        	    this.refresh();
        	},

        	/**
        	 * fires the refresh event
        	 *
        	 * @return void
        	 */
        	refresh() {
        	    this.$eventHub.$emit('refresh-home');
        	},

        	/**
        	 * In case the user has just joined to the Voten community let's ask them for the awesome Desktop notifications permission.
        	 *
        	 * @return void
        	 */
        	askNotificationPermission() {
                 if (this.$route.query.newbie == 1) {
                     if ('Notification' in window) {
                         Notification.requestPermission()
                     } else {
                         console.log('Your browser does not support desktop notifications. ')
                     }
                 }
        	}
        },
    }
</script>
