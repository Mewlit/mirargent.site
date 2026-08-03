<script lang="ts" setup>
const website = useWebsite()
const year = useDateFormat(new Date(), 'YYYY')
const { copy } = useClipboard({ source: website.value.socials.rss.url })
const { addToast } = useToast()

/** ウェブサイトの名前 */
const name = website.value.name
/** ソーシャルリンク */
const socials = website.value.socials
/** フッターナビゲーションの項目 */
const menu = website.value.footer.menu
/** RSSフィードのURLをコピーする */
const rssFeedCopy = async () => {
  await copy()
  addToast({
    title: 'RSSをコピーしました',
    description:
      'RSS購読アプリ等に登録することでブログの更新があった際に通知を受け取れます。',
    type: 'success',
  })
}
</script>

<template>
  <footer
    class="mt-20 border-t border-primary/10 bg-gradient-to-br from-primary/10 via-white to-white py-20 dark:from-primary/10 dark:via-slate-900 dark:to-slate-900"
  >
    <div
      class="mx-auto flex w-full flex-col items-start justify-between gap-8 px-4 md:flex-row md:items-center md:px-6 lg:px-8"
    >
      <div class="flex flex-col gap-5">
        <nav>
          <ul class="flex flex-wrap items-center gap-x-4 gap-y-1.5 px-1">
            <li v-for="item in menu" :key="item.url">
              <NuxtLink :to="item.url">
                <span class="text-xs font-bold underline hover:no-underline">
                  {{ item.title }}
                </span>
              </NuxtLink>
            </li>
          </ul>
        </nav>
        <div class="flex items-center gap-2">
          <NuxtLink
            :title="socials.bluesky.name"
            :to="socials.bluesky.url"
            aria-label="Blueskyでフォローする"
            class="relative flex size-8 items-center justify-center rounded before:absolute before:size-full before:rounded before:bg-current before:opacity-0 before:transition-opacity hover:before:opacity-20"
            target="_blank"
          >
            <span class="i-simple-icons-bluesky size-5" />
          </NuxtLink>
          <NuxtLink
            :title="socials.github.name"
            :to="socials.github.url"
            aria-label="GitHubでフォローする"
            class="relative flex size-8 items-center justify-center rounded before:absolute before:size-full before:rounded before:bg-current before:opacity-0 before:transition-opacity hover:before:opacity-20"
            target="_blank"
          >
            <span class="i-simple-icons-github size-5" />
          </NuxtLink>
          <NuxtLink
            :title="socials.discord.name"
            :to="socials.discord.url"
            aria-label="Discordサーバに参加する"
            class="relative flex size-8 items-center justify-center rounded before:absolute before:size-full before:rounded before:bg-current before:opacity-0 before:transition-opacity hover:before:opacity-20"
            target="_blank"
          >
            <span class="i-simple-icons-discord size-5" />
          </NuxtLink>
          <button
            :title="socials.rss.name"
            aria-label="RSSフィードのURLをコピーする"
            class="relative flex size-8 items-center justify-center rounded before:absolute before:size-full before:rounded before:bg-primary/10 before:opacity-0 before:transition-opacity hover:before:opacity-20"
            @click="() => rssFeedCopy()"
          >
            <span class="i-ph-rss-bold size-5" />
          </button>
        </div>
      </div>
      <div class="text-xs">&copy; 2026-{{ year }} {{ name }}</div>
    </div>
  </footer>
</template>
