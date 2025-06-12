import { Switch } from '@headlessui/react';
import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import { IoSettingsSharp } from 'react-icons/io5';

const SettingsDialog = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isMusicOn, setIsMusicOn] = useState(true);

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="absolute top-4 right-4 inline-flex h-[35px] items-center justify-center rounded-full px-3 text-gray-500 hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-600">
          <IoSettingsSharp size={22} />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed z-50 left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl data-[state=open]:animate-contentShow">
          
          <Dialog.Title className="text-lg font-semibold text-gray-800">
            Settings
          </Dialog.Title>
          
          <Dialog.Description className="mt-1 mb-4 text-sm text-gray-500">
            Adjust your game preferences
          </Dialog.Description>

          {/* Game Sound Toggle */}
          <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-3">
            <span className="text-sm text-gray-700">Game Sound</span>
            <Switch
              checked={!isMuted}
              onChange={() => setIsMuted(!isMuted)}
              className={`${
                !isMuted ? 'bg-violet-600' : 'bg-gray-300'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
            >
              <span
                className={`${
                  !isMuted ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </Switch>
          </div>

          {/* Music Toggle */}
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-gray-700">Music</span>
            <Switch
              checked={isMusicOn}
              onChange={() => setIsMusicOn(!isMusicOn)}
              className={`${
                isMusicOn ? 'bg-violet-600' : 'bg-gray-300'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
            >
              <span
                className={`${
                  isMusicOn ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </Switch>
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <Dialog.Close asChild>
              <button className="rounded bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-600">
                Save
              </button>
            </Dialog.Close>
          </div>

          <Dialog.Close asChild>
            <button
              className="absolute right-3 top-3 rounded-full bg-gray-200 p-1 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-400"
              aria-label="Close"
            >
              ×
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default SettingsDialog;
