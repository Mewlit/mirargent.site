<script lang="ts" setup>
type PageHeaderProps = {
  /** タイトル */
  title?: string
  /** 投稿した日 */
  created?: Date | string
  /** 本文 */
  content?: unknown
  /** 読了完了目安 */
  readingTime?: { charCount: number; minutes: number }
  /** 書いたひと */
  author?: {
    name: string
    icon: string
  }
  /** Intl.Segmenter に渡すロケール（word 分割の既定値は 'ja'） */
  segmenterLocale?: string
}

const props = withDefaults(defineProps<PageHeaderProps>(), {
  title: '',
  created: undefined,
  content: undefined,
  readingTime: undefined,
  author: () => ({ name: '', icon: '' }),
  segmenterLocale: 'ja',
})

/** 投稿した日 */
const createdDate = computed(() => useDatetimeFormat(props.created))
</script>

<template>
  <header class="flex flex-col gap-5">
    <h1
      class="text-3xl font-bold leading-snug text-slate-800 dark:text-white md:text-4xl md:leading-normal"
    >
      {{ props.title }}
    </h1>
    <slot>
      <dl class="grid grid-cols-fill-36 gap-3 text-xs sm:gap-4">
        <div
          v-if="props.created"
          class="flex flex-col gap-1 rounded-lg bg-primary/40 px-4 py-2.5 dark:bg-slate-800/60"
        >
          <dt>投稿日</dt>
          <dd class="flex items-center gap-1 font-bold">
            <span class="i-ph-calendar-blank-bold mt-0.5 size-5" />
            <time :datetime="createdDate.hyphen">
              {{ createdDate.slash }}
            </time>
          </dd>
        </div>
        <div
          v-if="readingTime && readingTime.charCount > 0"
          class="flex flex-col gap-1 rounded-lg bg-primary/40 px-4 py-2.5 dark:bg-slate-800/60"
        >
          <dt>文字数</dt>
          <dd class="flex items-center gap-1 font-bold">
            <span class="i-pepicons-pop-pen mt-0.5 size-5" />
            <span> {{ readingTime.charCount.toLocaleString() }}文字</span>
          </dd>
        </div>
        <div
          v-if="readingTime"
          class="flex flex-col gap-1 rounded-lg bg-primary/40 px-4 py-2.5 dark:bg-slate-800/60"
        >
          <dt>読了まで</dt>
          <dd class="flex items-center gap-1 font-bold">
            <span class="i-pepicons-pop-clock mt-0.5 size-5" />
            <span> 約{{ readingTime.minutes?.toFixed(2) }}分 </span>
          </dd>
        </div>
        <div
          v-if="props.author.name"
          class="flex flex-col gap-1 rounded-lg bg-primary/40 px-4 py-2.5 dark:bg-slate-800/60"
        >
          <dt>By</dt>
          <dd class="flex items-center gap-1 font-bold">
            <div class="size-6 overflow-hidden rounded-full">
              <img
                :src="props.author.icon"
                alt="icon"
                class="size-full object-contain"
                width="24"
                height="24"
              />
            </div>
            <span>{{ props.author.name }}</span>
          </dd>
        </div>
      </dl>
    </slot>
  </header>
</template>
