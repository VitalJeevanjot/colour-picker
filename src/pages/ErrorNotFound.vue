<template>
  <div class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30vh">
        404
      </div>

      <div class="not-found-message">
        {{ $t("notFound.title") }}
      </div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        to="/"
        :label="$t('notFound.goHome')"
        no-caps
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ErrorNotFound'
})
</script>

<style scoped>
.not-found-message {
  font-size: clamp(1.5rem, 7vw, 3.75rem);
  line-height: 1.2;
  overflow-wrap: anywhere;
}
</style>
