<template>
    <section>
        <h1 class="dotted-title">
			<span>
				禁止用户
			</span>
		</h1>

        <p>
            您可以在这里禁止用户向该频道提交文章和回复。
        </p>

        <div class="form-group">
            <multiselect :value="username" :options="users" @input="updateSelected"
            @search-change="getUsers" :placeholder="'按用户名查找...'" :loading="loading"
            ></multiselect>
        </div>

        <div class="form-group">
            <label for="description" class="form-label">理由(可选):</label>

            <textarea class="form-control" rows="3" v-model="description" id="description" placeholder="请描述该用户被禁止的理由? (支持markdown语法)"></textarea>
        </div>

        <div class="form-group">
            <label for="duration" class="form-label">禁止的天数(0表示永久禁止):</label>
            <input type="number" class="form-control" placeholder="禁止的天数(0表示永久禁止)..." min="0" max="999" name="duration" v-model="duration" id="duration">
        </div>

        <div class="form-group">
            <button type="button" class="v-button v-button--red" :disabled="!username" @click="banUser">禁止</button>
        </div>


        <h1 class="dotted-title" v-if="bannedUsers.length">
			<span>
				所有被禁止的用户
			</span>
		</h1>

        <banned-user v-for="banned in bannedUsers" :list="banned" :key="banned.id" @unban="unban"></banned-user>
    </section>
</template>

<script>
    import Multiselect from 'vue-multiselect'
    import BannedUser from '../components/BannedUser.vue'

    export default {
        components: {
            Multiselect,
            BannedUser
        },

        data: function () {
            return {
                loading: false,
                username: null,
                description: '',
                duration: 0,
                users: [],
                bannedUsers: [],
                Store
            }
        },

        created () {
            this.getBannedUsers()
        },

        mounted: function() {
            this.$nextTick(function() {
                this.$root.autoResize()
            })
        },

        methods: {
            updateSelected (newSelected) {
                this.username = newSelected
            },

            getUsers: _.debounce(function (query) {
                if (!query) return

                this.loading = true

                axios.get('/users', {
                	params: {
	                    username: query,
                    	category: this.$route.params.name
                	}
                } ).then((response) => {
                    this.users = response.data
                    this.loading = false
                })
            }, 600),

            banUser(){
                axios.post( '/ban-user', {
                    username: this.username,
                    description: this.description,
                    category: Store.category.name,
                    duration: this.duration
                } ).then((response) => {
                    // add the banned user to the this.bannedUsers array
                    this.username = ''
                    this.description = ''
                    this.duration = 0

                    this.bannedUsers.unshift(response.data)
                })
            },

            /**
             * Unbans the user (destroy the ban record).
             *
             * @return void
             */
            unban(user_id) {
                 axios.delete('/ban-user/destroy', {
                    params: {
                        user_id,
                        category: this.$route.params.name
                    }
                 }).then((response) => {
                    this.bannedUsers = this.bannedUsers.filter(function (item) {
                      	return item.user_id != user_id
                    })
                 })
            },

            /**
             * Fetches the list of already banned users on this category.
             *
             * @return void
             */
             getBannedUsers () {
                 axios.post('/banned-users', {
                     category: this.$route.params.name
                 }).then((response) => {
                     this.bannedUsers = response.data
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
