<script lang="ts" setup>
type PageHeaderProps = {
  /** タイトル */
  title?: string
  /** 投稿した日 */
  created?: Date | string
  /** 更新した日 */
  updated?: Date | string
  /** 文字数 */
  charCount?: number | string
  /** 単語数 */
  wordCount?: number | string
  /** 本文 */
  content?: unknown
  /** 読了完了目安 */
  readTime?: number | string
  /** 書いたひと */
  author?: {
    name: string
    icon: string
  }
  /** Intl.Segmenter に渡すロケール（word 分割の既定値は 'ja'） */
  segmenterLocale?: string
}

const TEXT_PER_MINUTE = 800

const props = withDefaults(defineProps<PageHeaderProps>(), {
  title: '',
  created: undefined,
  updated: undefined,
  charCount: undefined,
  wordCount: undefined,
  content: undefined,
  readTime: undefined,
  author: () => ({ name: '', icon: '' }),
  segmenterLocale: 'ja',
})

/** 投稿した日 */
const createdDate = computed(() => useDatetimeFormat(props.created))
/** 更新した日 */
const updatedDate = computed(() => useDatetimeFormat(props.updated))

const stripMarkdownSyntax = (value: string): string => {
  return value
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/~~~[\s\S]*?~~~/g, ' ')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^\s{0,3}#{1,6}\s*/gm, '')
    .replace(/^\s{0,3}(?:[-*+]|\d+\.)\s/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/[*_~`]/g, '')
    .replace(/^\s*[-*_]{3,}\s*$/gm, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const extractTextFromContent = (value: unknown): string => {
  if (typeof value === 'string') {
    return stripMarkdownSyntax(value)
  }

  if (Array.isArray(value)) {
    return value.map((item) => extractTextFromContent(item)).join(' ')
  }

  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>
    const type = typeof record.type === 'string' ? record.type : ''

    if (
      [
        'image',
        'img',
        'code',
        'codeInline',
        'code_block',
        'codeBlock',
        'html',
        'comment',
      ].includes(type)
    ) {
      return ''
    }

    if (type === 'minimal' && Array.isArray(record.children)) {
      const children = record.children as unknown[]
      return children.map((child) => extractTextFromContent(child)).join(' ')
    }

    if (record.body !== undefined) {
      if (record.body && typeof record.body === 'object') {
        const bodyRecord = record.body as Record<string, unknown>
        if (
          bodyRecord.type === 'minimal' &&
          Array.isArray(bodyRecord.children)
        ) {
          const children = bodyRecord.children as unknown[]
          return children
            .map((child) => extractTextFromContent(child))
            .join(' ')
        }
      }

      const bodyText = extractTextFromContent(record.body)
      if (bodyText) {
        return bodyText
      }
    }

    if (Array.isArray(record.children)) {
      return record.children
        .map((child) => extractTextFromContent(child))
        .join(' ')
    }

    if (typeof record.text === 'string' && record.text.trim()) {
      return stripMarkdownSyntax(record.text)
    }

    if (typeof record.value === 'string' && record.value.trim()) {
      return stripMarkdownSyntax(record.value)
    }

    return Object.values(record)
      .map((item) => extractTextFromContent(item))
      .filter(Boolean)
      .join(' ')
  }

  return ''
}

const contentSource = computed(() => {
  if (props.content && typeof props.content === 'object') {
    const record = props.content as Record<string, unknown>
    if (record.body !== undefined) {
      return record.body
    }
  }

  return props.content
})
const contentText = computed(() => extractTextFromContent(contentSource.value))
const normalizedContentText = computed(() =>
  contentText.value.replace(/\s+/g, ' ').trim(),
)
const derivedCharCount = computed(() => normalizedContentText.value.length)
const derivedWordCount = computed(() => {
  if (!normalizedContentText.value) {
    return 0
  }

  const text = normalizedContentText.value

  // Intl.Segmenter (単語単位) が利用可能な場合はこれを使用し、
  // 日本語などスペース区切りのない言語でも正確に単語数をカウントする。
  // 実行時チェックで Intl.Segmenter の有無を確認。
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (typeof Intl !== 'undefined' && (Intl as any).Segmenter) {
    try {
      const locale = props.segmenterLocale ?? 'ja'
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const iterator = new (Intl as any).Segmenter(locale, {
        granularity: 'word',
      }).segment(text)
      let count = 0
      for (const seg of iterator) {
        const token =
          seg && typeof seg === 'object' && 'segment' in seg
            ? seg.segment
            : String(seg)
        // 文字（アルファベット・漢字・仮名等）または数字を含むセグメントのみをカウント
        if (token && /\p{L}|\p{N}/u.test(token)) {
          count++
        }
      }
      return count
    } catch {
      // エラー時はフォールバック処理（空白区切り）へ移行
    }
  }

  // フォールバック: 従来の空白区切りによるカウント処理
  return text.split(/\s+/).length
})
const hasContentStats = computed(
  () =>
    props.charCount !== undefined ||
    props.wordCount !== undefined ||
    props.readTime !== undefined ||
    derivedCharCount.value > 0,
)
/** 文字数 */
/** 単語数 */
const toNumericValue = (
  value: number | string | undefined,
  fallback: number,
): number => {
  if (value === undefined) {
    return fallback
  }

  const parsed = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

const displayedCharCount = computed(() => {
  const value = props.charCount ?? derivedCharCount.value
  return toNumericValue(value, derivedCharCount.value)
})
const displayedWordCount = computed(() => {
  const value = props.wordCount ?? derivedWordCount.value
  return toNumericValue(value, derivedWordCount.value)
})
const derivedReadTime = computed(() => {
  if (props.readTime !== undefined) {
    return typeof props.readTime === 'number'
      ? `${props.readTime} 分`
      : String(props.readTime)
  }

  const chars = displayedCharCount.value

  // 1分未満（TEXT_PER_MINUTE 未満）の場合は秒表記
  if (chars < TEXT_PER_MINUTE) {
    const seconds = Math.max(1, Math.ceil((chars / TEXT_PER_MINUTE) * 60))
    return `${seconds} 秒`
  }

  const minutes = Math.ceil(chars / TEXT_PER_MINUTE)
  return `${minutes} 分`
})
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
          class="flex flex-col gap-1 rounded-lg bg-slate-100 px-4 py-2.5 dark:bg-slate-800"
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
          v-if="props.updated"
          class="flex flex-col gap-1 rounded-lg bg-slate-100 px-4 py-2.5 dark:bg-slate-800"
        >
          <dt>更新日</dt>
          <dd class="flex items-center gap-1 font-bold">
            <span class="i-ph-clock-clockwise-bold mt-0.5 size-5" />
            <time :datetime="updatedDate.hyphen">
              {{ updatedDate.slash }}
            </time>
          </dd>
        </div>
        <div
          v-if="hasContentStats"
          class="flex flex-col gap-1 rounded-lg bg-slate-100 px-4 py-2.5 dark:bg-slate-800"
        >
          <dt>単語数 / 文字数</dt>
          <dd class="flex items-center gap-1 font-bold">
            <span class="i-pepicons-pop-pen mt-0.5 size-5" />
            <span> {{ displayedWordCount }} / {{ displayedCharCount }} </span>
          </dd>
        </div>
        <div
          v-if="hasContentStats"
          class="flex flex-col gap-1 rounded-lg bg-slate-100 px-4 py-2.5 dark:bg-slate-800"
        >
          <dt>読了目安</dt>
          <dd class="flex items-center gap-1 font-bold">
            <span class="i-pepicons-pop-clock mt-0.5 size-5" />
            <span>
              {{ derivedReadTime }}
            </span>
          </dd>
        </div>
        <div
          v-if="props.author.name"
          class="flex flex-col gap-1 rounded-lg bg-slate-100 px-4 py-2.5 dark:bg-slate-800"
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
