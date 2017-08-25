<template>
    <section>
        <h1 class="dotted-title">
			<span>
				禁止域名
			</span>
		</h1>

        <p>
            如果你认为该域名不适合你的频道，你可以在这里禁止它们。
        </p>

        <div class="form-group">
            <label for="domain" class="form-label">域名:</label>
            <input type="url" class="form-control" placeholder="http://example.com" name="domain" v-model="domain" id="domain">
        </div>

        <div class="form-group">
            <label for="description" class="form-label">理由(可选):</label>

            <textarea class="form-control" rows="3" v-model="description" id="description" placeholder="该域名被禁止的原因? (支持markdown语法)"></textarea>
        </div>

        <div class="form-group">
            <button type="button" class="v-button v-button--red" :disabled="!domain" @click="blockDomain">禁止</button>
        </div>


        <h1 class="dotted-title" v-if="blockedDomains.length">
			<span>
				所有被禁止的域名
			</span>
		</h1>

        <blocked-domain v-for="blocked in blockedDomains" :list="blocked" :key="blocked.id"
        @unblock="unblock"></blocked-domain>
    </section>
</template>

<script>
    import BlockedDomain from '../components/BlockedDomain.vue'

    export default {
        components: { BlockedDomain },

        data: function () {
            return {
                loading: false,
                errors: [],
                domain: null,
                description: '',
                blockedDomains: []
            }
        },

        created () {
            this.getBlockedDomains()
        },

        mounted: function() {
            this.$nextTick(function() {
                this.$root.autoResize()
            })
        },

        methods: {
            blockDomain() {
                if(!this.domain) return

                this.loading = true
                this.blockErrors = [];

                axios.post( '/block-domain', {
                    domain: this.domain,
                    description: this.description,
                    category: this.$route.params.name
                } ).then((response) => {
                    this.domain = ''
                    this.description = ''
                    this.errors = []
                    this.blockedDomains.unshift(response.data)
                    this.loading = false
                }).catch((error) => {
                    this.errors = error.response.data
                    this.loading = false
                });
            },


            /**
             * Fetches the list of already blocked domains on this category.
             *
             * @return void
             */
             getBlockedDomains () {
                 axios.post('/blocked-domains', {
                     category: this.$route.params.name
                 }).then((response) => {
                     this.blockedDomains = response.data
                 })
            },

            /**
             * Unblock the domain (destroy the blockedDomain record).
             *
             * @return void
             */
            unblock(domain) {
                 axios.delete('/block-domain/destroy', {
                    params: {
                        domain: domain,
                        category: this.$route.params.name
                    }
                 }).then((response) => {
                    this.blockedDomains = this.blockedDomains.filter(function (item) {
                      	return item.domain != domain
                    })
                 })
            },
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
