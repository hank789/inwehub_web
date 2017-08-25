<template>
	<div>
		<div v-bind:style="{ background: coverBackground }" class="profile-cover">
		    <div class="container user-select full-width">
		        <div class="cols-flex">
		            <div class="category-header-left">
		               	<!-- avatar -->
		               		<div class="profile-avatar avatar-preview" v-if="$route.name == 'user-settings-profile'">
			                    <button type="button">
						            <img v-bind:alt="userStore.username" v-bind:src="userStore.avatar" class="circle" />

						            <div class="update circle">
						                <i class="v-icon v-photo" aria-hidden="true"></i>
						                上传头像
						            </div>
						        </button>

				                <input type="file" id="fileUploadFile" @change="passToCropModal">
		                    </div>

		                    <div class="profile-avatar" v-else>
	    						<router-link :to="'/@' + userStore.id">
		                        	<img v-bind:src="userStore.avatar" v-bind:alt="userStore.name" class="circle" />
		                        </router-link>
		                    </div>
		                <!-- end avatar -->
		            </div>

		            <div class="category-header-middle">
						<!--<h1 v-if="false">-->
						    <!--{{ userStore.name }}-->
						<!--</h1>-->

	    				<router-link :to="'/@' + userStore.id">
		                    <h2>
		                        {{ userStore.username }}
		                    </h2>
		                </router-link>

		                <!--<p v-text="userStore.bio"></p>-->

						<!--<span class="inline-block">-->
	                        <!--<i class="v-icon v-submissions" aria-hidden="true" data-toggle="tooltip" data-placement="bottom" title="Submissions"></i>{{ userStore.stats.submissionsCount }}-->
		                <!--</span>-->

						<!--<span class="inline-block">-->
	                        <!--<i class="v-icon v-chat" aria-hidden="true" data-toggle="tooltip" data-placement="bottom" title="Comments"></i>{{ userStore.stats.commentsCount }}-->
		                <!--</span>-->

						<!--<span v-if="false" class="inline-block">-->
	                        <!--<i class="v-icon v-calendar" aria-hidden="true"></i>加入日期: {{ date }}-->
		                <!--</span>-->

		                <!--<a v-bind:href="userStore.info.website" rel="nofollow" target="_blank" v-if="userStore.info.website" class="inline-block">-->
		                	<!--<i class="v-icon v-link" aria-hidden="true" data-toggle="tooltip" data-placement="bottom" title="Website"></i>{{ userStore.info.website }}-->
		                <!--</a>-->

		                <!--<span v-if="userStore.location" class="inline-block">-->
	                        <!--<i class="v-icon v-location" aria-hidden="true" data-toggle="tooltip" data-placement="bottom" title="Location"></i>{{ userStore.location }}-->
		                <!--</span>-->

						<!--<span v-if="userStore.info.twitter " class="inline-block">-->
							<!--<a v-bind:href="'https://twitter.com/' + userStore.info.twitter" rel="nofollow" target="_blank">-->
	                        	<!--<i class="v-icon v-twitter" aria-hidden="true" data-toggle="tooltip" data-placement="bottom" title="Twitter"></i>{{ userStore.info.twitter }}-->
							<!--</a>-->
		                <!--</span>-->
		            </div>

					<div class="statistics-inwehub">
						<span class="title">文章</span>
						<div class="content">
							<span class="two">累计<b>{{ userStore.stats.submissionsCount }}</b>篇</span>
							<span class="split"></span>
							<span class="two">影响值<b>{{ userStore.stats.submission_karma }}</b></span>
						</div>
					</div>

					<div class="statistics-inwehub">
						<span class="title">评论</span>
						<div class="content">
							<span class="two">累计<b>{{ userStore.stats.commentsCount }}</b>条</span>
							<span class="split"></span>
							<span class="two">影响值<b>{{ userStore.stats.comment_karma }}</b></span>
						</div>
					</div>

		        </div>
		    </div>
		</div>

		<nav class="nav has-shadow user-select">
		    <div class="container">
		        <div class="nav-left">
					<router-link :to="'/@' + $route.params.username" class="nav-item is-tab" active-class="is-active" exact>
						文章
					</router-link>

					<router-link :to="'/@' + $route.params.username + '/comments'" class="nav-item is-tab" active-class="is-active" exact>
						回复
					</router-link>

					<router-link :to="'/@' + $route.params.username + '/settings'" class="nav-item is-tab" active-class="is-active" v-if="isAuth && false">
						设置
					</router-link>

					<router-link :to="'/@' + $route.params.username + '/upvoted-submissions'" class="nav-item is-tab" active-class="is-active" v-if="isAuth">
						赞
					</router-link>

					<router-link :to="'/@' + $route.params.username + '/downvoted-submissions'" class="nav-item is-tab" active-class="is-active" v-if="isAuth">
						踩
					</router-link>
		        </div>

		        <div class="channel-admin-btn">
		        	<i class="v-icon h-yellow pointer" :class="bookmarked ? 'go-yellow v-unbookmark' : 'v-bookmark'"
		        	@click="bookmark" v-if="$route.params.username != auth.id"
	        		data-toggle="tooltip" data-placement="bottom" title="Bookmark"></i>

		            <message-button :id="userStore.id" v-if="$route.params.username != auth.id && !isGuest && false"></message-button>

					<router-link v-if="false" class="v-button" :to="{ name: 'user-settings-profile' }"  v-show="$route.params.username == auth.id">
						编辑个人信息
					</router-link>
		        </div>
		    </div>
		</nav>
	</div>
