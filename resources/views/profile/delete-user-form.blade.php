<x-jet-action-section>
  <x-slot name="title">
    {{ __('locale.Delete Account') }}
  </x-slot>

  <x-slot name="description">
    {{ __('locale.Permanently delete your account.') }}
  </x-slot>

  <x-slot name="content">
    <div>
      {{ __('locale.Once your account is deleted, all of its resources and data will be permanently deleted. Before deleting your account, please download any data or information that you wish to retain.') }}
    </div>

    <div class="mt-1">
      <x-jet-danger-button wire:click="confirmUserDeletion" wire:loading.attr="disabled">
        {{ __('locale.Delete Account') }}
      </x-jet-danger-button>
    </div>

    <!-- Delete User Confirmation Modal -->
    <x-jet-dialog-modal wire:model="confirmingUserDeletion">
      <x-slot name="title">
        {{ __('locale.Delete Account') }}
      </x-slot>

      <x-slot name="content">
        {{ __('locale.Are you sure you want to delete your account? Once your account is deleted, all of its resources and data will be permanently deleted. Please enter your password to confirm you would like to permanently delete your account.') }}

        <div class="mt-2" x-data="{}"
          x-on:confirming-delete-user.window="setTimeout(() => $refs.password.focus(), 250)">
          <x-jet-input type="password" class="{{ $errors->has('password') ? 'is-invalid' : '' }}"
            placeholder="{{ __('locale.Password') }}" x-ref="password" wire:model.defer="password"
            wire:keydown.enter="deleteUser" />

          <x-jet-input-error for="password" />
        </div>
      </x-slot>

      <x-slot name="footer">
        <x-jet-secondary-button wire:click="$toggle('confirmingUserDeletion')" wire:loading.attr="disabled">
          {{ __('locale.Cancel') }}
        </x-jet-secondary-button>

        <x-jet-danger-button class="ms-1" wire:click="deleteUser" wire:loading.attr="disabled">
          {{ __('locale.Delete Account') }}
        </x-jet-danger-button>
      </x-slot>
    </x-jet-dialog-modal>
  </x-slot>

</x-jet-action-section>
