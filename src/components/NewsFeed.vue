<template>
  <div class="news-move">
      <news-article v-for="article in articles" :key="article.link" :article='article'>

      </news-article>
  </div>
</template>
<script>
import { Parse } from "../../node_modules/rss-to-json";
import { ref, onMounted } from "vue";
import NewsArticle from "./NewsArticle.vue";
export default {
  components: { NewsArticle },
  setup() {
    const articles = ref([]);
    const parsed = async () => {
      const result = await Parse("https://cointelegraph.com/rss");
      const data= result.items.map((article) => article);

      articles.value = data;
      return data;
    };
    onMounted(() => {
      parsed();
    });
    setInterval(() => {
      parsed();
    }, 20000);
    return { parsed, articles };
  },
};
</script>
<style scoped>

</style>