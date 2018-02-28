<template>
  <scroll class = 'listview'
          :data = 'data'
          ref = 'listview'
          :listenScroll = 'listenScroll'
          @scroll = 'scroll'>
    <ul>
      <li v-for='group in data' class = 'list-group' ref = 'ListGroup' :key="group.title">
        <h2 class = 'list-group-title'>{{group.title}}</h2>
        <ul>
          <li class = 'list-group-item' v-for = 'item in group.items' :key="item.name">
            <img :src="item.avatar" class = 'avatar'>
            <span class = 'name'>{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class = 'list-shortcut' @touchstart = 'onShortcutTouchStart' @touchmove.stop.prevent = 'onShortcutTouchMove'>
      <ul>
        <li v-for = '(item, index) in shortcutList' class = 'item' :data-index = 'index' :key = 'item' :class = "{'current':currentIndex === index}">
          {{item}}
        </li>
      </ul>
    </div>
    <div class = 'list-fixed' v-show = 'fixedTitle' ref = 'fixedTop'>
      <h2 class = 'fixed-title'>{{fixedTitle}}</h2>
    </div>
    <div v-show = '!data.length' class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>

<script type = 'text/ecmascript-6'>

import Scroll from 'base/scroll/scroll'
import {getData} from 'common/js/dom'
import loading from 'base/loading/loading'

const ANCHOR_HEIGHT = 18
const FIXED_HEIGHT = 25

export default {
  created () {
    this.touch = {}
    this.listenScroll = true
    this.listHeight = []
  },
  data () {
    return {
      diff: -1,
      scrollY: -1,
      currentIndex: 0
    }
  },
  props: {
    data: {
      type: Array
    }
  },
  computed: {
    shortcutList () {
      return this.data.map((group) => {
        return group.title.substring(0, 1)
      })
    },
    fixedTitle () {
      if (this.scrollY > 0) {
        return ''
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  methods: {
    onShortcutTouchStart (e) {
      let anchorindex = getData(e.target, 'index')
      this.touch.y1 = e.touches[0].pageY
      this.touch.anchorindex = anchorindex
      this.scrollTo(anchorindex)
    },
    onShortcutTouchMove (e) {
      this.touch.y2 = e.touches[0].pageY
      let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
      let anchorindex = parseInt(this.touch.anchorindex) + delta
      this.scrollTo(anchorindex)
    },
    scroll (pos) {
      this.scrollY = pos.y
    },
    scrollTo (index) {
      this.scrollY = -this.listHeight[index]
      this.$refs.listview.scrollToElement(this.$refs.ListGroup[index], 0)
    },
    _canculateHeight () {
      this.listHeight = []
      const list = this.$refs.ListGroup
      let height = 0
      this.listHeight.push(height)
      for (var i = 0; i < list.length; i++) {
        let item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    }
  },
  watch: {
    data () {
      setTimeout(() => {
        this._canculateHeight()
      }, 20)
    },
    scrollY (newY) {
      let listHeight = this.listHeight
      // 当newY在第一位时
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      // 当newY在中间位置时
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        if ((-newY) >= height1 && (-newY) < height2) {
          this.diff = height2 + newY
          this.currentIndex = i
          return
        }
      }
      // 当newY在底部位置时
      this.currentIndex = this.listHeight.length - 2
    },
    diff (newVal) {
      let fixedTop = (newVal > 0 && newVal < FIXED_HEIGHT) ? newVal - FIXED_HEIGHT : 0

      if (this.fixedTop === fixedTop) {
        return
      }

      this.fixedTop = fixedTop
      this.$refs.fixedTop.style.transform = `translate3d(0,${fixedTop}px,0)`
    }
  },
  components: {
    Scroll,
    loading
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
          font-size:15px
    .list-fixed
      position: absolute
      top: -4px
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
