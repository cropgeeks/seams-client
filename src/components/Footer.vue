<template>
  <div class="bg-secondary pt-5">
    <b-container class="py-3">
      <b-row class="organizations">
        <b-col cols=12 sm=4 class="text-center pb-3">
          <div class="p-3 p-xl-4 img-container d-flex justify-content-center">
            <b-img :src="require('@/assets/img/seams.png')" alt="SEAMS" fluid />
          </div>
        </b-col>
        <b-col cols=12 sm=4 class="text-center pb-3">
          <div class="p-3 p-xl-4 img-container d-flex justify-content-center">
            <b-img :src="require('@/assets/img/scottish-government.svg')" alt="Scottish Government" fluid />
          </div>
        </b-col>
        <b-col cols=12 sm=4 class="text-center pb-3">
          <div class="p-3 p-xl-4 img-container d-flex justify-content-center">
            <b-img :src="require('@/assets/img/hutton.svg')" alt="The James Hutton Institute" fluid />
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped>
.organizations .img-container {
    height: 200px;
}
.organizations img {
    height: 150px;
    width: auto;
    -o-object-fit: contain;
    object-fit: contain;
}
</style>
