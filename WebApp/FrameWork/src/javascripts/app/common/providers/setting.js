define(function(require) {
  'use strict';
  var angular = require('angular');

  var module = angular.module('common.providers.setting', []);
  module.provider('appSettings', function() {
    var $this = this;
    this.settings = {
      languages: [],
      name: '',
      logo: '',
      version: ''
    };
    /**
     * addLanguage
     * @param newLanguage
       */
    function addLanguage(newLanguage) {
      $this.settings.languages.push(newLanguage);
    }

    /**
     * setLogo
     * @param logo
       */
    function setLogo(logo) {
      $this.settings.logo = logo;
    }

    /**
     * setName
     * @param name
       */
    function setName(name) {
      $this.settings.name = name;
    }

    /**
     * setVersion
     * @param version
       */
    function setVersion(version) {
      $this.settings.version = version;
    }

    /**
     * getFn
     * @returns {{languages: (*|Array), name: *, logo: *, version: *}}
       */
    function getFn() {
      return {
        languages: $this.settings.languages,
        name: $this.settings.name,
        logo: $this.settings.logo,
        version: $this.settings.version
      };
    }
    this.addLanguage =addLanguage;

    this.setLogo = setLogo;

    this.setName = setName;

    this.setVersion = setVersion;

    this.$get = getFn;
  });
  return module.name;
});
