'use strict'

export default {
  bind(el, binding) {
    el.style.backgroundImage = `url(${binding.value})`
  }
}