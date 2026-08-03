<script lang="ts" setup>
type BlogPostListProps = {
  /** 取得する投稿数 */
  limit?: number
  /** スキップする投稿数 */
  skip?: number
}

const props = withDefaults(defineProps<BlogPostListProps>(), {
  limit: undefined,
  skip: 0,
})

const website = useWebsite()
const { data, error } = await useAsyncData(
  pathToUseAsyncDataKey(
    '/blog',
    `limit-${props.limit || website.value.itemPerPage}`,
    `skip-${props.skip}`,
  ),
  () =>
    queryCollection('blog')
      .select('path', 'title', 'description', 'created')
      .order('created', 'DESC')
      .limit(props.limit || website.value.itemPerPage)
      .skip(props.skip)
      .all(),
)

if (error.value || !data.value?.length) {
  throw createError({
    statusCode: 404,
    message: 'ページが見つかりません',
    fatal: true,
  })
}

/** ブログの投稿 */
const items = computed(() =>
  (data.value || [])
    .filter((item) => item.path && item.title && item.created)
    .map((item) => ({
      path: useTrailingSlash(blogPathToUrl(item.path)),
      title: item.title || '',
      description: item.description || '',
      created: useDatetimeFormat(item.created),
    })),
)
</script>

<template>
  <div
    class="mx-auto grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2"
  >
    <NuxtLink
      v-for="post in items"
      :key="post.path"
      :to="post.path"
      class="group relative flex flex-col gap-2 overflow-hidden rounded-2xl border border-primary/50 bg-primary/20 p-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.7),0_4px_24px_-8px_rgba(184,248,251,0.5)] backdrop-blur-md backdrop-saturate-150 transition-all duration-300 hover:bg-primary/30 hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),0_8px_32px_-8px_rgba(184,248,251,0.65)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none dark:backdrop-blur-none dark:hover:bg-slate-800"
    >
      <h3 class="line-clamp-2 font-medium text-slate-800 dark:text-white">
        {{ post.title }}
      </h3>
      <p
        class="line-clamp-2 text-xs text-slate-600 dark:text-slate-300 sm:text-sm"
      >
        {{ post.description }}
      </p>
      <time
        :datetime="post.created.hyphen"
        class="mt-auto shrink-0 whitespace-nowrap text-xs text-slate-500 dark:text-slate-400"
      >
        {{ post.created.slash }}
      </time>
    </NuxtLink>
  </div>
</template>
