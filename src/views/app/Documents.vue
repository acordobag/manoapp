<template lang="pug">
main.documents
  .pk-tile
    .pk-tile-header.dark
      .pk-tile-title Documentos
    .pk-tile-body(v-if="!documents.length")
      .padding-20.txt-center No hay documentos disponibles en este momento
    .pk-tile-body(v-else)
      .document(v-for="doc in documents")
        .date {{doc.createdAt | exactDate}}
        .data
          .title {{doc.title}}
        .download
          i.fa.fa-download
</template>

<script>
import Documents from '@/services/Documents'

export default {
  data () {
    return {
      documents: []
    }
  },
  mounted () {
    this.initialize()
  },
  methods: {
    initialize () {
      this.getDocuments()
    },
    async getDocuments () {
      try {
        let {data} = await Documents.get()
        this.documents = data
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.document{
  padding: 10px;
  font-size: .8em;
  background: white;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  .date{
    height: 100%;
    border-right: 2px solid #712887;
  }
  .data{
    .title{
      font-size: 1.2em;
      color: #712887;
    }
  }
  * {
    flex: 1 1 auto;
    padding: 5px;
  }
  .download{
    color: rgb(160, 160, 160);
    font-size: 2em;
    &:hover{
      color: #712887;
    }
  }
}
</style>

