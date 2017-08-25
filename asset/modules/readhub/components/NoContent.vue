<template>
	<transition name="fade">
		<div class="no-content-wrapper user-select" v-show="visible">

			<svg class="icon-inwehub v-icon" aria-hidden="true">
				<use xlink:href="#icon-zanwushuju"></use>
			</svg>
	        <h1>{{ text }}</h1>
		</div>
	</transition>
</template>

<script>
    export default {
		props: ['text'],

		data () {
			return {
				visible: true
			}
		}
    }
</script>
