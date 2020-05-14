<template>
  <div class="main">
    <!-- 设备信息 -->
    <div class="deviceInfo">
      <img v-if="powerstate==false" src="https://img.alicdn.com/imgextra/i1/2504088756/O1CN01xCTYvl2EYIWThQBlS_!!2504088756.png" alt="">
      <img v-if="powerstate==true" src="https://img.alicdn.com/imgextra/i1/2504088756/O1CN01Bd3o4S2EYIWThQK7o_!!2504088756.png" alt="">
      <!-- <h5 class="title">{{productInfo.title}}</h5> -->
      <span class="timingValue" v-if="timeDataFlag == true">
        <icon class="timingValueIcon" icon="icon-timing" :iconSize="15" iconColor="#FEFEFE"></icon>
        <span class="timingValueTxt">{{remainTime}}分钟后{{timingStatue}}</span>
        </span>
    </div>
    <!-- 这里是tab切换栏 -->
    <div class="itemTab">
    <tab class="tab"   :nav-list="navList" :navWidth="navWidth" navColor="#0082FF" >
    <div  slot-scope="{activeIndex}" >
        <div class="OnOff"  v-if="activeIndex==0"  :class="{changeColor:powerstate==true,closeBtnColor:powerstate==false}"  @click="btnClick" >
           <div class="txt">
           <icon class="iconL" icon="icon-switch" :iconSize="24" v-bind:iconColor="range4.iconStyle.color"></icon>
           <span class="stuTxt">{{range4.label}}</span>
           </div>
        </div>
        <div class="timingSet" v-if="activeIndex==0" @click="timing" :class="{changeColor:timeDataFlag==true,closeBtnColor:timeDataFlag==false}">
           <div class="tTxt">
           <icon class="iconT" icon="icon-dingshiicon" :iconSize="20" v-bind:iconColor="range4.iconStyle.color"></icon>
           <span class="timeTxt">定时控制开关</span>
           </div>
        </div>
        
        <!-- <deviceSort class="devSort" v-if="activeIndex==0"></deviceSort>  -->
        <!-- <commandPanel v-if="activeIndex==1"></commandPanel> -->
      <div class="commandPanel" v-if="activeIndex==1">
      <div class="titleName">
          <div class="titleNameT">目前支持的口令(示意)</div>
          </div>
      <div class="isBody">
          <ol>
              <li v-for="(testData,i) in testDatas" :key="i">
                  <hr v-if="i>0">
                  <div class="itemTitle"><div>{{testData.title}}</div></div>
                  <ol>
                      <li class="itemTxt" v-for="(item,j) in testData.data" :key="j" >
                            <div class="itemColorTxt" :style="'width:'+(item.length*itemFontSize+60)+'px;'">
                              <div class="txtItem">{{item}}</div>
                            </div>
                      </li>
                  </ol>
              </li>
          </ol>
      </div>
    </div>   
    </div>
    </tab>
    </div>
    

    <!-- 设备状态 -->
    <!-- <push-bar
      v-for="(val, key) in deviceStatus" v-bind:key="key"
      :data="val" :type="val.type"
      :check="val.check"
    >
    </push-bar> -->
  </div>
</template>

<script type="text/ecmascript-6">
import { mapState } from 'vuex';
import { PushBar, Tab, TabItem,Icon } from 'genie-ui';

