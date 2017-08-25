<template>
	<transition name="fade">
		<div class="submission-wrapper" v-show="!hidden">
			<article class="flex1" v-bind:class="'box-typical profile-post ' + list.type">
				<!-- header -->
				<div class="submission-header user-select webviewTool">
					<div class="submission-header-container ">

						<div class="flex-space">

							<div class="h5-active-item commentBtn">
								<a  href="javascript:void(0)" class="comments-icon">

									<svg class="icon-inwehub v-icon icon-pinglun1" aria-hidden="true">
										<use xlink:href="#icon-xiugai"></use>
									</svg>

									评论
								</a>
							</div>

							<div class="h5-active-item">
								<a  href="javascript:void(0)" class="comments-icon h-green">

									<svg class="icon-inwehub v-icon icon-pinglun1" aria-hidden="true">
										<use xlink:href="#icon-pinglun1"></use>
									</svg>

									<span class="commentNum" v-if="comments" v-text="comments"></span>
								</a>
							</div>

							<div class="h5-active-item bookmarkButton">

								<a class="fa-stack" @click="bookmark"
								   data-toggle="tooltip" data-placement="top" title="Bookmark">


									<svg class="icon-inwehub v-icon" :class="bookmarked ? 'go-yellow v-unbookmark' : 'v-bookmark'" aria-hidden="true">
										<use xlink:href="#icon-shoucangxingxing"></use>
									</svg>

								</a>
							</div>

                            <div class="h5-active-item dianzanBtn">
                                <a class=" align-right" @click="voteUp"
                                   data-toggle="tooltip" data-placement="top" title="Upvote">
                                    <svg class="icon-inwehub v-icon" :class="upvoted ? 'go-primary' : 'go-gray'" aria-hidden="true">
                                        <use xlink:href="#icon-dianzan1"></use>
                                    </svg>
                                </a>

                                <div class="detail" :class="upvoted ? 'go-primary' : 'go-gray'">{{ points }}</div>

								<!--<a class=" align-right" @click="voteDown"-->
								   <!--data-toggle="tooltip" data-placement="top" title="Downvote">-->

									<!--<svg class="icon-inwehub v-icon rotate-180" :class="downvoted ? 'go-red' : 'go-gray'" aria-hidden="true">-->
										<!--<use xlink:href="#icon-dianzan1"></use>-->
									<!--</svg>-->
								<!--</a>-->

                            </div>

							<!--<div class="h5-active-item">-->


                                <!--<div class="detail">-->
                                    <!--{{ points }}-->
								<!--</div>-->
							<!--</div>-->


						</div>
					</div>
				</div>
			</article>
		</div>
	</transition>
</template>

