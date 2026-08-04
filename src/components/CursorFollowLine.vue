<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'

const rootRef = ref(null)
const svgns = 'http://www.w3.org/2000/svg'
const ease = 0.75
const total = 100

const pointer = { x: 0, y: 0 }
const tweens = []
let onMouseMove

onMounted(() => {
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches
  const hasFinePointer = window.matchMedia('(any-pointer: fine)').matches

  if (prefersReducedMotion || !hasFinePointer) return

  pointer.x = window.innerWidth / 2
  pointer.y = window.innerHeight / 2

  onMouseMove = (event) => {
    pointer.x = event.clientX
    pointer.y = event.clientY
  }
  window.addEventListener('mousemove', onMouseMove)

  let leader = pointer
  for (let i = 0; i < total; i++) {
    leader = createLine(leader, i)
  }
})

onUnmounted(() => {
  if (onMouseMove) window.removeEventListener('mousemove', onMouseMove)
  tweens.forEach((t) => t.kill())
  tweens.length = 0
})

function createLine(leader, i) {
  const line = document.createElementNS(svgns, 'line')
  rootRef.value.appendChild(line)

  gsap.set(line, { x: -15, y: -15, opacity: (total - i) / total })

  const pos = { x: leader.x, y: leader.y }

  const tween = gsap.to(pos, {
    duration: 1000,
    ease: 'none',
    x: '+=1',
    y: '+=1',
    repeat: -1,
    modifiers: {
      x: function () {
        const x = pos.x + (leader.x - pos.x) * ease
        line.setAttribute('x1', x)
        line.setAttribute('x2', leader.x)
        return x
      },
      y: function () {
        const y = pos.y + (leader.y - pos.y) * ease
        line.setAttribute('y1', y)
        line.setAttribute('y2', leader.y)
        return y
      },
    },
  })

  tweens.push(tween)
  return pos
}
</script>
<template>
  <svg ref="rootRef" class="trail-svg" xmlns="http://www.w3.org/2000/svg" />
</template>
<style scoped>
.trail-svg {
  position: fixed;
  top: 15px;
  left: 15px;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
}
.trail-svg :deep(line) {
  stroke: #b8f8fb;
  stroke-width: 5;
}
</style>
