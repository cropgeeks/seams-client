<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="primary" id="main-navigation">
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
  </div>
</template>

<script>
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
  }
}
</script>

<style lang="scss">
@import '~bootstrap/scss/bootstrap';
@import '~bootstrap-vue/src/index.scss';
</style>
