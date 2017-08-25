<template>
    <div class="v-modal-small user-select" :class="{ 'width-100': !sidebar }">
        <div class="v-modal-small-box" v-on-clickaway="close">
            <div class="flex1" v-if="! messageSent">
                <p>
                    请帮助我们更快的了解该文章存在的问题
                </p>

                <div class="form-group grouped fields">
                    <div class="field">
                        <div class="ui radio checkbox">
                            <input type="radio" value="It doesn't follow channel's exclusive rules" tabindex="0" class="hidden" v-model="subject">
                            <label>未遵守频道 #{{category}}的 规则</label>
                        </div>
                    </div>

                    <div class="field">
                        <div class="ui radio checkbox">
                            <input type="radio" value="It doesn't follow Voten's general rules" tabindex="0" class="hidden" v-model="subject">
                            <label>未遵守网站的规则</label>
                        </div>
                    </div>

                    <div class="field">
                        <div class="ui radio checkbox">
                            <input type="radio" value="It's abusive or harmful" tabindex="0" class="hidden" v-model="subject">
                            <label>包含暴力或色情内容</label>
                        </div>
                    </div>

                    <div class="field">
                        <div class="ui radio checkbox">
                            <input type="radio" value="Other" tabindex="0" class="hidden" v-model="subject">
                            <label>其它</label>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <textarea name="name" class="form-control" rows="2" id="report-textarea"
                        placeholder="(可选) 额外的描述..."
                        v-model="description"
                    ></textarea>
                </div>

                <button type="button" class="v-button v-button--green"
                @click="send" >
                    提交举报
                </button>

                <button type="button" class="v-button v-button--red"
                    data-toggle="tooltip" data-placement="bottom" title="Close (esc)"
                    @click="close">
                    取消
                </button>

            </div>

            <div class="padding-top-bottom-3 sent align-center" v-else>
                <i class="v-icon v-success" aria-hidden="true"
                    :class="{ 'rubberBand animated': messageSent }"
                ></i>

                <p>
                    感谢您的举报，我们会尽快安排核查。
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import { mixin as clickaway } from 'vue-clickaway';

export default {

    props: ['submission', 'category', 'sidebar'],

    mixins: [ clickaway ],

    data () {
        return {
            subject: "It doesn't follow channel's exclusive rules",
            description: "",
            messageSent: false,
        }
    },

	mounted: function () {
		this.$nextTick(function () {
			$('.ui.checkbox').checkbox()
	    	document.getElementById('report-textarea').focus()
			this.$root.autoResize()
		})
	},

    methods: {
        send: function(){
            this.messageSent = true;

            axios.post( '/report-submission', {
                submission_id: this.submission,
                subject: this.subject,
                description: this.description
            });

            setTimeout(function () { this.close() }.bind(this), 1500)
        },

        /**
        * Fire an event for changing the router to 'content'
        *
        * @return void
        */
        close () {
    		this.$eventHub.$emit('close')
        },
    },
}
</script>
