<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="dark" id="main-navigation">
      <b-navbar-brand :to="{ name: 'home' }" class="d-flex align-items-center">
        <!-- <img src="img/gridscore2.svg" height="40px" class="d-inline-block align-top mr-3" alt="GridScore"> -->
        SEAMS
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right>
            <template #button-content>
              <BIconFlag /><span> {{ $t('menuLocale') }}</span>
            </template>
            <b-dropdown-item v-for="language in languages" :key="`locale-${language.locale}`" @click="onLocaleChanged(language)">
              <span class="mr-2">{{ language.icon }}</span>
              <span>{{ language.name }}</span>
            </b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item :to="{ name: 'about' }"><BIconInfoCircle /> About</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <!-- The main content -->
    <b-container fluid class="my-3">
      <router-view :key="$route.path" />
    </b-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { loadLanguageAsync } from '@/plugins/i18n'
import { BIconInfoCircle, BIconFlag } from 'bootstrap-vue'

export default {
  components: {
    BIconInfoCircle,
    BIconFlag
  },
  data: function () {
    return {
      languages: [{
        locale: 'en_GB',
        name: 'British English',
        icon: '🇬🇧'
      }, {
        locale: 'de_DE',
        name: 'Deutsch - Deutschland',
        icon: '🇩🇪'
      }]
    }
  },
  computed: {
    /** Mapgetters exposing the store configuration */
    ...mapGetters([
      'storeLocale'
    ])
  },
  methods: {
    /**
     * When the locale is changed, update the i18n settings
     * @param language The newly selected locale
     */
    onLocaleChanged: function (language) {
      loadLanguageAsync(language.locale).then(() => {
        this.$i18n.locale = language.locale
        this.$store.dispatch('setLocale', language.locale)
      })
    }
  },
  mounted: function () {
    loadLanguageAsync(this.storeLocale)
  }
}
</script>

<style lang="scss">
$primary: #A3CB38;
$secondary: #bdc3c7;

@import '~bootswatch/dist/simplex/variables';
@import '~bootstrap/scss/bootstrap';
@import '~bootstrap-vue/src/index.scss';
@import '~bootswatch/dist/simplex/bootswatch';

body {
  // This is to stop tables from overflowing in production.
  overflow-x: hidden;
}

