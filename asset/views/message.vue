<template>
  <div>
    <mu-tabs :value="activeTab" @change="handleTabChange">
      <mu-tab value="tab1" title="我的问题"/>
      <mu-tab value="tab2" title="我的回答"/>
    </mu-tabs>
    <div v-if="activeTab === 'tab1'">
      <mu-list>
        <mu-list-item title="匿名用户" describeText="卖家具有动物繁殖许可证和经营许可证的情况下我买了他家的国家二级保护动物我需不需要也持有饲养许可证。买卖国家二级保护动物不是要买卖双方都持有相关证件的嘛">
          <mu-avatar icon="account_circle" slot="leftAvatar"/>
        </mu-list-item>
        <mu-divider inset/>
        <mu-list-item title="匿名用户" describeText="本人九八年进入一家企业工作至今，但至2007年该企业才给我买社保，现社保才购买10年，我今年五十九岁了，请问这种情况该怎么维权。谢谢">
          <mu-avatar icon="account_circle" slot="leftAvatar"/>

        </mu-list-item>
      </mu-list>
    </div>
    <div v-if="activeTab === 'tab2'">
      <mu-list>
        <mu-list-item title="匿名用户2" describeText="卖家具有动物繁殖许可证和经营许可证的情况下我买了他家的国家二级保护动物我需不需要也持有饲养许可证。买卖国家二级保护动物不是要买卖双方都持有相关证件的嘛">
          <mu-avatar icon="account_circle" slot="leftAvatar"/>
        </mu-list-item>
        <mu-divider inset/>
        <mu-list-item title="匿名用户" describeText="本人九八年进入一家企业工作至今，但至2007年该企业才给我买社保，现社保才购买10年，我今年五十九岁了，请问这种情况该怎么维权。谢谢">
          <mu-avatar icon="account_circle" slot="leftAvatar"/>

        </mu-list-item>
      </mu-list>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        activeTab: 'tab1'
      }
    },
    methods: {
      handleTabChange (val) {
        this.activeTab = val
      }
    }
  }
</script>
