<template>
  <div class="mui-table-view detail-answer" >

    <UserInfo
      :uuid="answer.uuid"
      :avatar="answer.user_avatar_url?answer.user_avatar_url:''"
      :realname="answer.user_name ? answer.user_name : ''"
      :position="answer.title ? answer.title : ''"
      :company="answer.company ? answer.company : ''"
      :isFollow="true"
      :isFollowed="answer.is_followed?true:false"
      :isExpert="answer.is_expert ? answer.is_expert : 0"
    ></UserInfo>


    <div class="mui-table-view-cell">
      <div class="richText">
        <quill-editor ref="myTextEditorRead"
                      :options="editorOptionRead" @ready="onEditorReadyRead($event)">
        </quill-editor>
        <div class="time">{{answer.created_at ? answer.created_at.split(' ')[0].replace(/-/g, '/') : ''}}</div>
      </div>

       <Statistics></Statistics>
    </div>
  </div>
</template>

<script type="text/javascript">
  import UserInfo from './UserInfo.vue';
  import {quillEditor} from '../../components/vue-quill';
  import Statistics from './Statistics.vue';

  export default {
    data () {
      return {
        editorOptionRead: {
          placeholder: ' ',
          modules: {
            toolbar: []
          },
          readOnly: true
        },
        editorReadObj: {}
      }
    },
    components: {
      UserInfo,
      quillEditor,
      Statistics
    },
    props: {
      answer: {
        type: Object,
        default: {}
      }
    },
    created(){

    },
    watch: {
      'answer'(newVal, oldVal) {
        var content = newVal.content;
        if (content) {
          var objs = JSON.parse(content);
          this.editorReadObj.setContents(objs);
        }
      },
    },
    methods: {
      onEditorReadyRead(editor) {
        this.editorReadObj = editor;
      },
    }
  };
</script>

<style scoped="scoped">
  .detail-answer{
    margin-bottom:10px;
  }

  .detail-answer:before {
    display: none;
  }



  .detail-answer .time {
    font-size: 12px;
    color: #b4b4b6;
    float: right;
  }
  .detail-answer:after{
    display: none;
  }
</style>
