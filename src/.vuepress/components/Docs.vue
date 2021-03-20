<template>
  <a :href='docsLink'>
    {{ docsType }}
  </a>
</template>

<script>
const mdnDocs = {
}

export default {
  data() {
    return {
      docsLink: this.link || mdnDocs[this.type] || `https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/${this.type}`,
      docsType: this.type
    }
  },
  props: {
    type: String,
    link: String
  }
}
</script>