<template>
	<div>
		<div v-if="showBigThumbnail && submission.data.thumbnail" :class="showEmbed ? 'relative pointer' : ''" @click="embedOrOpen">
			<a href="javascript:;" @click="openNewUrl(submission)" target="_blank" rel="nofollow" v-if="submission.data.thumbnail">
	            <img v-bind:src="submission.data.thumbnail" v-bind:alt="submission.title" class="big-thumbnail" />
	        </a>

			<span class="play-gif" v-if="showEmbed">
                <i class="v-icon v-play"></i>
            </span>
		</div>

		<div class="link-list-info flex-space">
			<span class="submission-img-title">
				<a href="javascript:;" @click="openNewUrl(submission)" target="_blank" rel="nofollow" class="submisison-small-thumbnail" v-if="submission.data.thumbnail && !full">
					<div v-bind:style="thumbnail"
						v-if="submission.data.thumbnail && showSmallThumbnail" class="small-thumbnail"
						@click="embedOrOpen" :class="showEmbed ? 'pointer' : ''"
						>
					</div>
				</a>

				<h1 class="submission-title" v-if="full">
					<a href="javascript:;" @click="openNewUrl(submission)" target="_blank" rel="nofollow">
						<i class="v-icon v-shocked go-red" aria-hidden="true" v-if="submission.nsfw"
							data-toggle="tooltip" data-placement="bottom" title="NSFW"
						></i>

						{{ submission.title }}

						<small class="go-gray">
							 - {{ submission.data.domain }}
						</small>
					</a>
				</h1>

				<span v-else class="full-width">
					<h3 class="v-ultra-bold no-margin">
						<a href="javascript:;" @click="openNewUrl(submission)" target="_blank" rel="nofollow">
							{{ submission.title }}

							<small class="go-gray">
								 - {{ submission.data.domain }}
							</small>
						</a>
					</h3>
					<div class="mobile-only mobile-submission-item-action">
						{{ date }}
						<router-link v-if="false" :to="'/' + '@' + submission.owner.id" class="h-underline">
							{{ '@' + submission.owner.username }}
						</router-link>
						发布于 <label class="category-label">#{{ submission.category_name }}</label>
					</div>

					<submission-footer :url="url" :comments="comments" :bookmarked="bookmarked" :submission="submission"
					@bookmark="$emit('bookmark')" @report="$emit('report')" @recommend="$emit('recommend')" @hide="$emit('hide')" @nsfw="$emit('nsfw')" @sfw="$emit('sfw')" @destroy="$emit('destroy')" @approve="$emit('approve')" @disapprove="$emit('disapprove')" @removethumbnail="$emit('removethumbnail')" :upvoted="upvoted" :downvoted="downvoted" :points="points"
					@upvote="$emit('upvote')" @downvote="$emit('downvote')"
					></submission-footer>
				</span>
			</span>
		</div>
	</div>
</template>

<script>
	import EmbedValidator from '../../mixins/EmbedValidator';
	import SubmissionFooter from '../../components/SubmissionFooter.vue';
	import Webview from '../../mixins/Webview';

    export default {
		mixins: [EmbedValidator,Webview],

		components: {
			SubmissionFooter
		},

        props: [
        	'nsfw', 'submission', 'full', 'url', 'comments', 'bookmarked', 'points', 'downvoted', 'upvoted'
        ],

		data(){
			return {
				auth
			}
		},

		computed: {
			thumbnail() {
				return {
					backgroundImage: 'url(' + this.submission.data.thumbnail + ')'
				};
			},

			showBigThumbnail() {
				if (this.full) return true

				if (this.nsfw) return false

				return ! auth.submission_small_thumbnail
			},

			showSmallThumbnail() {
				return ! this.showBigThumbnail && !this.nsfw
			},

			showEmbed() {
				return this.isValidSourceForEmbed && this.submission.data.embed
			},
            date () {
                return moment(this.submission.created_at).fromNow()
            }
		},

		methods: {
			/**
			 * It emits the event to open the EmbedViewer if is allowed to. And other
			 * wise it opens the url in a new tab.
			 *
			 * @return void
			 */
			embedOrOpen(event){
				if (this.showEmbed) {
					// prevent the browser from opening the URL
					event.preventDefault()

					// Emit the embed event
					this.$emit('embed')
				}
			},
			openNewUrl(submission){

                var partUrl = '/c/' + encodeURIComponent(submission.category_name) + '/' + submission.slug;

			    var jumpToComment = () => {
                    this.$router.push(partUrl);
				};

				var isPlusReady = navigator.userAgent.match(/Html5Plus/i);
				if (isPlusReady) {
				   var webview = this.openWebviewUrl(submission.data.url,submission.title);



                    var url = window.location.protocol + '//' + window.location.host + partUrl + '/webview';

                    var embed =plus.webview.create(url, url, {
                        cachemode:'noCache',
                        popGesture: 'hide',
                        bottom:'0px',
                        height:'44px',
                        dock:'bottom',
                        position:'dock',
                        backButtonAutoControl: 'hide',
                        bounce:'none', //不允许滑动
                        scrollIndicator:'none', //不显示滚动条
                    });



					//创建评论链接
                    var view = new plus.nativeObj.View('test', {bottom:'0px',left:'0',height:'44px',width:'60%'});

                    view.draw([
                        {tag:'rect',id:'rect',rectStyles:{color:'rgba(0,0,0,0)'},position:{bottom:'0px',left:'0px',width:'100%',height:'44px'}},
                    ]);
                    view.addEventListener('click', () => {
						console.log('准备跳转');
                        jumpToComment();
                        webview.close();
                    }, false);

                    embed.append(view);
                    webview.append(embed);

                    webview.show();

				} else {
                    this.openWebviewUrl(submission.data.url,submission.title);
//                    var pathUrl = window.location.protocol + '//' + window.location.host + partUrl + '/webview';
//                    this.$router.push('/readhub/detail?url='+submission.data.url+'&pathUrl='+pathUrl);

                }
			}
		}
    }
</script>