</template>

<script>
import MessageButton from '../components/MessageButton.vue';
import Helpers from '../mixins/Helpers';

export default {
	mixins: [Helpers],

    components: {
    	MessageButton
    },

    data: function () {
        return {
            Store,
            auth,
        	bookmarked: false,
        	fileUploadFormData: new FormData(),
        }
    },

    created () {
    	this.setBookmarked()
    },

    watch: {
        '$route' () {
            this.setBookmarked();
        },

        'Store.userBookmarks' () {
            this.setBookmarked();
        },
    },

	mounted () {
		this.$nextTick(function () {
        	this.$root.loadSemanticTooltip()
		})
	},

	methods: {
		/**
		 * Passes the photo to the cropModal to take care of the rest
		 *
		 * @return void
		 */
		passToCropModal (e) {
            this.fileUploadFormData.append('photo', e.target.files[0]);

    		axios.post('/upload-temp-avatar', this.fileUploadFormData)
				.then((response) => {
					this.$eventHub.$emit('crop-photo-uploaded', response.data)
	            });

    		this.$eventHub.$emit('crop-user-photo')
		},

    	/**
         * Whether or not user has bookmarked the submission
         *
         * @return void
         */
        setBookmarked () {
        	if (Store.userBookmarks.indexOf(Store.user.id) != -1) {
	        	this.bookmarked = true;
	        } else {
                this.bookmarked = false;
			}
	    },

        /**
         * Toggles the category into bookmarks
		 *
		 * @return void
         */
    	bookmark (user)
    	{
    		if (this.isGuest) {
        		this.mustBeLogin();
        		return;
        	}

    		this.bookmarked = !this.bookmarked

			axios.post('/bookmark-user', {
				id: Store.user.id
			}).then((response) => {
				if (Store.userBookmarks.indexOf(Store.user.id) != -1){
                	var index = Store.userBookmarks.indexOf(Store.user.id)
                	Store.userBookmarks.splice(index, 1)

                	return
                }
				Store.userBookmarks.push(Store.user.id)
			})
    	},
    },

    computed: {
    	isAuth ()
    	{
    		return auth.id == this.$route.params.username
		},

    	userStore ()
    	{
    		if ( auth.id == this.$route.params.username ) {
    			return auth
    		}

    		return Store.user
    	},

    	date () {
			return moment(this.userStore.created_at).utc(moment().format("MMM Do")).format("MMM Do")
    	},

        coverBackground ()
        {
            return '#3c3e44';

//        	if (this.userStore.color == 'Red') {
//        		return '#9a4e4e'
//        	} else if (this.userStore.color == 'Blue') {
//        		return '#5487d4'
//        	} else if (this.userStore.color == 'Dark Blue') {
//        		return '#2f3b49'
//        	} else if (this.userStore.color == 'Dark Green') {
//        		return '#507e75'
//        	} else if (this.userStore.color == 'Bright Green') {
//        		return 'rgb(117, 148, 127)'
//        	} else if (this.userStore.color == 'Purple') {
//        		return '#4d4261'
//        	} else if (this.userStore.color == 'Orange') {
//        		return '#ffaf40'
//        	} else if (this.userStore.color == 'Pink') {
//        		return '#ec7daa'
//        	} else { // userStore.color == 'Black'
//        		return '#333'
//        	}
        }
    }
}
</script>
