define(function(require) {
  'use strict';
  var jQuery = require('jquery');
  var directive = [
    '$timeout',
    '$rootScope',
    function($timeout,
             $rootScope) {
      return {
        restrict: 'A',
        /**
         * link fn
         * @param scope
         * @param elem
         */
        link: function(scope, elem) {
          // accordion menu
          jQuery(document)
            .off('click', '.side_menu_expanded #main_menu .has_submenu > a')
            .on('click', '.side_menu_expanded #main_menu .has_submenu > a', function() {
              if(jQuery(this).parent('.has_submenu').hasClass('first_level')) {
                var $this_parent = jQuery(this).parent('.has_submenu'),
                  panel_active = $this_parent.hasClass('section_active');

                if(!panel_active) {
                  $this_parent.siblings().removeClass('section_active').children('ul').slideUp('200');
                  $this_parent.addClass('section_active').children('ul').slideDown('200');
                } else {
                  $this_parent.removeClass('section_active').children('ul').slideUp('200');
                }
              } else {
                var $submenu_parent = jQuery(this).parent('.has_submenu'),
                  submenu_active = $submenu_parent.hasClass('submenu_active');

                if(!submenu_active) {
                  $submenu_parent.siblings().removeClass('submenu_active').children('ul').slideUp('200');
                  $submenu_parent.addClass('submenu_active').children('ul').slideDown('200');
                } else {
                  $submenu_parent.removeClass('submenu_active').children('ul').slideUp('200');
                }
              }

              $rootScope.$broadcast('malihuScrollBar.update');
            })
            .on('click', '.side_menu_expanded #main_menu .no-submenu > a', function () {
              jQuery('.has_submenu').removeClass('section_active');
            })
            .on('click', '.side_menu_collapsed #main_menu .no-submenu > a', function () {
              jQuery('.has_submenu').removeClass('section_active');  
            })
            .on('click', '.second_level > a', function () {
              var $this_parent = jQuery(this).parents('.has_submenu');
              $this_parent.addClass('section_active');
            });

          scope.$on('$destroy', function() {
            jQuery(document)
              .off('click', '.side_menu_expanded #main_menu .has_submenu > a');
          });
        }
      };
    }];
  return directive;
});
