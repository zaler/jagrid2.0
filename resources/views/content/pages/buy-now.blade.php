<div class="buy-now">
    <div id="feedbacks"></div>
    <input type="hidden" id="locale" value="{{ app()->getLocale() }}" />

    <div id="timer"></div>
</div>

<script src="{{ asset('js/feedbacks.js') }}"></script>
<?php
if (env('APP_ENV') != 'local') {
?>
    <script src="{{ asset('js/timer.js') }}"></script>
<?php
}
?>