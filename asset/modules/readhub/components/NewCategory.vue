<template>
    <section class="container margin-top-5 col-7 user-select" id="new-channel">
        <h1 class="align-center">
            创建属于你自己的频道
        </h1>

        <div class="v-status v-status--error" v-if="customError">
            {{ customError }}
        </div>

        <div class="form-group">
            <input type="text" class="form-control v-input-big" placeholder="名称..." id="name" v-model="name">

            <small class="text-muted" v-if="!name">
                频道名称必须是字母数字，没有空格。创建完后不可编辑！
                Examples: 游戏，新闻，阅读2
            </small>
            <small class="text-muted go-red" v-for="e in errors.name">{{ e }}</small>
        </div>

        <div class="form-group">
            <textarea name="description" rows="3" id="description" class="form-control v-input-big"
            v-model="description" placeholder="请简要描述你的频道..."></textarea>

            <small class="text-muted" v-if="!description">描述字段帮助用户找到通道。</small>
            <small class="text-muted go-red" v-for="e in errors.description">{{ e }}</small>
        </div>

        <div class="form-group">
            <button type="submit" class="v-button v-button--green btn-block" @click="submit" :disabled="!validates">创建</button>
        </div>
    </section>
</template>

<script>
export default {

    data: function () {
        return {
            name: '',
            description: '',
            nsfw: false,
            errors: [],
            customError: '',
            Store
        }
    },

	mounted: function () {
		this.$nextTick(function () {
			this.$root.autoResize()
		})
	},

	computed: {
		/**
		 * Validates the inputs
		 *
		 * @return Boolean
		 */
		validates () {
			return this.name && this.description
		},
	},


    methods: {
        submit () {
            axios.post( '/channel', {
                name: this.name,
                description: this.description,
                nsfw: this.nsfw
            } ).then((response) => {
                this.errors = []

                // let's add the categoriy_id to the user's moderatingAt and administratorAt
                Store.moderatingAt.push(response.data.id)
                Store.administratorAt.push(response.data.id)
                Store.moderatingCategories.push(response.data)
                Store.subscribedCategories.push(response.data)

                this.$router.push('/c/' + response.data.name + '/mod/settings?created=1')
            }).catch((error) => {
                if (error.response.status == 500) {
                    this.customError = error.response.data
                    this.errors = []
                    return
                }

                this.errors = error.response.data
            });
        },
    }
}
</script>
