<template>
  <div class="main">
     <!-- 设备信息 -->
    <div class="deviceInfo">
      <img v-if="doorStatus == 0" :src="imgUrl.off">
      <img v-if="doorStatus == 1" :src="imgUrl.on">
      <a class="curtainPosition">当前状态:&nbsp;{{doorStatus == 0 ? "关" : "开"}}</a>
    </div>

    <!-- 设备状态 -->
    <push-bar
      v-for="(val, key) in deviceStatus" v-bind:key="key"
      :data="val" :type="val.type"
      :check="val.check"
    >
    </push-bar>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapState } from 'vuex';
import { PushBar } from 'genie-ui';

export default {
  name: 'Main',
  components: {
    PushBar
  },
  data() {
    return {
      imgUrl:{
          "off":'https://img.alicdn.com/imgextra/i2/2504088756/O1CN01bRwGZo2EYIYMWdImI_!!2504088756.png',
          "on":'https://img.alicdn.com/imgextra/i4/2504088756/O1CN01G0ZqzZ2EYIYQOsMxc_!!2504088756.png',
        },
    };
  },
  computed: {
    ...mapState({
      // 产品信息详情
      productInfo: state => {
        return state.base.productInfo;
      },

      // 设备status
      deviceStatus(state) {
        const attr = state.publicInfo.attr;
        const onlinestate = attr.onlinestate === 'online' ? '在线' : '离线';
        const powerstate = attr.powerstate === 1;
        const power = attr.power + "%";
        return [{
          title: '设备信息',
          text: '设备状态',
          descColor: '#4a4a4a',
          desc: onlinestate
        }, {
          text: '电量',
          descColor: '#4a4a4a',
          desc: power
        }]
      },
      //门磁开关
      doorStatus: state => {
        return state.publicInfo.attr.doorStatus;
      },
      //电量
      power: state => {
        return state.publicInfo.attr.power;
      },
      // 在线状态
      onlinestate: state => {
        const onlinestate = state.publicInfo.attr.onlinestate;
        return onlinestate === 'online' ? '在线' : '离线';
      },

      // 开关状态
      powerstate: state => {
        const powerstate = state.publicInfo.attr.powerstate;
        return powerstate === 1;
      },
    }),
  },
  created() {
    console.log('this.$route.query：', this.$route.query);
    this.$nextTick(() => {
      this.setNavbar(); // 设置topbar
    });
  },
  beforeDestroy() {
    AI.allListenRemove(); // 页面兼听事件取消
  },
  methods: {
    // 设置topbar
    setNavbar() {
      AI.setNavbar({
        title: this.productInfo.title,
      })
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.main{
  height: 100%;
  width: 100%;
}
.deviceInfo {
  display: flex;
  height: 256px;
  background-color: #fff;
  margin-top: -10px;
  // flex-direction: column;
  // align-items: center;
  // justify-content: center;
  position: relative;
  img {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  .curtainPosition {
    position: absolute;
    color: #ffffff;
    width: 35%;
    left: 32.5%;
    top: 80%;
    margin-left: auto;
    margin-right: auto;
    font-size: 16px;
    text-align: center;
  }
}
</style>
