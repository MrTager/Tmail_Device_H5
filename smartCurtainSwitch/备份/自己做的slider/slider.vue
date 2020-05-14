<template>
  <div class="slider">
    <div class="sliderTxt">
      窗帘打开位置
    </div>
    <div class="sliderBody">
      <div class="barBody">
        <div class="bar">
          <div class="circle" :style="{left:circleLeft+circleAddLeft+'px'}" @touchstart="touchstart($event)"></div>
        </div>
        <!-- -->
        <!-- @mousedown="mousedown($event)" @mousemove="mousemove($event)" @mouseup="mouseup($event)  "-->
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name:'slider',
    data () {
      return{
        "circleLeft":-12,
        "circleAddLeft":0,
      }
    },
    mounted(){

    },
    props:[],
    methods:{
      touchstart(event){
        var self = this;
        var event = event||window.event;
        var startx = event.touches[0].clientX;  //圆圈相对于窗口位置
        var starty = event.touches[0].clientY;
        var _target = event.target;
        var divX = event.touches[0].clientX - _target.offsetLeft; //鼠标实际距离屏幕左边长度
        var divY = event.touches[0].clientY - _target.offsetTop;
        // console.log("事件",startx)
        // console.log("event",event)
        // console.log("target",_target)
        //获取滑块父亲节点并且获取到父亲节点的width

        //判断是否是点在圆圈上
        //获取圆圈范围  圆圈clientx~clientx+target.width   clienty~clienty+target+width

        _target.addEventListener('touchmove', function (e) {
           let left = e.touches[0].clientX - divX; 
           let top = e.touches[0].clientY - divY; 
          //console.log("移动了",left,top)
          if(left <= 0){
             self.circleAddLeft = 0;
          }else if(left > 0 && left <= 300){
             self.circleAddLeft = left - self.circleLeft;
          }else{
             self.circleAddLeft = 300 
          }
         
          
          
          console.log("this.circleLeft",self.circleAddLeft)
       // console.log("触发事件：touchend");
       //限制移动范围
          
          
          
        });
        //触摸抬起
        _target.addEventListener('touchend',function(ev){
          _target.removeEventListener("touchmove",function(){
            _target.removeEventListener("touchend",function(){
              console.log("取消监听完毕")
            })
          })
          
        })

      },
      
    }
  }
</script>
<style lang="less" scoped>
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
    background-color: darkseagreen;
    top: 42px;
  }
  .barBody{
    position: absolute;
    width: 100%;
    height: 50px;
    background-color: blue;
    top: 15px;
  }
  .bar{
    position: absolute;
    width: 300px;
    height: 3px;
    background-color: #0082ff;
    left: calc(50% - 150px);
    top: 48%;
    border-radius: 1.5px;
  }
  .circle{
    position: absolute;
    width: 24px;
    height: 24px;
    background-color: darkolivegreen;
    border-radius: 12px;
    top: -12px;
  }
}
</style>>