i.icon-value {
  -webkit-mask: url("~@/assets/img/value.svg") no-repeat 100% 100%;
  mask: url("~@/assets/img/value.svg") no-repeat 100% 100%;
}
i.icon-ler {
  -webkit-mask: url("~@/assets/img/ler.svg") no-repeat 100% 100%;
  mask: url("~@/assets/img/ler.svg") no-repeat 100% 100%;
}
i.icon-croppurpose {
  -webkit-mask: url("~@/assets/img/covercrop.svg") no-repeat 100% 100%;
  mask: url("~@/assets/img/covercrop.svg") no-repeat 100% 100%;
}
i.icon-mixture {
  -webkit-mask: url("~@/assets/img/mixture.svg") no-repeat 100% 100%;
  mask: url("~@/assets/img/mixture.svg") no-repeat 100% 100%;
}
i.icon-monoculture {
  -webkit-mask: url("~@/assets/img/monoculture.svg") no-repeat 100% 100%;
  mask: url("~@/assets/img/monoculture.svg") no-repeat 100% 100%;
}
i.icon-fertilizer {
  -webkit-mask: url("~@/assets/img/fertilizer.svg") no-repeat 100% 100%;
  mask: url("~@/assets/img/fertilizer.svg") no-repeat 100% 100%;
}
i.icon-herbicide {
  -webkit-mask: url("~@/assets/img/herbicide.svg") no-repeat 100% 100%;
  mask: url("~@/assets/img/herbicide.svg") no-repeat 100% 100%;
}
i.icon-pests {
  -webkit-mask: url("~@/assets/img/pests.svg") no-repeat 100% 100%;
  mask: url("~@/assets/img/pests.svg") no-repeat 100% 100%;
}
i.icon-tillage {
  -webkit-mask: url("~@/assets/img/tillage.svg") no-repeat 100% 100%;
  mask: url("~@/assets/img/tillage.svg") no-repeat 100% 100%;
}
i.icon-farm-management {
  -webkit-mask: url("~@/assets/img/farm-management.svg") no-repeat 100% 100%;
  mask: url("~@/assets/img/farm-management.svg") no-repeat 100% 100%;
}
i.icon-weed-cover {
  -webkit-mask: url("~@/assets/img/weed-cover.svg") no-repeat 100% 100%;
  mask: url("~@/assets/img/weed-cover.svg") no-repeat 100% 100%;
}
i.icon-sowing-date {
  -webkit-mask: url("~@/assets/img/sowing-date.svg") no-repeat 100% 100%;
  mask: url("~@/assets/img/sowing-date.svg") no-repeat 100% 100%;
}
i.icon-harvest-date {
  -webkit-mask: url("~@/assets/img/harvest-date.svg") no-repeat 100% 100%;
  mask: url("~@/assets/img/harvest-date.svg") no-repeat 100% 100%;
}
i.icon-barley {
  -webkit-mask: url("~@/assets/img/crops/barley.svg") no-repeat 100% 100%;
  mask: url("~@/assets/img/crops/barley.svg") no-repeat 100% 100%;
}
i.icon-beans {
  -webkit-mask: url("~@/assets/img/crops/bean.svg") no-repeat 100% 100%;
  mask: url("~@/assets/img/crops/bean.svg") no-repeat 100% 100%;
}
i.icon-blueberry {
  -webkit-mask: url("~@/assets/img/crops/blueberry.svg") no-repeat 100% 100%;
  mask: url("~@/assets/img/crops/blueberry.svg") no-repeat 100% 100%;
}
i.icon-clover {
  -webkit-mask: url("~@/assets/img/crops/clover.svg") no-repeat 100% 100%;
  mask: url("~@/assets/img/crops/clover.svg") no-repeat 100% 100%;
}
i.icon-linseed {
  -webkit-mask: url("~@/assets/img/crops/flax.svg") no-repeat 100% 100%;
  mask: url("~@/assets/img/crops/flax.svg") no-repeat 100% 100%;
}
i.icon-maize {
  -webkit-mask: url("~@/assets/img/crops/maize.svg") no-repeat 100% 100%;
  mask: url("~@/assets/img/crops/maize.svg") no-repeat 100% 100%;
}
i.icon-oats {
  -webkit-mask: url("~@/assets/img/crops/oat.svg") no-repeat 100% 100%;
  mask: url("~@/assets/img/crops/oat.svg") no-repeat 100% 100%;
}
i.icon-oilseed {
  -webkit-mask: url("~@/assets/img/crops/canola.svg") no-repeat 100% 100%;
  mask: url("~@/assets/img/crops/canola.svg") no-repeat 100% 100%;
}
i.icon-peas {
  -webkit-mask: url("~@/assets/img/crops/pea.svg") no-repeat 100% 100%;
  mask: url("~@/assets/img/crops/pea.svg") no-repeat 100% 100%;
}
i.icon-raspberry {
  -webkit-mask: url("~@/assets/img/crops/raspberry.svg") no-repeat 100% 100%;
  mask: url("~@/assets/img/crops/raspberry.svg") no-repeat 100% 100%;
}
i.icon-rye {
  -webkit-mask: url("~@/assets/img/crops/rye.svg") no-repeat 100% 100%;
  mask: url("~@/assets/img/crops/rye.svg") no-repeat 100% 100%;
}
i.icon-strawberry {
  -webkit-mask: url("~@/assets/img/crops/strawberry.svg") no-repeat 100% 100%;
  mask: url("~@/assets/img/crops/strawberry.svg") no-repeat 100% 100%;
}
i.icon-turnip {
  -webkit-mask: url("~@/assets/img/crops/turnip.svg") no-repeat 100% 100%;
  mask: url("~@/assets/img/crops/turnip.svg") no-repeat 100% 100%;
}
i.icon-wheat {
  -webkit-mask: url("~@/assets/img/crops/wheat.svg") no-repeat 100% 100%;
  mask: url("~@/assets/img/crops/wheat.svg") no-repeat 100% 100%;
}
i.icon-potato {
  -webkit-mask: url("~@/assets/img/crops/potato.svg") no-repeat 100% 100%;
  mask: url("~@/assets/img/crops/potato.svg") no-repeat 100% 100%;
}
</style>
