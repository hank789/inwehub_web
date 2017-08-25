<template>
    <div class="v-modal-small" :class="{ 'width-100': !sidebar }">
        <div class="v-modal-small-box" v-on-clickaway="close">
            <div class="flex1">
                <h2 class="align-center user-select">
                    Markdown规范
                </h2>

                <p class="user-select">
                    支持Markdown撰写内容：
                </p>

                <table class="table">
				  	<thead class="user-select">
					    <tr>
							<th>内容</th>
							<th class="half-width">显示</th>
					    </tr>
				  	</thead>

				  	<tbody>
			  			<tr>
					      	<td>
					      		**粗体**
					      	</td>

					      	<td>
					      		<b>粗体</b>
					      	</td>
					    </tr>

                        <tr>
					      	<td>
					      		__斜体__
					      	</td>

					      	<td>
					      		<i>斜体</i>
					      	</td>
					    </tr>

                        <tr>
					      	<td>
					      		[inwehub.com](https://www.inwehub.com)
					      	</td>

					      	<td>
					      		<a href="https://inwehub.com" target="_blank">inwehub.com</a>
					      	</td>
					    </tr>

                        <tr>
					      	<td>
                                -无序列表 <br>
                                -无序列表 <br>
                                -无序列表
					      	</td>

					      	<td>
					      		<ul class="no-margin">
					      		    <li>无序列表</li>
					      		    <li>无序列表</li>
					      		    <li>无序列表</li>
					      		</ul>
					      	</td>
					    </tr>

                        <tr>
					      	<td>
                                1.有序列表 <br>
                                2.有序列表 <br>
                                3.有序列表
					      	</td>

					      	<td>
					      		<ol class="no-margin">
					      		    <li>有序列表</li>
					      		    <li>有序列表</li>
					      		    <li>有序列表</li>
					      		</ol>
					      	</td>
					    </tr>

                        <tr>
					      	<td>
					      		`代码`
					      	</td>

					      	<td>
					      		<code>代码</code>
					      	</td>
					    </tr>

                        <tr v-if="false">
					      	<td>
					      	<br>
					      		```if (url == "inwehub") {<br>
						        	return "欢迎"<br>
						        }```
					      	</td>

					      	<td>
<pre>if (url == "inwehub") {
    return "欢迎"
}</pre>
					      	</td>
					    </tr>
				  	</tbody>
				</table>

                <button type="button" class="v-button v-button--green v-button--block"
                    data-toggle="tooltip" data-placement="bottom" title="Close (esc)"
                    @click="close">
                    关闭
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    import { mixin as clickaway } from 'vue-clickaway';

	export default {
		props: ['sidebar'],

        mixins: [ clickaway ],

	    methods: {
	    	close () {
	    		this.$eventHub.$emit('close')
	    	},
	    },
	}
</script>
