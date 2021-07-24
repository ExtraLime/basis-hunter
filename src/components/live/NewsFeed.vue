<template>
  <div class="news-move">
      <news-article v-for="article in articles" :key="article.link" :article='article'>

      </news-article>
  </div>
</template>
<script>
import { Parse } from "rss-to-json";
import { ref, onMounted } from "vue";
import NewsArticle from "./NewsArticle.vue";
export default {
  components: { NewsArticle },
  setup() {
    const articles = ref([]);
    const parsed = async () => {
      var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
      
      const result = await window.fetch("http://127.0.0.1:5000/newsticker");
      const arts = await result.json()
      console.log(arts)
      articles.value = arts;
      return arts;
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