<template>
	<div class="col-7">
		<div class="tabs is-fullwidth">
			<ul>
				<router-link tag="li" active-class="is-active" :to="{name: 'bookmarked-submissions'}">
					<a>
						文章
					</a>
				</router-link>

				<router-link tag="li" active-class="is-active" :to="{name: 'bookmarked-comments'}">
					<a>
						回复
					</a>
				</router-link>

				<router-link v-if="false" tag="li" active-class="is-active" :to="{name: 'bookmarked-categories'}">
					<a>
						频道
					</a>
				</router-link>

				<router-link v-if="false" tag="li" active-class="is-active" :to="{name: 'bookmarked-users'}">
					<a>
						用户
					</a>
				</router-link>
			</ul>
		</div>

		<router-view></router-view>
	</div>
</template>