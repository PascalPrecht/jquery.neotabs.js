/**
 * NeoTabs - jQuery plugin
 *
 * source: http://github.com/PascalPrecht/jQuery-NeoTabs/
 * site: http://pascalprecht.github.com/jQuery-NeoTabs/
 *
 * @author: Pascal Precht <pascal.precht@gmail.com>
 * Released under the MIT and GPL Licenses.
 */
;(function ($, window, undefined) {

  var pluginName = 'neoTabs',
      document = window.document,

      defaults = {
        wrapperClass: 'content',
        activeClass: 'active',
        tabHeadClass: 'tab',
        tabBodyClass: 'tabbody',
        firstTabClass: 'first',
        lastTabClass: 'last',
        clearfixClass: 'group',
        tabsListClass: 'tabs-list',
        tabHeadElement: 'h4',
        tabsPosition: 'top',
        cssClassAvailable: false,
        fx: 'show',
        fxSpeed: 'normal',
        autoAnchor: false,
        wrapInnerTabs: '',
        dropdownTabLabel: '&#x25BE;'
      },

      tabCount = 0,
      positions = {
        top: 'prepend',
        bottom: 'append'
      };

  if ($('body').data('accessibleTabsCount') !== undefined) {
    tabCount = $('body').data('accessibleTabsCount');
  }

  $('body').data('accessibleTabsCount', tabCount);

  function NeoTabs(element, options) {
    var _this = this,
        tabs = new TabList(),
        dropdownTabs = null,
        hasDropdown = false,
        count = 0;

    $.extend(_this, {
      $el: element,
      options: $.extend({}, defaults, options)
    });

    _this.$el.wrapInner('<div class="'+_this.options.wrapperClass+'"></div>');

    _this.$el.find(_this.options.tabHeadElement).each(function (i) {

      var $tabHeadElement = $(this);

      if (!hasDropdown && typeof($tabHeadElement.data('dropdown')) != 'undefined') {
        hasDropdown = true;
        dropdownTabs = new TabList();
      }

      var tab = new Tab({
        label:  $tabHeadElement.html(),
        id: 'accessibletabscontent' + tabCount + '-' + i,
        tabList: null
      });

      if (hasDropdown) {
        dropdownTabs.addTab(tab);
      } else {
        tabs.addTab(tab);
      }

      $tabHeadElement.attr({
        'id': tab.id,
        'class': _this.options.tabheadClass,
        'tabindex': '-1'
      });

      count = i;
    });

    if (hasDropdown) {
      tabs.addTab(new Tab({
        label: _this.options.dropdownTabLabel,
        id: 'accessibletabscontent' + tabCount + '-' + count,
        tabList: dropdownTabs
      }));
    }

    if (!_this.$el.find('.' + _this.options.tabsListClass).length) {
      _this.$el[positions[_this.options.tabsPosition]](tabs.toHtml({
        clearfixClass: _this.options.clearfixClass,
        tabsListClass: _this.options.tabsListClass
      }));
    }

    var $content = _this.$el.find('.' + _this.options.tabBodyClass),
        $tabsList = _this.$el.find('.' + _this.options.tabsListClass);

    if ($content.length > 0) {
      $content.hide();
      $($content[0]).show();
    }

    $tabsList.find(' > li:first')
      .addClass(_this.options.activeClass + ' ' + _this.options.firstTabClass)
      .closest('ul').children('li:last').addClass(_this.options.lastTabClass);

    if (_this.options.wrapInnerTabs) {
      $tabsList.find('> li > a').wrapInner(_this.options.wrapInnerTabs);
    }

    $tabsList.find('> li a').each(function (i) {
      $tab = $(this);
      $tabBody = _this.$el.find('.' + _this.options.tabBodyClass);

      $tab.on('click', function (e) {
        e.preventDefault();
        _this.$el.trigger('showTab.accessibleTabs', [$tab]);

        $tabsList
          .find('>li .' + _this.options.activeClass)
          .removeClass(_this.options.activeClass);

        $tab.blur();
        _this.$el.find('.' + _this.options.tabBodyClass + ':visible').hide();
        $tabBody.eq(i)[_this.options.fx](_this.options.fxSpeed);
      });
    });

    tabCount++;
  }

  function Tab(options) {
    this.label = options.label,
    this.id = options.id;
    this.tabList = options.tabList;
  };

  Tab.prototype.toHtml = function () {
    var html = '<li><a href="#' + this.id + '">' + this.label + '</a>';

    if (this.tabList) {
      html += this.tabList.toHtml({
        clearfixClass: '',
        tabsListClass: 'tabDropdownList'
      });
    }

    html += '</li>';
    return html;
  };

  function TabList() {
    this.tabs = [];
  };

  TabList.prototype.addTab = function (tab) {
    this.tabs.push(tab);
  };

  TabList.prototype.toHtml = function (options) {
    this.clearfixClass = options.clearfixClass;
    this.tabsListClass = options.tabsListClass;

    var len = this.tabs.length,
        i = 0,
        html = '<ul class="' + this.clearfixClass + ' ' + this.tabsListClass + '">';

    for (; i < len; i++) {
      html += this.tabs[i].toHtml();
    }

    return html;
  };

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      if (!$.data(this, 'plugin_' + pluginName)) {
        $.data(this, 'plugin_' + pluginName, new NeoTabs($(this), options ));
      }
    });
  }
}(jQuery, window));
