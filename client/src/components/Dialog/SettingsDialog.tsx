import { Switch } from '@headlessui/react';
import * as Dialog from '@radix-ui/react-dialog';
import { IoSettingsSharp } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { setMusicPlaying, setMute } from '../../redux/reducers/audioSlice';
import type { RootState } from '../../redux/store';

const SettingsDialog = () => {
  const dispatch = useDispatch();
  const { isMuted, isMusicPlaying } = useSelector((state: RootState) => state.audio);

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          className="absolute top-2 sm:top-4 right-2 sm:right-4 inline-flex h-9 sm:h-[35px] w-9 sm:w-auto items-center justify-center rounded-full px-2 sm:px-3 text-white hover:bg-gray-200 hover:text-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-600"
          title="Settings"
        >
          <IoSettingsSharp size={20} className="sm:size-[22px]" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed z-50 left-1/2 top-1/2 w-full max-w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl data-[state=open]:animate-contentShow">
          <Dialog.Title className="text-lg font-semibold text-gray-800">
            Settings
          </Dialog.Title>
          <Dialog.Description className="mt-1 mb-4 text-sm text-gray-500">
            Adjust your game preferences
          </Dialog.Description>
          <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-3">
            <span className="text-sm text-gray-700">Game Sound</span>
            <Switch
              checked={!isMuted}
              onChange={() => dispatch(setMute(!isMuted))}
              className={`${!isMuted ? 'bg-violet-600' : 'bg-gray-300'
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer`}
            >
              <span
                className={`${!isMuted ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition cursor-pointer`}
              />
            </Switch>
          </div>
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-gray-700">Music</span>
            <Switch
              checked={isMusicPlaying}
              onChange={() => dispatch(setMusicPlaying(!isMusicPlaying))}
              className={`${isMusicPlaying ? 'bg-violet-600' : 'bg-gray-300'
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer`}
            >
              <span
                className={`${isMusicPlaying ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition cursor-pointer`}
              />
            </Switch>
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <Dialog.Close asChild>
              <button className="rounded bg-violet-600 cursor-pointer px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-600">
                Save
              </button>
            </Dialog.Close>
          </div>

          <Dialog.Close asChild>
            <button
              className="absolute right-3 top-3 cursor-pointer rounded-full text-xl bg-gray-200  py-1 px-3 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-400"
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
