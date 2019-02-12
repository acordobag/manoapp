<template lang="pug">
  main.home
    section.home-1
      .content
        .title Aprenda a Invertir con solo $200
        .text Reciba asesoría para operar en mercados bursátiles, inicie su experiencia con solo $200
        OpenAccountBtn(:light="true")
      .image
        img(src="@/assets/img1.png")
    section.home-2
      p Aprenda a invertir con nosotros y sea un profesional
    section.home-5
      .txt-link.underline
      router-link.link.white(to="crypto")
        i.fab.fa-bitcoin
        |  Conozca más de las Crypto Divisas
    pTicker.home-ticker
    section.home-4
      .image
        img(src="@/assets/img3.png")
      .content
        .title ¿Que hace un coach de Strategic?
        .text.txt-justify.
          Nos enfocamos primero en ver cómo está su situación personal y financiera hoy, así como sus actitudes respecto al dinero. A partir de sus 
          propios valores, definimos los objetivos que tienes, es decir: ¿Qué es lo que quiere lograr con su dinero? Vemos juntos sus patrones de 
          consumo (¿Cómo gastas el dinero?) y cuál es su capacidad de ahorro. A partir de ello vamos construyendo un presupuesto que le ayude 
          precisamente a enfocarte en sus metas: en lo que verdaderamente te importa. Si tienes deudas de corto plazo (tarjetas de crédito, 
          préstamos personales o de coche), primero hacemos un plan para atacarlas, antes de pasar al ahorro
        OpenAccountBtn
    section.home-5
      p.txt-justify Ya sea usted un inversionista con o sin experiencia, le brindaremos los recursos humanos y las herramientas tecnológicas para que usted comprenda los riesgos y beneficios de las diferentes oportunidades de este emocionante mercado mundial.
    pPrices.home-6
</template>

<style lang="scss" scoped>
  @import '~styles/main.scss';

  [class^='home-'] {
    @include pk-media (tablet-landscape-up) {
      padding: 20px calc(100vw - 1200px)!important;
    }
  }

  .home-1{
    @include section($main-color, white);
    .content{
      display: flex;
      padding: 15px;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      *{
        margin: 5px;
      }
      .title{
        font-size: 1.4em;
      }
      .text{
        font-size: .9em;
      }
    }
    .image{
      display: flex;
      justify-content: center;
      align-items: center;
      img{
        flex: 0 0;
        height: auto;
        max-height: 500px;
        width: auto;
        max-width: 100%;
      }
      @include pk-media (tablet-portrait-up) {
        img{
          max-height: 300px;
          max-width: 100%;
        }
      }
    }
  }

  .home-2{
    @include section(white, $main-color, 20px);
    font-size: 1.2em;
  }

  .home-4{
    @include section(white, $main-color);
    flex-direction: column;
    .content{
      display: flex;
      padding: 15px;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      *{
        margin: 5px;
      }
      .title{
        font-size: 1.4em;
      }
      .text{
        font-size: .9em;
      }
    }
    .image{
      flex: 0 0 auto;
      display: flex;
      justify-content: center;
      align-items: center;
      img{
        flex: 0 0;
        height: auto;
        max-height: 200px;
        width: auto;
        max-width: 100%;
      }
      @include pk-media (tablet-portrait-up) {
        img{
          max-height: 300px;
          max-width: 100%;
        }
      }
    }

    @include pk-media (tablet-landscape-up) {
      flex-direction: row;
    }
  }
  .home-5{
    @include section($main-color, white, 20px);
  }
</style>
