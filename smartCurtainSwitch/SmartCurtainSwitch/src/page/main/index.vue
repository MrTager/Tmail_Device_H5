<template>
  <div class="main">
    <!-- 设备信息 -->
    <div class="deviceInfo">
      <img v-if="onlinestate === '离线'" :src="imgUrl.off">
      <img v-if="onlinestate === '在线'" :src="imgUrl.on">
      <a class="curtainPosition">窗帘位置:&nbsp;{{deviceStatus.curtainPosition}}%</a>
    </div>
    <!-- tab -->
    <div class="itemTab">
      <tab class="tab" v-model="tabIndex"  itemBgColor="default"  :nav-list="navList" :navHeight="navHeight" :navWidth="navWidth" navColor="#0082FF" >
        <div class="tabnav"  slot-scope="{activeIndex}" >
          <div class="ctrl" v-if="activeIndex==0" >
            <div class="tabBody">
              <div class="btnGroup" >
                <div class="tabBodyBtn1" v-for="(item,i) in btnGroupDate" :key="i" :class="['tabBtn'+i,{tabBodyBtn3:isClickBtn===i,tabBodyBtn2:isClickBtn!==i}]" @click="changeState(item.index,i)">
                  <img class="btnIcon" :src="item.imgurl">
                  <div class="btnName">{{item.name}}</div>
                </div>
              </div>
            </div>
            <div class="clear"></div>
            <div class="slider">
              <div class="sliderTxt">
                窗帘打开位置
              </div>
              <div class="sliderBody">
              <slider class="sliderBar" type="" v-model="deviceStatus.curtainPosition" @change="sliderOnChange" :min="0" :max="100" :step="step"></slider>
              </div>  
            </div>
            <div class="clear"></div>
            <div class="curtainSet" @click="showModel">
              <div class="setTxt">窗帘设置</div>
              <div class="stateTxt" >
                <div class="state">{{isMode.val}}</div>
                <div class="arrow"><icon icon="icon-right" :iconSize="iconsize" iconColor="#97a4be"></icon></div>
              </div>
            </div>
            <Model :modelFlag="modelFlag" :isMode="isMode.index" @setIsMode="setIsMode" @closeModel="closeModel"></Model>
          </div>
          <div class="commandPanel" v-if="activeIndex==1">
            <div class="titleName">
                <div class="titleNameT">目前支持的口令(示意)</div>
                </div>
            <div class="isBody">
                <ol>
                    <li v-for="(testData,i) in testDatas" :key="i">
                        <hr v-if="i>0">
                        <div class="itemTitle"><div>{{testData.functionName}}</div></div>
                        <ol>
                            <li class="itemTxt" v-for="(item,j) in testData.corpusList" :key="j" >
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
  </div>
</template>

<script type="text/ecmascript-6">
import { mapState } from 'vuex';
import { PushBar,Slider,Icon,Tab, TabItem} from 'genie-ui';
// import Slider  from '../../template/slider'
import Model from "../../template/model" 




