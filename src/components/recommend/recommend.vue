<template lang="html">
    <div class= 'recommend' ref = 'recommend'>
    </div>
</template>

<script>
import {getRecommend} from 'api/recommend'
import {ERR_OK} from 'api/config'
export default {
  data () {
    return {
      recommends: [],
      discList: []
    }
  },
  created () {
    this._getRecommend()
  },
  methods: {
    _getRecommend () {
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          console.log(res.data.slider)
        }
      })
    }
  }
}
</script>

<style lang="stylus" rel = 'stylesheet/stylus' scoped>

</style>