export default {
  name: 'Main',
  components: {
    PushBar,
    Tab,
    TabItem,
    Icon,
  },
  data() {
    return {
        navList: [ { label: '控制' }, { label: '口令' } ],
        navWidth:180,
        range4:{ value: 0, label: '开关', iconStyle: { color: '#1c8bfe' },backgroundColor:"#F2F9FF" },
        iconSize:24,
        testDatas:[
              {title:'开关',data:['关闭开关','打开开关','开关开了吗','开关了吗']},
              {title:'定时控制开关',data:['今天晚上九点关闭开关','明天上午八点关闭开关','明天二十点关闭开关','五分钟后关闭开关','一小时五分钟后关闭开关','五分钟后打开开关','今天晚上六点打开开关','明天晚上八点打开开关','明天二十点打开开关','十分钟后打开开关','一小时十分钟后打开开关']}
          ],
          //色块内文字的大小，用于色块长度计算
        itemFontSize:16,
        //是否有定时数据
        timeDataFlag:false,
        //倒计时显示条
        remainTime:0,
        timingStatue:"",
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
        return [
        //   {
        //   text: '设备状态',
        //   descColor: '#4a4a4a',
        //   desc: onlinestate
        // }, 
        {
          check: powerstate,
          text: '开关状态',
          type: 'switch',
          clickBack: (val) => {
            this.$store.dispatch('setDeviceStatus', {
              powerstate: val.check ? 0 : 1
            });
          }
        }]
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
    //初始化设置值
    
    //轮询定时
    setInterval(()=>{
       this.updateTimeCloud();
    },3000)
   

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
    //按钮切换
    btnClick(){
       if(this.powerstate){
           this.$store.dispatch('setDeviceStatus', {
           powerstate: 0
           });    
      }else{
          this.$store.dispatch('setDeviceStatus', {
           powerstate: 1
           }); 
      }
    },
    //定时按钮
    timing(){
       AI.goTiming()
    },
    updateTimeCloud(){
      AI.getRecentStatusByTimers().then((resp) => {
      console.log("定时数据",resp);  // 返回定时数据信息
      this.timeDataFlag = true;
      // resp.model.remainTime
      this.remainTime=resp.model.remainTime
      if(resp.model.startAttr.powerstate=="on"){
        this.timingStatue = "开启"
      }else{
        this.timingStatue = "关闭"
      }
      //resp.model.startAttr.powerstate
      }).catch((res) => {
        this.timeDataFlag = false;
        if (res.msgInfo === '查找不到定时数据') {
          return console.log('查找不到定时数据')
        }
        console.log('失败返回', res);
      });
    }
  },
  updated(){

     
    //console.log(this.powerstate);
    //console.log(this.onlinestate)
     
    this.updateTimeCloud();

  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.deviceInfo {
  // display: flex;
  position: relative;
  height: 330px;
  margin-bottom: 10px;
  background-color: #fff;
  // flex-direction: column;
  // align-items: center;
  // justify-content: center;
  img {
    position: absolute;
    height: 100%;
    width: 100%;
  }
  .title {
    color: #4a4a4a;
    font-weight: bold;
    padding-top: 5px;
  }
  
  
}
</style>
<style scoped>
    .main{
      background-color: #FFFFFF
    }
/* tab样式 */
   /* .switch{
    margin-left: auto;
    margin-right: auto;
    margin-top: 20px;
    border-radius: 5px; 
    }  */
    .devSort{
    margin-top: 30px;
    }
    .itemTab{
      height: 37px;
      width: 100%;
      background-color: #FFFFFF;
      border-bottom: 1px solid #EBEBEB;
    }
    /* .tab{
     margin-top: 10px;
    } */
     .changeColor{
    background-color: #F2F9FF;
    border:  1px solid #1c8bfe;
  }
  .closeBtnColor{
    background-color:  #FFFFFF;
    border:1px solid #EBEBEB;
  }
  /**按钮样式 */
  .OnOff{
    width: 170px;
    height: 80px;
    margin-top: 20px;
    border-radius: 5px; 
    margin-left: 10px;
    float: left;
  }
  .txt{
    width: 50px;
    height: 80px;
    margin-left: auto;
    margin-right: auto;
    
    position:relative;
  }
  .iconL{
    position: absolute;
    top: 19.5px;
    left: 13px;  
  }
  .stuTxt{
    position: absolute;
    top: 53.5px;
    left: 11px;
    font-size: 13px;
    color: #4A5A78;
  }
  /* 语料*/
  .commandPanel{
    height: 400px;
}
.titleName{
    height: 76px;
    font-size:16px; 
    font-weight: 600;
}
.titleNameT{
    line-height: 75px;
    margin-left: 20px;
}
.isBody{
    height: 300px;
    width: 100%;
}
.itemTxt{
    height: 68px;
    position: relative;
}
.itemColorTxt{
    left: 20px;
    height: 40px;
    border-radius: 19px 19px 19px 2px;
    background: linear-gradient(60deg, #0082FF, #00b7FF);
    text-align: center;  
    position: absolute;
    top: 15px;
    
    
}
.txtItem{
    color: white;
    font-size: 16px;
    line-height: 40px;
    font-weight: 500;
}
.itemTitle{
    height: 36px;
}
.itemTitle div{
    font-size: 16px;
    font-weight: 600;
    margin-left: 20px;
    line-height: 36px;
     
}
hr{
    margin: 0;
    padding: 0;
    color:#DEE1EA;
    size: 2px;
}
/**定时开关样式 */
.timingSet{
    width: 170px;
    height: 80px;
    margin-top: 20px;
    border-radius: 5px; 
    margin-right: 10px;
    float: right;
}
.tTxt{
  position: relative;
  height: 80px;
  width: 170px;
}
.iconT{
  position: absolute;
  top: 19.5px;
  left: 75px;
}
.timeTxt{
  position: absolute;
  top: 53.5px;
  left: 45px;
  font-size: 13px;
  color: #4A5A78;
}
.timingValue{
  position: absolute;
  width: 80%;
  height: 20px;
  text-align: center;
  left: 10%;
  top: 91%;
}
.timingValueIcon{
 position: relative;
 top: 2px;
  
}
.timingValueTxt{
  color: #FEFEFE;
  font-weight: 100; 
}
 
</style>
