@php
$configData = Helper::applClasses();
@endphp
<div class="main-menu menu-fixed {{(($configData['theme'] === 'dark') || ($configData['theme'] === 'semi-dark')) ? 'menu-dark' : 'menu-light'}} menu-accordion menu-shadow" data-scroll-to-active="true">
  <div class="navbar-header">
    <ul class="nav navbar-nav flex-row">
      <li class="nav-item me-auto">
        <a class="navbar-brand" href="{{url('/')}}">
          <span class="brand-logo">
            <img src="{{asset('images/logo/jagrid-icon.png')}}" class="img-fluid" alt="Jagrid.io">
          </span>
          @if($configData['theme'] === 'dark')
          <h2 class="brand-text"><img src="{{asset('images/logo/jagrid-text-white.png')}}" class="img-fluid" style="max-width:100px;" alt="Jagrid.io"></h2>
          @else
          <h2 class="brand-text"><img src="{{asset('images/logo/jagrid-text-dark.png')}}" class="img-fluid" style="max-width:100px;" alt="Jagrid.io"></h2>
          @endif
        </a>
      </li>
      <li class="nav-item nav-toggle">
        <a class="nav-link modern-nav-toggle pe-0" data-toggle="collapse">
          <i class="d-block d-xl-none text-primary toggle-icon font-medium-4" data-feather="x"></i>
          <i class="d-none d-xl-block collapse-toggle-icon font-medium-4 text-primary" data-feather="disc" data-ticon="disc"></i>
        </a>
      </li>
    </ul>
  </div>
  <div class="shadow-bottom"></div>
  <div class="main-menu-content">
    <ul class="navigation navigation-main" id="main-menu-navigation" data-menu="menu-navigation">
      <li class="navigation-header">
        <span>{{ __('locale.Dashboard') }}</span>
        <i data-feather="more-horizontal"></i>
      </li>
      <li class="nav-item {{Route::currentRouteName() === 'calendar.list' || Request::is('calendars/*') || Request::is('calendar/*') ? 'active' : ''}}">
        <a href="{{ route('calendar.list') }}" class="d-flex align-items-center">
          <i data-feather="calendar"></i>
          <span class="menu-title text-truncate">{{ __('locale.Calendars') }}</span>
        </a>
      </li>
      <li class="nav-item {{Route::currentRouteName() === 'cards.index' || Request::is('cards/*') ? 'active' : ''}}">
        <a href="{{ route('cards.index') }}" class="d-flex align-items-center">
          <i data-feather="credit-card"></i>
          <span class="menu-title text-truncate">Cards</span>
        </a>
      </li>
      <li class="navigation-header">
        <span>{{ __('locale.Administrator') }}</span>
        <i data-feather="more-horizontal"></i>
      </li>
      <li class="nav-item {{Route::currentRouteName() === 'accounts.index' || Request::is('accounts/*') ? 'active' : ''}}">
        <a href="{{ route('accounts.index') }}" class="d-flex align-items-center">
          <i data-feather="layers"></i>
          <span class="menu-title text-truncate">{{ __('locale.Accounts') }}</span>
        </a>
      </li>
      <li class="nav-item {{Route::currentRouteName() === 'feedbacks.index' || Request::is('feedbacks/*') ? 'active' : ''}}">
        <a href="{{ route('feedbacks.index') }}" class="d-flex align-items-center">
          <i data-feather="message-square"></i>
          <span class="menu-title text-truncate">Feedbacks</span>
        </a>
      </li>
      <li class="nav-item {{Route::currentRouteName() === 'tracking/time' || Request::is('tracking/*') ? 'active' : ''}}">
        <a href="{{ url('tracking/time') }}" class="d-flex align-items-center">
          <i data-feather="clock"></i>
          <span class="menu-title text-truncate">Tracking Time</span>
        </a>
      </li>
      <!--
    <li class="nav-item {{Route::currentRouteName() === 'tracking/projects' || Request::is('tracking/*') ? 'active' : ''}}">
        <a href="{{ url('tracking/projects') }}" class="d-flex align-items-center">
          <i data-feather="calendar"></i>
          <span class="menu-title text-truncate">Tracking Projects</span>
        </a>
      </li>
    -->
    </ul>
    <!--<ul class="navigation navigation-main" id="main-menu-navigation" data-menu="menu-navigation">
      {{-- Foreach menu item starts --}}
      @if(isset($menuData[0]))
      @foreach($menuData[0]->menu as $menu)
      @if(isset($menu->navheader))
      <li class="navigation-header">
        <span>{{ __('locale.'.$menu->navheader) }}</span>
        <i data-feather="more-horizontal"></i>
      </li>
      @else
      {{-- Add Custom Class with nav-item --}}
      @php
      $custom_classes = "";
      if(isset($menu->classlist)) {
      $custom_classes = $menu->classlist;
      }
      @endphp
      <li class="nav-item {{ $custom_classes }} {{Route::currentRouteName() === $menu->slug ? 'active' : ''}}">
        <a href="{{isset($menu->url)? url($menu->url):'javascript:void(0)'}}" class="d-flex align-items-center" target="{{isset($menu->newTab) ? '_blank':'_self'}}">
          <i data-feather="{{ $menu->icon }}"></i>
          <span class="menu-title text-truncate">{{ __('locale.'.$menu->name) }}</span>
          @if (isset($menu->badge))
          <?php $badgeClasses = "badge rounded-pill badge-light-primary ms-auto me-1" ?>
          <span class="{{ isset($menu->badgeClass) ? $menu->badgeClass : $badgeClasses }}">{{$menu->badge}}</span>
          @endif
        </a>
        @if(isset($menu->submenu))
        @include('panels/submenu', ['menu' => $menu->submenu])
        @endif
      </li>
      @endif
      @endforeach
      @endif
      {{-- Foreach menu item ends --}}
    </ul>-->
  </div>
</div>
<!-- END: Main Menu-->