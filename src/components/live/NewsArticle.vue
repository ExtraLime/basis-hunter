<template>
  <div class="news-article">
    <a :href="article.link" target="_blank"
      ><h5 class="a.title">{{ props.article.title }}</h5></a
    >{{}}
     <h6 class="a.description"> {{ (new Date(props.article.timestamp)).toLocaleDateString() }} {{(new Date(props.article.timestamp)).toLocaleTimeString()}}</h6> 
  </div>
</template>
<script>
export default {
  props: {
    article: {
      type: Object,
    },
  },
  setup(props) {
    return { props };
  },
};
</script>
<style scoped>
div {
  display: inline-flex;
  margin: 0.25rem;
}
h6 {
  color: black;
}
h5{
  margin-right:.25rem
}
a {
  padding: 0;
  margin: 0;
}
</style>