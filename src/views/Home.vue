<template>
  <div class="home">
    <SiteTable />
    <SiteMap />
  </div>
</template>

<script>
import SiteMap from '@/components/SiteMap'
import SiteTable from '@/components/SiteTable'

export default {
  name: 'Home',
  components: {
    SiteMap,
    SiteTable
  }
}
</script>
