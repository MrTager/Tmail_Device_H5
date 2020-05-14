<template>
  <div class="actionDialog">
    <action-dialog height="208" :show.sync="show" :maskClose="false" @confirm="onConfirm" @cancel="onCancel" @closed="onClosed" title="窗帘设置">
    <push-bar 
      v-for="(val, key) in list" v-bind:key="key"
      :data="val" :type="val.type"
      v-on:handClick="handClick"
      :check="val.check"
    >
    </push-bar>
    </action-dialog>
  </div>
</template>
 
<script>
import Vue from "vue";
import { mapState } from 'vuex';
import { ActionDialog, SelectList,PushBar } from "genie-ui";
 
export default {
  components: {
    ActionDialog,
    SelectList,
    PushBar
  },
  props:["modelFlag","isMode"],
  watch:{
      modelFlag:{
        handler(newVal, oldVal) {
        //  console.log("执行了")
		    this.show = newVal;
        }
      },
      
      isMode:{
        handler(newVal, oldVal) {
        //  console.log("1",newVal,oldVal)
          if(newVal){
        //  console.log("执行了isMode")
          this.newMode = newVal;
          this.setClick()
          }
        },
        immediate: true
      }
  }
  ,
  data () {
    return {
        show:false,
        list: [{
            check: false,
            text: '正常模式',
            type: 'radio',
            activeColor: '#0081fd',
            hint: '',
            index:353,
            clickBack: (val) => {
                if(val.check===false){
                    this.list[1].check = false
                    this.list[2].check = false
                    val.check = !val.check
                    this.setDevInfo({mode:353});
                    this.$emit('setIsMode',val.index)
                }else{
                    this.setDevInfo({mode:353});
                    this.$emit('setIsMode',val.index)
                }
            
            }
        },{
            check: false,
            text: '反转模式',
            type: 'radio',
            activeColor: '#0081fd',
            hint: '',
            index:351,
            clickBack: (val) => {
                if(val.check===false){
                    this.list[0].check = false
                    this.list[2].check = false
                    val.check = !val.check
                    this.setDevInfo({mode:351});
                    this.$emit('setIsMode',val.index)
                }else{
                    this.setDevInfo({mode:351});
                    this.$emit('setIsMode',val.index)
                }
            
            }
        },{
            check: false,
            text: '校准模式',
            type: 'radio',
            activeColor: '#0081fd',
            hint: '',
            index:352,
            clickBack: (val) => {
            if(val.check===false){
                    this.list[0].check = false
                    this.list[1].check = false
                    val.check = !val.check
                    this.setDevInfo({mode:352});
                    this.$emit('setIsMode',val.index)
                }else{
                    this.setDevInfo({mode:352});
                    this.$emit('setIsMode',val.index)
                }
            }
        }],
        newMode:0,

    }
  },
 
  methods: {
    onShow () {
      this.show = !this.show
    },
    onConfirm () {

    },
    onCancel () {

    },
    onClosed () {
      this.$emit('closeModel',false)
    },
     // 点击
    handClick(val) {
      //console.log(val, '点击返回数据')
    },
     //设置设备属性
    setDevInfo(info){
      console.log("执行了下发")
      this.$store.dispatch('setDeviceStatus',
        info
      )
    }, 
    setClick(){
      for(let i=0;i<this.list.length;i++){
          if(this.list[i].index === this.newMode){
              this.list[i].check = true
              
          }else{
              this.list[i].check = false
          }
      }
    }
  },
 
   computed: {
    ...mapState({
      deviceStatus(state) {
        const ismode = state.publicInfo.attr.mode
        //   for(let i=0;i<this.list.length;i++){
        //   if(this.list[i].index === isMode.index){
        //     console.log("对比",this.list[i])
        //     this.list[i].check = true
        //   }
        // }
        return ismode
      },
      
    })

  },
  created(){
   
    

  },
  mounted(){

  }
};
</script>
<style lang="less" scoped>
.clear{
width: 100%;
height: 0.5px;
background-color: #f1f1f5;
}
.item{
    width: 100%;
    height: 52px;
    background-color: white;
    position: relative;
    .modalName{
        font-size: 16px;
        color: #2b3b52;
        width: 64px;
        text-align: left;
        background-color: turquoise;
        height: 16px;
        position: absolute;
        left: 15px;
        top: calc(50% - 8px);
    }
}


</style>