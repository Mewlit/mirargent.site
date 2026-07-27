<script lang="ts" setup>
const website = useWebsite()

/** ソーシャルリンク */
const socials = website.value.socials
</script>

<template>
  <section
    class="flex flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-8 text-center backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/50"
  >
    <!-- ヘッダーエリア -->
    <div class="flex flex-col gap-1">
      <h2
        class="text-xl font-bold tracking-wide text-slate-800 dark:text-slate-100"
      >
        お問い合わせ
      </h2>
      <p class="text-xs text-slate-500 dark:text-slate-400">
        ご意見・ご感想・ご質問はこちらから
      </p>
    </div>

    <!-- フォームへのリンクボタン -->
    <NuxtLink
      :to="socials.form.url"
      target="_blank"
      rel="noopener noreferrer"
      class="group inline-flex items-center gap-2.5 rounded-full bg-primary px-6 py-2.5 text-slate-800 shadow-md shadow-blue-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0077e6] hover:shadow-lg hover:shadow-blue-500/30 active:translate-y-0"
    >
      <!-- アイコンのスペル修正: sinpleicons -> simple-icons -->
      <span
        class="i-simple-icons-mail size-4 transition-transform duration-300 group-hover:scale-110"
      />
      <span class="text-sm font-semibold tracking-wider">{{
        socials.form.name
      }}</span>
      <span
        class="i-lucide-arrow-up-right size-3.5 opacity-70 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      />
    </NuxtLink>
  </section>
</template>
