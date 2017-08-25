<template>
	<div class="v-modal" id="search">
	    <div class="v-close" data-toggle="tooltip" data-placement="bottom" title="Close (esc)" @click="close">
	        <i class="v-icon block-before v-cancel" aria-hidden="true"></i>
	    </div>

	    <div class="v-modal-title user-select">
	        <h1 class="title">
	            搜索
	        </h1>

	        <h4 class="sub-title">
	            寻找你感兴趣的内容
	        </h4>
	    </div>

	    <div class="v-modal-search-box" :class="{ 'left-1': !sidebar }">
	    	<div class="tabs is-fullwidth margin-bottom-1">
				<ul>
					<li :class="{ 'is-active--green': type == 'Categories'}">
						<a class="h-green" @click="changeType('Categories')">
							<span>频道</span>
						</a>
					</li>

					<li :class="{ 'is-active--green': type == 'Users'}">
						<a class="h-green" @click="changeType('Users')">
							<span>用户</span>
						</a>
					</li>

					<li :class="{ 'is-active--green': type == 'Submissions'}">
						<a class="h-green" @click="changeType('Submissions')">
							<span>文章</span>
						</a>
					</li>

					<li :class="{ 'is-active--green': type == 'Comments'}">
						<a class="h-green" @click="changeType('Comments')">
							<span>回复</span>
						</a>
					</li>
				</ul>
			</div>

            <div class="ui contacts search">
                <div class="ui huge icon input">
                    <input class="v-search" v-model="filter" type="text"
						   :placeholder="placeholder"
						   v-on:input="search(filter)" v-focus="focused" @focus="focused = true">

					<i v-show="!loading" class="v-icon v-search search icon"></i>
		        	<moon-loader :loading="loading" :size="'30px'" :color="'#777'"></moon-loader>
                </div>
            </div>
	    </div>

	    <div class="container">
	    	<div class="v-push-20"></div>

	        <div class="col-7 user-select">
	            <ul class="v-contact-list" v-if="type == 'Categories'">
	            	<category-search-item v-for="category in categories" :list="category" :key="category.id"></category-search-item>
	            </ul>

	            <h1 class="align-center" v-if="noCategories && filter">
	            	No #channel matched your keywords
	            </h1>

	            <ul class="v-search-items" v-if="type == 'Users'">
	            	<user-search-item v-for="user in users" :list="user" :key="user.id"></user-search-item>
	            </ul>

	            <h1 class="align-center" v-if="noUsers && filter">
	            	未搜索到用户
	            </h1>

	            <div v-if="type == 'Submissions'">
			        <submission v-for="submission in submissions" :list="submission" :key="submission.id"></submission>

			        <h1 class="align-center" v-if="noSubmissions && filter">
		            	未搜索到文章
		            </h1>
			    </div>

		    	<div class="ui threaded comments" v-if="type == 'Comments'">
		    		<div v-for="comment in comments" class="comment-search-item" :key="comment.id">
				        <comment :list="comment" :comments-order="'created_at'"></comment>
				    </div>

				    <h1 class="align-center" v-if="noComments && filter">
						未搜索到回复
		            </h1>
		    	</div>
	        </div>
	    </div>
	</div>
</template>

<script>
import CategorySearchItem from '../components/CategorySearchItem.vue';
import UserSearchItem from '../components/UserSearchItem.vue';
import Submission from '../components/Submission.vue';
import Comment from '../components/Comment.vue';
import MoonLoader from '../components/MoonLoader.vue';
import { focus } from 'vue-focus';

export default {
	directives: {
		focus: focus
	},

	components: {
		CategorySearchItem,
		Comment,
		Submission,
		MoonLoader,
		UserSearchItem
	},

	props: ['sidebar'],

	data: function () {
		return {
			focused: true,
			filter: '',
			result: [],
			loading: false,
			categories: [],
			users: [],
			submissions: [],
			comments: [],
			type: 'Categories',
		}
	},

	mounted: function () {
		this.$nextTick(function () {
			this.$root.loadSemanticTooltip()
		})
	},


	computed: {
		noSubmissions() {
			return this.type == 'Submissions' && this.submissions.length == 0;
		},

		noComments() {
			return this.type == 'Comments' && this.comments.length == 0;
		},

		noCategories() {
			return this.type == 'Categories' && this.categories.length == 0;
		},

		noUsers() {
			return this.type == 'Users' && this.users.length == 0;
		},

		placeholder() {
		    if (this.type == 'Categories') {
		        return '按"#频道"或"描述"搜索...';
			}

			if (this.type == 'Users') {
		        return '按"@用户名"搜索...';
			}

            if (this.type == 'Submissions') {
                return '按文章标题搜索...';
            }

            if (this.type == 'Comments') {
                return '按回复内容搜索...';
            }

            return '搜索...';
		}
	},

	methods: {
		/**
    	 * Gets the data with ajax call and put it in the correct array
    	 */
		search: _.debounce(function () {
			if(!this.filter.trim()) return

			this.loading = true;

			axios.get('/search', {
				params: {
	                type: this.type,
	                searched: this.filter,
				}
            }).then((response) => {
            	if( this.type == 'Categories' ) {
            		this.categories = response.data;
            	}

            	if( this.type == 'Users' ) {
            		this.users = response.data;
            	}

            	if( this.type == 'Comments' ) {
            		this.comments = response.data;
            	}

            	if( this.type == 'Submissions' ) {
            		this.submissions = response.data;
            	}

            	this.loading = false;
            }).catch((error) => {
            	this.loading = false;
            });
		}, 600),

		/**
    	 * Changes the type of the search
    	 * @return void
    	 */
    	changeType: function (type) {
    		if(this.type == type) return

			this.type = type
			this.search()
		},

    	/**
    	 * Fires the 'close' event which causes all the modals to be closed.
    	 *
    	 * @return void
    	 */
    	close () {
    		this.$eventHub.$emit('close')
    	}
	}
}
</script>
