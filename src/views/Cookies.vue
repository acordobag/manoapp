<template lang="pug">
  main.termsAndConditions
    p.
      <strong>AVISO DE INVERSIÓN DE ALTO RIESGO:</strong> Las operaciones con Forex y con Contratos por Diferencia (CFDs) son muy especulativas e implican un riesgo
      considerable de pérdida. Este tipo de operaciones no es recomendable para todos los inversores, de modo que antes de operar usted debería asegurarse
      de que entiende totalmente los riesgos. Puede leer el documento de “divulgación de riesgos”, que le dará una explicación más completa de algunos
      que los riesgos que conlleva.
    p.
      SWMP está administrada por Safecap Investments Ltd, una empresa de servicios financieros autorizada y regulada por la Comisión del Mercado de
      Valores de Chipre (CySEC, por sus siglas en inglés) con número de licencia 092/08 y por la Junta de Servicios Financieros de Sudáfrica
      (FSB, por sus siglas en inglés) como Proveedor de servicios financieros autorizado en FSP con número 43906. Las oficinas de Safecap Investments
      Ltd están en 148 Strovolos Avenue, 2048 Strovolos, P.O. Box 28132, Nicosia, Chipre.
    p.
      Esta notificación sólo tiene fines informativos y no constituye ninguna petición de compra de ningún instrumento financiero. Toda la información contenida
      se reúne a partir de fuentes fiables y no debe ser usada a modo de consejo para invertir. Sin embargo, no garantizamos la exactitud ni el carácter
      completo de ninguna información indicada y no nos responsabilizaremos ante ningún cliente de la exactitud de la información ni de cualquier
      inexactitud o error.
</template>

<style lang="scss" scoped>
@import '~styles/main.scss';

.termsAndConditions{
  background: white;
  padding: 20px;
  height: 100%;
  margin: 0 auto;
  p{
    margin: 10px 0;
  }
}

@include pk-media (tablet-landscape-up) {
  .termsAndConditions{
    width: 1200px;
  }
}

</style>
