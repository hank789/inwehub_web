<template>
    <div class="mui-table-view answersWrapper beforeHidden afterHidden">

        <div class="item bottomBorder">
            <UserInfo
                    :uuid="11111"
                    :avatar="'/images/whiteLogo@2x.png'"
                    :realname="'test'"
                    :position="'phper'"
                    :company="'company'"
                    :isFollow="false"
                    :isFollowed="false"
                    :isExpert="1"
                    :isShowPositionAndCompany="true"
                    @setFollowStatus="setFollowStatus"
            ></UserInfo>

            <div class="content">
                发布会一上来，雷军就说小米终于回到全球出货量前五名了！排在三星、苹果、华为和OPPO后面，估计是因为小米6带来的强势反弹吧。雷军

            </div>

            <div class="time">
                2016/03/12 18:00

            </div>
        </div>

        <div class="item bottomBorder">
            <UserInfo
                    :uuid="11111"
                    :avatar="'/images/whiteLogo@2x.png'"
                    :realname="'test'"
                    :position="'phper'"
                    :company="'company'"
                    :isFollow="false"
                    :isFollowed="false"
                    :isExpert="1"
                    :isShowPositionAndCompany="true"
                    @setFollowStatus="setFollowStatus"
            ></UserInfo>

            <div class="content">
                发布会一上来，雷军就说小米终于回到全球出货量前五名了！排在三星、苹果、华为和OPPO后面，估计是因为小米6带来的强势反弹吧。雷军


            </div>

            <div class="time">
                2016/03/12 18:00
            </div>
        </div>


    </div>
</template>

<script type="text/javascript">
    import UserInfo from './UserInfo.vue';

    export default {
        data () {
            return {}
        },
        components: {
            UserInfo,
        },
        props: {
          list: {
            type: Array,
            default: []
          },
        },
        created(){
        },

        mounted(){
        },
        methods: {}
    };
</script>

<style lang="less" scoped>
    .answersWrapper {
        .content {
            padding: 0 15px;
        }

        .item{
            position: relative;
        }

        .time {
            padding: 0 15px 10px;
            font-size: 13px;
            color: #c8c8c8;
            text-align: right;
        }
    }
</style>