export default {
  name: 'Main',
  components: {
    PushBar,Slider,Icon,Model,Tab, TabItem

  },
  data() {
    return {
        navList: [ { label: '控制' }, { label: '口令' } ],
        navWidth:180,
        navHeight:49,
        tabIndex:0,
        onOff:"online",
        imgUrl:{
          "off":'https://img.alicdn.com/imgextra/i3/2504088756/O1CN01CCvPJH2EYIXaikhaJ_!!2504088756.png',
          "on":'https://img.alicdn.com/imgextra/i1/2504088756/O1CN01kll4CD2EYIXd0CLsZ_!!2504088756.png',
        },
        step: 1,
        iconsize:13,
        testDatas:[
              {functionName:'开关',corpusList:['关闭开关','打开开关','开关开了吗','开关了吗']},
              {functionName:'定时控制开关',corpusList:['今天晚上九点关闭开关','明天上午八点关闭开关','明天二十点关闭开关','五分钟后关闭开关','一小时五分钟后关闭开关','五分钟后打开开关','今天晚上六点打开开关','明天晚上八点打开开关','明天二十点打开开关','十分钟后打开开关','一小时十分钟后打开开关']}
          ],
          //色块内文字的大小，用于色块长度计算
        itemFontSize:16,
        //按钮绑定文字urlindex
        btnGroupDate:[
          {name:"打开窗帘",index:1,imgurl:"https://img.alicdn.com/imgextra/i3/2504088756/O1CN01Wa54Vs2EYIXXcCRiZ_!!2504088756.png"},
          {name:"暂停窗帘",index:2,imgurl:"https://img.alicdn.com/imgextra/i4/2504088756/O1CN01KZTlij2EYIXc9y7Lj_!!2504088756.png"},
          {name:"关闭窗帘",index:0,imgurl:"https://img.alicdn.com/imgextra/i2/2504088756/O1CN01pejco52EYIXc9yr4u_!!2504088756.png"}
        ],
        //当前点击按钮，解决点击状态跳闪问题
        isClickBtn:0,
        modelFlag:false,
        modeList:[{index:8,val:"起床"},{index:14,val:"睡眠"},{index:351,val:"反转"},{index:352,val:"校准"},{index:353,val:"正常"},{index:395,val:"会客"},{index:396,val:"微光"}],
        isMode:{index:353,val:"正常"},
        
         
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
        // const onlinestate = attr.onlinestate === 'online' ? '在线' : '离线';
        // const powerstate = attr.powerstate === 1;
        //this.onOff = attr.onlinestate;
        //console.log(state.publicInfo.attr.mode)
        const modeNum = state.publicInfo.attr.mode;
        //console.log("上报mode",modeNum)
        // for(let key in this.modeList){
        //   let num = Number(key)
        //   if( modeNum === num){
        //     this.isMode.index = num;
        //     this.isMode.name = this.modeList[key];
            
        //   }
        // }
        return  attr
        



        //[

           



        // {
        //   text: '设备状态',
        //   descColor: '#4a4a4a',
        //   desc: onlinestate
        // },
        //  {
        //   check: powerstate,
        //   text: '开关状态',
        //   type: 'switch',
        //   clickBack: (val) => {
        //     this.$store.dispatch('setDeviceStatus', {
        //       powerstate: val.check ? 0 : 1
        //     });
        //   }
        // }
        //]
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
   // console.log('this.$route.query：', this.$route.query);
    this.$nextTick(() => {
      this.setNavbar(); // 设置topbar
      this.getDevInfo();//获取设备状态
    });
    // 返回语料信息
    AI.getProductFunctionCorpus().then((resp) => {
     // console.log("语料信息",resp);  
      this.testDatas = resp.model
    }).catch((res) => {
      console.log('失败返回', res);
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
     // console.log("设备信息",this.productInfo)
    //  console.log('state',this)
    },
    //获取设备状态
    getDevInfo(){
      AI.getDeviceActions().then((resp) => {
        console.log("设备完整属性",resp);  // 返回获取的设备状态
        switch(resp.model.attr.curtainConrtol){
          case 0:
            this.isClickBtn = 2
            break;
          case 1:
            this.isClickBtn = 0
            break;
          case 2:
            this.isClickBtn = 1
            break;
        }
        this.setModeState(resp.model.attr.mode)
      }).catch((res) => {
        console.log('获取设备状态失败返回', res);
      });
    },
    //设置设备属性
    setDevInfo(info){
      console.log("执行了下发")
      this.$store.dispatch('setDeviceStatus',
        info
      )
    },
    //滑块进度
    sliderOnChange(val) {
      this.setDevInfo({curtainPosition:val})
    },
    //模态框显示
    showModel(){
      this.modelFlag = true;
    },
    //关闭模态框
    closeModel(val){
      this.modelFlag = false;
    },
    setIsMode(n){
     // console.log("子组件传回的数据",n)
      this.setModeState(n)
    },
    changeState(index,i){
      this.setDevInfo({curtainConrtol:index})
      this.isClickBtn=i;
    },
    //设置模式状态
    setModeState(n){
      for(var i = 0;i < this.modeList.length;i++){
        if(n === this.modeList[i].index){
          let index1 =this.modeList[i].index;
          let val1 = this.modeList[i].val;
          let obj = {index:index1,val:val1}
          this.isMode = obj
         // console.log("找到",this.isMode)
        }
      }
    }
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
.itemTab{
  .tab{
    height: 49px;
    background-color: white;
    .tabnav{
      background-color: white;
      border-top: 0.5px solid rgb(115,190,230);
      margin-top: -1px;
      height: 100%;
    }
  }
  .tabBody{
    height: 108px;
    width: 100%;
    height: 100%;
    overflow: hidden;
    .btnGroup{
      width: 364.5px;
      height: 82px;
      margin-top: 14px;
      margin-bottom: 14px;
      margin-left: auto;
      margin-right: auto;
      position: relative;
      .tabBodyBtn1{
        position: absolute;
        width: 110px;
        height: 80px;
        border-radius: 5px;
        text-align: center;
      }
      .tabBtn0{
        left: 5.75px;
      }
      .tabBtn1{
        left: 127.25px;
      }
      .tabBtn2{
        left: 248.75px;
      }
      .tabBodyBtn2{
        border: 1px solid #ebebeb;
        background-color: #ffffff;
      }
      .tabBodyBtn3{
        border: 1px solid #0082ff;
        background-color: #f2f9ff;
      }
      .btnIcon{
        width: 20px;
        height: 20px;
        margin-top: 19px;
      }
      .btnName{
        font-size: 13px;
        width: 100%;
        text-align: center;
        margin-top: 13px;
        color: #4a5a78;
      }
    }
  }
  .clear{
    width: 100%;
    height: 10px;
    background-color: #f6f6f9;
  }
  .slider{
    width: 100%;
    height: 127px;
    background-color: #ffffff;
    position: relative;
    .sliderTxt{
      position: absolute;
      font-size: 16px;
      color: #2b3852;
      left: 13px;
      top: 13px;
    }
    .sliderBody{
      position: absolute;
      width: 100%;
      height: 85px;
      top: 42px;
    }
  }
  .curtainSet{
    background-color: #ffffff;
    width: 100%;
    height: 57px;
    position: relative;
    .setTxt{
      position: absolute;
      font-size: 16px;
      height: 16px;
      width: 70px;
      left: 13px;
      top: calc(50%-8px);
    }
    .stateTxt{
      position: absolute;
      height: 13px;
      width: 54px;
      right: 13px;
      top: calc(50%-6.5px);
    }
    .state{
      position: absolute;
      font-size: 13px;
      color: #97a4be;
      height: 100%;
      width: 30px;
      text-align: center;
      left: 0;
    }
    .arrow{
      position: absolute;
      height: 100%;
      width: 13px;
      right: 0px;
    }
  }
//语料
.commandPanel{
    height: 100%;
    overflow-x: auto;
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
    margin-bottom: -60px;
    ol{
      height: 100%;
      margin-bottom: 20px;
    }
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
    size: 0.5px;
}


}


</style>
