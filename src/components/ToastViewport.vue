<script lang="ts" setup>
const { toasts, dismissToast } = useToast()
</script>

<template>
  <div
    class="pointer-events-none fixed inset-x-0 top-4 z-[60] flex justify-center px-4"
  >
    <div class="flex w-full max-w-2xl flex-col gap-3">
      <transition-group name="toast" tag="div" class="flex flex-col gap-3">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          role="status"
          aria-atomic="true"
          class="pointer-events-auto rounded-2xl border border-white/50 bg-white/70 px-4 py-3 shadow-[0_20px_60px_rgba(15,23,42,0.18)] backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/70"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <p
                class="text-sm font-semibold text-slate-800 dark:text-slate-100"
              >
                {{ toast.title }}
              </p>
              <p
                v-if="toast.description"
                class="mt-1 text-sm text-slate-600 dark:text-slate-300"
              >
                {{ toast.description }}
              </p>
            </div>
            <button
              type="button"
              class="shrink-0 rounded-full p-1 text-slate-500 transition hover:bg-slate-200/70 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              :aria-label="`通知を閉じる: ${toast.title}`"
              @click="dismissToast(toast.id)"
            >
              <span class="i-ph-x-bold size-4" />
            </button>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<style scoped>
.toast-enter-active {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.toast-leave-active {
  transition: all 0.2s ease-in;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(100%) scale(0.8);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(100%) scale(0.9);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>
