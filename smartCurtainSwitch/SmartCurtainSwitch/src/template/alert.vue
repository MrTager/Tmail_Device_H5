<template>
  <div class="actionDialog">
    <action-dialog :show.sync="show"  @confirm="onConfirm" @cancel="onCancel" @closed="onClosed"
    title="窗帘设置"
    >
      <!-- <select-list v-if="show" class="select-list" :height="380" ref="selectList"></select-list> -->
    
    </action-dialog>
  </div>
</template>
 
<script>
import Vue from "vue";
import { ActionDialog, SelectList } from "genie-ui";
 
export default {
  components: {
    ActionDialog,
    SelectList
  },
 
  data () {
    return {
      show: true,
    }
  },
 
  methods: {
    onShow () {
      console.log('show')
      this.show = !this.show
    },
    onConfirm () {
      console.log('confirm')
    },
    onCancel () {
      console.log('cancel')
    },
    onClosed () {
      console.log('closed')
    }
  },
 
  mounted () {
    setTimeout(() => {
      this.show = false
    }, 5000)
  }
};
</script>