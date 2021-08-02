<template>
  <div class="news-move">
    <news-article
      v-for="article in articles"
      :key="article.link"
      :article="article"
    >
    </news-article>
  </div>
</template>
<script>
import { ref, onMounted } from "vue";
import NewsArticle from "./NewsArticle.vue";
export default {
  components: { NewsArticle },
  setup() {
    const articles = ref([]);
    const parsed = async () => {
      const result = await window.fetch(process.env.VUE_APP_API+"newsticker");
      const arts = await result.json();
      articles.value = arts;
      return arts;
    };
    onMounted(() => {
      parsed();
    });
    setInterval(() => {
      parsed();
    }, 900000);
    return { parsed, articles };
  },
};
</script>
<style scoped>
</style>