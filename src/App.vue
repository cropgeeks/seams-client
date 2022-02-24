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
    <b-container fluid class="mt-3">
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
  background-image: url("~@/assets/img/value.svg");
}
i.icon-covercrop {
  background-image: url("~@/assets/img/covercrop.svg");
}
i.icon-mixture {
  background-image: url("~@/assets/img/mixture.svg");
}
i.icon-fertilizer {
  background-image: url("~@/assets/img/fertilizer.svg");
}
i.icon-tillage {
  background-image: url("~@/assets/img/tillage.svg");
}
i.icon-farm-management {
  background-image: url("~@/assets/img/farm-management.svg");
}
i.icon-weed-cover {
  background-image: url("~@/assets/img/weed-cover.svg");
}
i.icon-sowing-date {
  background-image: url("~@/assets/img/sowing-date.svg");
}
i.icon-harvest-date {
  background-image: url("~@/assets/img/harvest-date.svg");
}
i.icon-barley {
  background-image: url("~@/assets/img/crops/barley.svg");
}
i.icon-beans {
  background-image: url("~@/assets/img/crops/bean.svg");
}
i.icon-blueberry {
  background-image: url("~@/assets/img/crops/blueberry.svg");
}
i.icon-clover {
  background-image: url("~@/assets/img/crops/clover.svg");
}
i.icon-linseed {
  background-image: url("~@/assets/img/crops/flax.svg");
}
i.icon-maize {
  background-image: url("~@/assets/img/crops/maize.svg");
}
i.icon-oats {
  background-image: url("~@/assets/img/crops/oat.svg");
}
i.icon-oilseed {
  background-image: url("~@/assets/img/crops/canola.svg");
}
i.icon-peas {
  background-image: url("~@/assets/img/crops/pea.svg");
}
i.icon-raspberry {
  background-image: url("~@/assets/img/crops/raspberry.svg");
}
i.icon-rye {
  background-image: url("~@/assets/img/crops/rye.svg");
}
i.icon-strawberry {
  background-image: url("~@/assets/img/crops/strawberry.svg");
}
i.icon-turnip {
  background-image: url("~@/assets/img/crops/turnip.svg");
}
i.icon-wheat {
  background-image: url("~@/assets/img/crops/wheat.svg");
}
i.icon-potato {
  background-image: url("~@/assets/img/crops/potato.svg");
}
</style>
