<template>
  <div class="slider">
    <slider v-model="val" @change="onChange" :show-points="false" bar-color="#0082FF">
      <div slot="left">开</div>
      <div slot="right">关</div>
    </slider>
 
    <slider type="" v-model="val2" @change="onChange" :min="0" :max="100" :step="step"></slider>
 
    <slider
      type="onDark"
      v-model="val3" @change="onChange" :min="40" :max="80" :step="step2" :show-stops="showstops2"
      :outer-stops="stops2" align="center"
    ></slider>
 
     
 
    <slider
      type="isLight"
      v-model="val4" @change="onChange" :min="40" :max="80" :step="step2" :show-stops="showstops2"
      :outer-stops="stops3" align="center"
    ></slider>
 
  </div>
</template>
 
<script>
import { Slider } from "genie-ui";
 
export default {
  name:"slider",
  components: {
    Slider
  },
 
  data() {
    return {
      step: 1,
      showstops: false,
      step2: 10,
      showstops2: true,
      stops2: ['低档', '中档', '高档', '高档', '极档'],
      stops3: [45, 50, 55, 60, 65, 70, 75, 80],
 
      val: 40,
      val2: 50,
      val3: 60,
      val4: 70,
    };
  },
 
  methods: {
    onChange(val) {
      console.log(val)
    }
  },
};
</script>