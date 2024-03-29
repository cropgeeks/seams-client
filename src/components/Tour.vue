<template>
  <div v-if="popoverShow">
    <!-- The backdrop prevents input on the background -->
    <div class="backdrop" />
    <!-- The popover appears next to the element -->
    <b-popover :target="popoverTarget" :placement="steps[currentIndex].position" ref="popover" custom-class="tour-popover" :show="popoverShow" >
      <template v-slot:title>
        <button @click="popoverShow = false" size="sm" class="ml-1 close" aria-label="Close">
          ×
        </button>
        <span>{{ steps[currentIndex].title() }}</span>
      </template>
      <div>
        <!-- Step content text -->
        <p v-html="steps[currentIndex].text()" />

        <!-- Buttons -->
        <b-button-group class="d-flex">
          <!-- Back button -->
          <b-button variant="secondary" @click="currentIndex = currentIndex - 1" :disabled="currentIndex < 1" v-if="!hideBackButton && (steps.length > 1)"><BIconChevronLeft /> {{ $t('buttonBack') }}</b-button>
          <!-- Next button -->
          <b-button variant="success" @click="next" v-if="currentIndex < steps.length - 1">{{ $t('buttonNext') }} <BIconChevronRight /></b-button>
          <!-- Finish button -->
          <b-button variant="success" @click="resetPopover" v-else>{{ $t('buttonClose') }} <BIconCheck /></b-button>
        </b-button-group>
      </div>
    </b-popover>
  </div>
</template>

<script>
import { BIconCheck, BIconChevronLeft, BIconChevronRight } from 'bootstrap-vue'

export default {
  components: {
    BIconCheck,
    BIconChevronLeft,
    BIconChevronRight
  },
  props: {
    steps: {
      type: Array,
      default: () => []
    },
    resetOnRouterNav: {
      type: Boolean,
      default: true
    },
    hideBackButton: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      currentIndex: 0,
      popoverShow: false,
      popoverTarget: null
    }
  },
  watch: {
    currentIndex: function () {
      if (this.popoverShow) {
        this.updatePopover()
      } else {
        this.resetPopover()
      }
    },
    $route: function () {
      if (this.resetOnRouterNav) {
        // Hide on page navigation
        this.resetPopover()
        document.body.classList.remove('overflow-hidden')
      }
    },
    popoverShow: function (newValue) {
      if (newValue === true) {
        document.body.classList.add('overflow-hidden')
      } else {
        document.body.classList.remove('overflow-hidden')
      }
    }
  },
  methods: {
    next: function () {
      const currStep = this.steps[this.currentIndex]

      if (currStep.afterShow) {
        currStep.afterShow().then(() => {
          this.nextInternal()
        })
      } else {
        this.nextInternal()
      }
    },
    nextInternal: function () {
      const nextStep = this.steps[this.currentIndex + 1]

      if (nextStep.beforeShow) {
        nextStep.beforeShow().then(() => {
          this.currentIndex = this.currentIndex + 1
        })
      } else {
        this.currentIndex = this.currentIndex + 1
      }
    },
    updatePopover: function () {
      this.popoverShow = false
      this.$nextTick(() => {
        if (this.currentIndex < this.steps.length) {
          this.popoverTarget = document.querySelector(this.steps[this.currentIndex].target())

          if (this.popoverTarget) {
            this.popoverShow = true

            const rect = this.popoverTarget.getBoundingClientRect()
            const absoluteElementTop = rect.top + window.pageYOffset
            const middle = absoluteElementTop - (window.innerHeight / 2)
            window.scrollTo({
              left: 0,
              top: middle,
              behavior: 'smooth'
            })
          } else {
            this.popoverShow = true
            this.currentIndex++
          }
        } else {
          this.popoverShow = false
        }
      })
    },
    resetPopover: function () {
      if (this.currentIndex === this.steps.length - 1) {
        const step = this.steps[this.currentIndex]

        if (step.afterShow) {
          step.afterShow()
        }
      }

      this.currentIndex = 0
      this.popoverTarget = null
      this.popoverShow = false
    },
    start: function () {
      this.resetPopover()
      this.updatePopover()
    },
    handleKeys: function (e) {
      if (this.popoverShow) {
        if (e.keyCode === 39) {
          // Right
          if (this.currentIndex < this.steps.length - 1) {
            this.next()
          }
        } else if (e.keyCode === 37) {
          // Left
          if (!this.hideBackButton && this.currentIndex > 0) {
            this.currentIndex--
          }
        } else if (e.keyCode === 27) {
          // Escape
          this.resetPopover()
        }
      }
    }
  },
  mounted: function () {
    document.addEventListener('keyup', this.handleKeys)
  },
  destroyed: function () {
    document.removeEventListener('keyup', this.handleKeys)
  }
}
</script>

<style scoped>
.backdrop {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1059;
}
.tour-popover {
  max-width: 100%;
  width: 400px;
}
</style>