<script>
    import TextSubmission from '../components/submission/TextSubmission.vue';
    import LinkSubmission from '../components/submission/LinkSubmission.vue';
    import ImgSubmission from '../components/submission/ImgSubmission.vue';
    import GifSubmission from '../components/submission/GifSubmission.vue';
	import PhotoViewer from '../components/PhotoViewer.vue';
	import EmbedViewer from '../components/Embed.vue';
	import GifPlayer from '../components/GifPlayer.vue';
	import Helpers from '../mixins/Helpers';

    export default {
        props: ['list', 'full'],

        mixins: [Helpers],

        components: {
            TextSubmission,
            LinkSubmission,
            ImgSubmission,
			GifSubmission,
			PhotoViewer,
			EmbedViewer,
			GifPlayer,
        },

        data () {
            return {
                bookmarked: false,
                upvoted: false,
                downvoted: false,
                hidden: false,
                reported: false,
				photoViewerIndex: null,
				photoViewer: false,
				embedViewer: false,
				gifPlayer: false,
                auth,
                Store
            }
        },

        created () {
        	this.setBookmarked();
        	this.setVoteds();
			this.$eventHub.$on('photo-viewer', this.showPhotoViewer);
			this.$eventHub.$on('scape', this.closeViwer);
        },

        watch: {
            // call again the method if the route changes
            '$route' () {
                this.setBookmarked();
                this.setVoteds();
            },

            'Store.submissionUpVotes' () {
                this.setVoteds();
            },

            'Store.submissionDownVotes' () {
                this.setVoteds();
            },

            'Store.submissionBookmarks' () {
                this.setBookmarked();
            },
        },

		mounted () {
			this.$nextTick(function () {
	        	this.$root.loadSemanticTooltip()
	        	this.$root.loadSemanticDropdown()
			})
		},


        computed: {
			points(){
				let total = this.list.upvotes - this.list.downvotes

				if (total < 0 ) return 0

				return total
			},

			/**
        	 * Does the auth user own the submission
        	 *
        	 * @return Boolean
        	 */
        	owns() {
        		return auth.id == this.list.owner.id
        	},

			showApprove(){
				return !this.list.approved_at && Store.moderatingAt.indexOf(this.list.category_id) != -1 && !this.owns
			},

			showDisapprove(){
				return !this.list.deleted_at && Store.moderatingAt.indexOf(this.list.category_id) != -1 && !this.owns
			},

			showNSFW(){
				return (this.owns || Store.moderatingAt.indexOf(this.list.category_id) != -1) && !this.list.nsfw
			},

			showSFW(){
				return (this.owns || Store.moderatingAt.indexOf(this.list.category_id) != -1) && this.list.nsfw
			},

			showRemoveTumbnail(){
				if (this.owns && this.list.data.thumbnail)
					return true
				return false
			},

            /**
             * Whether or not user wants to see NSFW content's image
             *
             * (Hint: The base idea is that we don't display NSFW content)
             * If the user wants to see NSFW media then return false, like it's not NSFW at all
             * Otherwise return true which means the media must not be displayed.
             * (false: the media will be displayed)
             *
             * @return boolean
             */
            nsfw() {
				return this.list.nsfw && !auth.nsfwMedia
            },

			/**
			 * The current vote type. It's being used to optimize the voing request on the server-side.
			 *
			 * @return mixed
			 */
			currentVote () {
			    if (this.upvoted)
                    return "upvote";

				if (this.downvoted)
					return "downvote";

				return null;
			},

            date () {
                return moment(this.list.created_at).fromNow();
            },
			url () {
				return  '/c/' + encodeURIComponent(this.list.category_name) + '/' + this.list.slug;
			},
			comments(){
			    return this.list.comments_number;
			}
        },

        methods: {
        	/**
        	 * Fires the "submission-edit" event that gets picked up by the TextSubmission.vue component.
        	 *
        	 * @return void
        	 */
        	edit() {
        	    this.$eventHub.$emit('edit-submission');
        	},

        	/**
        	 * Removes the thumbnail
        	 *
        	 * @return
        	 */
			removeThumbnail() {
				this.list.data.thumbnail = null;
				this.list.data.img = null;

				axios.post('/remove-thumbnail', {
				    id: this.list.id
				});
			},

			/**
			 * marks the submission as NSFW (not safe for work)
			 *
			 * @return void
			 */
			markAsNSFW() {
			     axios.post('/mark-submission-nsfw', {
			         id: this.list.id
			     }).then((response) => {
			         this.list.nsfw = true;
			     })
			},

			/**
			 * marks the submission as NSFW (not safe for work)
			 *
			 * @return void
			 */
			markAsSFW() {
				axios.post('/mark-submission-sfw', {
					id: this.list.id
				}).then((response) => {
					this.list.nsfw = false;
				})
			},

        	/**
             * whether or not the user has voted on submission
             *
             * @return void
             */
            setVoteds () {
            	if (Store.submissionUpVotes.indexOf(this.list.id) != -1) {
            		this.upvoted = true;
            		this.downvoted = false;
            		return;
            	}

            	if (Store.submissionDownVotes.indexOf(this.list.id) != -1) {
            		this.downvoted = true;
            		this.upvoted = false;
            		return;
            	}

                this.downvoted = false;
                this.upvoted = false;
            },

        	/**
             * Whether or not user has bookmarked the submission
             *
             * @return void
             */
            setBookmarked () {
                if (Store.submissionBookmarks.indexOf(this.list.id) != -1) {
                    this.bookmarked = true;
				} else {
                    this.bookmarked = false;
                }
			},

        	/**
             * Toggles the submission into bookmarks
			 *
			 * @return void
             */
        	bookmark (submission) {
        		if (this.isGuest) {
            		this.mustBeLogin();
            		return;
            	}

        		this.bookmarked = !this.bookmarked

				axios.post('/bookmark-submission', {
					id: this.list.id,
                    need_refresh:1
				}).then((response) => {
					if (Store.submissionBookmarks.indexOf(this.list.id) != -1) {
	                	var index = Store.submissionBookmarks.indexOf(this.list.id);
	                	Store.submissionBookmarks.splice(index, 1);
                        this.showAppToast('取消收藏');
	                	return;
	                }
                    this.showAppToast('收藏成功');
					Store.submissionBookmarks.push(this.list.id);
				})
        	},

            /**
             *  hide(block) submission
             *
             *  @return void
             */
            hide () {
                this.hidden = true
                axios.post('/hide-submission', { submission_id: this.list.id })
            },

            /**
             * Deletes the submission. Only the owner is allowed to make such decision.
             *
             * @return void
             */
            destroy () {
                axios.post('/destroy-submission', { id: this.list.id })
                if (this.full) {
                    this.$router.push('/')
                } else {
                	this.hidden = true
                }
            },

			/**
             * Approves the submission. Only the moderators of category are allowed to do this.
             *
             * @return void
             */
			approve(){
				axios.post('/approve-submission', {
				    submission_id: this.list.id
				}).then((response) => {
				    this.list.approved_at = moment().utc().format('YYYY-MM-DD HH:mm:ss')
				})
			},

			/**
             * Disapproves the submission. Only the moderators of category are allowed to do this.
             *
             * @return void
             */
			disapprove(){
				axios.post('/disapprove-submission', {
				    submission_id: this.list.id
				}).then((response) => {
					if (this.full) {
	                    this.$router.push('/')
	                } else {
	                	this.hidden = true
	                }
				})
			},

            /**
            *  Report submission
            *
            *  @return void
            */
            report () {
                this.reported = true
        		this.$eventHub.$emit('report-submission', this.list.id, this.list.category_name)
            },
			/**
			 * 推荐到app
			 */
            recommend () {
                axios.post('/recommend-app-submission', {
                    submission_id: this.list.id
                })
			},

            /**
             *  Upvote submission
             *
             *  @return void
             */
            voteUp () {
            	if (this.isGuest) {
            		this.mustBeLogin();
            		return;
            	}

				let id = this.list.id

				axios.post('/upvote-submission', {
					submission_id: id,
					previous_vote: this.currentVote,
                    need_refresh:1
				})

            	// Have up-voted
            	if (this.upvoted) {
            		this.upvoted = false
            		this.list.upvotes --

            		var index = Store.submissionUpVotes.indexOf(id);
                	Store.submissionUpVotes.splice(index, 1);

            		return
            	}

				// Have down-voted
            	if (this.downvoted) {
            		this.downvoted = false
            		this.list.downvotes --

            		var index = Store.submissionDownVotes.indexOf(id);
                	Store.submissionDownVotes.splice(index, 1);
            	}

            	// Not voted
            	this.upvoted = true
            	this.list.upvotes ++
            	Store.submissionUpVotes.push(id)
            },


            /**
             *  Downvote submission
             *
             *  @return void
             */
            voteDown () {
            	if (this.isGuest) {
            		this.mustBeLogin();
            		return;
            	}

				let id = this.list.id

				axios.post('/downvote-submission', {
					submission_id: id,
					previous_vote: this.currentVote,
                    need_refresh:1
				})

            	// Have down-voted
            	if (this.downvoted) {
            		this.downvoted = false
            		this.list.downvotes --

            		var index = Store.submissionDownVotes.indexOf(id);
                	Store.submissionDownVotes.splice(index, 1);

            		return
            	}

				// Have up-voted
            	if (this.upvoted) {
            		this.upvoted = false
            		this.list.upvotes --

            		var index = Store.submissionUpVotes.indexOf(id);
                	Store.submissionUpVotes.splice(index, 1);
            	}

            	// Not voted
            	this.downvoted = true
            	this.list.downvotes ++
            	Store.submissionDownVotes.push(id)
            },

			showPhotoViewer(index = null){
				if (index !== null) {
					this.photoViewerIndex = index
				}
	            this.photoViewer = true
	        },

			showGifPlayer() {
				console.log('works')
			},

			showEmbed(){
				this.embedViewer = true
			},

			showGifPlayer(){
				this.gifPlayer = true
			},

			closeViwer(){
				this.photoViewer = false
			},

			closeEmbed(){
				this.embedViewer = false
			},

			closeGifPlayer(){
				this.gifPlayer = false
			}
        }
    }
</script>
